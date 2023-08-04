import AppLayout from "@/components/Layouts/AppLayout";
import React from "react";
import {getSession} from "next-auth/react";

export default function Language() {
    return (
        <AppLayout>
            <div className="py-8">
                <h1 className="text-lg font-bold mb-10">Language</h1>
                <div className="">
                    <form className="">
                        <select id="underline_select"
                                className="focus:outline-none bg-white border border-c5 text-c5 text-sm rounded  focus:ring-0 block w-full p-2.5 lable-c5">
                            <option selected>Select Language</option>
                            <option value="1">Bengali</option>
                            <option value="2">Hindi</option>
                            <option value="3">English</option>
                        </select>
                        <button
                            className="rounded-full bg-c3 px-16 pb-2 pt-2.5 mt-16 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0">
                            Save
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