import AppLayout from "@/components/Layouts/AppLayout";
import React from "react";
import Link from "next/link";
import {getSession, useSession} from "next-auth/react";


export default function Settings() {
    const {data: session} = useSession()
    return (
        <AppLayout session={session}>
            <div className="py-8 bg-white w-full rounded">
                <div className="p-4">
                    <h1 className="text-lg font-bold mb-10">Settings</h1>

                    <Link href="/Support">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Support</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/comma-format">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Comma Format Selection</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/faq">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>FAQ</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/language">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Languages</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="#">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Rate The App</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/redeem">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Redeem Coupon</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/subscription">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Subscribe</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/payment">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Online Payment Gateway</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="#">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Restore Purchase</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="#">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Invite Friends</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/about">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>About The App</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/privacy">
                        <div className="flex justify-between border-b-2 border-c6 items-center pb-2 my-5">
                            <p>Privacy Policy</p>
                            <div>
                                <svg height="26" viewBox="0 0 32 32" width="26" fill="#FD5822"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow,-next,-right,-skip" fill-rule="evenodd">
                                        <path id="Path"
                                              d="m9.29289322 5.70710678 1.41421358-1.41421356 11.7071068 11.70710678-11.7071068 11.7071068-1.41421358-1.4142136 10.29210678-10.2928932z"
                                              fill-rule="nonzero"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="#">
                        <div className="flex justify-between items-center pb-2 my-5">
                            <p>Delete Account</p>
                            <button className="bg-white shadow-01xl text-c1 py-4 px-8 rounded-full">
                                Delete Now
                            </button>
                        </div>
                    </Link>
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