import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Input from "@/components/InputFields/Input";
import Image from "next/image";
import logoIcon from "@/public/assets/img/logo.jpeg";
import {getSession, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import PillNavigation from "@/components/Navs/PillNavigation";

export default function BusinessView(warehouses) {

    const router = useRouter();
    const receivedValue = router.query;

    const [searchItem, setSearchItem] = useState('');
    const [filteredData, setFilteredData] = useState(warehouses && warehouses.warehouse ? warehouses.warehouse : null);

    const {data: session} = useSession()

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
        console.log(e.target.value);

        if (e.target.value === '') {
            setFilteredData(warehouses.warehouse)
        } else {
            let data = filteredData.filter((row) =>
                row.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            setFilteredData(data)
        }
    };

    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap relative">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Business', link: `/business/${receivedValue.business_id}/view`},
                            {label: 'Add Warehouse', link: `/business/${receivedValue.business_id}/warehouse/create`},
                            {label: 'Warehouse (s)', link: `/business/${receivedValue.business_id}/warehouse`}
                        ]}
                    />
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space p-4">
                                <form>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Input type="text" value={searchItem} onChange={handleSearch}
                                               lable="Search Warehouse"/>
                                    </div>
                                </form>
                                <div className="w-full">
                                    <div className="sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                            <div className="">
                                                <table
                                                    className="min-w-full text-left text-sm font-light border-collapse ">
                                                    <thead className="border-y-2 font-medium dark:border-neutral-500">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-4">Warehouse</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        filteredData && filteredData.map((listing) => {
                                                            return (
                                                                <tr key={listing.warehouse_id}
                                                                    className="border-b dark:border-neutral-500">
                                                                    <td className="px-2 py-1 font-medium">
                                                                        <div className="flex">
                                                                            <Image
                                                                                className="h-8 w-8 rounded bject-cover"
                                                                                src={warehouses.company.logo ? warehouses.company_image_path + warehouses.company.logo : logoIcon}
                                                                                alt="Business Logo"
                                                                                width={32} height={32}
                                                                            />
                                                                            <div className="ml-4">
                                                                                <p>{listing.name}</p>
                                                                                <p className="truncate w-40">{listing.description}</p>
                                                                            </div>
                                                                        </div>
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
        </AppLayout>
    )
}


export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }

    const sentFormData = new FormData();
    sentFormData.append("company_id", context.params.business_id)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}warehouse/listing`, {
        method: 'POST',
        body: sentFormData,
        headers: {"Access-Token": session.user.access_token}
    });

    const warehouses = await res.json();

    console.log(warehouses)

    if (warehouses.status) {
        return {props: warehouses.data};
    } else {
        return {props: {}};
    }

}