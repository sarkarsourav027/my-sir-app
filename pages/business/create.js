import ImagePreview from "@/components/InputFields/ImagePreview";
import React, {useState} from "react";
import Input from "@/components/InputFields/Input";
import {toast, ToastContainer} from "react-toastify";
import {getSession, useSession} from "next-auth/react";
import SelectInput from "@/components/InputFields/SelectInput";
import {useRouter} from "next/router";
import AppLayout from "@/components/Layouts/AppLayout";
import useSWR from "swr";
import PillNavigation from "@/components/Navs/PillNavigation";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {FormikProvider, useFormik} from "formik";
import * as yup from 'yup';
import ColorInput from "@/components/InputFields/ColorInput";
import FileUpload from "@/components/InputFields/FileUpload";
import {useBusinessData} from "@/context/BusinessContext";

const currencies_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

export default function AddBusiness() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const router = useRouter();
    const {data: session} = useSession()
    const {
        data: currencies,
        error: currencies_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}currency/all`, session], ([url, session]) => currencies_fetcher(url, session))
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone_number: '',
            website: '',
            address: '',
            color: '#6ad3ff',
            currency_id: '',
            payment_iban: '',
            payment_swift_bic: '',
            payment_bank_name: '',
            paypal_email: '',
            cheque_payable_to: '',
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Business name field is Required'),
            currency_id: yup.string().required('Currency field is Required'),
            payment_iban: yup.string().nullable(),
            payment_swift_bic: yup.string().when('payment_iban', {
                is: value => value && value.length > 0,
                then: (schema) => schema.required('payment swift bic name field is Required'),
                otherwise: (schema) => schema.nullable()
            }),
            payment_bank_name: yup.string().when('payment_iban', {
                is: value => value && value.length > 0,
                then: (schema) => schema.required('payment bank name name field is Required'),
                otherwise: (schema) => schema.nullable()
            }),
        }),
        onSubmit: async (values, {setSubmitting}) => {

            const sentFormData = new FormData();
            sentFormData.append("image", selectedFile)
            sentFormData.append("name", values.name)
            sentFormData.append("email", values.email)
            sentFormData.append("phone_number", values.phone_number)
            sentFormData.append("website", values.website)
            sentFormData.append("address", values.address)
            sentFormData.append("color", values.invoiceColor)
            sentFormData.append("currency_id", values.currency_id)
            sentFormData.append("payment_iban", values.payment_iban)
            sentFormData.append("payment_swift_bic", values.payment_swift_bic)
            sentFormData.append("payment_bank_name", values.payment_bank_name)
            sentFormData.append("paypal_email", values.paypal_email)
            sentFormData.append("cheque_payable_to", values.cheque_payable_to)
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/add`, {
                method: 'POST',
                body: sentFormData,
                headers: {
                    "Access-Token": session.user.access_token
                }
            })
            const response = await result.json();
            if (response.status) {
                toast.success(response.message)
                await router.push("/business");
            } else {
                toast.error(response.message)
            }

            setSubmitting(false);
        },
    })
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
    return (
        <AppLayout session={session}>
            <div className="w-full">
                <PillNavigation
                    lists={[
                        {label: 'My Businesses', link: '/business'},
                        {label: 'Add Business', link: '/business/create'}
                    ]}
                />
                <div className="flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                    <div className="flex-auto">
                        <div className="tab-content tab-space">
                            <div className="mt-14 p-4">
                                <ToastContainer className="toast-position"/>
                                <FormikProvider value={formik}>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className=" mb-8">

                                                <ImagePreview previewUrl={previewUrl}/>

                                            <FileUpload label="Click to upload logo or drag and drop" onChange={handleFileChange}/>
                                        </div>

                                        <div className="mb-8">
                                            <h5 className="text-c3 text-lg font-medium">Business Details</h5>
                                        </div>

                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    className="required"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    lable="Business Name"
                                                    required={true}
                                                />
                                                {formik.errors.name ?
                                                    <div className="text-red-600">{formik.errors.name}</div> : null}
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="email" value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    lable="Business Email"
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="tel"
                                                    name="phone_number"
                                                    value={formik.values.phone_number}
                                                    onChange={formik.handleChange}
                                                    lable="Business Phone Number"
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="website"
                                                    value={formik.values.website}
                                                    onChange={formik.handleChange}
                                                    lable="Website"
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="address"
                                                    value={formik.values.address}
                                                    onChange={formik.handleChange}
                                                    lable="Business Address"
                                                />
                                            </div>
                                            <div>
                                                <SelectInput
                                                    option={
                                                        currencies && currencies.data && currencies.data.currencies.length > 0 && currencies.data.currencies.map((item, key) => {
                                                            return ({
                                                                "value": item.currency_id,
                                                                "label": `( ${item.symbol_left} ) ${item.title}`,
                                                            })
                                                        })
                                                    }
                                                    label={"Select Currency"}
                                                    name="currency_id"
                                                    className="required"
                                                    onChange={formik.handleChange}
                                                    required={true}
                                                />
                                                {formik.errors.currency_id ?
                                                    <div
                                                        className="text-red-600">{formik.errors.currency_id}</div> : null}
                                            </div>
                                            <div className="flex">
                                                <label htmlFor="favcolor">Choose Brand Color (For Invoice
                                                    Templates):</label>
                                                <ColorInput
                                                    type="color"
                                                    name="color"
                                                    value={formik.values.color}
                                                    onChange={formik.handleChange}
                                                    lable="Choose Brand Color (For Invoice Templates)"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-8">
                                            <h5 className="text-c3 text-lg font-medium">PAYMENT DETAILS(OPTIONAL)</h5>
                                        </div>
                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="payment_iban"
                                                    value={formik.values.payment_iban}
                                                    onChange={formik.handleChange}
                                                    lable=" Enter IBAN / Account Number"
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="payment_bank_name"
                                                    value={formik.values.payment_bank_name}
                                                    onChange={formik.handleChange}
                                                    lable="Enter Bank Name"
                                                />
                                                {formik.errors.payment_bank_name ?
                                                    <div
                                                        className="text-red-600">{formik.errors.payment_bank_name}</div> : null}
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="payment_swift_bic"
                                                    value={formik.values.payment_swift_bic}
                                                    onChange={formik.handleChange}
                                                    lable="Enter Swift BIC / Sort Code"
                                                />
                                                {formik.errors.payment_swift_bic ?
                                                    <div
                                                        className="text-red-600">{formik.errors.payment_swift_bic}</div> : null}
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="paypal_email"
                                                    value={formik.values.paypal_email}
                                                    onChange={formik.handleChange}
                                                    lable="Paypal Email Address"
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="cheque_payable_to"
                                                    value={formik.values.cheque_payable_to}
                                                    onChange={formik.handleChange}
                                                    lable="Make Cheque Payable To"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-center mt-10">
                                            <PrimaryButton type="submit">
                                                {formik.isSubmitting === false ? 'Add Business' : 'Please Wait...'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </FormikProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }
    return {props: {}};
}