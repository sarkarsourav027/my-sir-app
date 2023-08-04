import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import ImagePreview from "@/components/InputFields/ImagePreview";
import FileUpload from "@/components/InputFields/FileUpload";
import Input from "@/components/InputFields/Input";
import SelectInput from "@/components/InputFields/SelectInput";
import {useRouter} from "next/router";
import {getSession, useSession} from "next-auth/react";
import useSWR from "swr";
import PillNavigation from "@/components/Navs/PillNavigation";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import * as yup from "yup";
import {useBusinessData} from "@/context/BusinessContext";
import CheckboxInput from "@/components/InputFields/CheckboxInput";
import {toast} from "react-toastify";

const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());


export default function User() {

    const {data: session} = useSession()

    const router = useRouter();

    const {globalBusiness} = useBusinessData();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))


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
    };

    const formik = useFormik({
        initialValues: {
            company_id: globalBusiness.company_id,
            fullname: '',
            email: '',
            password: '',
            permission: {
                invoice: 0,
                estimate: 0,
                customer: 0,
                supplier: 0,
                stock: 0,
                receipt: 0,
                purchase_order: 0,
                payment_voucher: 0,
                tax: 0,
                product: 0,
                service: 0,
                debit_note: 0,
                credit_note: 0,
                sub_admin: 0,
            },
        },
        validationSchema: yup.object().shape({
            fullname: Yup.string()
                .required('Required'),permission: Yup.object().test(
                'at-least-one-permission',
                'Please select at least one permission.',
                (value,key) => {
                    const permission = Object.values(value);
                    let permissionStatus = false;
                    permission.some(function(item,itemValue) {
                        if (item[0] === '1'){
                            permissionStatus = true;
                        }
                    })
                    return permissionStatus
                    // return permission.includes(1); // Assuming a checked permission has a value of 1
                }
            ),
            company_id: Yup.string()
                .required('Required'),
            password: Yup.string()
                .min(6, 'We have minimum 6 characters required')
                .max(50, 'Too Long!')
                .required('Required'),
            email: Yup.string()
                .email()
                .matches(/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i, 'Invalid email')
                .required('Required'),
        }),
        onSubmit: async (values, {setSubmitting}) => {


            const sentFormData = new FormData();

            sentFormData.append("image", selectedFile)
            sentFormData.append("subuser_id", values.subuser_id)
            sentFormData.append("fullname", values.fullname)
            sentFormData.append("email", values.email)
            sentFormData.append("password", values.password)
            sentFormData.append("company_id", values.company_id)
            sentFormData.append("permission[invoice]", values.permission.invoice ?? 0)
            sentFormData.append("permission[estimate]", values.permission.estimate ?? 0)
            sentFormData.append("permission[customer]", values.permission.customer ?? 0)
            sentFormData.append("permission[supplier]", values.permission.supplier ?? 0)
            sentFormData.append("permission[stock]", values.permission.stock ?? 0)
            sentFormData.append("permission[receipt]", values.permission.receipt ?? 0)
            sentFormData.append("permission[purchase_order]", values.permission.purchase_order ?? 0)
            sentFormData.append("permission[payment_voucher]", values.permission.payment_voucher ?? 0)
            sentFormData.append("permission[tax]", values.permission.tax ?? 0)
            sentFormData.append("permission[product]", values.permission.product ?? 0)
            sentFormData.append("permission[service]", values.permission.service ?? 0)
            sentFormData.append("permission[debit_note]", values.permission.debit_note ?? 0)
            sentFormData.append("permission[credit_note]", values.permission.credit_note ?? 0)
            sentFormData.append("permission[sub_admin]", values.permission.sub_admin ?? 0)



            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}user/addSubUser`, {
                method: 'POST',
                body: sentFormData,
                headers: {
                    "Access-Token": session.user.access_token
                }
            })

            const response = await result.json();

            if (response.status) {
                toast.success(response.message)
                await router.push('/user');
            } else {
                if ((typeof response.message === 'object')) {
                    toast.error(response.message.email,)
                } else {
                    toast.error(response.message,)
                }
            }

        },
    })


    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Users', link: '/user'},
                            {label: 'Add User', link: '/user/create'}
                        ]}
                    />
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space">
                                <div className="lg:px-2 lg:py-2 p-2">
                                    <FormikProvider value={formik}>
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="mb-8">

                                                <ImagePreview previewUrl={previewUrl}/>
                                                <FileUpload onChange={handleFileChange}/>
                                            </div>
                                            {formik.errors.name ?
                                                <div className="text-red-600">{formik.errors.name}</div> : null}
                                            <div className="mb-8">
                                                <h5 className="text-c3 text-lg font-medium">User Details</h5>
                                            </div>

                                            <div className="grid gap-6 mb-8 md:grid-cols-2">
                                                <div>
                                                    <Input
                                                        type="text"
                                                        name="fullname"
                                                        id="fullname"
                                                        value={formik.values.fullname}
                                                        onChange={formik.handleChange}
                                                        lable="Full Name"
                                                        required={true}
                                                    />
                                                    {formik.errors.fullname ?
                                                        <div
                                                            className="text-red-600">{formik.errors.fullname}</div> : null}
                                                </div>
                                                <div>
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        value={formik.values.email}
                                                        onChange={formik.handleChange}
                                                        lable="Email"
                                                        required={true}
                                                    />
                                                    {formik.errors.email ?
                                                        <div
                                                            className="text-red-600">{formik.errors.email}</div> : null}
                                                </div>
                                                <div>
                                                    <Input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        value={formik.values.password}
                                                        onChange={formik.handleChange}
                                                        lable="Password"
                                                        required={true}
                                                    />
                                                    {formik.errors.password ?
                                                        <div
                                                            className="text-red-600">{formik.errors.password}</div> : null}
                                                </div>
                                                <div>
                                                    <SelectInput
                                                        option={
                                                            business && business.data && business.data.company.length > 0 && business.data.company.map((item, key) => {
                                                                return ({"value": item.company_id, "label": item.name,})
                                                            })
                                                        }
                                                        label={"Company"}
                                                        name="company_id"
                                                        id="company_id"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.company_id}
                                                        required={true}
                                                        defaultSelectedValue={globalBusiness.company_id}
                                                    />
                                                    {formik.errors.company_id ?
                                                        <div
                                                            className="text-red-600">{formik.errors.company_id}</div> : null}
                                                </div>
                                            </div>

                                            <div className="mb-8">
                                                <h5 className="text-c3 text-lg font-medium">Access Rights</h5>
                                                {formik.errors.permission && (
                                                    <div style={{ color: 'red' }}>{formik.errors.permission}</div>
                                                )}
                                            </div>

                                            <div className="grid mb-6 grid-cols-2 gap-5">
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.invoice" id="permission.invoice" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-1"
                                                           className="w-full ml-2"> Invoices</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.estimate" id="permission.estimate" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-2"
                                                           className="w-full ml-2"> Estimates</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.customer" id="permission.customer" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-3"
                                                           className="w-full ml-2"> Customers</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.supplier" id="permission.supplier" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4"
                                                           className="w-full ml-2"> Suppliers</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.stock" id="permission.stock" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4"
                                                           className="w-full ml-2"> Stocks</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.receipt" id="permission.receipt" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4"
                                                           className="w-full ml-2"> Receipts</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.purchase_order" id="permission.purchase_order" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4" className="w-full ml-2"> Purchase
                                                        Order</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.payment_voucher" id="permission.payment_voucher" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4" className="w-full ml-2"> Payment
                                                        Voucher</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.tax" id="permission.tax" value="1" onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4"
                                                           className="w-full ml-2"> Taxs</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.product" id="permission.product" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4"
                                                           className="w-full ml-2"> Products</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.service" id="permission.service" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4"
                                                           className="w-full ml-2"> Services</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        id="permission.debit_note"
                                                        name="permission.debit_note" value="1" onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4" className="w-full ml-2"> Debit
                                                        Notes</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.credit_note" id="permission.credit_note" value="1"
                                                        onChange={formik.handleChange}/>
                                                    <label htmlFor="bordered-radio-4" className="w-full ml-2"> Credit
                                                        Notes</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <CheckboxInput
                                                        name="permission.sub_admin" id="permission.sub_admin" value="1"
                                                        onChange={formik.handleChange}
                                                    />
                                                    <label htmlFor="bordered-radio-4"
                                                           className="w-full ml-2"> Sub-Admin</label>
                                                </div>
                                            </div>

                                            <div className="flex justify-center mt-10">
                                                <PrimaryButton type="submit">
                                                    Add User
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </FormikProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }

    return {props: {}};
}