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
import {FormikProvider} from "formik";
import FileUpload from "@/components/InputFields/FileUpload";
import TextArea from "@/components/InputFields/TextArea";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

const company_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());
export default function ProductView(details) {

    const [formData, setFormData] = useState(details.product);

    const {data: session} = useSession()

    const {
        data: company,
        error: company_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => company_fetcher(url, session))
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

                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space p-4">
                                <div className="mt-14">
                                    <ToastContainer className="toast-position"/>
                                    <div>
                                        <div className="mb-8 flex flex-row justify-between">
                                            <h5 className="text-c3 text-lg font-medium">Item Details</h5>
                                            <PrimaryLinkButton
                                                href={'/item/' + formData.product_id + "/edit"}
                                            >
                                                Edit Item
                                            </PrimaryLinkButton>
                                        </div>
                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <div>
                                                <Input type="text" name="name" value={formData.name}
                                                       lable="Item Name" readOnly/>
                                            </div>
                                            <div>
                                                <Input type="text" name="price" value={formData.price}
                                                       lable="Item Rate" readOnly/>
                                            </div>

                                            <div>
                                                <SelectInput
                                                    option={
                                                        company && company.data && company.data.company.length > 0 && company.data.company.map((item, key) => {
                                                            return ({"value": item.company_id, "label": `${item.name}`,})
                                                        })
                                                    }
                                                    label={"Company"}
                                                    name="company_id"
                                                    value={formData.company_id} disabled/>
                                            </div>

                                        </div>
                                        <div>
                                            <TextArea
                                                name="description"
                                                value={formData.description}
                                                lable="Item Description (Optional)"
                                            />
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


    const sentFormData = new FormData();
    sentFormData.append("product_id", context.params.item_id)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}product/detail`, {
        method: 'POST',
        body: sentFormData,
        headers: {"Access-Token": session.user.access_token}
    });

    const product = await res.json();

    return {props:  product.data};
};
