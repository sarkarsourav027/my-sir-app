import React, {Fragment, useContext, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import Input from "@/components/InputFields/Input";
import {ProductAddContext, useProductAddData} from "@/context/ProductAddContext";
import Radio from "@/components/InputFields/Radio";

function DiscountDetails() {
    let [isOpenProductDiscountModal, setIsOpenProductDiscountModal] = useState(false)
    const [selectProductDiscountType, setSelectProductDiscountType] = useState(null);
    const [selectProductDiscountAmount, setSelectProductDiscountAmount] = useState(null);
    const {globalProductGrossAmount} = useProductAddData();
    const {globalProductDiscountAmount} = useProductAddData();
    const {globalSelectCurrency} = useProductAddData();
    const {globalProductDiscountAmountDetails} = useProductAddData();
    const {setGlobalProductDiscountAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductDiscountDetailsValues} = useContext(ProductAddContext);
    const {setGlobalProductSubTotalAmountValues} = useContext(ProductAddContext);
    const {setGlobalTotalAmountValues} = useContext(ProductAddContext);
    const handleSelectProductDiscountType = (e) => {
        setSelectProductDiscountType(e.target.value)
    };
    const handleSelectProductDiscountAmount = (e) => {
        setSelectProductDiscountAmount(e.target.value)
    };

    const handleSelectProductDiscountSetContext = () => {
        if(selectProductDiscountType != null && selectProductDiscountAmount !== null){
            if (selectProductDiscountType == "1"){
                let discountAmount = (parseFloat(globalProductGrossAmount) * parseFloat(selectProductDiscountAmount)) / 100;
                setGlobalProductDiscountAmountValues(discountAmount)
                // setGlobalProductSubTotalAmountValues( parseFloat(globalProductGrossAmount) - parseFloat(discountAmount))
                setGlobalProductDiscountDetailsValues({
                    discount_type : selectProductDiscountType,
                    discount_amount : selectProductDiscountAmount,
                })
            }else if (selectProductDiscountType == "2"){
                let discountAmount = parseFloat(globalProductGrossAmount) - parseFloat(selectProductDiscountAmount);
                setGlobalProductDiscountAmountValues(selectProductDiscountAmount)
                // setGlobalProductSubTotalAmountValues(discountAmount)
                setGlobalProductDiscountDetailsValues({
                    discount_type : selectProductDiscountType,
                    discount_amount : selectProductDiscountAmount,
                })

            }
        }

        setIsOpenProductDiscountModal(false)
    };

    return (
        <>
        <Transition appear show={isOpenProductDiscountModal} as={Fragment}>
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
                                    Enter Discount
                                </Dialog.Title>
                                <div className="bg-white w-full rounded">

                                    <div className="p-4">
                                        <div>

                                            <Radio type="radio" value="1" id="Percentage" onChange={handleSelectProductDiscountType} lable="Percentage" checked= {selectProductDiscountType === "1" ? true : ""} />
                                        </div>
                                        <div>
                                            <Radio type="radio" value="2" id="amount"  onChange={handleSelectProductDiscountType} lable="Amount"  checked= {selectProductDiscountType === "2" ? true : ""}/>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div>
                                            <Input type="number" min={1} value={selectProductDiscountAmount}  onChange={handleSelectProductDiscountAmount}  lable="Enter Discount"/>
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-4 flex flex-col lg:flex-row space-y-8 lg:space-y-0 justify-between">
                                    <button
                                        type="button"
                                        className="iinline-block shadow rounded-full bg-white px-16 py-3 text-lg font-semibold leading-normal text-blue-950 transition  duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700 hover:text-white"
                                        onClick={() => setIsOpenProductDiscountModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-block rounded-full bg-blue-950 px-16 py-3 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700"
                                        onClick={() => handleSelectProductDiscountSetContext()}
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
        <div className="flex justify-between text-gray-500 text-lg mb-8"  onClick={() => setIsOpenProductDiscountModal(true)}>
            <span>Discount</span>
            <span className="text-red-600">{globalSelectCurrency.symbol_left} {parseFloat(globalProductDiscountAmount).toFixed(2)}</span>
        </div>
        </>
    );
}

export default DiscountDetails;