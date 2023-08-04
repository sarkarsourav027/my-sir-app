import MenuList from "@/components/Layouts/MenuList";
import Link from "next/link";
import {AiFillHome, AiFillSetting, AiOutlineLogin, AiOutlineStar} from "react-icons/ai";
import {signOut} from "next-auth/react";
import {useRouter} from "next/router";
import {Dialog, Menu, Transition} from "@headlessui/react";
import Image from "next/image";
import logoIcon from "@/public/assets/img/logo.jpeg";
import {Fragment, useContext, useEffect, useState} from "react";
import {BsFillCalculatorFill, BsFillCartDashFill} from "react-icons/bs";
import {FaFileInvoice, FaFileInvoiceDollar, FaMousePointer} from "react-icons/fa";
import {HiBars3} from "react-icons/hi2";
import useSWR from "swr";
import {BusinessContext, DashboardContext, useBusinessData, useDashboardData} from "@/context/BusinessContext";
import {permission} from "@/utils/permission";

const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());


export default function AppLayout({children, session}) {
    const [isLoading, setIsLoading] = useState(true);
    const {globalBusiness} = useBusinessData();
    const {globalDashboard} = useDashboardData();
    const router = useRouter();
    if (session){
        const { pathname } = router;
        const permissionStatus = permission(session,pathname)
        if (!permissionStatus) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                router.push('/access-denied');
            }, [router]);

        }
    }
    console.log(session)
    const [sidebarOpened, setSidebarOpened] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
    const {setGlobalBusinessValues} = useContext(BusinessContext);
    const {setGlobalDashboardValues} = useContext(DashboardContext);
    const fetchData = async (companyId) => {
        try {
            const sentFormDataCompanyInfo = new FormData();
            sentFormDataCompanyInfo.append("company_id", companyId)
            sentFormDataCompanyInfo.append("invoice","")
            sentFormDataCompanyInfo.append("estimate","")
            sentFormDataCompanyInfo.append("receipt","")
            sentFormDataCompanyInfo.append("purchase_order","")
            sentFormDataCompanyInfo.append("debit_note","")
            sentFormDataCompanyInfo.append("payment_voucher","")
            sentFormDataCompanyInfo.append("product","")
            sentFormDataCompanyInfo.append("service","")
            sentFormDataCompanyInfo.append("supplier","")
            sentFormDataCompanyInfo.append("tax","")
            sentFormDataCompanyInfo.append("warehouse","")
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
    const fetchCurrencyData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}currency/all`, {
                method: 'POST',
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
    const changeCompanySetData = async (companyData,company_image_path) => {
        let dasData = fetchData(companyData.company_id);
        let dasHomeData = fetchCompanyHomeData(companyData.company_id);
        let curData = fetchCurrencyData();
        let dashboardData = JSON.parse(await dasData);
        let dashboardHomeData = JSON.parse(await dasHomeData);
        let currencyData = JSON.parse(await curData);

        // let currencyCompanyData = currencyData && currencyData.currencies && currencyData.currencies.length > 0 && currencyData.currencies.filter((row) =>
        //     row.currency_id.includes(companyData.currency_id)
        // )
        let currencyCompanyData = currencyData && currencyData.currencies && currencyData.currencies.length > 0 && currencyData.currencies.find(o => o.currency_id == companyData.currency_id)

        companyData['company_image_path'] = company_image_path;
        companyData['currency'] = currencyCompanyData ? currencyCompanyData : null ;
        setGlobalBusinessValues(companyData);
        setGlobalDashboardValues({home: dashboardHomeData, info: dashboardData});
    }


    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session), {
        onSuccess: async (data, key, config) => {
            if (data.status === true){
                let dasData = fetchData(data.data.company[0].company_id);
                let dasHomeData = fetchCompanyHomeData(data.data.company[0].company_id);
                let dashboardData = JSON.parse(await dasData);
                let dashboardHomeData = JSON.parse(await dasHomeData);
                let curData = fetchCurrencyData();
                let currencyData = JSON.parse(await curData);
                // dashboardData.push(dashboardHomeData)
                // let currencyCompanyData = currencyData && currencyData.currencies && currencyData.currencies.length > 0 && currencyData.currencies.filter((row) =>
                //     row.currency_id.includes(data.data.company[0].currency_id)
                // )
                let currencyCompanyData = currencyData && currencyData.currencies && currencyData.currencies.length > 0 && currencyData.currencies.find(o => o.currency_id == data.data.company[0].currency_id)
                data.data.company[0]['company_image_path'] = data.data.company_image_path;
                data.data.company[0]['currency'] = currencyCompanyData ? currencyCompanyData : null ;

                if (!globalBusiness.name){
                    setGlobalBusinessValues(data.data.company[0]);
                    setGlobalDashboardValues({home : dashboardHomeData, info : dashboardData});
                }else{
                    setGlobalBusinessValues(data.data.company[0]);
                    setGlobalDashboardValues({home : dashboardHomeData, info : dashboardData});
                }
            }
        }
    })
    const profileImage = session && session.user && session.user.fullname && globalBusiness && globalBusiness.logo !== null ? globalBusiness.company_image_path+globalBusiness.logo : logoIcon;
    const name = session && session.user && session.user.fullname ? session.user.fullname : null;
    const email = session && session.user && session.user.email ? session.user.email : null;
    console.log(globalBusiness)
    return (
        <>

            <Transition appear show={modalOpened} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setModalOpened(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25"/>
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Module Not Available
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Available on Mobile App. Please log in to the Mobile app to access this
                                            feature.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => setModalOpened(false)}
                                        >
                                            Got it, thanks!
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={sidebarOpened}>
                <Dialog as="div" className="fixed inset-0 z-40 md:hidden" onClose={() => setSidebarOpened(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25"/>
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Dialog.Panel
                            className="h-screen items-center w-72 overflow-y-auto scrollbar scrollbar-track-transparent md:hidden lg:hidden bg-blue-950 py-2">
                            <div className="px-6 pt-4 pb-4">
                                <Link
                                    className="flex items-center"
                                    href="/pages/dashboard">
                                    <Image className="rounded-full mr-3"
                                           src={logoIcon}
                                           width={32}
                                           height={32}
                                           alt="Picture of the author"
                                    />
                                    <span className="text-sm font-bold text-white">stocks invoices receipts</span>
                                </Link>
                                {/*<button*/}
                                {/*    className="lg:hidden leading-none transition-all bg-transparent border border-transparent border-solid rounded-lg shadow-none cursor-pointer text-lg ease-soft-in-out"*/}
                                {/*    type="button" onClick={() => setSidebarOpened(false)}>*/}
                                {/*    <AiOutlineClose className="w-5 h-5"/>*/}
                                {/*</button>*/}
                            </div>
                            <ul className="flex flex-col pl-0 mb-0 ">
                                {
                                    MenuList.map((link) => (
                                        <li key={link.href} className="px-2 w-full">
                                            <Link key={link.href}
                                                  className={`py-1.5 flex items-center rounded px-2 text-white ${link.active.includes(router.pathname) ? "bg-orange-500" : ""}`}
                                                  href={link.href}>
                                                <div
                                                    className={`mr-1 flex h-8 w-8 items-center justify-center text-center p-1 ${link.active.includes(router.pathname) ? "rounded bg-white text-orange-500 bg-center stroke-0" : "text-white"}`}>
                                                    {link.icon}
                                                </div>
                                                <span className="opacity-100">{link.label}</span>
                                            </Link>
                                        </li>
                                    ))
                                }
                                <li className="px-2 w-full">
                                    <button type='button'
                                            className={"py-2 px-2 flex text-white items-center whitespace-nowrap transition-colors"}
                                            onClick={() => signOut({callbackUrl: '/'})}>
                                        <div
                                            className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-white bg-center stroke-0 text-center p-1">
                                            <AiOutlineLogin className="h-6 w-6"/>
                                        </div>
                                        <span className="opacity-100 pointer-events-none ease-soft">Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            <div className="bg-gray-100 flex flex-col gap-2 items-stretch justify-between p-2 h-screen">
                <header
                    className="bg-white w-full shadow-md rounded-md flex flex-row items-center justify-between py-2 px-4 mx-auto">
                    <Link
                        className="flex items-center text-sm font-bold"
                        href="/pages/dashboard">
                        <Image className="rounded-full mr-3"
                               src={logoIcon}
                               width={32}
                               height={32}
                               alt="Picture of the author"
                        />
                        <span className="font-bold">stocks invoices receipts</span>
                    </Link>
                    <ul className="flex pl-0 mb-0 list-none flex-row items-center lg:ml-auto xl:ml-auto gap-5">
                        <li>
                            <Menu as="div" className="relative">
                                <Menu.Button className="text-xl text-c3">
                                    {(() => {
                                        if (router.pathname  === '/dashboard') {
                                            return  <FaMousePointer className="h-6 w-6"/>
                                        }
                                    })()}

                                </Menu.Button>
                                <Menu.Items
                                    className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="bg-blue-900 rounded-md">
                                        {
                                            business && business.data && business.data.company.length > 0 && business.data.company.map((item, key) => {

                                                return (
                                                    // {"value": item.company_id, "label": item.name,}
                                                    <>
                                                        <Menu.Item className="bg-blue-900">
                                                            <button onClick={() => changeCompanySetData(item,business.data.company_image_path)}
                                                                    className=" w-full text-white hover:bg-orange-500 hover:text-white  active:bg-orange-500  active:text-white focus-visible:ring ring-pink-300  text-center outline-none transition duration-100 px-3 py-3">
                                                                {item.name}
                                                            </button>
                                                        </Menu.Item>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </Menu.Items>
                            </Menu>
                        </li>
                        <li>
                            <Link
                                className="text-xl text-c3" href="/settings">
                                <AiFillSetting className="h-6 w-6"/>
                            </Link>
                        </li>
                        <li>
                            <button
                                className="lg:hidden md:hidden leading-none transition-all bg-transparent border border-transparent border-solid rounded-lg shadow-none cursor-pointer text-lg ease-soft-in-out"
                                type="button" onClick={() => setSidebarOpened(true)}>
                                <HiBars3 className="h-6 w-6"/>
                            </button>
                        </li>
                    </ul>
                </header>
                <div className="h-sidenav flex gap-2">
                    <aside
                        className="hidden md:block bg-blue-950 w-80 flex-wrap items-center justify-between rounded overflow-y-scroll overflow-x-hidden lg:rounded-lg">
                        <div className="flex px-4 py-2 m-0 text-sm">
                            <div className="mr-2">
                                {/*<Avatar squared size="lg" text={name}/>*/}

                                <Image src={profileImage} alt="Preview" width={250} height={250} className="bg-white border-2 border-white h-10 w-10 flex justify-center items-center shadow-lg rounded-full"/>
                            </div>
                            <div className="flex flex-col text-white">
                                <span className="font-semibold">{name}</span>
                                <span className="font-semibold">{email}</span>
                                <span className="flex">
                                        <AiOutlineStar className="h-4 w-4"/>
                                        <span>Upgrade to pro</span>
                                </span>
                            </div>
                        </div>
                        <hr className=""></hr>
                        <ul className="flex flex-col py-2">
                            {
                                MenuList.map((link) => (
                                    <li key={link.href} className="px-2 w-full">
                                        {(() => {
                                            if (link.type === 'modal') {
                                                return (
                                                    <button type='button'
                                                            className={"py-2 px-2 flex text-white items-center whitespace-nowrap transition-colors"}
                                                            onClick={() => setModalOpened(true)}>
                                                        <div
                                                            className={`mr-1 flex h-8 w-8 items-center justify-center text-center p-1 ${link.active.includes(router.pathname) ? "rounded bg-white text-orange-500 bg-center stroke-0" : "text-white"}`}>
                                                            {link.icon}
                                                        </div>
                                                        <span
                                                            className="opacity-100 pointer-events-none ease-soft">{link.label}</span>
                                                    </button>
                                                )
                                            } else {
                                                return (
                                                    <Link key={link.href}
                                                          className={`py-1.5 flex items-center rounded px-2 text-white ${link.active.includes(router.pathname) ? "bg-orange-500" : ""}`}
                                                          href={link.href}>
                                                        <div
                                                            className={`mr-1 flex h-8 w-8 items-center justify-center text-center p-1 ${link.active.includes(router.pathname) ? "rounded bg-white text-orange-500 bg-center stroke-0" : "text-white"}`}>
                                                            {link.icon}
                                                        </div>
                                                        <span className="opacity-100">{link.label}</span>
                                                    </Link>
                                                )
                                            }
                                        })()}
                                    </li>
                                ))
                            }
                            <li className="px-2 w-full">
                                <button type='button'
                                        className={"py-2 px-2 flex text-white items-center whitespace-nowrap transition-colors"}
                                        onClick={() => signOut({callbackUrl: '/'})}>
                                    <div
                                        className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-white bg-center stroke-0 text-center p-1">
                                        <AiOutlineLogin className="h-6 w-6"/>
                                    </div>
                                    <span className="opacity-100 pointer-events-none ease-soft">Logout</span>
                                </button>
                            </li>
                        </ul>
                    </aside>
                    <main className="overflow-y-auto w-full">
                        {children}
                    </main>
                </div>
                <footer className="w-full flex flex-wrap items-center shadow-xl rounded-md bg-blue-950">
                    <div className="w-full lg:py-1 lg:px-10 px-3 py-1">
                        <ul className="flex justify-between pl-0 mx-auto mb-0 list-none lg:flex-row xl:ml-auto">
                            <li>
                                <Link
                                    className={router.pathname === "/dashboard" ? "py-1 ease-nav-brand  my-0 lg:mx-4 flex flex-col lg:flex-row items-center whitespace-nowrap rounded-full bg-transparent  pl-1 lg:pr-3 text-white transition-colors" : "py-1 ease-nav-brand my-0 lg:mx-4 flex flex-col lg:flex-row text-white items-center whitespace-nowrap  lg:px-2 transition-colors"}
                                    href="/dashboard">
                                    <div
                                        className={router.pathname === "/dashboard" ? "lg:mr-2 flex h-8 w-8 items-center justify-center  rounded-full bg-c1 text-c3 bg-center stroke-0 text-center  p-1" : "lg:mr-2 flex h-8 w-8 items-center justify-center  rounded-lg bg-transparent text-white bg-center stroke-0 text-center p-1"}>
                                        <AiFillHome className="h-6 w-6"/>
                                    </div>
                                    <span className="ml-1">Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={router.pathname === "/estimate" ? "py-1 ease-nav-brand  my-0 lg:mx-4 flex flex-col lg:flex-row items-center whitespace-nowrap rounded-full bg-transparent  pl-1 lg:pr-3 text-white transition-colors" : "py-1 ease-nav-brand my-0 lg:mx-4 flex flex-col lg:flex-row text-white items-center whitespace-nowrap  lg:px-2 transition-colors"}
                                    href="/estimate">
                                    <div
                                        className={router.pathname === "/estimate" ? "lg:mr-2 flex h-8 w-8 items-center justify-center  rounded-full bg-c1 text-c3 bg-center stroke-0 text-center  p-1" : "lg:mr-2 flex h-8 w-8 items-center justify-center  rounded-lg bg-transparent text-white bg-center stroke-0 text-center p-1"}>
                                        <BsFillCalculatorFill className="h-6 w-6"/>
                                    </div>
                                    <span className="ml-1">Estimate</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={router.pathname === "/invoice" ? "py-1 ease-nav-brand my-0 lg:mx-4 flex flex-col lg:flex-row items-center whitespace-nowrap rounded-full bg-transparent  pl-1 lg:pr-3 text-white transition-colors" : "py-1 ease-nav-brand  my-0 lg:mx-4 flex flex-col lg:flex-row text-white items-center whitespace-nowrap lg:px-2 transition-colors"}
                                    href="/invoice">
                                    <div
                                        className={router.pathname === "/invoice" ? "bg-c1 lg:mr-2 flex h-8 w-8 items-center justify-center rounded-full text-c3 bg-center stroke-0 text-center p-1" : "lg:mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-white bg-center stroke-0 text-center p-1"}>
                                        <FaFileInvoice className="h-6 w-6"/>
                                    </div>
                                    <span className="ml-1">Invoices</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={router.pathname === "/receipt" ? "py-1 ease-nav-brand  my-0 lg:mx-4 flex flex-col lg:flex-row items-center whitespace-nowrap rounded-full bg-transparent  pl-1 lg:pr-3 text-white transition-colors" : "py-1 ease-nav-brand  my-0 lg:mx-4 flex flex-col lg:flex-row text-white items-center whitespace-nowrap  lg:px-2 transition-colors"}
                                    href="/receipt">
                                    <div
                                        className={router.pathname === "/receipt" ? "lg:mr-2 flex h-8 w-8 items-center justify-center  rounded-full bg-c1 text-c3 bg-center stroke-0 text-center  p-1" : "lg:mr-2 flex h-8 w-8 items-center justify-center  rounded-lg bg-transparent text-white bg-center stroke-0 text-center p-1"}>
                                        <FaFileInvoiceDollar className="h-6 w-6"/>
                                    </div>
                                    <span className="ml-1">Receipts</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={router.pathname === "/po" ? "py-1 ease-nav-brand  my-0 lg:mx-4 flex flex-col lg:flex-row items-center whitespace-nowrap rounded-full bg-transparent  pl-1 lg:pr-3 text-white transition-colors" : "py-1 ease-nav-brand  my-0 lg:mx-4 flex flex-col lg:flex-row text-white items-center whitespace-nowrap  lg:px-2 transition-colors"}
                                    href="/po">
                                    <div
                                        className={router.pathname === "/po" ? "lg:mr-2 flex h-8 w-8 items-center justify-center  rounded-full bg-c1 text-c3 bg-center stroke-0 text-center  p-1" : "lg:mr-2 flex h-8 w-8 items-center justify-center  rounded-lg bg-transparent text-white bg-center stroke-0 text-center p-1"}>
                                        <BsFillCartDashFill className="h-6 w-6"/>
                                    </div>
                                    <span className="ml-1">PO</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </footer>
            </div>
        </>
    )
}