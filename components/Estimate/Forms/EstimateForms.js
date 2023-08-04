import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import PillNavigation from "@/components/Navs/PillNavigation";
import SelectInput from "@/components/InputFields/SelectInput";
import Input from "@/components/InputFields/Input";
import Link from "next/link";
import AddedProductList from "@/components/Estimate/AddedProductList/AddedProductList";
import ProductAdd from "@/components/Estimate/ProductAdd/ProductAdd";
import ImagePreview from "@/components/InputFields/ImagePreview";
import FileUpload from "@/components/InputFields/FileUpload";
import TextArea from "@/components/InputFields/TextArea";
import {ProductAddContext, useProductAddData} from "@/context/ProductAddContext";
import {useBusinessData} from "@/context/BusinessContext";
import {getSession, useSession} from "next-auth/react";
import useSWR from "swr";
import {useFormik} from "formik";
import * as yup from "yup";
import {toast} from "react-toastify";
import DiscountDetails from "@/components/Estimate/Discount/DiscountDetails";
import TaxDetails from "@/components/Estimate/Tax/TaxDetails";
import ShippingDetails from "@/components/Estimate/Shipping/ShippingDetails";
import {useRouter} from "next/router";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {Dialog, Transition} from "@headlessui/react";
import CanvasDraw from "react-canvas-draw";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import MultipleFileUpload from "@/components/InputFields/MultipleFileUpload";


const business_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

const customers_fetcher = async (url, session) => await fetch(url, {
    method: 'POST',
    headers: {"Access-Token": session.user.access_token}
}).then((res) => res.json());

