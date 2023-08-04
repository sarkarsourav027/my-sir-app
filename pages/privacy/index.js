import AppLayout from "@/components/Layouts/AppLayout";
import React from "react";
import {getSession} from "next-auth/react";

export default function Privacy() {
    return (
        <AppLayout>
            <div className="py-8">
                <h1 className="text-lg font-bold mb-10">Privacy Policy</h1>
                <span className="text-base text-c5 leading-9">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </span>
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