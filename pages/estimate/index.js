import AppLayout from "@/components/Layouts/AppLayout";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Menu} from "@headlessui/react";
import {getSession, useSession} from "next-auth/react";
import PillNavigation from "@/components/Navs/PillNavigation";
import {useBusinessData} from "@/context/BusinessContext";
import useSWR from "swr";
import SelectInput from "@/components/InputFields/SelectInput";
import Input from "@/components/InputFields/Input";


const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

export default function Estimate() {

    const {globalBusiness} = useBusinessData();
    const [estimateData, setEstimateData] = useState(null);
    const [searchItem, setSearchItem] = useState('');
    const [searchCompanyItem, setSearchCompanyItem] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const {data: session} = useSession()
    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))
    const fetchData = async (company_id) => {

        const estimateSentDataFetch =  new FormData();
        estimateSentDataFetch.append("company_id", company_id)
        const estimates = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}estimate/getListingByCompany`, {
            method: 'POST',
            body: estimateSentDataFetch,
            headers: {
                "Access-Token": session.user.access_token
            }
        }).then((result) => {
            return result.json()
        }).catch((error) => {
            console.log(error)
        });
        setFilteredData(estimates && estimates.status ? estimates.data.estimate : [])
        setEstimateData(estimates && estimates.status ? estimates.data : [])
        return estimates

    };
    useEffect(() => {

        console.log(session)
        if (session && session.user){
            fetchData(globalBusiness.company_id).then(r => {});
        }
    }, [globalBusiness.company_id, session]);
    console.log(filteredData)
    const handleSearch = (e) => {
        setSearchItem(e.target.value);
        console.log(e.target.value);
        if (e.target.value === '') {
            setFilteredData(estimateData.estimate)
        } else {
            let data = estimateData.estimate.filter((row) =>
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
            setFilteredData(estimates.estimate)
        } else {
            fetchData(e.target.value)
        }
    };

    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap relative ">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Estimates', link: '/estimate'},
                            {label: 'Create Estimate', link: '/estimate/create'}
                        ]}
                    />
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded p-6">
                        <div className="flex-auto">
                            <div className="tab-content tab-space">
                                <div>
                                    <form>
                                        <div className="mb-8 flex justify-between">
                                            <h5 className="text-c3 text-lg font-medium">Estimate List</h5>
                                            <span className="text-c1">
                        {/*<Icon icon="icon-menu-2"/>*/}
                    </span>
                                        </div>

                                        <div className="grid gap-6 mb-6 md:grid-cols-2">
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
                                                    <Input type="text" value={searchItem} onChange={handleSearch}
                                                           lable="Search By Customer Name"/>
                                                </div>
                                            </div>
                                        </div>
                                    </form>


                                    <div className="w-full">

                                        <div className="sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                                <div className="">
                                                    <table
                                                        className="min-w-full text-left text-sm font-light border-collapse ">
                                                        <thead
                                                            className="border-y-2 font-medium dark:border-neutral-500">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-4">Estimate No.</th>
                                                            <th scope="col" className="px-6 py-4">Amount</th>
                                                            <th scope="col" className="px-6 py-4">Action</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            filteredData && filteredData.map((data) => {
                                                                return (
                                                                    <tr key={data.estimate_id} className="border-b dark:border-neutral-500">
                                                                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                                            <p className="mb-0">{data.customer_name}</p>
                                                                            <p className="mb-0">{data.estimate_no} | Date: {data.estimate_date}</p>
                                                                            <p className="mb-0">Status : <span className="text-rose-600">{data.status == "1" ? "Pending" : ""}</span></p>
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-6 py-4">{data.currency_symbol} {data.total}</td>
                                                                        <td className="whitespace-nowrap px-6 py-4">
                                                                            <Menu as="div" className="relative">
                                                                                <Menu.Button className="">
                                                                                    <svg id="Layer_1" height="21" fill="#818181"
                                                                                         viewBox="0 0 24 24"
                                                                                         width="21"
                                                                                         xmlns="http://www.w3.org/2000/svg"
                                                                                         data-name="Layer 1">
                                                                                        <path
                                                                                            d="m12 9.03a2.975 2.975 0 1 0 2.98 2.97 2.979 2.979 0 0 0 -2.98-2.97z"/>
                                                                                        <path
                                                                                            d="m12 1.25a2.98 2.98 0 1 0 2.98 2.98 2.987 2.987 0 0 0 -2.98-2.98z"/>
                                                                                        <path
                                                                                            d="m12 16.8a2.975 2.975 0 1 0 2.98 2.98 2.981 2.981 0 0 0 -2.98-2.98z"/>
                                                                                    </svg>
                                                                                </Menu.Button>

                                                                                <Menu.Items
                                                                                    className="absolute left-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                                    <div className="py-1">
                                                                                        <Menu.Item className="py-2">
                                                                                            <Link href={`estimate/${data.estimate_id}/view`} className="text-gray-700 block px-4 py-2 text-sm" >
                                                                                                View
                                                                                            </Link>
                                                                                        </Menu.Item>
                                                                                        <Menu.Item className="py-2">
                                                                                            <Link href={`estimate/${data.estimate_id}/edit`} className="text-gray-700 block px-4 py-2 text-sm"
                                                                                            >
                                                                                                Edit
                                                                                            </Link>
                                                                                        </Menu.Item>
                                                                                        <Menu.Item className="py-2">
                                                                                            <Link
                                                                                                href="#"
                                                                                                className="text-gray-700 block px-4 py-2 text-sm"

                                                                                            >
                                                                                                Duplicate
                                                                                            </Link>
                                                                                        </Menu.Item>
                                                                                        <Menu.Item className="py-2">
                                                                                            <Link
                                                                                                href="#"
                                                                                                className="text-gray-700 block px-4 py-2 text-sm"

                                                                                            >
                                                                                                Share
                                                                                            </Link>
                                                                                        </Menu.Item>
                                                                                        <Menu.Item className="py-2">
                                                                                            <Link
                                                                                                href="#"
                                                                                                className="text-gray-700 block px-4 py-2 text-sm"

                                                                                            >
                                                                                                Convert
                                                                                            </Link>
                                                                                        </Menu.Item>
                                                                                        <Menu.Item className="py-2">
                                                                                            <Link
                                                                                                href="#"
                                                                                                className="text-gray-700 block px-4 py-2 text-sm"

                                                                                            >
                                                                                                Delete
                                                                                            </Link>
                                                                                        </Menu.Item>
                                                                                    </div>
                                                                                </Menu.Items>

                                                                            </Menu>
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


    return {props:{}};
}