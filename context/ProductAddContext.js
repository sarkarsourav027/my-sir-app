import {createContext, useContext, useState} from "react";

export const ProductAddContext = createContext([]);

export function ProductAddProvider({children}) {
    const [globalProductAdd, setGlobalProductAdd] = useState([]);
    const [globalProductGrossAmount, setGlobalProductGrossAmount] = useState(0);
    const [globalProductDiscountAmount, setGlobalProductDiscountAmount] = useState(0);
    const [globalProductDiscountAmountDetails, setGlobalProductDiscountDetails] = useState([]);
    const [globalProductSubTotalAmount, setGlobalProductSubTotalAmount] = useState(0);
    const [globalProductTaxAmount, setGlobalProductTaxAmount] = useState(0);
    const [globalTotalAmount, setGlobalTotalAmount] = useState(0);
    const [globalProductTaxAmountDetails, setGlobalProductTaxDetails] = useState([]);
    const [globalProductShippingAmount, setGlobalProductShippingAmount] = useState(0);
    const [globalProductList, setGlobalProductList] = useState([]);
    const [globalTaxList, setGlobalTaxList] = useState([]);
    const [globalItemList, setGlobalItemList] = useState([]);
    const [globalSelectBusiness, setGlobalSelectBusiness] = useState({});
    const [globalSelectCurrency, setGlobalSelectCurrency] = useState({});

    const setGlobalSelectBusinessValues = (values) => {
        setGlobalSelectBusiness((prevValues) => ({
            ...prevValues,
            ...values,
        }));
    };
    const setGlobalSelectCurrencyValues = (values) => {
        setGlobalSelectCurrency((prevValues) => ({
            ...prevValues,
            ...values,
        }));
    };
    // Actions
    const setGlobalProductListValues = (values) => {
        setGlobalProductList((prevValues) => ({
            ...prevValues,
            ...values,
        }));

    };

    const setGlobalTaxListValues = (values) => {
        setGlobalTaxList((prevValues) => ({
            ...prevValues,
            ...values,
        }));
    };

    const setGlobalProductAddValues = (values) => {
        setGlobalProductAdd((prevValues) => [...prevValues, values]);
    };

    const setGlobalProductAddEditValues = (values) => {
        // setGlobalProductAdd((prevValues) => [...prevValues, ...values]);

        setGlobalProductAdd(values)
    };

    const setGlobalProductGrossAmountValues = (values) => {
        setGlobalProductGrossAmount(values);

    };

    const setGlobalProductDiscountAmountValues = (values) => {
        setGlobalProductDiscountAmount(values);

    };

    const setGlobalProductSubTotalAmountValues = (values) => {
        setGlobalProductSubTotalAmount(values);

    };


    const setGlobalProductDiscountDetailsValues = (values) => {
        setGlobalProductDiscountDetails((prevValues) => ({
            ...prevValues,
            ...values,
        }));

    };

    const setGlobalProductTaxAmountValues = (values) => {
        setGlobalProductTaxAmount(values);

    };

    const setGlobalTotalAmountValues = (values) => {
        setGlobalTotalAmount(values);
    };

    const setGlobalProductTaxDetailsValues = (values) => {
        setGlobalProductTaxDetails((prevValues) => ({
            ...prevValues,
            ...values,
        }));

    };

    const setGlobalProductShippingAmountValues = (values) => {
        setGlobalProductShippingAmount(values);
    };

    const setGlobalItemListValues = (values) => {
        setGlobalItemList((prevValues) => ({
            ...prevValues,
            ...values,
        }));

    };

    return (
        <ProductAddContext.Provider value={{globalProductAdd, setGlobalProductAddValues, setGlobalProductAddEditValues,setGlobalProductAdd, globalProductList, setGlobalProductListValues, globalTaxList, setGlobalTaxListValues, globalItemList, setGlobalItemListValues, globalProductGrossAmount, setGlobalProductGrossAmountValues, globalProductDiscountAmount, setGlobalProductDiscountAmountValues, globalProductDiscountAmountDetails, setGlobalProductDiscountDetailsValues, globalProductTaxAmount, setGlobalProductTaxAmountValues, globalProductTaxAmountDetails, setGlobalProductTaxDetailsValues, globalProductShippingAmount, setGlobalProductShippingAmountValues, globalProductSubTotalAmount, setGlobalProductSubTotalAmountValues, globalTotalAmount, setGlobalTotalAmountValues,globalSelectBusiness,
            setGlobalSelectBusinessValues,globalSelectCurrency,setGlobalSelectCurrencyValues}}>
            {children}
        </ProductAddContext.Provider>
    );
}

export function useProductAddData() {
    return useContext(ProductAddContext);
}