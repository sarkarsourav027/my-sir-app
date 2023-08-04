import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Link from "next/link";
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
export default function Tax(taxes) {

    const {globalBusiness} = useBusinessData();
    const [searchCompanyItem, setSearchCompanyItem] = useState('');
    const [searchItem, setSearchItem] = useState('');
    const [filteredData, setFilteredData] = useState(taxes && taxes.tax ? taxes.tax.filter((row) =>
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
            setFilteredData(taxes.tax)
        } else {
            let data = taxes.tax.filter((row) =>
                row.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            setFilteredData(data)
        }
    };

    const handleCompanySearch = (e) => {
        setSearchCompanyItem(e.target.value);


        if (e.target.value === '') {
            setFilteredData(taxes.tax)
        } else {
            let data = taxes.tax.filter((row) =>
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
                            {label: 'Taxes', link: '/tax'},
                            {label: 'Add Taxes', link: '/tax/create'}
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
                                <Input type="text" value={searchItem} onChange={handleSearch} lable="Search Tax"/>
                            </div>

                        </div>
                        <div className="bg-white w-full rounded">
                            <table className="min-w-full text-left text-sm font-light border-collapse ">
                                <thead className="border-y-2 font-medium dark:border-neutral-500">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Tax</th>
                                    <th scope="col" className="px-6 py-4">Rate</th>
                                    <th scope="col" className="px-6 py-4">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    filteredData && filteredData.map((item) => {

                                        return (
                                            <tr key={item.tax_id}
                                                className="border-b -gray-500 dark:border-neutral-500">
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                    <div className="flex">
                                                        <div className="ml-4">
                                                            <p>{item.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">{item.rate} %</td>

                                                <td className="px-2 py-1">
                                                    <Link
                                                        href={
                                                            {
                                                                pathname: `/tax/[id]/edit`,
                                                                query: {data: JSON.stringify(item)},
                                                            }
                                                        }
                                                        as={`/tax/${item.tax_id}/edit`}
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
    return {props: taxes && taxes.status ? taxes.data : {}};

}
