import React, {Fragment, useContext, useState} from 'react';
import {getSession} from "next-auth/react";
import {ProductAddContext, useProductAddData} from "@/context/ProductAddContext";
import {Dialog, Transition} from "@headlessui/react";
import Input from "@/components/InputFields/Input";
import {useBusinessData} from "@/context/BusinessContext";
import Toggle from "@/components/InputFields/Toggle";

function TaxDetails() {
    const {globalTaxList} = useProductAddData();
    const {globalSelectCurrency} = useProductAddData();
    const {globalBusiness} = useBusinessData();
    const {globalProductTaxAmount} = useProductAddData();
    const {globalProductTaxAmountDetails} = useProductAddData();
    const {globalProductSubTotalAmount} = useProductAddData();
    const {setGlobalProductSubTotalAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductTaxAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductTaxDetailsValues} = useContext(ProductAddContext);
    const {setGlobalTotalAmountValues} = useContext(ProductAddContext);
    let [isOpenTaxModal, setIsOpenTaxModal] = useState(false)
    const [selectTaxInclusive, setSelectTaxInclusive] = useState(false);
    const handleTaxInclusive = (e) => {
        if (e.target.checked){
            setSelectTaxInclusive(true)
        }else{
            setSelectTaxInclusive(false)
        }

    };
    const handleSelectProductTaxSetContext = (data) => {
        console.log(selectTaxInclusive)
        console.log(data)
        if (globalProductSubTotalAmount > 0) {
            if (selectTaxInclusive === true) {
                console.log("hi")
                if (data.type == "P") {
                    let taxAmount = (parseFloat(globalProductSubTotalAmount) * parseFloat(data.rate)) / 100;

                    data.tax_inclusive = selectTaxInclusive
                    setGlobalProductTaxAmountValues(taxAmount)
                    setGlobalProductTaxDetailsValues(data)
                    setGlobalTotalAmountValues(parseFloat(globalProductSubTotalAmount))
                }
            } else {
                console.log("hi2")
                if (data.type == "P") {
                    let taxAmount = parseFloat((parseFloat(globalProductSubTotalAmount) * parseFloat(data.rate)) / 100);

                    data.tax_inclusive = selectTaxInclusive
                    setGlobalProductTaxAmountValues(taxAmount)
                    setGlobalProductTaxDetailsValues(data)
                    setGlobalTotalAmountValues(parseFloat(parseFloat(globalProductSubTotalAmount) + parseFloat(taxAmount)))
                }
            }
        }

        setIsOpenTaxModal(false)
    };
    return (
        <>
            <Transition appear show={isOpenTaxModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpenTaxModal(false)}>
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
                                        Tax
                                    </Dialog.Title>
                                    <div className="bg-white w-full rounded">

                                        <div className="p-4 grid gap-6 md:grid-cols-2">
                                            <div>
                                                <Toggle onChange={handleTaxInclusive} value={true} lable="Inclusive" checked={selectTaxInclusive === true ? true :""}/>
                                                {/*<Input type="text" value={searchItem} onChange={handleSearch} lable="Search Item"/>*/}
                                            </div>

                                        </div>
                                        <div className="bg-white w-full rounded">
                                            <table className="min-w-full text-left text-sm font-light border-collapse ">
                                                <thead className="border-y-2 font-medium dark:border-neutral-500">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4">Tax</th>
                                                    <th scope="col" className="px-6 py-4">Rate</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {(() => {
                                                    let tableData = globalTaxList.filteredTaxData;
                                                    // if (searchItem !== ""){
                                                    //     tableData = globalItemList.filteredProductData.filter((row) =>
                                                    //         row.name.toLowerCase().includes(searchItem)
                                                    //     )
                                                    // }
                                                    return tableData && tableData.map((item) => {
                                                        return (
                                                            <tr key={item.tax_id}
                                                                onClick={() => handleSelectProductTaxSetContext(item)}
                                                                className="border-b -gray-500 dark:border-neutral-500">
                                                                <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                                    <div className="flex">
                                                                        <div className="ml-4">
                                                                            <p>{item.name}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="whitespace-nowrap px-6 py-4 ">{item.rate} %</td>
                                                            </tr>
                                                        )
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
            <div className="flex justify-between text-gray-500 text-lg mb-8" onClick={() => setIsOpenTaxModal(true)}>
                <span>Tax {(() => {
                    if (globalProductTaxAmountDetails && globalProductTaxAmountDetails.tax_inclusive) {
                        return "(" + globalProductTaxAmountDetails.name + " " + globalProductTaxAmountDetails.rate + "% incl.)"
                    } else if (globalProductTaxAmountDetails && !globalProductTaxAmountDetails.tax_inclusive) {
                        return "(" + globalProductTaxAmountDetails.name + " " + globalProductTaxAmountDetails.rate + "%)"
                    } else {
                        return ""
                    }
                })}</span>
                <span className="text-green-700">{globalSelectCurrency.symbol_left} {parseFloat(globalProductTaxAmount).toFixed(2)}</span>
            </div>
        </>
    );
}

export default TaxDetails;
