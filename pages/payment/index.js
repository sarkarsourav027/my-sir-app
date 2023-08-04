import AppLayout from "@/components/Layouts/AppLayout";
import React, {useEffect, useState} from "react";
import {getSession, useSession} from "next-auth/react";
import SelectInput from "@/components/InputFields/SelectInput";
import Link from "next/link";
import useSWR from "swr";
import {useBusinessData} from "@/context/BusinessContext";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());
export default function Payment({sessionDetails}) {

    const {data: session} = useSession()
    const router = useRouter();
    const query = router.query;

    const {globalBusiness} = useBusinessData();
    const [stripePaymentSetting, setStripePaymentSetting] = useState('0');
    const [paypalPaymentSetting, setPaypalPaymentSetting] = useState('0');
    const [selectedCompanyId, setSelectedCompanyId] = useState(globalBusiness.company_id);

    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))

    const handleCompanyChange = async (e) => {
        setSelectedCompanyId(e.target.value)
        await get_company(e.target.value)
    };

    useEffect(()=>{
        if(query.code){
            router.push("/payment");
        }
        get_company(selectedCompanyId)
    },[])

    const get_company = async (company_id) =>{
        const sentFormData = new FormData();
        sentFormData.append("company_id", company_id)
        const settings = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}settings/get`, {
            method: 'POST',
            headers: {"Access-Token": sessionDetails.user.access_token},
            body:sentFormData
        })
            .then((res) => {
                return res.json()
            })
            .then()
            .catch((error) => {
                console.log(error)
            });
        if(settings.status){
            setStripePaymentSetting(settings.data.company[0].stripe)
            setPaypalPaymentSetting(settings.data.company[0].paypal)
        }
    }
    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <div className="bg-white w-full rounded">
                        <div className="p-4 grid gap-6 md:grid-cols-2">
                            <div>
                                <SelectInput
                                    option={
                                        business && business.data && business.data.company.length > 0 && business.data.company.map((item, key) => {
                                            return ({"value": item.company_id, "label": item.name,})
                                        })
                                    }
                                    label={"Company"}
                                    name="company_id"
                                    defaultSelectedValue={selectedCompanyId}
                                    onChange={handleCompanyChange}
                                />
                            </div>
                        </div>
                        <div className="w-full p-8">

                            <div className="flex justify-between mb-8 mt-16">
                                <p className="text-lg text-c3 font-bold">Stripe</p>
                                {
                                    selectedCompanyId && selectedCompanyId !=='' ? <button onClick={() => {
                                        if (window) {
                                            window.document.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${
                                                process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID
                                            }&scope=read_write&state=${selectedCompanyId}&redirect_uri=${
                                                process.env.NEXT_PUBLIC_BASE_URL
                                            }payment`;
                                        }
                                    }}
                                        className="flex sm:inline-flex justify-center items-center bg-gradient-to-tr from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 active:from-orange-700 active:to-orange-600 focus-visible:ring ring-pink-300 text-white text-center rounded-full outline-none transition duration-100 px-16 py-3">
                                        {stripePaymentSetting === '0' ? 'Setup' : 'Edit'}
                                    </button> : ''
                                }
                            </div>
                            <div className="flex justify-between mb-8">
                                <p className="text-lg text-c3 font-bold">Paypal</p>
                                {
                                    selectedCompanyId && selectedCompanyId !=='' ? <Link href={paypalPaymentSetting === '0' ? `payment/paypal/${selectedCompanyId}/add` : `payment/paypal/${selectedCompanyId}/edit`}
                                                                                         className="flex sm:inline-flex justify-center items-center bg-gradient-to-tr from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 active:from-orange-700 active:to-orange-600 focus-visible:ring ring-pink-300 text-white text-center rounded-full outline-none transition duration-100 px-16 py-3">
                                        {paypalPaymentSetting === '0' ? 'Setup' : 'Edit'}
                                    </Link> : ''
                                }
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

    const body = context.query;
    if (!body?.code) {
        return {props: {sessionDetails:session}};
    }

    let response;
    try {
        // return {redirect: {destination: '/payment', permanent: false,}}
        // const sentFormData = new FormData();
        // sentFormData.append("company_id", body.state)
        // sentFormData.append("key", "STRIPE")
        // sentFormData.append("token", body.code)
        //
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}settings/add`, {
        //     method: 'POST',
        //     body: sentFormData,
        //     headers: {
        //         "Access-Token": session.user.access_token
        //     }
        // }).then((result) => {
        //     return result.json()
        // })
        // if (response.status) {
        //     toast.success(response.message)
        // } else {
        //     toast.error(response.message)
        // }
    } catch (error) {
        return {props: {sessionDetails:session}};
    }

    return {props: {sessionDetails:session}};
}