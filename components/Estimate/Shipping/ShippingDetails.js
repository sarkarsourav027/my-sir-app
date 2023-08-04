import React, {Fragment, useContext, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import Radio from "@/components/InputFields/Radio";
import Input from "@/components/InputFields/Input";
import {ProductAddContext, useProductAddData} from "@/context/ProductAddContext";

function ShippingDetails() {
    let [isOpenProductShippingModal, setIsOpenProductShippingModal] = useState(false)
    const [selectProductShippingAmount, setSelectProductShippingAmount] = useState(null);
    const {setGlobalProductShippingAmountValues} = useContext(ProductAddContext);
    const {globalSelectCurrency} = useContext(ProductAddContext);
    const handleSelectProductDiscountAmount = (e) => {
        setSelectProductShippingAmount(e.target.value)
    };
    const {globalProductShippingAmount} = useProductAddData();
    const handleSelectProductShippingSetContext = () => {
        setGlobalProductShippingAmountValues(selectProductShippingAmount)
        setIsOpenProductShippingModal(false)
    }
    return (
        <>
            <Transition appear show={isOpenProductShippingModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpenProductDiscountModal(false)}>
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
                                        Shipping Amount
                                        <p>Do you want to add Shipping amount for this Estimate</p>
                                    </Dialog.Title>
                                    <div className="bg-white w-full rounded">
                                        <div className="p-4">
                                            <div>
                                                <Input type="number" min={1} value={selectProductShippingAmount}  onChange={handleSelectProductDiscountAmount}  lable="Enter Shipping Amount"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col lg:flex-row space-y-8 lg:space-y-0 justify-between">
                                        <button
                                            type="button"
                                            className="iinline-block shadow rounded-full bg-white px-16 py-3 text-lg font-semibold leading-normal text-blue-950 transition  duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700 hover:text-white"
                                            onClick={() => setIsOpenProductShippingModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-block rounded-full bg-blue-950 px-16 py-3 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700"
                                            onClick={() => handleSelectProductShippingSetContext()}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>


                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className="flex justify-between text-gray-500 text-lg mb-8"  onClick={() => setIsOpenProductShippingModal(true)}>
                <span>Shipping</span>
                <span className="text-green-700">{globalSelectCurrency.symbol_left} {parseFloat(globalProductShippingAmount).toFixed(2)}</span>
            </div>
        </>
    );
}

export default ShippingDetails;