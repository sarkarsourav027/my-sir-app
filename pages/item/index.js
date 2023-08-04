import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import logoIcon from "@/public/assets/img/logo.jpeg";
import {Menu} from "@headlessui/react";
import {getSession, useSession} from "next-auth/react";
import PillNavigation from "@/components/Navs/PillNavigation";
import Input from "@/components/InputFields/Input";
import {IoIosArrowForward} from "react-icons/io";
import SelectInput from "@/components/InputFields/SelectInput";
import useSWR from "swr";
import {useBusinessData} from "@/context/BusinessContext";
const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());
export default function Product(products) {
    console.log(products)
    const {globalBusiness} = useBusinessData();


    const [searchCompanyItem, setSearchCompanyItem] = useState('');
    const [searchItem, setSearchItem] = useState('');
    const [filteredData, setFilteredData] = useState(products && products.service ? products.service.filter((row) =>
        row.company_id.toLowerCase().includes(globalBusiness.company_id)
    ) : null);
    const {data: session} = useSession()
    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))
    const handleSearch = (e) => {
        setSearchItem(e.target.value);
        if (e.target.value === '') {
            setFilteredData(products.service)
        } else {
            let data = products.service.filter((row) =>
                row.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            setFilteredData(data)
        }
    };

    const handleCompanySearch = (e) => {
        setSearchCompanyItem(e.target.value);
        console.log(e.target.value);

        if (e.target.value === '') {
            setFilteredData(products.service)
        } else {
            let data = products.service.filter((row) =>
                row.company_id.toLowerCase().includes(e.target.value.toLowerCase())
            )
            console.log(data)
            setFilteredData(data)
        }
    };


    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap relative">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Items', link: '/item'},
                            {label: 'Add Item', link: '/item/create'}
                        ]}
                    />
                    <div className="bg-white w-full rounded">

                        <div className="p-4 grid gap-6 md:grid-cols-2">
                            <div>
                                <SelectInput
                                    option={
                                        business && business.data && business.data.company.length > 0 && business.data.company.map((item, key) => {
                                            return ({"value": item.company_id, "label": item.name,})
                                        })
                                    }
                                    label={"Company"}
                                    name="company_id"
                                    onChange={handleCompanySearch}
                                    defaultSelectedValue={globalBusiness.company_id}
                                />
                            </div>
                            <div>
                                <Input type="text" value={searchItem} onChange={handleSearch} lable="Search Item"/>
                            </div>

                        </div>
                        <div className="bg-white w-full rounded">
                            <table className="min-w-full text-left text-sm font-light border-collapse ">
                                <thead className="border-y-2 font-medium dark:border-neutral-500">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Item</th>
                                    <th scope="col" className="px-6 py-4">Price</th>
                                    <th scope="col" className="px-6 py-4">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    filteredData && filteredData.map((item) => {
                                        return (
                                            <tr key={item.product_id}
                                                className="border-b -gray-500 dark:border-neutral-500">
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                    <div className="flex">
                                                        <div className="ml-4">
                                                            <p>{item.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">{item.currency_symbol}{item.price}</td>

                                                <td className="px-2 py-1">
                                                    <Link
                                                        href={'/item/' + item.product_id + "/view"}
                                                        className="text-gray-700 block px-4 py-1 text-sm">
                                                        <IoIosArrowForward className="h-8"/>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
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
    const sentFormData = new FormData();
    sentFormData.append("company_id", 374)
    const products = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}service/getListingByUser`, {
        method: 'POST',
        headers: {"Access-Token": session.user.access_token},
        body:sentFormData
    })
        .then((res) => {
            return res.json()
        })
        .then()
        .catch((error) => {
            console.log(error)
        });

    console.log(products)

    return {props: products && products.status ? products.data : {}};

}