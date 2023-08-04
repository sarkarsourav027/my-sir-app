import AppLayout from "@/components/Layouts/AppLayout";
import React from "react";
import {getSession} from "next-auth/react";

export default function Support() {
    return (
        <AppLayout>
            <div className="py-8">
                <h1 className="text-lg font-bold mb-10">Need Some Help?</h1>
                <div className="">
                    <form className="">
                        <input type="text" id="first_name"
                               className="focus:outline-none mb-5 bg-white border border-c5 text-c5 text-sm rounded  focus:ring-0 block w-full p-2.5 lable-c5"
                               lable="Email ID" required/>
                        <textarea
                            className="focus:outline-none bg-white border border-c5 text-c5 text-sm rounded  focus:ring-0 block w-full p-2.5 lable-c5 h-48"
                            lable="Write a message ..." required/>
                        <button
                            className="rounded-full bg-c3 px-16 pb-2 pt-2.5 mt-16 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0">
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