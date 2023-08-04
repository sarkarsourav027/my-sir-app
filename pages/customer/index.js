import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Link from "next/link";
import SelectInput from "@/components/InputFields/SelectInput";
import Input from "@/components/InputFields/Input";
import {getSession, useSession} from "next-auth/react";
import useSWR from "swr";
import {IoIosArrowForward} from "react-icons/io";
import PillNavigation from "@/components/Navs/PillNavigation";
import {useBusinessData} from "@/context/BusinessContext";

const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

export default function Customer(customers) {
    const {globalBusiness} = useBusinessData();
    const [searchItem, setSearchItem] = useState('');
    const [searchCompanyItem, setSearchCompanyItem] = useState('');
    const [filteredData, setFilteredData] = useState(customers && customers.customer ? customers.customer : null);
    const {data: session} = useSession()

    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
        console.log(e.target.value);

        if (e.target.value === '') {
            setFilteredData(customers.customer)
        } else {
            let data = customers.customer.filter((row) =>
                row.customer_name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            console.log(data)
            setFilteredData(data)
        }
    };

    const handleCompanySearch = (e) => {
        setSearchCompanyItem(e.target.value);
        console.log(e.target.value);

        if (e.target.value === '') {
            setFilteredData(customers.customer)
        } else {
            let data = customers.customer.filter((row) =>
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
                            {label: 'Customers', link: '/customer'},
                            {label: 'Add Customers', link: '/customer/create'}
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
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <Input
                                        type="text"
                                        value={searchItem}
                                        onChange={handleSearch}
                                        lable="Search Customer"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="inline-block min-w-full py-2">
                                <table className="min-w-full text-left text-sm font-light border-collapse ">
                                    <thead className="border-y-2 font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className="px-2 py-2">Customer</th>
                                        <th scope="col" className="px-2 py-2">Address</th>
                                        <th scope="col" className="px-2 py-2">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        filteredData && filteredData.map((data) => {
                                            return (
                                                <tr key={data.customer_id}
                                                    className="border-b dark:border-neutral-500">
                                                    <td className="px-2 py-2">{data.customer_name}</td>
                                                    <td className="px-2 py-2">{data.address}</td>
                                                    <td className="px-2 py-2">
                                                        <Link
                                                            href={'/customer/' + data.customer_id + "/view"}
                                                            className="text-gray-700 block text-sm">
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
            </div>
        </AppLayout>
    )
}


export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }

    if (session.user.permission.customer == 0) {
        return {redirect: {destination: '/access-denied', permanent: false,}}
    }

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

    console.log(customers)

    return {props: customers && customers.status ? customers.data: {}};
}