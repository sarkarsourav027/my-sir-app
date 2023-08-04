import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Link from "next/link";
import ImagePreview from "@/components/InputFields/ImagePreview";
import Input from "@/components/InputFields/Input";
import SelectInput from "@/components/InputFields/SelectInput";
import {getSession, useSession} from "next-auth/react";
import CheckboxInput from "@/components/InputFields/CheckboxInput";
import useSWR from "swr";
import PillNavigation from "@/components/Navs/PillNavigation";
import logoGrayIcon from "@/public/assets/img/logo-gray.jpg";
import PrimaryLinkButton from "@/components/Buttons/PrimaryLinkButton";
import {IoIosArrowForward} from "react-icons/io";

const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());


export default function User({user, user_image_path}) {

    const {data: session} = useSession()
    let userData = JSON.parse(user);

    const [previewUrl, setPreviewUrl] = useState(user_image_path + user.image);

    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))


    return (
        <AppLayout>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <PillNavigation
                        lists={[
                            {label: 'Users', link: '/user'},
                            {label: 'Add User', link: '/user/create'}
                        ]}
                    />
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space">
                                <div className="lg:px-2 lg:py-2 p-2">
                                    <div className="flex flex-row justify-between my-2">
                                        <h5>User Details</h5>
                                        <Link
                                            href={{
                                                pathname: `/user/[id]/edit`,
                                                query: {
                                                    user: JSON.stringify(userData) ,
                                                    user_image_path: user_image_path,
                                                }
                                            }}
                                            as={`/user/${userData.user_id}/edit`}
                                            className="flex sm:inline-flex justify-center items-center bg-gradient-to-tr from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 active:from-orange-700 active:to-orange-600 focus-visible:ring ring-pink-300 text-white text-center rounded-md outline-none transition duration-100 px-5 py-2">
                                            Edit User
                                        </Link>
                                        {/*<PrimaryLinkButton*/}
                                        {/*    href={{*/}
                                        {/*        pathname: `/user/[id]/edit`,*/}
                                        {/*        query: {*/}
                                        {/*            user: JSON.stringify(userData),*/}
                                        {/*            user_image_path: user_image_path,*/}
                                        {/*        }*/}
                                        {/*    }}*/}
                                        {/*    as={`/user/${userData.user_id}/edit`}*/}
                                        {/*>*/}
                                        {/*    Edit User*/}
                                        {/*</PrimaryLinkButton>*/}
                                    </div>
                                    <form>
                                        <div className="flex mb-8">
                                            <ImagePreview previewUrl={userData.image ? user_image_path+userData.image : logoGrayIcon}/>
                                        </div>
                                        <div className="mb-8">
                                            <h5 className="text-blue-950 text-lg font-medium">User Details</h5>
                                        </div>

                                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <div>
                                                <Input type="text" lable="Name" id="fullname" name="fullname"
                                                       value={userData.fullname}
                                                       required/>
                                            </div>
                                            <div>
                                                <Input type="email" lable="Email" required name="email"
                                                       value={userData.email}
                                                />
                                            </div>
                                            <div>
                                                <SelectInput
                                                    option={
                                                        business && business.data && business.data.company.length > 0 && business.data.company.map((item, key) => {
                                                            return ({"value": item.company_id, "label": item.name,})
                                                        })
                                                    }
                                                    label={"Company"} name="company_id"

                                                    defaultSelectedValue={userData.company_id}/>
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h5 className="text-blue-950 text-lg font-medium">Access Rights</h5>
                                        </div>
                                        <div className="grid mb-6 md:grid-cols-2 gap-5">
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="invoice" id="invoice"
                                                               name="invoice"
                                                               value="1" checked={userData.permission.invoice == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-1"
                                                       className="w-full ml-2">Invoices</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="estimate" id="estimate"
                                                               name="estimate" value="1" checked={userData.permission.estimate == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-2"
                                                       className="w-full ml-2">Estimate</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="customer" id="customer"
                                                               name="customer" value="1" checked={userData.permission.customer == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-3"
                                                       className="w-full ml-2">Customer</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="supplier" id="supplier"
                                                               name="supplier" value="1" checked={userData.permission.supplier == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-4"
                                                       className="w-full ml-2">Supplier</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="stock" id="stock"
                                                               name="stock"
                                                               value="1" checked={userData.permission.stock == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-4"
                                                       className="w-full ml-2">Stock</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="receipt" id="receipt"
                                                               name="receipt"
                                                               value="1" checked={userData.permission.receipt == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-4"
                                                       className="w-full ml-2">Receipt</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="purchase_order"
                                                               id="purchase_order"
                                                               name="purchase_order"
                                                               value="1" checked={userData.permission.purchase_order == "1" ?true:false }/>
                                                <label htmlFor="bordered-radio-4" className="w-full ml-2">Purchase
                                                    Order</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="payment_voucher"
                                                               id="payment_voucher" name="payment_voucher"
                                                               value="1" checked={userData.permission.payment_voucher == "1" ?true:false }/>
                                                <label htmlFor="bordered-radio-4" className="w-full ml-2">Payment
                                                    Voucher</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="tax" id="tax" name="tax"
                                                               value="1" checked={userData.permission.tax == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-4"
                                                       className="w-full ml-2">Tax</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="product" id="product"
                                                               name="product"
                                                               value="1" checked={userData.permission.product == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-4"
                                                       className="w-full ml-2">Product</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="service" id="service"
                                                               name="service"
                                                               value="1" checked={userData.permission.service == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-4"
                                                       className="w-full ml-2">Service</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="debit_note" id="debit_note"
                                                               name="debit_note" value="1" checked={userData.permission.debit_note == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-4" className="w-full ml-2">Debit
                                                    Note</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="credit_note"
                                                               id="credit_note"
                                                               name="credit_note"
                                                               value="1" checked={userData.permission.credit_note == "1" ?true:false }/>
                                                <label htmlFor="bordered-radio-4" className="w-full ml-2">Credit
                                                    Note</label>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckboxInput type="checkbox" lable="Sub Admin" id="sub_admin"
                                                               name="sub_admin" value="1" checked={userData.permission.sub_admin == "1" ?true:false }
                                                />
                                                <label htmlFor="bordered-radio-4" className="w-full ml-2">Sub
                                                    Admin</label>
                                            </div>
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

export const getServerSideProps = async (context) => {
    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }



    if (!context.query.user){
        return {redirect: {destination: '/user', permanent: false,}}
    }


    let receiveData =  {
        user: context.query.user,
        user_image_path: context.query.user_image_path
    }

    return {
        props: context.query.user ? receiveData : {}
    };
}

