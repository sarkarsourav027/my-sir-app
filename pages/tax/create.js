import ImagePreview from "@/components/InputFields/ImagePreview";
import React, {useState} from "react";
import Input from "@/components/InputFields/Input";
import {toast, ToastContainer} from "react-toastify";
import {getSession, useSession} from "next-auth/react";
import SelectInput from "@/components/InputFields/SelectInput";
import {useRouter} from "next/router";
import AppLayout from "@/components/Layouts/AppLayout";
import useSWR from "swr";
import PillNavigation from "@/components/Navs/PillNavigation";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {FormikProvider, useFormik} from "formik";
import * as yup from 'yup';
import ColorInput from "@/components/InputFields/ColorInput";
import FileUpload from "@/components/InputFields/FileUpload";
import {useBusinessData} from "@/context/BusinessContext";
import TextArea from "@/components/InputFields/TextArea";



const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

export default function AddTax() {
    const {globalBusiness} = useBusinessData();
    const router = useRouter();
    const {data: session} = useSession()
    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))

    const setCompanyId = globalBusiness.company_id;
    const formik = useFormik({
        initialValues: {
            name: '',
            rate: '',
            type: '',
            company_id: setCompanyId,
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Tax name field is Required'),
            rate: yup.string().required('Tax rate field is Required'),
            company_id: yup.string().required('Company field is Required'),
        }),
        onSubmit: async (values, {setSubmitting}) => {

            const sentFormData = new FormData();
            sentFormData.append("name", values.name)
            sentFormData.append("rate", values.rate)
            sentFormData.append("type", "P")
            sentFormData.append("company_id", values.company_id)

            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}tax/add`, {
                method: 'POST',
                body: sentFormData,
                headers: {
                    "Access-Token": session.user.access_token
                }
            })
            const response = await result.json();
            if (response.status) {
                toast.success(response.message)
                await router.push("/tax");
            } else {
                toast.error(response.message)
            }
            setSubmitting(false);
        },
    })


    return (
        <AppLayout session={session}>
            <div className="w-full">
                <PillNavigation
                    lists={[
                        {label: 'Taxes', link: '/tax'},
                        {label: 'Add Tax', link: '/tax/create'}
                    ]}
                />
                <div className="flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                    <div className="flex-auto">
                        <div className="tab-content tab-space">
                            <div className="mt-14 p-4">
                                <ToastContainer className="toast-position"/>
                                <FormikProvider value={formik}>
                                    <form onSubmit={formik.handleSubmit}>


                                        <div className="mb-8">
                                            <h5 className="text-c3 text-lg font-medium">Tax Details</h5>
                                        </div>

                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <SelectInput
                                                option={
                                                    business && business.data && business.data.company.length > 0 && business.data.company.map((item, key) => {
                                                        return ({"value": item.company_id, "label": item.name,})
                                                    })
                                                }
                                                label={"Company"}
                                                name="company_id"
                                                onChange={formik.handleChange}
                                                value={formik.values.company_id}
                                                required={true}
                                                defaultSelectedValue={globalBusiness.company_id}
                                            />
                                            {formik.errors.company_id ?
                                                <div
                                                    className="text-red-600">{formik.errors.company_id}
                                                </div> : null
                                            }
                                            <div>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    className="required"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    lable="Tax Name"
                                                    id="name"
                                                    required={true}
                                                />
                                                {formik.errors.name ?
                                                    <div className="text-red-600">{formik.errors.name}</div> : null}
                                            </div>
                                            <div>
                                                <Input
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    max="100"
                                                    name="rate"
                                                    className="required"
                                                    value={formik.values.rate}
                                                    onChange={formik.handleChange}
                                                    lable="Tax Rate (%)"
                                                    id="rate"
                                                    required={true}
                                                />
                                                {formik.errors.rate ?
                                                    <div className="text-red-600">{formik.errors.rate}</div> : null}
                                            </div>
                                        </div>

                                        <div className="flex justify-center mt-10">
                                            <PrimaryButton type="submit">
                                                {formik.isSubmitting === false ? 'Add New Tax' : 'Please Wait...'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </FormikProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }

    return {props: {}};
}