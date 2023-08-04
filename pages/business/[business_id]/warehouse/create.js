import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import {useRouter} from "next/router";
import Input from "@/components/InputFields/Input";
import {useSession} from "next-auth/react";
import {toast} from "react-toastify";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PillNavigation from "@/components/Navs/PillNavigation";

export default function BusinessView() {
    const router = useRouter();
    const receivedValue = router.query;
    console.log(receivedValue.business_id)
    const [openTab, setOpenTab] = React.useState(1);
    const [errors, setErrors] = useState({});

    const {data: session, status} = useSession()
    console.log(session);

    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_id: receivedValue.business_id,
        name: '',
        address: '',
    });

    const resetFormData = () => {
        setFormData({
            company_id: receivedValue.business_id,
            name: '',
            address: '',
        })
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!formData.address.trim()) {
            errors.address = 'Address is required';
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        console.log(errors)
        const sentFormData = new FormData();

        sentFormData.append("company_id", formData.company_id)
        sentFormData.append("name", formData.name)
        sentFormData.append("address", formData.address)

        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}warehouse/add`, {
            method: 'POST',
            body: sentFormData,
            headers: {
                "Access-Token": session.user.access_token
            }
        })

        const response = await result.json();

        if (response.status) {
            resetFormData()
            toast.success(response.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })

            router.push('/business/' + receivedValue.business_id + "/warehouse");
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
                                <div className="mt-10">
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <div>
                                                <Input type="text" name="name" value={formData.name} onChange={handleChange} lable="Warehouse Name" required/>
                                                {errors.name && <div className="text-red-600">{errors.name}</div>}
                                            </div>
                                            <div>
                                                <Input type="text" name="address" value={formData.address} onChange={handleChange} lable="Warehouse Address" required/>
                                                {errors.address && <div className="text-red-600">{errors.address}</div>}
                                            </div>
                                        </div>

                                        <div className="flex justify-center mt-10">
                                            <PrimaryButton type="submit">
                                                {submitLoading === false ? 'Add Warehouse' : 'Please Wait...'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

