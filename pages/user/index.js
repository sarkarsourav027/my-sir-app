import AppLayout from "@/components/Layouts/AppLayout";
import React, {useEffect, useState} from "react";
import SelectInput from "@/components/InputFields/SelectInput";
import Input from "@/components/InputFields/Input";
import Image from "next/image";
import logoIcon from "@/public/assets/img/logo.jpeg";
import logoGrayIcon from "@/public/assets/img/logo-gray.jpg";
import Link from "next/link";
import useSWR from "swr";
import {getSession, useSession} from "next-auth/react";
import {IoIosArrowForward} from "react-icons/io";
import PillNavigation from "@/components/Navs/PillNavigation";
import {useBusinessData} from "@/context/BusinessContext";

const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

export default function User(users) {
    const {globalBusiness} = useBusinessData();
    const [searchItem, setSearchItem] = useState('');
    const [searchCompanyItem, setSearchCompanyItem] = useState('');
    const [filteredData, setFilteredData] = useState(users && users.user ? users.user.filter((row) =>
        row.company_id.toLowerCase().includes(globalBusiness.company_id)
    ) : null);

    const {data: session} = useSession()



    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
        console.log(e.target.value);

        if (e.target.value === '') {
            setFilteredData(users.user)
        } else {
            let data = users.user.filter((row) =>
                row.fullname.toLowerCase().includes(e.target.value.toLowerCase())
            )
            console.log(data)
            setFilteredData(data)
        }
    };

    const handleCompanySearch = (e) => {
        setSearchCompanyItem(e.target.value);
        console.log(e.target.value);

        if (e.target.value === '') {
            setFilteredData(users.user)
        } else {
            let data = users.user.filter((row) =>
                row.company_id.toLowerCase().includes(e.target.value.toLowerCase())
            )
            console.log(data)
            setFilteredData(data)
        }
    };

    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Users', link: '/user'},
                            {label: 'Add User', link: '/user/create'}
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
                                    <Input type="text" value={searchItem} onChange={handleSearch}
                                           lable="Search User"/>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="inline-block min-w-full py-2">
                                <table
                                    className="min-w-full text-left text-sm font-light border-collapse ">
                                    <thead className="border-y-2 font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Name</th>
                                        <th scope="col" className="px-6 py-4">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        filteredData && filteredData.map((data) => {
                                            return (
                                                <tr key={data.user_id}
                                                    className="border-b dark:border-neutral-500">
                                                    <td className="px-2 py-2">
                                                        <div className="flex">
                                                            <Image
                                                                className="h-8 w-8 rounded bject-cover"
                                                                src={data.image ? users.user_image_path + data.image : logoGrayIcon}
                                                                alt="Business Logo" width={32}
                                                                height={32}/>
                                                            <div className="ml-4">
                                                                <p>{data.fullname}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <Link
                                                            href={{
                                                                pathname: `/user/[id]/view`,
                                                                query: {
                                                                    user: JSON.stringify(data),
                                                                    user_permission: JSON.stringify(data.permission),
                                                                    user_image_path: users.user_image_path,
                                                                }
                                                            }}
                                                            as={`/user/${data.user_id}/view`}
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

    const users = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}user/getSubUserListing`, {
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

    console.log(users)

    return {props: users && users.status ? users.data : {}};

}