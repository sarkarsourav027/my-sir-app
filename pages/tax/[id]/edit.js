import React, {useEffect, useState} from 'react';
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
import PrimaryLinkButton from "@/components/Buttons/PrimaryLinkButton";
import TextArea from "@/components/InputFields/TextArea";
import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
const company_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());
export default function TaxEdit(tax) {

    const [formData, setFormData] = useState({
        name : tax.tax.name,
        rate : tax.tax.rate,
        type : tax.tax.type,
        company_id : tax.tax.company_id,
    });
    const router = useRouter();
    const {data: session} = useSession()
    const [submitLoading, setSubmitLoading] = useState(false);
    const {
        data: company,
        error: company_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => company_fetcher(url, session))
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sentFormData = new FormData();
        sentFormData.append("tax_id", tax.tax.tax_id)
        sentFormData.append("name", formData.name)
        sentFormData.append("rate", formData.rate)
        sentFormData.append("company_id", formData.company_id)


        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}tax/update`, {
            method: 'POST',
            body: sentFormData,
            headers: {
                "Access-Token": session.user.access_token
            }
        })

        const response = await result.json();

        if (response.status) {
            toast.success(response.message)
            router.push("/tax");
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
                            {label: 'Taxes', link: '/tax'},
                            {label: 'Add Tax', link: '/tax/create'}
                        ]}
                    />
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space p-4">
                                <div className="mt-14">
                                    <ToastContainer className="toast-position"/>
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-8">
                                                <h5 className="text-c3 text-lg font-medium">Tax Details</h5>
                                            </div>


                                            <div className="grid gap-6 mb-8 md:grid-cols-2">
                                                <div>
                                                    <SelectInput
                                                        option={
                                                            company && company.data && company.data.company.length > 0 && company.data.company.map((item, key) => {
                                                                return ({"value": item.company_id, "label": `${item.name}`,})
                                                            })
                                                        }
                                                        onChange={handleChange}
                                                        label={"Company"}
                                                        name="company_id"
                                                        value={formData.company_id}/>
                                                </div>
                                                <div>
                                                    <Input type="text" name="name" value={formData.name}  onChange={handleChange}
                                                           lable="Tax Name"/>
                                                </div>
                                                <div>
                                                    <Input type="number" name="rate" min="1" max="100" value={formData.rate} onChange={handleChange}
                                                           lable="Tax Rate (%)"/>
                                                </div>
                                            </div>
                                            <div className="flex justify-center mt-10">
                                                <PrimaryButton type="submit">
                                                    {submitLoading === false ? 'Update Tax' : 'Please Wait...'}
                                                </PrimaryButton>
                                            </div>
                                        </form>

                                    </div>
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
    if (!context.query.data){
        return {redirect: {destination: '/tax', permanent: false,}}
    }


    let receiveData =  {
        tax: JSON.parse(context.query.data)
    }

    return {
        props: context.query.data ? receiveData : {}
    };
}