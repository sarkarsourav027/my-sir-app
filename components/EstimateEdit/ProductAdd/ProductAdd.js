import React, {Fragment, useContext, useEffect, useState} from 'react';
import useSWR from "swr";
import {DashboardContext, useBusinessData} from "@/context/BusinessContext";
import {useSession} from "next-auth/react";
import {Dialog, Transition} from "@headlessui/react";
import SelectInput from "@/components/InputFields/SelectInput";
import Input from "@/components/InputFields/Input";
import Image from "next/image";
import logoIcon from "@/public/assets/img/logo.jpeg";
import Link from "next/link";
import {IoIosArrowForward} from "react-icons/io";
import {ProductAddContext, useProductAddData} from "@/context/ProductAddContext";
function ProductAdd() {
    const {data: session} = useSession()
    const {globalProductAdd} = useProductAddData();
    const {globalProductList} = useProductAddData();
    const {globalItemList} = useProductAddData();
    const {globalProductGrossAmount} = useProductAddData();
    const {globalProductSubTotalAmount} = useProductAddData();
    const {globalProductTaxAmount} = useProductAddData();
    const {globalProductTaxAmountDetails} = useProductAddData();
    const {globalProductShippingAmount} = useProductAddData();
    const {setGlobalProductAddValues} = useContext(ProductAddContext);
    const {setGlobalProductGrossAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductSubTotalAmountValues} = useContext(ProductAddContext);
    const {setGlobalTotalAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductTaxAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductTaxDetailsValues} = useContext(ProductAddContext);
    const {setGlobalProductShippingAmountValues} = useContext(ProductAddContext);
    const [searchItem, setSearchItem] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    let [isOpenProductAddModal, setIsOpenProductAddModal] = useState(false)
    let [isOpenItemAddModal, setIsOpenItemAddModal] = useState(false)
    let [isOpenProductAddQtyModal, setIsOpenProductAddQtyModal] = useState(false)
    const [selectProduct, setSelectProduct] = useState(null);
    const [selectProductPrice, setSelectProductPrice] = useState(null);
    const [selectProductQty, setSelectProductQty] = useState(null);
    const handleSearch = (e) => {
        setSearchProduct(e.target.value);
    };
    const handleItemSearch = (e) => {
        setSearchItem(e.target.value);
    };
    const handleQtyModal = (data) => {
        setSelectProduct(data)
        setSelectProductPrice(data.price)
        setSelectProductQty(1)
        setIsOpenProductAddModal(false)
        setIsOpenProductAddQtyModal(true)
    };
    const handleSelectProductPrice = (e) => {
        setSelectProductPrice(e.target.value)
    };
    const handleSelectProductQty = (e) => {
        setSelectProductQty(e.target.value)
    };

    const handleSelectProductSetContext = () => {
        if(selectProductPrice != null && selectProductQty !== null){
            if (globalProductAdd === null || globalProductAdd === undefined){
                selectProduct.add_price = selectProductPrice
                selectProduct.add_qty = selectProductQty
                setGlobalProductAddValues(selectProduct)
                let grossAmount = parseFloat(globalProductGrossAmount) + parseFloat(selectProductPrice != null && selectProductQty != null ? parseFloat(parseFloat(selectProductPrice) * parseFloat(selectProductQty)) : 0)
                setGlobalProductGrossAmountValues(grossAmount)
                setGlobalProductSubTotalAmountValues(grossAmount)
            }else{
                selectProduct.add_price = selectProductPrice
                selectProduct.add_qty = selectProductQty
                setGlobalProductAddValues(selectProduct)
                let grossAmount = parseFloat(globalProductGrossAmount) + parseFloat(selectProductPrice != null && selectProductQty != null ? parseFloat(parseFloat(selectProductPrice) * parseFloat(selectProductQty)) : 0)
                setGlobalProductGrossAmountValues(grossAmount)
                setGlobalProductSubTotalAmountValues(grossAmount)

            }
        }

        setIsOpenProductAddQtyModal(false)
    };
    return (
        <div>
            <Transition appear show={isOpenProductAddModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpenProductAddModal(false)}>
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
                                        Add Product
                                    </Dialog.Title>
                                    <div className="bg-white w-full rounded">

                                        <div className="p-4 grid gap-6 md:grid-cols-2">
                                            <div>
                                                <Input type="text" value={searchProduct} onChange={handleSearch} lable="Search Product"/>
                                            </div>
                                            <div>
                                                <Link
                                                    href={"/product/create"}
                                                    className="inline-block rounded-full bg-blue-950 px-4 py-2 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700">
                                                    Add New Product
                                                </Link>
                                            </div>

                                        </div>
                                        <div className="bg-white w-full rounded">
                                            <table className="min-w-full text-left text-sm font-light border-collapse ">
                                                <thead className="border-y-2 font-medium dark:border-neutral-500">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4">Product</th>
                                                    <th scope="col" className="px-6 py-4">Price</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    (()=>{
                                                        let productTableData = globalProductList.filteredProductData;
                                                        if (searchProduct !== ""){
                                                            productTableData = globalProductList.filteredProductData.filter((row) =>
                                                                row.name.toLowerCase().includes(searchProduct)
                                                            )
                                                        }
                                                        return productTableData && productTableData.map((item) => {
                                                            let productAllreadyAdded = globalProductAdd.filter((row) =>
                                                                row.product_type.includes("PRODUCT")
                                                            )
                                                            productAllreadyAdded = productAllreadyAdded.filter((row) =>
                                                                row.name.toLowerCase().includes(item.name.toLowerCase())
                                                            )

                                                            if (productAllreadyAdded.length === 0){
                                                                return (
                                                                    <tr key={item.product_id} onClick={()=>{handleQtyModal(item)}}
                                                                        className="border-b -gray-500 dark:border-neutral-500">
                                                                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                                            <div className="flex">
                                                                                <Image className="h-16 w-16 rounded bject-cover"
                                                                                       src={item.image ? globalProductList.products.product_image_path + item.image : logoIcon}
                                                                                       alt="Product Image"  width={32}
                                                                                       height={32}
                                                                                />

                                                                                <div className="ml-4">
                                                                                    <p>{item.name}</p>
                                                                                    <p className="truncate w-40">Reorder Level : {item.minimum}</p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-6 py-4">{item.currency_symbol}{item.price}</td>
                                                                    </tr>
                                                                )
                                                            }else{
                                                                return "";
                                                            }

                                                        })
                                                    })()


                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/*<div className="mt-4">*/}
                                    {/*    <button*/}
                                    {/*        type="button"*/}
                                    {/*        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"*/}
                                    {/*        onClick={() => setIsOpenProductAddModal(false)}*/}
                                    {/*    >*/}
                                    {/*        Got it, thanks!*/}
                                    {/*    </button>*/}
                                    {/*</div>*/}
                                </Dialog.Panel>
                            </Transition.Child>


                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={isOpenItemAddModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpenItemAddModal(false)}>
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
                                        Add Product
                                    </Dialog.Title>
                                    <div className="bg-white w-full rounded">

                                        <div className="p-4 grid gap-6 md:grid-cols-2">
                                            <div>
                                                <Input type="text" value={searchItem} onChange={handleItemSearch} lable="Search Item"/>
                                            </div>
                                            <div>
                                                <Link
                                                    href={"/item/create"}
                                                    className="inline-block rounded-full bg-blue-950 px-4 py-2 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700">
                                                    Add New Item
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="bg-white w-full rounded">
                                            <table className="min-w-full text-left text-sm font-light border-collapse ">
                                                <thead className="border-y-2 font-medium dark:border-neutral-500">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4">Item</th>
                                                    <th scope="col" className="px-6 py-4">Price</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {(()=>{
                                                    let tableData = globalItemList.filteredProductData;
                                                    if (searchItem !== ""){
                                                        tableData = globalItemList.filteredProductData.filter((row) =>
                                                            row.name.toLowerCase().includes(searchItem)
                                                        )
                                                    }
                                                    return tableData && tableData.map((item) => {

                                                        let itemAllreadyAdded = globalProductAdd.filter((row) =>
                                                            row.product_type.includes("SERVICE")
                                                        )
                                                        itemAllreadyAdded = itemAllreadyAdded.filter((row) =>
                                                            row.name.toLowerCase().includes(item.name.toLowerCase())
                                                        )
                                                        if (itemAllreadyAdded.length === 0){
                                                            return (
                                                                <tr key={item.product_id} onClick={()=>{handleQtyModal(item)}}
                                                                    className="border-b -gray-500 dark:border-neutral-500">
                                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                                        <div className="flex">
                                                                            <div className="ml-4">
                                                                                <p>{item.name}</p>
                                                                                <p className="truncate w-40">Reorder Level : {item.minimum}</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-6 py-4">{item.currency_symbol}{item.price}</td>
                                                                </tr>
                                                            )
                                                        }else{
                                                            return "";
                                                        }


                                                    })
                                                })()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/*<div className="mt-4">*/}
                                    {/*    <button*/}
                                    {/*        type="button"*/}
                                    {/*        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"*/}
                                    {/*        onClick={() => setIsOpenProductAddModal(false)}*/}
                                    {/*    >*/}
                                    {/*        Got it, thanks!*/}
                                    {/*    </button>*/}
                                    {/*</div>*/}
                                </Dialog.Panel>
                            </Transition.Child>


                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={isOpenProductAddQtyModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpenProductAddQtyModal(false)}>
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
                                        Enter Price and Quantity
                                    </Dialog.Title>
                                    <div className="bg-white w-full rounded">

                                        <div className="p-4">
                                            <div>
                                                <Input type="number" min={0.01} step={0.01} value={selectProductPrice} onChange={handleSelectProductPrice}  lable="Price"/>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div>
                                                <Input type="number" min={1} value={selectProductQty}  onChange={handleSelectProductQty}  lable="Enter Quantity"/>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="mt-4 flex flex-col lg:flex-row space-y-8 lg:space-y-0 justify-between">
                                        <button
                                            type="button"
                                            className="iinline-block shadow rounded-full bg-white px-16 py-3 text-lg font-semibold leading-normal text-blue-950 transition  duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700 hover:text-white"
                                            onClick={() => setIsOpenProductAddQtyModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-block rounded-full bg-blue-950 px-16 py-3 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700"
                                            onClick={() => handleSelectProductSetContext()}
                                        >
                                            Ok
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>


                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 justify-between mt-24">
                <button type="button" className="bg-white shadow text-orange-500 rounded-full py-4 px-8  font-semibold hover:bg-blue-900 hover:text-white" onClick={() => setIsOpenProductAddModal(true)}>
                    Add Products
                </button>
                <button type="button" className="bg-white shadow text-orange-500 py-4 px-8 rounded-full font-semibold hover:bg-blue-900 hover:text-white" onClick={() => setIsOpenItemAddModal(true)}>
                    Add Items
                </button>
            </div>
        </div>
    );
}

export default ProductAdd;