function EstimateForms(products) {
    const router = useRouter();
    const canvasRef = useRef(null);

    const [signatureEstimateDrawing, setSignatureEstimateDrawing] = useState();
    const [signatureReceiverDrawing, setSignatureReceiverDrawing] = useState();

    const [isOpenSignatureEstimateModal, setIsOpenSignatureEstimateModal] = useState(false);
    const [isOpenSignatureReceiverModal, setIsOpenSignatureReceiverModal] = useState(false);
    const [estimateNumber, setEstimateNumber] = useState("Est # ");
    const {setGlobalProductListValues} = useContext(ProductAddContext);
    const {setGlobalItemListValues} = useContext(ProductAddContext);
    const {setGlobalTaxListValues} = useContext(ProductAddContext);
    const {setGlobalProductDiscountAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductSubTotalAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductTaxAmountValues} = useContext(ProductAddContext);
    const {setGlobalTotalAmountValues} = useContext(ProductAddContext);
    const {setGlobalProductShippingAmountValues} = useContext(ProductAddContext);
    const {setGlobalSelectBusinessValues} = useContext(ProductAddContext);
    const {setGlobalSelectCurrencyValues} = useContext(ProductAddContext);
    const {globalBusiness} = useBusinessData();
    const {globalProductAdd} = useProductAddData();
    const {globalProductGrossAmount} = useProductAddData();
    const {globalProductSubTotalAmount} = useProductAddData();
    const {globalProductDiscountAmountDetails} = useProductAddData();
    const {globalProductDiscountAmount} = useProductAddData();
    const {globalTotalAmount} = useProductAddData();
    const {globalProductShippingAmount} = useProductAddData();
    const {globalProductTaxAmountDetails} = useProductAddData();
    const {globalSelectBusiness} = useProductAddData();
    const {globalSelectCurrency} = useProductAddData();
    const [customerData, setCustomerData] = useState(null);
    const [selectedCompanyData, setSelectedCompanyData] = useState(null);
    const [searchCompanyItem, setSearchCompanyItem] = useState('');
    const [selectedMarkerFile, setSelectedMarkerFile] = useState(null);
    const [previewMarkerUrl, setPreviewMarkerUrl] = useState(null);
    const [selectedReceiverFile, setSelectedReceiverFile] = useState(null);
    const [previewReceiverUrl, setPreviewReceiverUrl] = useState(null);
    const [selectedBusinessFile, setSelectedBusinessFile] = useState(null);
    const [previewBusinessUrl, setPreviewBusinessUrl] = useState(null);
    const [selectedEstimateFile, setSelectedEstimateFile] = useState([]);
    const [previewEstimateUrl, setPreviewEstimateUrl] = useState([]);
    const {data: session} = useSession()
    useEffect(() => {
        const fetchData = async (company_id) => {
            const estimateSentDataFetch = new FormData();
            estimateSentDataFetch.append("company_id", company_id)
            const estimates = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}estimate/getListingByCompany`, {
                method: 'POST',
                body: estimateSentDataFetch,
                headers: {
                    "Access-Token": session.user.access_token
                }
            }).then((result) => {
                return result.json()
            }).catch((error) => {
                console.log(error)
            });
            setEstimateNumber(estimates && estimates.status ? "Est # " + parseFloat(parseFloat(estimates.data.estimate.length)+1) : "Est # ")

            return estimates

        };
        console.log(session)
        if (session && session.user) {
            fetchData(globalBusiness.company_id).then(r => {
            });
        }
    }, [globalBusiness.company_id, session]);

    const handleSignatureEstimateExport = () => {
        const base64 = canvasRef.current.canvasContainer.childNodes[1].toDataURL();
        setSignatureEstimateDrawing(base64);
        setIsOpenSignatureEstimateModal(false)
    };

    const handleSignatureReceiverExport = () => {
        const base64 = canvasRef.current.canvasContainer.childNodes[1].toDataURL();
        setSignatureReceiverDrawing(base64);
        setIsOpenSignatureReceiverModal(false)
    };
    const template = [{value: 1, name: "Template 1"}, {value: 2, name: "Template 2"}, {
        value: 3,
        name: "Template 3"
    }, {value: 4, name: "Template 4"}]

    const [filteredProductData, setFilteredProductData] = useState(null);
    const [filteredCustomerData, setFilteredCustomerData] = useState(products && products.customers && products.customers.customer ? products.customers.customer.filter((row) =>
        row.company_id.includes(globalBusiness.company_id)
    ) : []);

    const [filteredItemData, setFilteredItemData] = useState(null);
    const [filteredTaxData, setFilteredTaxData] = useState(null);
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
    const handleFileMarkerChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedMarkerFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewMarkerUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleFileReceiverChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedReceiverFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewReceiverUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleFileBusinessChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedBusinessFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewBusinessUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const handleFileSelected = (event) => {
        const files = event.target.files;
        const selectedImagePreviews = [];

        // Loop through the selected files and generate previews
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            // Read the image file and create a data URL (preview)
            reader.onloadend = () => {
                selectedImagePreviews.push(reader.result);
                if (selectedImagePreviews.length === files.length) {
                    setImagePreviews(selectedImagePreviews);
                    setSelectedImages(Array.from(files)); // Convert FileList to an array
                }
            };

            reader.readAsDataURL(file);
        }
    }
    const handleFileEstimateChange = (event) => {
        const files = event.target.files;
        const selectedImagePreviews = [];

        // Loop through the selected files and generate previews
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            // Read the image file and create a data URL (preview)
            reader.onloadend = () => {
                selectedImagePreviews.push(reader.result);
                if (selectedImagePreviews.length === files.length) {
                    setPreviewEstimateUrl(selectedImagePreviews);
                    setSelectedEstimateFile(Array.from(files)); // Convert FileList to an array
                }
            };
            console.log("setPreviewEstimateUrl")
            console.log(setPreviewEstimateUrl)
            reader.readAsDataURL(file);
        }
        // const file = event.target.files[0];
        //
        // if (file) {
        //     setSelectedEstimateFile(file);
        //     const reader = new FileReader();
        //     reader.onload = () => {
        //         setPreviewEstimateUrl(reader.result);
        //     };
        //     reader.readAsDataURL(file);
        // }
    };
    const {
        data: business,
        error: business_error
    } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}company/listing`, session], ([url, session]) => business_fetcher(url, session))
    const formik = useFormik({
        initialValues: {
            company_id: globalBusiness.company_id,
            customer_id: '',
            estimate_no: estimateNumber,
            estimate_date: '',
            ref_no: '',
            credit_terms: '',
            notes: '',
            shipping_firstname: '',
            shipping_lastname: '',
            shipping_address_1: '',
            shipping_address_2: '',
            shipping_city: '',
            shipping_postcode: '',
            shipping_country: '',
            payment_bank_name: '',
            payment_currency: '',
            payment_iban: '',
            payment_swift_bic: '',
            tax: '',
            template_type: '',
            product: '',
            freight_cost: '',
            discount: '',
        },
        validationSchema: yup.object().shape({
            company_id: yup.string().required('Company field is Required'),
            estimate_no: yup.string().required('Estimate no field is Required'),
            estimate_date: yup.string().required('Estimate date field is Required'),
            customer_id: yup.string().required('Customer field is Required'),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            if(globalProductAdd.length !== 0){
                const sentFormData = new FormData();
                // signatureReceiverDrawing
                const signatureOfMakerDataUrlParts = signatureEstimateDrawing.split(',');
                const signatureOfMakerMimeType = signatureOfMakerDataUrlParts[0].match(/:(.*?);/)[1];
                const signatureOfMakerBinaryString = atob(signatureOfMakerDataUrlParts[1]);
                const signatureOfMakerBinaryData = new Uint8Array(signatureOfMakerBinaryString.length);
                for (let i = 0; i < signatureOfMakerBinaryString.length; i++) {
                    signatureOfMakerBinaryData[i] = signatureOfMakerBinaryString.charCodeAt(i);
                }
                // Create a Blob from the binary data
                const signatureOfMakerImageBlob = new Blob([signatureOfMakerBinaryData], {type: signatureOfMakerMimeType});

                // signatureReceiverDrawing
                const signatureReceiverDataUrlParts = signatureReceiverDrawing.split(',');
                const signatureReceiverMimeType = signatureReceiverDataUrlParts[0].match(/:(.*?);/)[1];
                const signatureReceiverBinaryString = atob(signatureReceiverDataUrlParts[1]);
                const signatureReceiverBinaryData = new Uint8Array(signatureReceiverBinaryString.length);
                for (let i = 0; i < signatureReceiverBinaryString.length; i++) {
                    signatureReceiverBinaryData[i] = signatureReceiverBinaryString.charCodeAt(i);
                }
                // Create a Blob from the binary data
                const signatureReceiverImageBlob = new Blob([signatureReceiverBinaryData], {type: signatureReceiverMimeType});

                sentFormData.append("company_id", values.company_id)
                sentFormData.append("payment_bank_name", selectedCompanyData.payment_bank_name)
                sentFormData.append("payment_currency", selectedCompanyData.payment_currency)
                sentFormData.append("payment_iban", selectedCompanyData.payment_iban)
                sentFormData.append("payment_swift_bic", selectedCompanyData.payment_swift_bic)
                sentFormData.append("shipping_address_1", customerData.shipping_address_1)
                sentFormData.append("shipping_address_2", customerData.shipping_address_2)
                sentFormData.append("shipping_city", customerData.shipping_city)
                sentFormData.append("shipping_country", customerData.shipping_country)
                sentFormData.append("shipping_firstname", customerData.shipping_firstname)
                sentFormData.append("shipping_lastname", customerData.shipping_lastname)
                sentFormData.append("shipping_postcode", customerData.shipping_postcode)
                sentFormData.append("customer_id", values.customer_id)
                sentFormData.append("estimate_no", values.estimate_no)
                sentFormData.append("estimate_date", values.estimate_date)
                sentFormData.append("ref_no", values.ref_no)
                sentFormData.append("notes", values.notes)
                sentFormData.append("template_type", values.template_type !== "" ? values.template_type : 1)
                sentFormData.append("discount", globalProductDiscountAmount)
                sentFormData.append("company_stamp", selectedBusinessFile)
                // selectedEstimateFile.map()

                sentFormData.append("estimate_image[0]", selectedEstimateFile)
                sentFormData.append("signature_of_maker", signatureOfMakerImageBlob, 'signature_of_maker_image.png')
                sentFormData.append("signature_of_receiver", signatureReceiverImageBlob, 'signature_of_receiver_image.png')
                sentFormData.append("freight_cost", globalProductShippingAmount)
                globalProductAdd.forEach((element, key) => {
                    sentFormData.append(`product[${key}][product_id]`, element.product_id)
                    sentFormData.append(`product[${key}][price]`, element.add_price)
                    sentFormData.append(`product[${key}][quantity]`, element.add_qty)
                });
                selectedEstimateFile.forEach((element, key) => {
                    sentFormData.append(`estimate_image[${key}]`, element)
                });
                sentFormData.append("tax[0][type]", globalProductTaxAmountDetails && globalProductTaxAmountDetails.tax_inclusive && globalProductTaxAmountDetails.tax_inclusive === true ? 'inclusive' : "exclusive")
                sentFormData.append("tax[0][rate]", globalProductTaxAmountDetails && globalProductTaxAmountDetails.rate ? globalProductTaxAmountDetails.rate : 0)
                sentFormData.append("tax[0][title]", globalProductTaxAmountDetails && globalProductTaxAmountDetails.name ? globalProductTaxAmountDetails.name : "")


                const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}estimate/add`, {
                    method: 'POST',
                    body: sentFormData,
                    headers: {
                        "Access-Token": session.user.access_token
                    }
                })

                const response = await result.json();

                if (response.status) {
                    toast.success(response.message)

                    // router.push("/estimate");
                } else {
                    toast.error(response.message)
                }

            }else {
                toast.error("Select Product First")
            }


            setSubmitting(false);
        },
    })
    useEffect(() => {
        setEstimateNumber(formik.values.estimate_no)
    }, [formik.values.estimate_no])
    useEffect(() => {
        const handleCompanySearch = async (company_id) => {
            setSearchCompanyItem(company_id);
            console.log("company_id")
            console.log(company_id)
            if (company_id === '') {
                setFilteredProductData(products.products.product)
                setGlobalProductListValues({
                    filteredProductData: products.products.product,
                    products: products.products
                })
                setGlobalItemListValues({filteredProductData: products.items.service, products: products.items.service})
            } else {
                let curData = fetchCurrencyData();
                let currencyData = JSON.parse(await curData);
                let selectBusiness = business && business.data && business.data.company.length > 0 && business.data.company.find(o => o.company_id === company_id)
                let currencyCompanyData = currencyData && currencyData.currencies && currencyData.currencies.length > 0 && currencyData.currencies.find(o => selectBusiness.currency_id && o.currency_id === selectBusiness.currency_id)
                selectBusiness['company_image_path'] = business.data.company_image_path;
                setGlobalSelectBusinessValues(selectBusiness)
                setGlobalSelectCurrencyValues(currencyCompanyData)
                let data = products && products.products && products.products.product ? products.products.product.filter((row) =>
                    row.company_id.toLowerCase().includes(company_id)
                ) : []
                let dataItem = products && products.items && products.items.service ? products.items.service.filter((row) =>
                    row.company_id.toLowerCase().includes(company_id)
                ) : []
                setFilteredCustomerData(products && products.customers && products.customers.customer ? products.customers.customer.filter((row) =>
                    row.company_id.includes(globalBusiness.company_id)
                ) : [])
                setGlobalProductListValues({filteredProductData: data, products: products.products})
                setGlobalItemListValues({filteredProductData: dataItem, products: products.items})
                setFilteredProductData(data)
                const companyData = business && business.data && business.data.company.length > 0 ? business.data.company.filter((row) =>
                    row.company_id.includes(company_id)
                ) : []
                setSelectedCompanyData(companyData && companyData[0] ? companyData[0] : null)
            }
        };
        handleCompanySearch(formik.values.company_id)
    }, [formik.values.company_id, globalBusiness.company_id, filteredProductData == null, filteredCustomerData == null, filteredItemData == null, filteredTaxData == null])
    useEffect(() => {
        const handleCustomerChange = (data) => {
            // setSearchCompanyItem(company_id);
            const cusData = products && products.customers && products.customers.customer ? products.customers.customer.filter((row) =>
                row.customer_id.includes(data)
            ) : []
            setCustomerData(cusData && cusData[0] ? cusData[0] : null)

        };
        handleCustomerChange(formik.values.customer_id)
    }, [formik.values.customer_id, products])
    useEffect(() => {
        setGlobalSelectBusinessValues(globalBusiness)
        setGlobalSelectCurrencyValues(globalBusiness.currency)
        setFilteredCustomerData(products && products.customers && products.customers.customer ? products.customers.customer.filter((row) =>
            row.company_id.includes(globalBusiness.company_id)
        ) : [])
        setFilteredProductData(products && products.products && products.products.product ? products.products.product.filter((row) =>
            row.company_id.includes(globalBusiness.company_id)
        ) : null)
        setFilteredItemData(products && products.items && products.items.service ? products.items.service.filter((row) =>
            row.company_id.includes(globalBusiness.company_id)
        ) : null)
        setFilteredTaxData(products && products.taxes && products.taxes.tax ? products.taxes.tax.filter((row) =>
            row.company_id.includes(globalBusiness.company_id)
        ) : null)
        setGlobalProductListValues({filteredProductData: filteredProductData, products: products.products})
        setGlobalItemListValues({filteredProductData: filteredItemData, products: products.items})
        setGlobalTaxListValues({filteredTaxData: filteredTaxData, taxes: products.taxes})
        const companyData = business && business.data && business.data.company.length > 0 ? business.data.company.filter((row) =>
            row.company_id.includes(globalBusiness.company_id)
        ) : []
        setSelectedCompanyData(companyData && companyData[0] ? companyData[0] : null)
    }, [globalBusiness.company_id, filteredProductData == null, filteredCustomerData == null, filteredItemData == null, filteredTaxData == null])
    useEffect(() => {
        let total = parseFloat(globalProductGrossAmount)
        let subTotal = parseFloat(globalProductGrossAmount)
        if (globalProductAdd.length > 0) {
            total = parseFloat(globalProductGrossAmount)
            if (globalProductDiscountAmountDetails && globalProductDiscountAmountDetails.discount_type &&
                globalProductDiscountAmountDetails.discount_amount) {
                if (globalProductDiscountAmountDetails.discount_type == "1") {
                    let discountAmount = (parseFloat(globalProductGrossAmount) * parseFloat(globalProductDiscountAmountDetails.discount_amount)) / 100;
                    setGlobalProductDiscountAmountValues(discountAmount)
                    subTotal = parseFloat(globalProductGrossAmount) - parseFloat(discountAmount)
                    total = parseFloat(globalProductGrossAmount) - parseFloat(discountAmount)
                } else if (globalProductDiscountAmountDetails.discount_type == "2") {
                    setGlobalProductDiscountAmountValues(globalProductDiscountAmountDetails.discount_amount)
                    subTotal = parseFloat(globalProductGrossAmount) - parseFloat(globalProductDiscountAmountDetails.discount_amount)
                    total = parseFloat(globalProductGrossAmount) - parseFloat(globalProductDiscountAmountDetails.discount_amount)
                }
            }
            if (subTotal > 0) {
                if (globalProductTaxAmountDetails && globalProductTaxAmountDetails.rate && globalProductTaxAmountDetails.type) {
                    if (globalProductTaxAmountDetails.tax_inclusive === true) {
                        if (globalProductTaxAmountDetails.type == "P") {
                            let taxAmount = (parseFloat(subTotal) * parseFloat(globalProductTaxAmountDetails.rate)) / 100;
                            setGlobalProductTaxAmountValues(taxAmount)
                            total = parseFloat(subTotal)
                        }
                    } else {
                        if (globalProductTaxAmountDetails.type == "P") {
                            let taxAmount = parseFloat(parseFloat(subTotal) * parseFloat(globalProductTaxAmountDetails.rate)) / 100;
                            setGlobalProductTaxAmountValues(taxAmount)
                            total = parseFloat(parseFloat(subTotal) + parseFloat(taxAmount))
                        }
                    }
                }
            }

        }
        if (globalProductShippingAmount > 0) {
            total += parseFloat(globalProductShippingAmount)
        }
        setGlobalProductSubTotalAmountValues(subTotal)
        setGlobalTotalAmountValues(total)
    }, [globalProductAdd.length, setGlobalProductDiscountAmountValues, globalProductTaxAmountDetails, setGlobalProductShippingAmountValues, setGlobalProductSubTotalAmountValues, setGlobalProductTaxAmountValues, setGlobalTotalAmountValues])



    return (
        <div className="flex flex-wrap relative">
            <div className="w-full ">
                <PillNavigation
                    lists={[
                        {label: 'Estimates', link: '/estimate'},
                        {label: 'Create Estimate', link: '/estimate/create'}
                    ]}
                />
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded p-6">
                    <div className="flex-auto">
                        <div className="tab-content tab-space">
                            <div className="">
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="mb-8">
                                        <h5 className="text-blue-950 text-lg font-medium">Estimate Details</h5>
                                    </div>
                                    <div className="mb-6">
                                        <SelectInput
                                            option={
                                                business && business.data && business.data.company.length > 0 && business.data.company.map((item, key) => {
                                                    return ({"value": item.company_id, "label": item.name,})
                                                })
                                            }
                                            label={"Company"}
                                            name="company_id"
                                            onChange={formik.handleChange}
                                            value={formik.values.company_id}
                                            required={true}
                                            defaultSelectedValue={globalBusiness.company_id}
                                        />
                                        {formik.errors.company_id ?
                                            <div
                                                className="text-red-600">{formik.errors.company_id}
                                            </div> : null
                                        }
                                    </div>

                                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                                        <div>
                                            <Input
                                                type="text"
                                                name="estimate_no"
                                                className="required"
                                                value={estimateNumber}
                                                onChange={formik.handleChange}
                                                lable="Estimate No"
                                                id="estimate_no"
                                                required={true}
                                            />
                                            {formik.errors.estimate_no ?
                                                <div className="text-red-600">{formik.errors.estimate_no}</div> : null}
                                        </div>
                                        <div>
                                            <Input
                                                type="datetime-local"
                                                name="estimate_date"
                                                className="required"
                                                value={formik.values.estimate_date}
                                                onChange={formik.handleChange}
                                                lable="Estimate Date"
                                                id="estimate_date"
                                                required={true}
                                            />
                                            {formik.errors.estimate_date ?
                                                <div
                                                    className="text-red-600">{formik.errors.estimate_date}</div> : null}
                                        </div>
                                        <div>

                                            <SelectInput
                                                option={
                                                    filteredCustomerData && filteredCustomerData.map((item, key) => {
                                                        return ({"value": item.customer_id, "label": item.customer_name,})
                                                    })
                                                }
                                                label={"Customer"}
                                                name="customer_id"
                                                onChange={formik.handleChange}
                                                value={formik.values.customer_id}
                                                required={true}
                                                defaultSelectedValue={""}
                                            />
                                            {formik.errors.customer_id ?
                                                <div className="text-red-600">{formik.errors.customer_id}</div> : null}
                                        </div>

                                        <div>

                                            <Input
                                                type="text"
                                                name="ref_no"
                                                className="required"
                                                value={formik.values.ref_no}
                                                onChange={formik.handleChange}
                                                lable="Enter Reference No."
                                                id="ref_no"
                                            />
                                            {formik.errors.ref_no ?
                                                <div className="text-red-600">{formik.errors.ref_no}</div> : null}
                                        </div>


                                        <div className="mb-6">
                                            <SelectInput
                                                option={
                                                    template && template.map((item, key) => {
                                                        return ({"value": item.value, "label": item.name,})
                                                    })
                                                }
                                                label={"Select Template"}
                                                name="template_type"
                                                onChange={formik.handleChange}
                                                value={formik.values.template_type}

                                                defaultSelectedValue={""}
                                            />
                                            {formik.errors.template_type ?
                                                <div
                                                    className="text-red-600">{formik.errors.template_type}
                                                </div> : null
                                            }

                                        </div>
                                    </div>

                                    <div className="mb-8 border-b-2 border-c6 pb-8">
                                        <h5 className="text-blue-950 text-lg font-medium">Items</h5>
                                        <div className="mb-16 text-center">
                                            <AddedProductList></AddedProductList>
                                        </div>
                                        {/*<div className="flex gap-6">*/}
                                        <ProductAdd/>
                                        {/*</div>*/}
                                    </div>

                                    <div className="mb-8 border-b-2 border-c6 pb-8">
                                        <div className="flex justify-between text-gray-500 text-lg mb-8">
                                            <span>Gross Amount</span>
                                            <span>{globalSelectCurrency.symbol_left} {parseFloat(globalProductGrossAmount).toFixed(2)}</span>
                                        </div>
                                        <DiscountDetails/>
                                        <div className="flex justify-between text-gray-500 text-lg mb-8">
                                            <span>Sub Total</span>
                                            <span>{globalSelectCurrency.symbol_left} {parseFloat(globalProductSubTotalAmount).toFixed(2)}</span>
                                        </div>
                                        <TaxDetails/>
                                        <ShippingDetails/>
                                        <div className="flex justify-between text-gray-500 text-lg mb-8">
                                            <span>Net Amount</span>
                                            <span
                                                className="text-green-700">{globalSelectCurrency.symbol_left} {parseFloat(globalTotalAmount).toFixed(2)}</span>
                                        </div>
                                    </div>


                                    <div className="grid lg:grid-cols-3 gap-6">
                                        <Transition appear show={isOpenSignatureEstimateModal} as={Fragment}>
                                            <Dialog as="div" className="relative z-10"
                                                    onClose={() => setIsOpenSignatureEstimateModal(false)}>
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
                                                    <div
                                                        className="flex min-h-full items-center justify-center p-4 text-center">
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
                                                                    Signature of Estimate Marker
                                                                </Dialog.Title>
                                                                <div className="bg-white w-full text-center">
                                                                    <CanvasDraw
                                                                        ref={canvasRef} brushRadius={1}
                                                                        className="shadow-2xl"
                                                                    />
                                                                </div>

                                                                <div
                                                                    className="mt-4 flex flex-col lg:flex-row space-y-8 lg:space-y-0 justify-between">
                                                                    <PrimaryButton
                                                                        type="button"
                                                                        onClick={() => setIsOpenSignatureEstimateModal(false)}
                                                                    >
                                                                        Cancel
                                                                    </PrimaryButton>
                                                                    <SecondaryButton
                                                                        type="button"
                                                                        onClick={handleSignatureEstimateExport}
                                                                    >
                                                                        Export Drawing
                                                                    </SecondaryButton>
                                                                </div>
                                                            </Dialog.Panel>
                                                        </Transition.Child>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </Transition>

                                        <Transition appear show={isOpenSignatureReceiverModal} as={Fragment}>
                                            <Dialog as="div" className="relative z-10"
                                                    onClose={() => setIsOpenSignatureReceiverModal(false)}>
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
                                                    <div
                                                        className="flex min-h-full items-center justify-center p-4 text-center">
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
                                                                    Signature of Estimate Marker
                                                                </Dialog.Title>
                                                                <div className="bg-white w-full text-center">
                                                                    <CanvasDraw
                                                                        ref={canvasRef} brushRadius={1}
                                                                        className="shadow-2xl"
                                                                    />
                                                                </div>

                                                                <div
                                                                    className="mt-4 flex flex-col lg:flex-row space-y-8 lg:space-y-0 justify-between">
                                                                    <PrimaryButton
                                                                        type="button"
                                                                        onClick={() => setIsOpenSignatureReceiverModal(false)}
                                                                    >
                                                                        Cancel
                                                                    </PrimaryButton>
                                                                    <SecondaryButton
                                                                        type="button"
                                                                        onClick={handleSignatureReceiverExport}
                                                                    >
                                                                        Export Drawing
                                                                    </SecondaryButton>
                                                                </div>
                                                            </Dialog.Panel>
                                                        </Transition.Child>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </Transition>

                                        <div>
                                            <ImagePreview previewUrl={signatureEstimateDrawing}/>
                                            <div className="flex items-center justify-center w-full mt-1">
                                                <button type="button"
                                                        className="flex sm:inline-flex items-center justify-center border-01xl border-c3 border-dashed rounded-full cursor-pointer bg-blue-900 dark:hover:bg-orange-700 dark:bg-blue-900 hover:bg-orange-700 text-white py-4 px-6"
                                                        onClick={() => setIsOpenSignatureEstimateModal(true)}>Signature
                                                    of Estimate Marker
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <ImagePreview previewUrl={signatureReceiverDrawing}/>
                                            <div className="flex items-center justify-center w-full mt-1">
                                                <button type="button"
                                                        className="flex flex-col items-center justify-center border-01xl border-c3 border-dashed rounded-full cursor-pointer bg-blue-900 dark:hover:bg-orange-700 dark:bg-blue-900 hover:bg-orange-700 text-white py-4 px-6"
                                                        onClick={() => setIsOpenSignatureReceiverModal(true)}>Signature
                                                    of Receiver
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <ImagePreview previewUrl={previewBusinessUrl}/>
                                            <FileUpload onChange={handleFileBusinessChange}
                                                        label={"Upload Business Seal"} subLabel="PNG (MAX. 800x400px)"
                                                        id={"Business"}/>
                                        </div>



                                    </div>
                                    <div>

                                        <div className="grid lg:grid-cols-3 gap-6">
                                            <div>
                                            <FileUpload
                                                accept="image/png, image/jpeg"
                                                onChange={handleFileEstimateChange}
                                                subLabel="PNG, JPG (MAX. 800x400px)"
                                                label={"Upload Estimate Images"} id={"Estimate"}
                                                multiple
                                            />
                                            </div>
                                        </div>
                                        <div className="grid lg:grid-cols-5 gap-6">

                                                {previewEstimateUrl.map((preview, index) => (
                                                    <ImagePreview previewUrl={preview} key={index}/>
                                                    // <ImagePreview images={preview} />
                                                ))}

                                        </div>

                                        {/*<ImagePreview previewUrl={previewEstimateUrl}/>*/}
                                        {/*<FileUpload onChange={handleFileEstimateChange}*/}
                                        {/*            subLabel="PNG, JPG (MAX. 800x400px)"*/}
                                        {/*            label={"Upload Estimate Images"} id={"Estimate"}/>*/}
                                    </div>

                                    <div className="my-8">
                                        <TextArea lable="Notes"/>
                                    </div>

                                    <div
                                        className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 justify-between mt-24">
                                        <button
                                            type="submit"
                                            className="inline-block rounded-full bg-blue-950 px-16 py-3 text-lg font-medium leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700"
                                            data-te-ripple-color="light">
                                            Create Estimate
                                        </button>

                                        <button
                                            type="submit"
                                            className="inline-block shadow rounded-full bg-white px-16 py-3 text-lg font-semibold leading-normal text-blue-950 transition  duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-orange-700 hover:text-white"
                                            data-te-ripple-color="light">
                                            Preview
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default EstimateForms;

