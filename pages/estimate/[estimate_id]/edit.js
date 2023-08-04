import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Link from "next/link";
import {Menu} from "@headlessui/react";
import PillNavigation from "@/components/Navs/PillNavigation";
import {getSession, useSession} from "next-auth/react";
import {ProductAddProvider} from "@/context/ProductAddContext";
import EstimateForms from "@/components/EstimateEdit/Forms/EstimateForms";

export default function EstimateEdit(data) {
    const {data: session} = useSession()
    return (
        <AppLayout session={session}>
            <ProductAddProvider>
                <EstimateForms products={data.products} items={data.items} taxes = {data.taxes} customers = {data.customers} details = {data.details}/>
            </ProductAddProvider>
        </AppLayout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }
    const products = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}product/getListingByUser`, {
        method: 'POST',
        headers: {"Access-Token": session.user.access_token},
    })
        .then((res) => {
            return res.json()
        })
        .then()
        .catch((error) => {
            console.log(error)
        });

    const items = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}service/getListingByUser`, {
        method: 'POST',
        headers: {"Access-Token": session.user.access_token},
    })
        .then((res) => {
            return res.json()
        })
        .then()
        .catch((error) => {
            console.log(error)
        });
    const taxes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}tax/listing`, {
        method: 'POST',
        headers: {"Access-Token": session.user.access_token}
    })
        .then((res) => {
            return res.json()
        })
        .then()
        .catch((error) => {
            console.log(error)
        });


    const customers = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}customer/listing`, {
        method: 'POST',
        headers: {"Access-Token": session.user.access_token}
    })
        .then((res) => {
            return res.json()
        })
        .then()
        .catch((error) => {
            console.log(error)
        });
    const sentFormData = new FormData();
    sentFormData.append("estimate_id", context.params.estimate_id)
    const details = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}estimate/detail`, {
        method: 'POST',
        body: sentFormData,
        headers: {"Access-Token": session.user.access_token}
    })
        .then((res) => {
            return res.json()
        })
        .then()
        .catch((error) => {
            console.log(error)
        });
    return {props: {products : products && products.status ? products.data : {},items : items && items.status ? items.data : {}, taxes : taxes && taxes.status ? taxes.data : {}, customers : customers && customers.status ? customers.data: {}, details : details && details.status ? details.data: {}}};
}