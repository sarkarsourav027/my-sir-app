import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Image from "next/image";
import {getSession, useSession} from "next-auth/react";
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import axios from "axios";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
export default function Subscription() {

    const router = useRouter()
    const {data: session,status} = useSession()
    const initialOptions = {
        'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        intent: 'capture',
        vault: "true"
    };
    const paypalCreateOrder = async (data,actions,params) => {

        try {
            let response = await axios.post('/api/paypal/createorder', {
                user_id: session.user.user_id,
                subscriptionType: params.subscriptionType
            })
            return response.data
        } catch (err) {
            toast.error('Some Error Occured')
            return null
        }
    }
    const paypalCaptureOrder = async orderID => {
        try {
            let response = await axios.post('/api/paypal/captureorder', {
                orderID,
                AccessToken: session.user.access_token
            })
            console.log(response)
            toast.success("Subscription Successfull.")
            await router.push("/subscription")
        }catch (err) {
            toast.error('Some Error Occured')
        }
    }
        return (
        <AppLayout session={session}>
            <PayPalScriptProvider options={initialOptions}>
                <div className="p-8 bg-white">
                    <h1 className="text-lg font-bold mb-8 text-blue-950">Unlock Everything</h1>
                    <div className="grid lg:grid-cols-3 text-center gap-2">
                        <div className="bg-white rounded border px-4 py-14 border-gray-400">
                            <p className="text-5xl text-black font-bold">$9<span className="text-lg">.99</span></p>
                            <p className="text-lg text-gray-400">Monthly</p>
                            <div className="space-y-2">
                                <div className="flex">
                                    <div className="text-c1 mt-1 mr-4">{/*<Icon icon="icon-check" />*/}</div>

                                    <div className="text-left ">
                                        <p className="text-black font-bold text-lg mb-0">Get Paid Faster</p>
                                        <p className="text-gray-400 text-sm">
                                            Accept online or in-person payments via credit card, debit card or Paypal
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="text-c1 mt-1 mr-4">{/*<Icon icon="icon-check" />*/}</div>

                                    <div className="text-left ">
                                        <p className="text-black font-bold text-lg mb-0">Get Paid Faster</p>
                                        <p className="text-gray-400 text-sm">
                                            Accept online or in-person payments via credit card, debit card or Paypal
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <PayPalButtons
                                    style={{layout: "horizontal",shape:   'rect',tagline :false,label:'buynow'}}
                                    onClick={async (data, actions) => {

                                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}subscription/get`, {
                                            method: 'POST',
                                            headers: {"Access-Token": session.user.access_token}
                                        }).then((res) => {
                                            return res.json()
                                        })

                                        if(response.status) {

                                            // return actions.resolve()
                                            if(response.data.subscription.length===0){
                                                setSubscriptionType('monthly')
                                                return actions.resolve()
                                            }else {
                                                toast.error("You have already subscribed!")
                                                await router.push("/subscription")
                                                return actions.reject()
                                            }
                                        }
                                        return actions.resolve()

                                    }}
                                    createSubscription = {async(data, actions) => {
                                            return actions.subscription.create({
                                            'plan_id': process.env.NEXT_PUBLIC_PAYPAL_SUBSCRIPTION_MONTHLY
                                        });
                                    }}
                                    onApprove={async (data, actions) => {
                                        // let response = await paypalCaptureOrder(data.orderID)
                                        console.log(data)
                                        console.log(actions)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="bg-white rounded border px-4 py-14 border-gray-400 relative">
                            <p className="text-5xl text-black font-bold">$49<span className="text-lg">.99</span></p>
                            <p className="text-lg text-gray-400">Anuually</p>
                            <p>3-day trail</p>
                            <div className="space-y-2">
                                <div className="flex">
                                    <div className="text-c1 mt-1 mr-4">{/*<Icon icon="icon-check" />*/}</div>

                                    <div className="text-left ">
                                        <p className="text-black font-bold text-lg mb-0">Get Paid Faster</p>
                                        <p className="text-gray-400 text-sm">
                                            Accept online or in-person payments via credit card, debit card or Paypal
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="text-c1 mt-1 mr-4">{/*<Icon icon="icon-check" />*/}</div>

                                    <div className="text-left ">
                                        <p className="text-black font-bold text-lg mb-0">Get Paid Faster</p>
                                        <p className="text-gray-400 text-sm">
                                            Accept online or in-person payments via credit card, debit card or Paypal
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-c3 text-white px-12 py-3 rounded-full mt-8">
                                Start Now
                            </button>
                            <div className="bg-gradient-to-tr from-orange-500 to-orange-400 text-white absolute rounded-tl top-0 left-0 py-2 px-4">
                                Save 58% | Flash Sale
                            </div>
                        </div>
                        <div className="bg-white rounded border px-4 py-14 border-gray-400 relative">
                            <p className="text-5xl text-black font-bold">$299<span className="text-lg">.99</span></p>
                            <p className="text-lg text-gray-400">Lifetime</p>
                            <div className="space-y-2">
                                <div className="flex">
                                    <div className="text-c1 mt-1 mr-4">{/*<Icon icon="icon-check" />*/}</div>

                                    <div className="text-left ">
                                        <p className="text-black font-bold text-lg mb-0">Get Paid Faster</p>
                                        <p className="text-gray-400 text-sm">
                                            Accept online or in-person payments via credit card, debit card or Paypal
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="text-c1 mt-1 mr-4">{/*<Icon icon="icon-check" />*/}</div>

                                    <div className="text-left ">
                                        <p className="text-black font-bold text-lg mb-0">Get Paid Faster</p>
                                        <p className="text-gray-400 text-sm">
                                            Accept online or in-person payments via credit card, debit card or Paypal
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <PayPalButtons
                                    style={{layout: "horizontal",shape:   'rect',tagline :false,label:'buynow'}}
                                    onClick={async (data, actions) => {

                                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}subscription/get`, {
                                            method: 'POST',
                                            headers: {"Access-Token": session.user.access_token}
                                        }).then((res) => {
                                            return res.json()
                                        })

                                        if(response.status) {

                                            // return actions.resolve()
                                            if(response.data.subscription.length===0){
                                                setSubscriptionType('monthly')
                                                return actions.resolve()
                                            }else {
                                                toast.error("You have already subscribed!")
                                                await router.push("/subscription")
                                                return actions.reject()
                                            }
                                        }
                                        return actions.resolve()

                                    }}
                                    createOrder={async (data, actions) => {
                                        let response = await paypalCreateOrder(data,actions,{subscriptionType:"monthly"})
                                        return response.data
                                    }}
                                    onApprove={async (data, actions) => {
                                        let response = await paypalCaptureOrder(data.orderID)
                                    }}
                                />
                            </div>
                            <div className="bg-gradient-to-tr from-orange-500 to-orange-400 text-white absolute rounded-tl top-0 left-0 py-2 px-4">
                                Super Saver
                            </div>
                        </div>
                    </div>
                    <h2 className="text-lg font-bold mb-8 mt-14">More Features for half the price</h2>
                    <div className="w-full">
                        <div className="sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="rounded">
                                    <table className="min-w-full text-left text-sm font-light border-collapse ">
                                        <thead className="border font-medium dark:border-neutral-500">
                                        <tr>
                                            <th scope="col" className="px-6 py-4"></th>
                                            <th scope="col" className="px-6 py-4 text-c3">Basic</th>
                                            <th scope="col" className="px-6 py-4 text-c1">Pro</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr className="border">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium">Professional Invoice Templates</td>
                                            <td className="whitespace-nowrap px-6 py-4">3</td>
                                            <td className="whitespace-nowrap px-6 py-4">Unlimited</td>
                                        </tr>
                                        <tr className="border bg-c4">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium">Professional Invoice Templates</td>
                                            <td className="whitespace-nowrap px-6 py-4">3</td>
                                            <td className="whitespace-nowrap px-6 py-4">Unlimited</td>
                                        </tr>
                                        <tr className="border">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium">Professional Invoice Templates</td>
                                            <td className="whitespace-nowrap px-6 py-4">3</td>
                                            <td className="whitespace-nowrap px-6 py-4">Unlimited</td>
                                        </tr>
                                        <tr className="border bg-c4">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium">Professional Invoice Templates</td>
                                            <td className="whitespace-nowrap px-6 py-4">3</td>
                                            <td className="whitespace-nowrap px-6 py-4">Unlimited</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-lg font-bold mt-14 mb-8">Rate & Reviews</h2>
                    <div className="w-full">
                        <h2 className="text-black text-sm sm:text-lg md:text-lg font-bold mb-1">SumonXRD</h2>
                        {/*<Image src="/stars.svg" alt="plus icon" width="{120}" height="{10}" />*/}
                        <h3 className="text-black text-sm sm:text-lg md:text-sm font-bold mb-1">Quick and Efficient</h3>
                        <p className="text-gray-400 text-justify text-xs sm:text-base md:text-sm font-medium">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
                            type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                            Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                    </div>
                    <div className="w-full">
                        <h2 className="text-black text-sm sm:text-lg md:text-lg font-bold mb-1">SumonXRD</h2>
                        {/*<Image src="/stars.svg" alt="plus icon" width="{120}" height="{10}" />*/}
                        <h3 className="text-black text-sm sm:text-lg md:text-sm font-bold mb-1">Quick and Efficient</h3>
                        <p className="text-gray-400 text-justify text-xs sm:text-base md:text-sm font-medium">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
                            type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                            Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                    </div>
                    <h2 className="text-lg font-bold mt-14 mb-8">Frequently Asked Questions</h2>
                    <div className="w-full">
                        <h3 className="text-black text-sm sm:text-lg md:text-sm font-bold mb-1">How your free trial works?</h3>
                        <p className="text-gray-400 text-justify text-xs sm:text-base md:text-sm font-medium">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
                            type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                            Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                        <h3 className="text-black text-sm sm:text-lg md:text-sm font-bold mb-1">How your free trial works?</h3>
                        <p className="text-gray-400 text-justify text-xs sm:text-base md:text-sm font-medium">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
                            type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                            Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                    </div>
                </div>
            </PayPalScriptProvider>
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