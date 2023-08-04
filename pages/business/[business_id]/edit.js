import React, {useState} from 'react';
import {getSession, useSession} from "next-auth/react";
import {toast, ToastContainer} from "react-toastify";
import ImagePreview from "@/components/InputFields/ImagePreview";
import FileUpload from "@/components/InputFields/FileUpload";
import Input from "@/components/InputFields/Input";
import SelectInput from "@/components/InputFields/SelectInput";
import ColorPicker from "@/components/InputFields/ColorPicker";
import AppLayout from "@/components/Layouts/AppLayout";
import {useRouter} from "next/router";
import useSWR from "swr";
import Link from "next/link";
import PillNavigation from "@/components/Navs/PillNavigation";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import ColorInput from "@/components/InputFields/ColorInput";

const currencies_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

function EditBusiness(details) {

    const [formData, setFormData] = useState(details.company[0]);
    const router = useRouter();
    const {data: session} = useSession()

    const [selectedFile, setSelectedFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(details.company_image_path + details.company[0].logo);
    const [color, setColor] = useState(formData.color);

    const {
        data: currencies,
        error: currencies_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}currency/all`, session], ([url, session]) => currencies_fetcher(url, session))

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleColorChange = (newColor) => {
        setColor(newColor.hex);
        setFormData({...formData, invoiceColor: newColor.hex});
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFormData({...formData, image: file});
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sentFormData = new FormData();

        if (selectedFile !== null) {
            sentFormData.append("image", selectedFile)
        }

        sentFormData.append("company_id", formData.company_id)
        sentFormData.append("name", formData.name)
        sentFormData.append("email", formData.email)
        sentFormData.append("phone_number", formData.phone_number)
        sentFormData.append("website", formData.website)
        sentFormData.append("address", formData.address)
        sentFormData.append("color", formData.color)
        sentFormData.append("currency_id", formData.currency_id)
        sentFormData.append("payment_iban", formData.payment_iban)
        sentFormData.append("payment_swift_bic", formData.payment_swift_bic)
        sentFormData.append("payment_bank_name", formData.payment_bank_name)
        sentFormData.append("paypal_email", formData.paypal_email)
        sentFormData.append("cheque_payable_to", formData.cheque_payable_to)

        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/update`, {
            method: 'POST',
            body: sentFormData,
            headers: {
                "Access-Token": session.user.access_token
            }
        })

        const response = await result.json();

        if (response.status) {
            toast.success(response.message)
            router.push("/business");
        } else {
            toast.error(response.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
    };

    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap relative">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Business', link: `/business/${formData.company_id}/view`},
                            {label: 'Add Warehouse', link: `/business/${formData.company_id}/warehouse/create`},
                            {label: 'Warehouse (s)', link: `/business/${formData.company_id}/warehouse`}
                        ]}
                    />
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space p-4">
                                <div className="mt-14">
                                    <ToastContainer className="toast-position"/>
                                    <form onSubmit={handleSubmit}>

                                        <div className="mb-8">

                                                <ImagePreview previewUrl={previewUrl}/>

                                            <FileUpload label="Click to upload logo"  onChange={handleFileChange}/>
                                        </div>

                                        <div className="mb-8">
                                            <h5 className="text-c3 text-lg font-medium">Business Details</h5>
                                        </div>

                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    lable="Business Name"/>
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    lable="Business Email"/>
                                            </div>
                                            <div>
                                                <Input
                                                    type="tel"
                                                    name="phone_number"
                                                    value={formData.phone_number}
                                                    onChange={handleChange}
                                                    lable="Business Phone Number"
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    lable="Website"
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    lable="Business Address"/>
                                            </div>
                                            <div>
                                                <SelectInput
                                                    option={
                                                        currencies && currencies.data && currencies.data.currencies.length > 0 && currencies.data.currencies.map((item, key) => {
                                                            return ({"value": item.currency_id, "label": `( ${item.symbol_left} ) ${item.title}`,})
                                                        })
                                                    }
                                                    label={"Currency"}
                                                    name="currency_id"
                                                    onChange={handleChange}
                                                    value={formData.currency_id}/>
                                            </div>
                                            <div>
                                                <label htmlFor="favcolor">Choose Brand Color (For Invoice
                                                    Templates):</label>
                                                <ColorInput
                                                    type="color"
                                                    name="color"
                                                    value={formData.color}
                                                    onChange={handleChange}
                                                    lable="Choose Brand Color (For Invoice Templates)"
                                                />
                                                {/*<ColorPicker handleColorChange={handleColorChange} color={color}/>*/}
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h5 className="text-c3 text-lg font-medium">PAYMENT DETAILS(OPTIONAL)</h5>
                                        </div>

                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <div>
                                                <Input type="text" name="payment_iban" value={formData.payment_iban}
                                                       onChange={handleChange}
                                                       lable="Enter IBAN / Account Number"/>
                                            </div>
                                            <div>
                                                <Input type="text" name="payment_bank_name"
                                                       value={formData.payment_bank_name}
                                                       onChange={handleChange} lable="Enter Bank Name"/>
                                            </div>
                                            <div>
                                                <Input type="text" name="payment_swift_bic"
                                                       value={formData.payment_swift_bic}
                                                       onChange={handleChange} lable="Enter Swift BIC / Sort Code"/>
                                            </div>
                                            <div>
                                                <Input type="text" name="paypal_email" value={formData.paypal_email}
                                                       onChange={handleChange}
                                                       lable="Paypal Email Address"/>

                                            </div>
                                            <div>
                                                <Input type="text" name="cheque_payable_to"
                                                       value={formData.cheque_payable_to}
                                                       onChange={handleChange} lable="Make Cheque Payable To"/>
                                            </div>
                                        </div>

                                        <div className="flex justify-center mt-10">
                                            <PrimaryButton type="submit">
                                                {submitLoading === false ? 'Update Business' : 'Please Wait...'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default EditBusiness;

export const getServerSideProps = async (context) => {

    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,},}
    }

    const sentFormData = new FormData();
    sentFormData.append("company_id", context.params.business_id)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/detail`, {
        method: 'POST',
        body: sentFormData,
        headers: {"Access-Token": session.user.access_token}
    });

    const business = await res.json();

    return {props: business.data};
};
