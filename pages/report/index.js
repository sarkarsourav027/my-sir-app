import AppLayout from "@/components/Layouts/AppLayout";
import React from "react";
import {getSession} from "next-auth/react";

export default function Report() {
    return (
        <AppLayout>
            <div className="py-8">
                <h1 className="text-lg font-bold mb-10">Reports</h1>
                <div className="">
                    <form className="">
                        <select id="underline_select"
                                className="focus:outline-none bg-white border border-c5 text-c5 text-sm rounded  focus:ring-0 block w-full p-2.5 lable-c5">
                            <option selected>Select Business</option>
                            <option value="1">Business 1</option>
                            <option value="2">Business 2</option>
                            <option value="3">Business 3</option>
                        </select>
                    </form>
                    <div className="grid lg:grid-cols-3 gap-6 mt-12">
                        <button className="bg-white shadow-01xl text-c1 font-bold py-4 px-8 rounded-full">
                            Customer Statement of Account
                        </button>
                        <button className="bg-white shadow-01xl text-c1 font-bold py-4 px-8 rounded-full">
                            Supplier Statement of Account
                        </button>
                        <button className="bg-white shadow-01xl text-c1 font-bold py-4 px-8 rounded-full">
                            Total Sales Report
                        </button>
                        <button className="bg-white shadow-01xl text-c1 font-bold py-4 px-8 rounded-full">
                            Total Purchase Report
                        </button>
                        <button className="bg-white shadow-01xl text-c1 font-bold py-4 px-8 rounded-full">
                            Customer Ageing Report
                        </button>
                        <button className="bg-white shadow-01xl text-c1 font-bold py-4 px-8 rounded-full">
                            Tax Collected Report
                        </button>
                        <button className="bg-white shadow-01xl text-c1 font-bold py-4 px-8 rounded-full">
                            Stock Report
                        </button>
                        <button className="bg-white shadow-01xl text-c1 font-bold py-4 px-8 rounded-full">
                            Product Movement Report
                        </button>
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

    return {props: {}};
}