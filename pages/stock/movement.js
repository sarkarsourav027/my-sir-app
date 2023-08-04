import AppLayout from "@/components/Layouts/AppLayout";
import React, {useEffect, useState} from "react";
import {getSession, useSession} from "next-auth/react";
import PillNavigation from "@/components/Navs/PillNavigation";
import SelectInput from "@/components/InputFields/SelectInput";
import {useBusinessData} from "@/context/BusinessContext";
import useSWR from "swr";
import {toast} from "react-toastify";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import Input from "@/components/InputFields/Input";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useRouter} from "next/router";
const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());
export default function Movement() {

    const {globalBusiness} = useBusinessData();
    const router = useRouter()
    const {data: session,status} = useSession()
    const [warehouses,setWarehouses] = useState([]);
    const [productsList,setProductsList] = useState([]);
    const [selectedCompanyId,setSelectedCompanyId] = useState(globalBusiness.company_id);
    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))

    useEffect(()=>{
        if (status === "authenticated") {
            get_warehouse(globalBusiness.company_id)
            get_product_by_company(globalBusiness.company_id)
        }
    },[status, session,globalBusiness])
    const handelCompanyChange = async (e) =>{
        if (status === "authenticated") {
            setSelectedCompanyId(e.target.value)
            await get_warehouse(e.target.value)
            await get_product_by_company(e.target.value)
        }
    }
    const get_warehouse = async (company_id) =>{

        const sentFormData = new FormData();
        sentFormData.append("company_id", company_id)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}warehouse/listing`, {
            method: 'POST',
            headers: {"Access-Token": session.user.access_token},
            body:sentFormData
        })
            .then((res) => {
                return res.json()
            });
        if(response.status){
            setWarehouses(response)
        }
        else{
            setWarehouses([])
            toast.error(response.message)
        }
    }
    const get_product_by_company = async (company_id) =>{

        const sentFormData = new FormData();
        sentFormData.append("company_id", company_id)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}product/getOnlyProductsListingByCompany`, {
            method: 'POST',
            headers: {"Access-Token": session.user.access_token},
            body:sentFormData
        })
            .then((res) => {
                return res.json()
            });
        if(response.status){
            setProductsList(response)
        }else {
            setProductsList([])
            toast.error(response.message)
        }
    }
    const formik = useFormik({
        initialValues: {
            quantity: '',
            send_from_warehouse_id:'',
            send_to_warehouse_id:'',
            product_id:''
        },
        validationSchema: Yup.object().shape({
            quantity: Yup.number()
                .required('Required'),
            send_from_warehouse_id: Yup.string()
                .required('Required'),
            send_to_warehouse_id: Yup.string()
                .required('Required'),
            product_id: Yup.string()
                .required('Required'),
        }),
        onSubmit: async (values, {setSubmitting,resetForm }) => {

            const sentFormData = new FormData();
            sentFormData.append("warehouse_id_sender", values.send_from_warehouse_id)
            sentFormData.append("warehouse_id_receiver", values.send_to_warehouse_id)
            sentFormData.append("product_id", values.product_id)
            sentFormData.append("quantity", values.quantity)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}product/movement`, {
                method: 'POST',
                body: sentFormData,
                headers: {
                    "Access-Token": session.user.access_token
                }
            }).then((result) => {
                return result.json()
            })

            if (response.status) {
                toast.success(response.message)
                resetForm()
                await router.push("/stock/movement");
            } else {
                toast.error(response.message)
            }

            setSubmitting(false);
        },
    })
    return (
        <AppLayout session={session}>
            <div className="flex flex-wrap relative">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Products', link: '/stock'},
                            {label: 'Update Stock', link: '/stock/update'},
                            {label: 'Stock Movement', link: '/stock/movement'},
                            {label: 'Waste/Damage', link: '/stock/damage'}
                        ]}
                    />
                    <div className="bg-white w-full rounded pb-10">
                        <p className="p-4">Manage your stock froom here, move products between warehouse(s).</p>
                        <form onSubmit={formik.handleSubmit}>
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
                                        onChange={handelCompanyChange}
                                        defaultSelectedValue={globalBusiness.company_id}
                                    />
                                </div>
                                <div>
                                    <SelectInput
                                        option={
                                            productsList && productsList.data && productsList.data.product.length > 0 && productsList.data.product.map((item, key) => {
                                                return ({"value": item.product_id, "label": item.name,})
                                            })
                                        }
                                        label={"Select Product"}
                                        name="product_id"
                                        required={true}
                                        value={formik.values.product_id}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.errors.product_id ?
                                        <div
                                            className="text-red-600">{formik.errors.product_id}</div> : null}
                                </div>
                                <div>
                                    <SelectInput
                                        option={
                                            warehouses && warehouses.data && warehouses.data.warehouse.length > 0 && warehouses.data.warehouse.map((item, key) => {
                                                return ({"value": item.warehouse_id, "label": item.name,})
                                            })
                                        }
                                        label={"Send from Warehouse"}
                                        name="send_from_warehouse_id"
                                        required={true}
                                        value={formik.values.send_from_warehouse_id}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.errors.send_from_warehouse_id ?
                                        <div
                                            className="text-red-600">{formik.errors.send_from_warehouse_id}</div> : null}
                                </div>
                                <div>
                                    <SelectInput
                                        option={
                                            warehouses && warehouses.data && warehouses.data.warehouse.length > 0 && warehouses.data.warehouse.map((item, key) => {
                                                return ({"value": item.warehouse_id, "label": item.name,})
                                            })
                                        }
                                        label={"Send to Warehouse"}
                                        name="send_to_warehouse_id"
                                        required={true}
                                        value={formik.values.send_to_warehouse_id}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.errors.send_to_warehouse_id ?
                                        <div
                                            className="text-red-600">{formik.errors.send_to_warehouse_id}</div> : null}
                                </div>
                                <div>
                                    <Input
                                        type="number"
                                        name="quantity"
                                        id="quantity"
                                        value={formik.values.quantity}
                                        onChange={formik.handleChange}
                                        lable="Enter Quantity"
                                        required={true}
                                    />
                                    {formik.errors.quantity ?
                                        <div
                                            className="text-red-600">{formik.errors.quantity}</div> : null}
                                </div>
                            </div>
                            <div className="flex justify-center mt-10">
                                <PrimaryButton type="submit">
                                    Save
                                </PrimaryButton>
                            </div>
                        </form>
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

    return {props: {}};

}