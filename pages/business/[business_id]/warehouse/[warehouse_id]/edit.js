import React, {useEffect, useState} from 'react';
import {getSession} from "next-auth/react";
import {toast, ToastContainer} from "react-toastify";
import Input from "@/components/InputFields/Input";
import AppLayout from "@/components/Layouts/AppLayout";
import {useRouter} from "next/router";


function EditBusiness(details) {

    const [formData, setFormData] = useState(details);
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const router = useRouter();


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true)
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
        sentFormData.append("color", formData.invoiceColor)
        sentFormData.append("currency_id", formData.currency_id)
        sentFormData.append("payment_iban", formData.payment_iban)
        sentFormData.append("payment_swift_bic", formData.payment_swift_bic)
        sentFormData.append("payment_bank_name", formData.payment_bank_name)
        sentFormData.append("paypal_email", formData.paypal_email)
        sentFormData.append("cheque_payable_to", formData.cheque_payable_to)
        // console.log(JSON.stringify(sentFormData))
        console.log(JSON.stringify(Object.fromEntries(sentFormData)))
        const session = await getSession()
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/update`, {
                method: 'POST',
                body: sentFormData,
                headers: {
                    "Access-Token": "y6pZhlMk9sAS9wlWbf3ntphbwh4IshUV"
                    // "Access-Token": session.user.access_token
                }
            })
            const response = await result.json();
            if (response.status) {
                toast.success(response.message)
                router.push("/business");
            } else {
                setSubmitLoading(false)
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

        } catch (error) {
            console.log(error)

        }
    };
    return (
        <AppLayout session={session}>
            <div className="mt-14">
                <ToastContainer className="toast-position"/>
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <h5 className="text-c3 text-lg font-medium">Warehouse Details</h5>
                    </div>

                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        <div>
                            <Input type="text" name="name" value={formData.name}
                                   onChange={handleChange}
                                   lable="Warehouse Name" required/>
                        </div>
                        <div>
                            <Input type="text" name="address" value={formData.address}
                                   onChange={handleChange}
                                   lable="Warehouse Address" required/>
                        </div>
                    </div>
                    <div className="flex justify-center mt-24">
                        {submitLoading === false ? <button
                            type="submit"
                            className="inline-block rounded-full bg-c3 px-24 pb-2 pt-2.5 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0"
                            data-te-ripple-color="light">
                            Add Warehouse
                        </button> : <button
                            type="button" disabled=""
                            className="inline-block rounded-full bg-c3 px-24 pb-2 pt-2.5 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0"
                            data-te-ripple-color="light">
                            Please Wait...
                        </button>}
                    </div>
                </form>
            </div>
        </AppLayout>

    );
}

export default EditBusiness;

export const getServerSideProps = async (perms) => {

    const sentFormData = new FormData();
    let details;
    const {id} = perms.query;
    sentFormData.append("company_id", id)
    const session = await getSession(perms)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/detail`, {
        method: 'POST',
        body: sentFormData,
        headers: {
            "Access-Token": session.user.access_token
        }
    });

    const fetchDetails = await res.json();
    console.log(fetchDetails)
    if (fetchDetails.status) {
        return {props: {details}};
    } else {
        console.log(fetchDetails.message)
    }
};