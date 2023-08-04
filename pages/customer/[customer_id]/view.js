import React, {useState} from "react";
import {getSession, useSession} from "next-auth/react";
import SelectInput from "@/components/InputFields/SelectInput";
import Input from "@/components/InputFields/Input";
import AppLayout from "@/components/Layouts/AppLayout";
import Link from "next/link";
import useSWR from "swr";
import PrimaryLinkButton from "@/components/Buttons/PrimaryLinkButton";

const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

export default function ViewCustomers(details) {
    const {data: session, status} = useSession()
    const [formData, setFormData] = useState(details);

    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))


    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap relative">
                <div className="w-full flex flex-row justify-between">
                    <ul className="flex flex-col lg:flex-row border-b border-c6 top-3 lg:top-0 sticky z-50 bg-white w-full">
                        <li className="text-center">
                            <Link
                                className="lg:w-72 text-base font-bold px-5 py-2 block text-c3 border-b-2 border-c3 bg-white"
                                href="/customer">
                                View Customer
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col bg-white w-full rounded p-4">
                    <div className="flex flex-row justify-between my-2">
                        <h5>Customer Details</h5>
                        <PrimaryLinkButton
                            href={'/customer/' + formData.customer_id + "/edit"}
                        >
                            Edit Customer
                        </PrimaryLinkButton>
                    </div>
                    <form className="">
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
                                    value={formData.company_id}
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    lable="Customer/Business Name"
                                    id="customer_name"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    required/>
                            </div>
                            <div>
                                <Input
                                    type="email"
                                    lable="Customer/Business Email Address"
                                    id="email"
                                    name="email"
                                    value={formData.email}

                                />
                            </div>
                            <div>
                                <Input
                                    type="tel"
                                    lable="Phone Number"
                                    id="phone_number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                />
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    lable="Customer/Business Address"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                />
                            </div>
                        </div>
                    </form>
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