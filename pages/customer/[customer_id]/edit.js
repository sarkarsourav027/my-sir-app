import React, {useState} from "react";
import {getSession, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import SelectInput from "@/components/InputFields/SelectInput";
import InputError from "@/components/InputFields/InputError";
import Input from "@/components/InputFields/Input";
import AppLayout from "@/components/Layouts/AppLayout";
import useSWR from "swr";
import Link from "next/link";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());


export default function EditCustomers(details) {
    const router = useRouter();
    const {data: session} = useSession();

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(details);
    const [submitLoading, setSubmitLoading] = useState(false);

    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitLoading(true)

        const sentFormData = new FormData();
        sentFormData.append("customer_id", formData.customer_id)
        sentFormData.append("company_id", formData.company_id)
        sentFormData.append("customer_name", formData.customer_name)
        sentFormData.append("email", formData.email)
        sentFormData.append("phone_number", formData.phone_number)
        sentFormData.append("address", formData.address)

        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}customer/update`, {
            method: 'POST',
            body: sentFormData,
            headers: {
                "Access-Token": session.user.access_token
            }
        })

        const response = await result.json();

        setSubmitLoading(false)

        if (response.status) {
            toast.success(response.message)
            await router.push("/customer");
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
                    <ul className="flex flex-col lg:flex-row border-b border-c6 top-3 lg:top-0 sticky z-50 bg-white w-full">
                        <li className="text-center">
                            <Link
                                className="lg:w-72 text-base font-bold px-5 py-2 block text-c3 border-b-2 border-c3 bg-white"
                                href="/customer">
                                Edit Customer
                            </Link>
                        </li>
                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full p-4 rounded">
                        <form onSubmit={handleSubmit}>
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
                                        onChange={handleChange}
                                        value={formData.company_id}
                                        required
                                    />
                                    {errors.company_id && <InputError message={errors.company_id}/>}
                                </div>
                                <div>
                                    <Input
                                        type="text"
                                        lable="Customer/Business Name"
                                        id="customer_name"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        onChange={handleChange}
                                        required/>
                                    {errors.customer_name && <InputError message={errors.customer_name} required/>}
                                </div>
                                <div>
                                    <Input
                                        type="email"
                                        lable="Customer/Business Email Address"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}

                                    />
                                    {errors.email && <InputError message={errors.email} required/>}
                                </div>
                                <div>
                                    <Input
                                        type="tel"
                                        lable="Phone Number"
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="text"
                                        lable="Customer/Business Address"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-24">
                                <PrimaryButton
                                    type="submit"
                                >
                                    {submitLoading === false ? 'Update Customer' : ' Please Wait...'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export async function getServerSideProps(context) {

    const session = await getSession(context)

    if (session) {

        const sentFormData = new FormData();
        sentFormData.append("customer_id", context.params.customer_id)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}customer/detail`, {
            method: 'POST',
            body: sentFormData,
            headers: {"Access-Token": session.user.access_token}
        });

        const fetchDetails = await res.json();

        console.log(fetchDetails.data.customer[0])

        if (fetchDetails.status) {
            return {props: fetchDetails.data.customer[0]};
        } else {
            console.log(fetchDetails.message)
        }
    }

    return {redirect: {destination: '/', permanent: false,}}
}