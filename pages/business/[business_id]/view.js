import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Link from "next/link";
import {ToastContainer} from "react-toastify";
import ImagePreview from "@/components/InputFields/ImagePreview";
import Input from "@/components/InputFields/Input";
import SelectInput from "@/components/InputFields/SelectInput";
import ColorPicker from "@/components/InputFields/ColorPicker";
import {getSession, useSession} from "next-auth/react";
import useSWR from "swr";
import PillNavigation from "@/components/Navs/PillNavigation";
import SecondaryLinkButton from "@/components/Buttons/SecondaryLinkButton";
import PrimaryLinkButton from "@/components/Buttons/PrimaryLinkButton";
import ColorInput from "@/components/InputFields/ColorInput";

const currencies_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

export default function BusinessView(details) {

    const [formData, setFormData] = useState(details.company[0]);
    const [previewUrl, setPreviewUrl] = useState(details.company_image_path + details.company[0].logo);
    const {data: session} = useSession()

    const {
        data: currencies,
        error: currencies_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}currency/all`, session], ([url, session]) => currencies_fetcher(url, session))

    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap relative">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Business', link: `/business/`},
                            {label: 'Add Warehouse', link: `/business/${formData.company_id}/warehouse/create`},
                            {label: 'Warehouse (s)', link: `/business/${formData.company_id}/warehouse`}
                        ]}
                    />

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
                                        <div className="mb-8 flex flex-row justify-between">
                                            <h5 className="text-c3 text-lg font-medium">Business Details</h5>
                                            <PrimaryLinkButton
                                                href={'/business/' + formData.company_id + "/edit"}
                                            >
                                                Edit Business
                                            </PrimaryLinkButton>
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
                                                <SelectInput
                                                    option={
                                                        currencies && currencies.data && currencies.data.currencies.length > 0 && currencies.data.currencies.map((item, key) => {
                                                            return ({"value": item.currency_id, "label": `( ${item.symbol_left} ) ${item.title}`,})
                                                        })
                                                    }
                                                    label={"Currency"}
                                                    name="currency_id"
                                                             value={formData.currency_id} readOnly/>
                                            </div>
                                            <div>
                                                <label htmlFor="favcolor">Choose Brand Color (For Invoice
                                                    Templates):</label>
                                                <ColorInput
                                                    type="color"
                                                    name="color"
                                                    value={formData.color}
                                                    lable="Choose Brand Color (For Invoice Templates)" readOnly
                                                />

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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}


export const getServerSideProps = async (context) => {

    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,},}
    }
    console.log(session.user.access_token)

    const sentFormData = new FormData();
    sentFormData.append("company_id", context.params.business_id)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/detail`, {
        method: 'POST',
        body: sentFormData,
        headers: {"Access-Token": session.user.access_token}
    });

    const business = await res.json();

    return {props: business.data};
};
