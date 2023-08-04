import AppLayout from "@/components/Layouts/AppLayout";
import React from "react";
import Link from "next/link";
import {getSession} from "next-auth/react";

export default function Po() {
    const [openTab, setOpenTab] = React.useState(1);
    return (
        <AppLayout>
            <div className="flex flex-wrap relative">
                <div className="w-full">
                    <ul
                        className="flex flex-col lg:flex-row lg:border-b-2 lg:border-c6 top-3 lg:top-0 sticky z-50 bg-white w-full"
                        role="tablist">
                        <li className="text-center">
                            <Link
                                className={
                                    "lg:w-72 text-base font-bold px-5 py-5 block leading-normal" +
                                    (openTab === 1
                                        ? "text-c3 rounded lg:rounded-0 lg:border-b-2 lg:border-c3 bg-white shadow-01xl lg:shadow-none border-2 lg:border-0"
                                        : "text-c5 ")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                }}
                                data-toggle="tab"
                                href="/link1"
                                role="tablist"
                            >
                                Create PO
                            </Link>
                        </li>
                        <li className="text-center">
                            <Link
                                className={
                                    "lg:w-72 text-base font-bold px-5 py-5 block leading-normal" +
                                    (openTab === 2
                                        ? "text-c3 rounded lg:rounded-0 lg:border-b-2 lg:border-c3 bg-white shadow-01xl lg:shadow-none border-2 lg:border-0"
                                        : "text-c5 ")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                }}
                                data-toggle="tab"
                                href="/"
                                role="tablist"
                            >
                                Purchase Orders
                            </Link>
                        </li>

                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">

                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">

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