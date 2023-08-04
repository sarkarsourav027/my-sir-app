import AppLayout from "@/components/Layouts/AppLayout";
import React from "react";
import {getSession} from "next-auth/react";

export default function CommaFormatSelection() {
    return (
        <AppLayout>
            <div className="py-8">
                <h1 className="text-lg font-bold mb-10">Comma Format Selection</h1>
                <div className="">
                    <form className="">
                        <div className="grid mb-6 md:grid-cols-2 gap-12">
                            <div className="flex items-center">
                                <input id="bordered-radio-1" type="radio" value="" name="bordered-radio"
                                       className="w-5 h-5 border-c3 mr-5"/>
                                <label htmlFor="bordered-radio-1" className="w-full text-lg text-c5">100000000</label>
                            </div>
                            <div className="flex items-center">
                                <input id="bordered-radio-2" type="radio" value="" name="bordered-radio"
                                       className="w-5 h-5 border-c3 mr-5"/>
                                <label htmlFor="bordered-radio-2" className="w-full text-lg text-c5">100000000</label>
                            </div>
                            <div className="flex items-center">
                                <input id="bordered-radio-3" type="radio" value="" name="bordered-radio"
                                       className="w-5 h-5 border-c3 mr-5"/>
                                <label htmlFor="bordered-radio-3" className="w-full text-lg text-c5">100000000</label>
                            </div>
                            <div className="flex items-center">
                                <input id="bordered-radio-4" type="radio" value="" name="bordered-radio"
                                       className="w-5 h-5 border-c3 mr-5"/>
                                <label htmlFor="bordered-radio-4" className="w-full text-lg text-c5">100000000</label>
                            </div>
                        </div>
                        <button className="rounded-full bg-c3 px-16 pb-2 pt-2.5 mt-16 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0">
                            Submit
                        </button>
                    </form>
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