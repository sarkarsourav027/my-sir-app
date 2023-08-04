import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import {getSession, useSession} from "next-auth/react";
import Input from "@/components/InputFields/Input";
import {useFormik} from "formik";
import * as Yup from "yup";
import Radio from "@/components/InputFields/Radio";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

export default function Edit(data) {

    const {data: session} = useSession()
    const router = useRouter()
    const query = router.query;

    const formik = useFormik({
        initialValues: {
            company_id: query.company_id,
            email: '',
            confirm_email: '',
            email_type:'STANDARD'
        },
        validationSchema: Yup.object().shape({
            company_id: Yup.string()
                .required('Required'),
            email: Yup.string()
                .email()
                .matches(/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i, 'Invalid email')
                .required('Required'),
            confirm_email: Yup.string().email()
                .matches(/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i, 'Invalid email')
                .required('Required')
                .oneOf([Yup.ref('email'), null], 'Email must match'),
            email_type: Yup.string().required("Required")
        }),
        onSubmit: async (values, {setSubmitting}) => {

            // console.log(values)
            const sentFormData = new FormData();

            sentFormData.append("company_id", values.company_id)
            sentFormData.append("key", "PAYPAL")
            sentFormData.append("paypal_email", values.email)
            sentFormData.append("email_type", values.email_type)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}settings/update`, {
                method: 'POST',
                body: sentFormData,
                headers: {
                    "Access-Token": session.user.access_token
                }
            }).then((result) => {
                return result.json()
            })

            if (response.status) {
                toast.success(response.message)
                await router.push("/payment");
            } else {
                toast.error(response.message)
            }

            console.log(response)

            setSubmitting(false);
        },
    })
    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <div className="bg-white w-full rounded">
                        <div className="w-full p-8">
                            <h4 className="text-xl font-medium mb-4">Paypal</h4>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid gap-6 mb-8 md:grid-cols-2">
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
                                            type="email"
                                            name="confirm_email"
                                            id="confirm_email"
                                            value={formik.values.confirm_email}
                                            onChange={formik.handleChange}
                                            lable="Confirm Email"
                                            required={true}
                                        />
                                        {formik.errors.confirm_email ?
                                            <div
                                                className="text-red-600">{formik.errors.confirm_email}</div> : null}
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <h5 className="text-c3 text-lg font-medium">Payment Options</h5>
                                </div>
                                <div className="flex items-center border-b-2 border-c6 py-2">
                                    <Radio className="h-8 w-8" type="radio" name="email_type" value="STANDARD" onChange={formik.handleChange} defaultChecked/>
                                    <span className="ml-3 text-base text-c5">Standard</span>
                                </div>
                                <div className="flex items-center border-b-2 border-c6 py-2">
                                    <Radio className="h-8 w-8" type="radio" name="email_type" value="BUSINESS" onChange={formik.handleChange}/>
                                    <span className="ml-3 text-base text-c5">Business</span>
                                </div>
                                <div className="flex justify-center mt-10">
                                    <PrimaryButton type="submit">
                                        Save
                                    </PrimaryButton>
                                </div>
                            </form>
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