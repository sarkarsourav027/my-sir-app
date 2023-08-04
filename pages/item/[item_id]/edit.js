import React, {useState} from 'react';
import {getSession, useSession} from "next-auth/react";
import {toast, ToastContainer} from "react-toastify";
import ImagePreview from "@/components/InputFields/ImagePreview";
import FileUpload from "@/components/InputFields/FileUpload";
import Input from "@/components/InputFields/Input";
import SelectInput from "@/components/InputFields/SelectInput";
import ColorPicker from "@/components/InputFields/ColorPicker";
import AppLayout from "@/components/Layouts/AppLayout";
import {useRouter} from "next/router";
import useSWR from "swr";
import Link from "next/link";
import PillNavigation from "@/components/Navs/PillNavigation";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PrimaryLinkButton from "@/components/Buttons/PrimaryLinkButton";
import TextArea from "@/components/InputFields/TextArea";
const company_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());
export default function ProductEdit(details) {
    const [formData, setFormData] = useState(details.product);
    const router = useRouter();
    const {data: session} = useSession()

    const [selectedFile, setSelectedFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const {
        data: company,
        error: company_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => company_fetcher(url, session))
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFormData({...formData, image: file});
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sentFormData = new FormData();

        if (selectedFile !== null) {
            sentFormData.append("image", selectedFile)
        }

        sentFormData.append("product_id", formData.product_id)
        sentFormData.append("name", formData.name)
        sentFormData.append("price", formData.price)
        sentFormData.append("description", formData.description)
        sentFormData.append("company_id", formData.company_id)
        sentFormData.append("product_type", "SERVICE")
        sentFormData.append("is_taxable", 0)



        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}product/edit`, {
            method: 'POST',
            body: sentFormData,
            headers: {
                "Access-Token": session.user.access_token
            }
        })

        const response = await result.json();

        if (response.status) {
            toast.success(response.message)
            router.push("/item");
        } else {
            toast.error(response.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
    };


    return (
        <AppLayout>
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
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-8">
                                                <h5 className="text-c3 text-lg font-medium">Item Details</h5>
                                            </div>


                                            <div className="grid gap-6 mb-8 md:grid-cols-2">
                                                <div>
                                                    <Input type="text" name="name" value={formData.name} onChange={handleChange}
                                                           lable="Product Name" />
                                                </div>
                                                <div>
                                                    <Input type="text" name="price" value={formData.price} onChange={handleChange}
                                                           lable="Per Unit Price" />
                                                </div>
                                                <div>
                                                    <Input type="text" name="minimum" value={formData.minimum} onChange={handleChange}
                                                           lable="Re-order Lavel (Optional)" />
                                                </div>
                                                <div>
                                                    <SelectInput
                                                        option={
                                                            company && company.data && company.data.company.length > 0 && company.data.company.map((item, key) => {
                                                                return ({"value": item.company_id, "label": `${item.name}`,})
                                                            })
                                                        }
                                                        onChange={handleChange}
                                                        label={"Company"}
                                                        name="company_id"
                                                        value={formData.company_id}/>
                                                </div>

                                            </div>
                                            <div>
                                                <TextArea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    lable="Product Description (Optional)"
                                                />
                                            </div>
                                            <div className="flex justify-center mt-10">
                                                <PrimaryButton type="submit">
                                                    {submitLoading === false ? 'Update Item' : 'Please Wait...'}
                                                </PrimaryButton>
                                            </div>
                                        </form>

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
    sentFormData.append("product_id", context.params.item_id)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}product/detail`, {
        method: 'POST',
        body: sentFormData,
        headers: {"Access-Token": session.user.access_token}
    });

    const product = await res.json();

    return {props:  product.data};
}