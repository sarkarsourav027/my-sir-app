import AppLayout from "@/components/Layouts/AppLayout";
import React from "react";
import {Disclosure} from '@headlessui/react'
import {ChevronUpIcon} from '@heroicons/react/20/solid'
import {getSession} from "next-auth/react";

export default function Faq() {
    return (
        <AppLayout>
            <div className="py-8">
                <h1 className="text-lg font-bold mb-10">FAQ</h1>
                <div>
                    <Disclosure>
                        {({open}) => (
                            <>
                                <Disclosure.Button className="border-b-2 border-c6 pb-4">
                                    <span className="mr-02xl">What is your refund policy?</span>
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-c3`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="text-c5 py-4">
                                    If youre unhappy with your purchase for any reason, email us
                                    within 90 days and well refund you in full, no questions asked.
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                    <Disclosure>
                        {({open}) => (
                            <>
                                <Disclosure.Button className="border-b-2 border-c6 pb-4 mt-8">
                                    <span className="mr-02xl">What is your refund policy?</span>
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-c3`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="text-c5 py-4">
                                    If youre unhappy with your purchase for any reason, email us
                                    within 90 days and well refund you in full, no questions asked.
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                    <Disclosure>
                        {({open}) => (
                            <>
                                <Disclosure.Button className="border-b-2 border-c6 pb-4 mt-8">
                                    <span className="mr-02xl">What is your refund policy?</span>
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-c3`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="text-c5 py-4">
                                    If youre unhappy with your purchase for any reason, email us
                                    within 90 days and well refund you in full, no questions asked.
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                    <Disclosure>
                        {({open}) => (
                            <>
                                <Disclosure.Button className="border-b-2 border-c6 pb-4 mt-8">
                                    <span className="mr-02xl">What is your refund policy?</span>
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-c3`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="text-c5 py-4">
                                    If youre unhappy with your purchase for any reason, email us
                                    within 90 days and well refund you in full, no questions asked.
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
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