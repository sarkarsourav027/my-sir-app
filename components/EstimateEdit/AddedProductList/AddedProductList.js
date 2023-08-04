import React, {useContext, useState} from 'react';
import Image from "next/image";
import logoIcon from "@/public/assets/img/logo.jpeg";
import {ProductAddContext, useProductAddData} from "@/context/ProductAddContext";
import {AiFillDelete} from "react-icons/ai";

function AddedProductList() {
    const {globalProductAdd} = useProductAddData();
    const {globalProductGrossAmount} = useProductAddData();
    const {setGlobalProductAddValues} = useContext(ProductAddContext);
    const {setGlobalProductGrossAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductSubTotalAmountValues} = useContext(ProductAddContext);
    const handleDelete = (data,key) => {
        let grossAmount = parseFloat(globalProductGrossAmount) - parseFloat(parseFloat(data.add_price) * parseFloat(data.add_qty))
        globalProductAdd.splice(key)
        setGlobalProductGrossAmountValues(grossAmount)
        setGlobalProductSubTotalAmountValues(grossAmount)
    };
    return (
        <div>
            <div className="bg-white w-full rounded">
                <table className="min-w-full text-left text-sm font-light border-collapse mt-5">
                    <thead className="border-y-2 font-medium dark:border-neutral-500">
                    <tr>
                        <th scope="col" className="px-6 py-4"> Product / Item</th>
                        <th scope="col" className="px-6 py-4">Price * Qty</th>
                        <th scope="col" className="px-6 py-4">Total Price</th>
                        <th scope="col" className="px-6 py-4">Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        globalProductAdd && globalProductAdd.map((item,key) => {
                            return (
                                <tr key={key}
                                    className="border-b -gray-500 dark:border-neutral-500">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                        <div className="flex">
                                            <div className="ml-4">
                                                <p>{item.name}</p>

                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                        <div className="flex">
                                            <div className="ml-4">
                                                <p className="truncate w-40">{item.currency_symbol}{item.add_price} * {item.add_qty}</p>

                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">

                                        <p className="truncate w-40 font-medium">{item.currency_symbol}{item.add_price * item.add_qty}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <button type="button" onClick={()=>{handleDelete(item,key)}}
                                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                            <AiFillDelete classNblueame="h-4 w-4"/>
                                            <span class="sr-only">Icon description</span>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default AddedProductList;