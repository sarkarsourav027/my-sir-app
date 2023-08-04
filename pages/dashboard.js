import AppLayout from "@/components/Layouts/AppLayout";
import Link from "next/link";
import {getSession, useSession} from "next-auth/react";
import {BiRadioCircle, BiRadioCircleMarked} from "react-icons/bi";
import SecondaryLinkButton from "@/components/Buttons/SecondaryLinkButton";
import {DashboardContext, useBusinessData, useDashboardData} from "@/context/BusinessContext";
import {useContext, useEffect, useState} from "react";

export default function Dashboard() {
    const {globalBusiness} = useBusinessData();
    const {globalDashboard} = useDashboardData();
    console.log(globalDashboard)
    const {data: session} = useSession()
    const [getsStartedHide, setGetsStartedHide] = useState(false);
    const name = session && session.user && session.user.fullname ? session.user.fullname : null;
    // const [companyInfoData, setCompanyInfoData] = useState(globalDashboard);
    // console.log(companyInfoData)

    const {setGlobalDashboardValues} = useContext(DashboardContext);

    useEffect(() => {
        const fetchData = async (companyId) => {
            try {
                const sentFormDataCompanyInfo = new FormData();
                sentFormDataCompanyInfo.append("company_id", companyId)
                sentFormDataCompanyInfo.append("invoice", "")
                sentFormDataCompanyInfo.append("estimate", "")
                sentFormDataCompanyInfo.append("receipt", "")
                sentFormDataCompanyInfo.append("purchase_order", "")
                sentFormDataCompanyInfo.append("debit_note", "")
                sentFormDataCompanyInfo.append("payment_voucher", "")
                sentFormDataCompanyInfo.append("product", "")
                sentFormDataCompanyInfo.append("service", "")
                sentFormDataCompanyInfo.append("supplier", "")
                sentFormDataCompanyInfo.append("tax", "")
                sentFormDataCompanyInfo.append("warehouse", "")
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/info`, {
                    method: 'POST',
                    body: sentFormDataCompanyInfo,
                    headers: {
                        "Access-Token": session.user.access_token
                    }
                });
                let res = await response.json();

                return JSON.stringify(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchCompanyHomeData = async (companyId) => {
            try {
                const sentFormDataCompanyInfo = new FormData();
                sentFormDataCompanyInfo.append("company_id", companyId)
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}company/home`, {
                    method: 'POST',
                    body: sentFormDataCompanyInfo,
                    headers: {
                        "Access-Token": session.user.access_token
                    }
                });
                let res = await response.json();

                return JSON.stringify(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDash = async () => {
            let dasData = fetchData(globalBusiness.company_id);
            let dasHomeData = fetchCompanyHomeData(globalBusiness.company_id);
            let dashboardData = JSON.parse(await dasData);
            let dashboardHomeData = JSON.parse(await dasHomeData);
            setGlobalDashboardValues({home: dashboardHomeData, info: dashboardData});
        }
        if (globalBusiness.company_id) {
            fetchDash().then(r => {})
        }

    }, [globalBusiness.company_id,session]);

    console.log(getsStartedHide)

    return (
        <AppLayout session={session}>
            <div className="p-8 bg-white rounded-md">
                <div>
                    <div className="flex justify-between">
                        <div>
                            <h3 className="font-medium text-md">Hello {name},</h3>
                            <p className="font-medium text-md">{globalBusiness.name}</p>
                        </div>
                        <div>
                            <SecondaryLinkButton href="/subscription">
                                <span> Go Pro</span>
                            </SecondaryLinkButton>
                        </div>
                    </div>

                    <div className="mt-4">
                        {(() => {
                            if (globalDashboard && globalDashboard.info && globalDashboard.home) {
                                return <div>{(() => {
                                    // if (globalDashboard && globalDashboard.info && globalDashboard.info.company || globalDashboard.info.company.length === 0 && globalDashboard.home.customer && globalDashboard.home.customer.length === 0 || globalDashboard.info.service && globalDashboard.info.service.length === 0 || globalDashboard.info.invoice || globalDashboard.info.invoice.length === 0){
                                    //     return  <h4 className="text-xl font-medium mb-2">Let’s gets started</h4>
                                    // }
                                    if (globalDashboard && globalDashboard.info && globalDashboard.home && globalDashboard.info.company && globalDashboard.home.customer && globalDashboard.info.service && globalDashboard.info.invoice) {
                                        if (globalDashboard.home.customer.length === 0 || globalDashboard.info.service.length === 0 || globalDashboard.info.service.length === 0 || globalDashboard.info.invoice.length === 0) {
                                            return <h4 className="text-xl font-medium mb-2">Let’s gets started</h4>
                                        }
                                    }
                                })()}

                                    {(() => {
                                        console.log(getsStartedHide)
                                        if ((globalDashboard && globalDashboard.info && globalDashboard.info.company && globalDashboard.info.company.length === 0) || (globalDashboard.home && globalDashboard.home.customer && globalDashboard.home.customer.length === 0) || (globalDashboard.info && globalDashboard.info.service && globalDashboard.info.service.length === 0) || (globalDashboard.info && globalDashboard.info.invoice && globalDashboard.info.invoice.length === 0)) {
                                            if (globalDashboard && globalDashboard.info && globalDashboard.info.company && globalDashboard.info.company.length > 0) {
                                                return <Link href="/business/create"
                                                             className="flex items-center border-b-2 border-c6 py-2">
                                                    <BiRadioCircleMarked className="h-8 w-8"/>
                                                    <span
                                                        className="ml-3 text-base text-c5">Add Your Business Info </span>
                                                </Link>
                                            } else {
                                                return <Link href="/business/create"
                                                             className="flex items-center border-b-2 border-c6 py-2">
                                                    <BiRadioCircle className="h-8 w-8"/>
                                                    <span
                                                        className="ml-3 text-base text-c5">Add Your Business Info</span>
                                                </Link>
                                            }
                                        }
                                    })()}
                                    {(() => {
                                        if ((globalDashboard && globalDashboard.info && globalDashboard.info.company && globalDashboard.info.company.length === 0) || (globalDashboard.home && globalDashboard.home.customer && globalDashboard.home.customer.length === 0) || (globalDashboard.info && globalDashboard.info.service && globalDashboard.info.service.length === 0) || (globalDashboard.info && globalDashboard.info.invoice && globalDashboard.info.invoice.length === 0)) {
                                            return <Link href="/customer/create"
                                                         className="flex items-center border-b-2 border-c6 py-2">
                                                {(() => {
                                                    if (globalDashboard && globalDashboard.home && globalDashboard.home.customer && globalDashboard.home.customer.length > 0) {
                                                        return <BiRadioCircleMarked className="h-8 w-8"/>
                                                    } else {
                                                        return <BiRadioCircle className="h-8 w-8"/>
                                                    }
                                                })()}
                                                <span className="ml-3 text-base text-c5"> Add Your Customers</span>
                                            </Link>
                                        }
                                    })()}
                                    {(() => {
                                        if ((globalDashboard && globalDashboard.info && globalDashboard.info.company && globalDashboard.info.company.length === 0) || (globalDashboard.home && globalDashboard.home.customer && globalDashboard.home.customer.length === 0) || (globalDashboard.info && globalDashboard.info.service && globalDashboard.info.service.length === 0) || (globalDashboard.info && globalDashboard.info.invoice && globalDashboard.info.invoice.length === 0)) {
                                            return <Link href="/item/create"
                                                         className="flex items-center border-b-2 border-c6 py-2">
                                                {(() => {
                                                    if (globalDashboard && globalDashboard.info && globalDashboard.info.service && globalDashboard.info.service.length > 0) {
                                                        return <BiRadioCircleMarked className="h-8 w-8"/>
                                                    } else {
                                                        return <BiRadioCircle className="h-8 w-8"/>
                                                    }
                                                })()}
                                                <span className="ml-3 text-base text-c5">Add Your Items</span>
                                            </Link>
                                        }
                                    })()}

                                    {(() => {
                                        if ((globalDashboard && globalDashboard.info && globalDashboard.info.company && globalDashboard.info.company.length === 0) || (globalDashboard.home && globalDashboard.home.customer && globalDashboard.home.customer.length === 0) || (globalDashboard.info && globalDashboard.info.service && globalDashboard.info.service.length === 0) || (globalDashboard.info && globalDashboard.info.invoice && globalDashboard.info.invoice.length === 0)) {
                                            return <Link href=""
                                                         className="flex items-center border-b-2 border-c6 py-2">
                                                {(() => {
                                                    if (globalDashboard && globalDashboard.info && globalDashboard.info.invoice && globalDashboard.info.invoice.length > 0) {
                                                        return <BiRadioCircleMarked className="h-8 w-8"/>
                                                    } else {
                                                        return <BiRadioCircle className="h-8 w-8"/>
                                                    }
                                                })()}
                                                <span className="ml-3 text-base text-c5">
                                    Create Your Invoice</span>
                                            </Link>
                                        }
                                    })()}</div>
                            } else {
                                return <div>
                                    <h4 className="text-xl font-medium mb-2">Let’s gets started</h4>
                                    <Link href="/business/create"
                                          className="flex items-center border-b-2 border-c6 py-2">
                                        <BiRadioCircle className="h-8 w-8"/>
                                        <span className="ml-3 text-base text-c5">Add Your Business Info</span>
                                    </Link>
                                    <Link href="/customer/create"
                                          className="flex items-center border-b-2 border-c6 py-2">
                                        <BiRadioCircle className="h-8 w-8"/>
                                        <span className="ml-3 text-base text-c5"> Add Your Customers</span>
                                    </Link>
                                    <Link href="/item/create" className="flex items-center border-b-2 border-c6 py-2">
                                        <BiRadioCircle className="h-8 w-8"/>
                                        <span className="ml-3 text-base text-c5">Add Your Items</span>
                                    </Link>
                                    <Link href="" className="flex items-center border-b-2 border-c6 py-2">
                                        <BiRadioCircle className="h-8 w-8"/>
                                        <span className="ml-3 text-base text-c5"> Create Your Invoice</span>
                                    </Link>
                                </div>
                            }
                        })()}


                    </div>

                    <div className="mt-4">
                        <h4 className="text-xl font-medium mb-2">If you wish to track inventory</h4>
                        <Link href="product/create" className="flex items-center border-b-2 border-c6 py-2">
                            {(() => {
                                if (globalDashboard && globalDashboard.info && globalDashboard.info.product && globalDashboard.info.product.length > 0) {
                                    return <BiRadioCircleMarked className="h-8 w-8"/>
                                } else {
                                    return <BiRadioCircle className="h-8 w-8"/>

                                }
                            })()}
                            <span className="ml-3 text-base text-c5">
                                    Add your products</span>
                        </Link>

                        <Link href={"/business/" + globalBusiness.company_id + "/warehouse/create"}
                              className="flex items-center border-b-2 border-c6 py-2">
                            {(() => {
                                if (globalDashboard && globalDashboard.info && globalDashboard.info.warehouse && globalDashboard.info.warehouse.length > 0) {
                                    return <BiRadioCircleMarked className="h-8 w-8"/>
                                } else {
                                    return <BiRadioCircle className="h-8 w-8"/>
                                }
                            })()}
                            <span className="ml-3 text-base text-c5">
                                    Add Your warehouse</span>
                        </Link>
                        <Link href="" className="flex items-center border-b-2 border-c6 py-2">
                            <BiRadioCircle className="h-8 w-8"/>
                            <span className="ml-3 text-base text-c5">
                                    Add Your Stocks</span>
                        </Link>
                    </div>

                    <div className="mt-4">
                        <h4 className="text-xl font-medium mb-2">If you wish to accept online payments</h4>
                        <Link href="" className="flex items-center border-b-2 border-c6 py-2">
                            <BiRadioCircle className="h-8 w-8"/>
                            <span className="ml-3 text-base text-c5">
                                    Set up Payment Gateway</span>
                        </Link>
                    </div>
                    <div className="mt-4 md:flex justify-between w-full">
                        <div className="">
                            <h5 className="text-black font-bold text-sm sm:text-lg md:text-lg ">A quick look
                                at your key business activities</h5>
                            <p className="text-c5 text-xs sm:text-base md:text-sm font-medium">No unpaid
                                invoices | No overdue invoices</p>
                        </div>
                        {/*<div className="flex justify-center md:mt-2.5 md:mb-2.5">*/}
                        {/*    <SecondaryButton type="submit">*/}
                        {/*        + Create*/}
                        {/*    </SecondaryButton>*/}
                        {/*</div>*/}
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