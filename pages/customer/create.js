import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import SelectInput from "@/components/InputFields/SelectInput";
import InputError from "@/components/InputFields/InputError";
import Input from "@/components/InputFields/Input";
import {getSession, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import * as Yup from 'yup';
import useSWR from "swr";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PillNavigation from "@/components/Navs/PillNavigation";
import {useBusinessData} from "@/context/BusinessContext";
import {FormikProvider, useFormik} from "formik";
import * as yup from "yup";

const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
});

export default function CustomerCreate() {

    const router = useRouter();

    const {data: session, status} = useSession()
    const {globalBusiness} = useBusinessData();

    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))

    const dd = globalBusiness.company_id;
    console.log(dd)
    const formik = useFormik({
        initialValues: {
            company_id: dd,
            customer_name: '',
            email: '',
            phone_number: '',
            address: '',
            website: '',
        },
        validationSchema: yup.object().shape({
            company_id: yup.string().required('Company field is Required'),
            customer_name: yup.string().required('Customer name field is Required'),
            email: Yup.string()
                .email()
                .matches(/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i, 'Invalid email'),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            console.log(values);

            const sentFormData = new FormData();

            sentFormData.append("company_id", values.company_id)
            sentFormData.append("customer_name", values.customer_name)
            sentFormData.append("email", values.email)
            sentFormData.append("phone_number", values.phone_number)
            sentFormData.append("address", values.address)
            sentFormData.append("website", values.website)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}customer/add`, {
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
                await router.push("/customer");
            } else {
                toast.error(response.message)
            }

            console.log(response)

            setSubmitting(false);
        },
    })

    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap relative">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Customers', link: '/customer'},
                            {label: 'Add Customers', link: '/customer/create'}
                        ]}
                    />
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space p-4">
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                                        <div>
                                            <SelectInput
                                                option={
                                                    business && business.data && business.data.company.length > 0 && business.data.company.map((item, key) => {
                                                        return ({"value": item.company_id, "label": item.name,})
                                                    })
                                                }
                                                label={"Company"}
                                                name="company_id"
                                                onChange={formik.handleChange}
                                                value={formik.values.company_id}
                                                required={true}
                                                defaultSelectedValue={globalBusiness.company_id}
                                            />
                                            {formik.errors.company_id ?
                                                <div
                                                    className="text-red-600">{formik.errors.company_id}</div> : null}
                                        </div>
                                        <div>
                                            <Input
                                                type="text"
                                                lable="Customer/Business Name"
                                                id="customer_name"
                                                name="customer_name"
                                                value={formik.values.customer_name}
                                                onChange={formik.handleChange}
                                                required/>
                                            {formik.errors.customer_name ?
                                                <div
                                                    className="text-red-600">{formik.errors.customer_name}</div> : null}
                                        </div>
                                        <div>
                                            <Input
                                                type="email"
                                                lable="Customer/Business Email Address"
                                                id="email"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}

                                            />
                                            {formik.errors.email ?
                                                <div className="text-red-600">{formik.errors.email}</div> : null}
                                        </div>
                                        <div>
                                            <Input
                                                type="tel"
                                                lable="Phone Number"
                                                id="phone_number"
                                                name="phone_number"
                                                value={formik.values.phone_number}
                                                onChange={formik.handleChange}
                                            />
                                            {formik.errors.phone_number ?
                                                <div
                                                    className="text-red-600">{formik.errors.phone_number}</div> : null}
                                        </div>
                                        <div>
                                            <Input
                                                type="text"
                                                lable="Customer/Business Address"
                                                id="address"
                                                name="address"
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                            />
                                            {formik.errors.address ?
                                                <div className="text-red-600">{formik.errors.address}</div> : null}
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-10">
                                        <PrimaryButton
                                            type="submit"
                                        >
                                            Add Customer
                                        </PrimaryButton>
                                    </div>
                                </form>
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
        return {redirect: {destination: '/', permanent: false,},}
    }

    return {props: {session,},}
}