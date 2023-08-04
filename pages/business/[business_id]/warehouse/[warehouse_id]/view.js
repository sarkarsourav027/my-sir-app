import AppLayout from "@/components/Layouts/AppLayout";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {ToastContainer} from "react-toastify";
import ImagePreview from "@/components/InputFields/ImagePreview";
import Input from "@/components/InputFields/Input";
import SelectInput from "@/components/InputFields/SelectInput";
import ColorPicker from "@/components/InputFields/ColorPicker";
import {useSession} from "next-auth/react";

export default function BusinessView(details) {
    const router = useRouter();
    const receivedValue = router.query;


    const {data: session, status} = useSession()
    console.log(session);

    const [openTab, setOpenTab] = React.useState(1);
    const [formData, setFormData] = useState(details);

    const [previewUrl, setPreviewUrl] = useState();
    const [color, setColor] = useState();
    const [currencies, setCurrencies] = useState([]);
    const detailsFetch = async () => {

        const sentFormData = new FormData();
        let details;
        // console.log(perms)
        sentFormData.append("company_id", receivedValue.id)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/detail`, {
            method: 'POST',
            body: sentFormData,
            headers: {
                "Access-Token": session.user.access_token
            }
        });

        const fetchDetails = await res.json();

        if (fetchDetails.status) {
            fetchDetails.data.company.map((item, key) => {
                details = {
                    company_id: item.company_id,
                    company_image_path: fetchDetails.data.company_image_path,
                    logo: item.logo,
                    name: item.name,
                    email: item.email,
                    phone_number: item.phone_number,
                    website: item.website,
                    address: item.address,
                    invoiceColor: item.color,
                    currency_id: item.currency_id,
                    payment_iban: item.payment_iban,
                    payment_swift_bic: item.payment_swift_bic,
                    payment_bank_name: item.payment_bank_name,
                    paypal_email: item.paypal_email,
                    cheque_payable_to: item.cheque_payable_to,
                }
            })
            setFormData(details)
            setColor(details.invoiceColor)
            setPreviewUrl(details.company_image_path + details.logo)
        } else {
            console.log(fetchDetails.message)
        }
    }

    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap relative">
                <div className="w-full">

                    <ul className="flex flex-col lg:flex-row lg:border-b-2 lg:border-c6 top-3 lg:top-0 sticky z-50 bg-white w-full">
                        <li className="text-center">
                            <Link
                                className="lg:w-72 text-base font-bold px-5 py-5 block leading-normal text-c3 rounded lg:rounded-0 lg:border-b-2 lg:border-c3 bg-white shadow-01xl lg:shadow-none border-2 lg:border-0"
                                href={'/business/' + receivedValue.company_id + "/view"}
                            >
                                Business
                            </Link>
                        </li>
                        <li className="text-center">
                            <Link
                                className="lg:w-72 text-base font-bold px-5 py-5 block leading-normal"
                                href={'/business/' + receivedValue.company_id + "/warehouse/create"}
                            >
                                Add Warehouse
                            </Link>
                        </li>
                        <li className="text-center">
                            <Link
                                className="lg:w-72 text-base font-bold px-5 py-5 block leading-normal"
                                href={'/business/' + receivedValue.company_id + "/warehouse"}
                            >
                                Warehouse (s)
                            </Link>
                        </li>
                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space p-4">
                                <div className="mt-14">
                                    <ToastContainer className="toast-position"/>
                                    <div>

                                        <div className="flex mb-8">
                                            <div className="w-full px-4 accent-gray-400 rounded-full justify-center">
                                                <ImagePreview previewUrl={previewUrl}/>
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h5 className="text-c3 text-lg font-medium">Business Details</h5>
                                        </div>

                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <div>
                                                <Input type="text" name="name" value={formData.name}
                                                       lable="Business Name" readOnly/>
                                            </div>
                                            <div>
                                                <Input type="text" name="email" value={formData.email}
                                                       lable="Business Email" readOnly/>
                                            </div>
                                            <div>
                                                <Input type="tel" name="phone_number" value={formData.phone_number}
                                                       lable="Business Phone Number" readOnly/>
                                            </div>
                                            <div>
                                                <Input type="text" name="website" value={formData.website}
                                                       lable="Website" readOnly/>
                                            </div>
                                            <div>
                                                <Input type="text" name="address" value={formData.address}
                                                       lable="Business Address" readOnly/>
                                            </div>
                                            <div>
                                                <SelectInput option={currencies} label={"Currency"} name="currency_id"
                                                             value={formData.currency_id} readOnly/>
                                            </div>
                                            <div>
                                                <ColorPicker color={color} readOnly/>
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h5 className="text-c3 text-lg font-medium">PAYMENT DETAILS(OPTIONAL)</h5>
                                        </div>

                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <div>
                                                <Input type="text" name="payment_iban" value={formData.payment_iban}
                                                       lable="Enter IBAN" readOnly/>
                                            </div>
                                            <div>
                                                <Input type="text" name="payment_bank_name"
                                                       value={formData.payment_bank_name} lable="Enter Bank Name"
                                                       readOnly/>
                                            </div>
                                            <div>
                                                <Input type="text" name="payment_swift_bic"
                                                       value={formData.payment_swift_bic} lable="Enter Swift BIC"
                                                       readOnly/>
                                            </div>
                                            <div>
                                                <Input type="text" name="paypal_email" value={formData.paypal_email}
                                                       lable="Paypal Email Address" readOnly/>
                                            </div>
                                            <div>
                                                <Input type="text" name="cheque_payable_to"
                                                       value={formData.cheque_payable_to}
                                                       lable="Make Cheque Payable To" readOnly/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-24">
                                        <Link
                                            href={'/business/' + formData.company_id + "/edit"}
                                            className="inline-block rounded-full bg-c3 px-24 pb-2 pt-2.5 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0"
                                        >
                                            Edit Business
                                        </Link>
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

