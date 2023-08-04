import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Link from "next/link";
import Input from "@/components/InputFields/Input";
import Image from "next/image";
import logoIcon from "@/public/assets/img/logo.jpeg";
import {IoIosArrowForward} from "react-icons/io";
import {getSession, useSession} from "next-auth/react";
import PillNavigation from "@/components/Navs/PillNavigation";

export default function Business(business) {

    const [searchItem, setSearchItem] = useState('');
    const [filteredData, setFilteredData] = useState(business && business.company ? business.company : null);
    const {data: session} = useSession()

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
        console.log(e.target.value);

        if (e.target.value === '') {
            setFilteredData(business.company)
        } else {
            let data = business.company.filter((row) =>
                row.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            setFilteredData(data)
        }
    };

    return (
        <AppLayout session={session}>
            <div className="w-full">
                <PillNavigation
                    lists={[
                        {label: 'My Businesses', link: '/business'},
                        {label: 'Add Business', link: '/business/create'}
                    ]}
                />
                <div className="bg-white w-full rounded">
                    <div className="p-4 grid gap-6 md:grid-cols-2">
                        <Input type="text" value={searchItem} onChange={handleSearch} lable="Search Business"/>
                    </div>
                    <div className="bg-white w-full rounded">
                        <table className="min-w-full text-left text-sm font-light border-collapse ">
                            <thead className="border-y-2 font-medium dark:border-neutral-500">
                            <tr>
                                <th scope="col" className="px-2 py-2">Business</th>
                                <th scope="col" className="px-2 py-2">Currency</th>
                                <th scope="col" className="px-2 py-2">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                filteredData && filteredData.map((item) => {
                                    return (
                                        <tr key={item.company_id}
                                            className="border-b -gray-500 dark:border-neutral-500">
                                            <td className="px-2 py-1">
                                                <div className="flex">
                                                    {
                                                        <Image
                                                            className="h-8 w-8 rounded bject-cover"
                                                            src={item.logo == null ? logoIcon : business.company_image_path + item.logo}
                                                            alt="Business Logo"
                                                            width={32} height={32}
                                                        />
                                                    }
                                                    <div className="ml-4"><p>{item.name}</p></div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1">{item.payment_currency}</td>
                                            <td className="px-2 py-1">
                                                <Link
                                                    href={'/business/' + item.company_id + "/view"}
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
        </AppLayout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }

    const business = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, {
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

    console.log(business)

    return {props: business && business.status ? business.data : {}};

}