import React, {useState} from 'react';
import AppLayout from "@/components/Layouts/AppLayout";
import {Dialog} from "@headlessui/react";
import {useRouter} from "next/router";
import Link from "next/link";

function Index(props) {
    let [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    return (
        <AppLayout>
            <Dialog
                open={isOpen}
                onClose={() => router.back()}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel>
                            <div className="relative z-10" aria-labelledby="modal-title" role="dialog"
                                 aria-modal="true">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                                <div className="fixed inset-0 z-10 overflow-y-auto">
                                    <div
                                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <div
                                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div
                                                        className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                        <svg className="h-6 w-6 text-red-600" fill="none"
                                                             viewBox="0 0 24 24"
                                                             strokeWidth="1.5" stroke="currentColor"
                                                             aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                                                        </svg>
                                                    </div>
                                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                        <h3 className="text-base font-semibold leading-6 text-gray-900"
                                                            id="modal-title">Unauthorized Access</h3>
                                                        <div className="mt-2">
                                                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                                                            <p className="text-sm text-gray-500">You are not authorized
                                                                to visit this page</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center ">

                                                <button onClick={() => router.back()} type="button"
                                                        className="inline-block rounded-full bg-c3 px-5 pb-2 pt-2.5 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0">Back
                                                </button>
                                                <Link href='/dashboard'
                                                      className="inline-block rounded-full bg-c3  px-8 mx-3 pb-2 pt-2.5 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0"> Dashboard
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </AppLayout>

    );
}

export default Index;