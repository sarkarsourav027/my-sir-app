import {
    BsBarChartLineFill,
    BsCalculatorFill,
    BsEnvelopePaperFill,
    BsFillBagFill,
    BsFillBoxSeamFill,
    BsFillBuildingFill,
    BsFillCartDashFill,
    BsFillPersonFill,
    BsPeopleFill,
    BsPersonPlusFill
} from "react-icons/bs";

import {MdDashboard, MdDeliveryDining, MdReceipt} from "react-icons/md";
import {TbReceiptTax} from "react-icons/tb";
import {FaBell, FaFileInvoice, FaFileInvoiceDollar, FaMoneyBillAlt} from "react-icons/fa";
import {GiTakeMyMoney} from "react-icons/gi";
import {AiFillSetting} from "react-icons/ai";


const list = [
    {
        type: 'link',
        href: '/dashboard',
        icon: <MdDashboard className="h-6 w-6"/>,
        label: 'Dashboard',
        active: ['/dashboard']
    },
    {
        type: 'link',
        href: '/user',
        icon: <BsPersonPlusFill className="h-6 w-6"/>,
        label: 'Add New User',
        active: ['/user', '/user/create', '/user/[id]/edit', '/user/[id]/view',]
    },
    {
        type: 'link',
        href: '/business',
        icon: <BsFillBuildingFill className="h-6 w-6"/>,
        label: 'My Businesses',
        active: ['/business', "/business/[business_id]/edit", "/business/create", "/business/[business_id]/view", "/business/[business_id]/warehouse", "/business/[business_id]/warehouse/create", "/business/[business_id]/view/[warehouse_id]/view", "/business/[business_id]/view/[warehouse_id]/edit"]
    },
    {
        type: 'link',
        href: '/product',
        icon: <BsFillBoxSeamFill className="h-6 w-6"/>,
        label: 'My Products (Tracked)',
        active: ['/product', "/product/[product_id]/edit", "/product/create", "/product/[product_id]/view"]
    },
    {type: 'link', href: '/item', icon: <BsFillBagFill className="h-6 w-6"/>, label: 'My Items', active: ['/item' , "/item/[item_id]/edit", "/item/create", "/item/[item_id]/view"]},
    {type: 'link', href: '/tax', icon: <TbReceiptTax className="h-6 w-6"/>, label: 'Add Taxes', active: ['/tax' , "/tax/[id]/edit", "/tax/create", "/tax/[id]/view"]},
    {
        type: 'link',
        href: '/customer',
        icon: <BsPeopleFill className="h-6 w-6"/>,
        label: 'Customers',
        active: ['/customer', '/customer/create', "/customer/[customer_id]/edit", "/customer/[customer_id]/view"]
    },
    {
        type: 'link',
        href: '/supplier',
        icon: <MdDeliveryDining className="h-6 w-6"/>,
        label: 'Suppliers',
        active: ['/supplier', '/supplier/create', "/supplier/[supplier_id]/edit", "/supplier/[supplier_id]/view"]
    },
    {
        type: 'link',
        href: '/stock',
        icon: <BsBarChartLineFill className="h-6 w-6"/>,
        label: 'Stocks',
        active: ['/stock', '/stock/create', "/stock/[stock_id]/edit", "/stock/[stock_id]/view"]
    },
    {
        type: 'link',
        href: '/invoice',
        icon: <FaFileInvoice className="h-6 w-6"/>,
        label: 'Invoices',
        active: ['/invoice', '/invoice/create', "/invoice/[invoice_id]/edit", "/invoice/[invoice_id]/view"]
    },
    {
        type: 'link',
        href: '/estimate',
        icon: <BsCalculatorFill className="h-6 w-6"/>,
        label: 'Estimates',
        active: ['/estimate', '/estimate/create', "/estimate/[estimate_id]/edit", "/estimate/[estimate_id]/view"]
    },
    {
        type: 'link',
        href: '/po',
        icon: <BsFillCartDashFill className="h-6 w-6"/>,
        label: 'Purchase Order',
        active: ['/po', '/po/create', "/po/[po_id]/edit", "/po/[po_id]/view"]
    },
    {type: 'link', href: '/receipt', icon: <MdReceipt className="h-6 w-6"/>, label: 'Receipts', active: ['/receipt']},
    {
        type: 'link',
        href: '/report',
        icon: <FaFileInvoiceDollar className="h-6 w-6"/>,
        label: 'Reports',
        active: ['/report']
    },
    {
        type: 'modal',
        href: '/payment',
        icon: <BsFillPersonFill className="h-6 w-6"/>,
        label: 'Payment Vouchers',
        active: ['/payment']
    },
    {
        type: 'modal',
        href: '/credit',
        icon: <GiTakeMyMoney className="h-6 w-6"/>,
        label: 'Credit Notes',
        active: ['/credit']
    },
    {
        type: 'modal',
        href: '/debit',
        icon: <FaMoneyBillAlt className="h-6 w-6"/>,
        label: 'Debit Notes',
        active: ['/debit']
    },
    {
        type: 'modal',
        href: '/thank-you',
        icon: <BsEnvelopePaperFill className="h-6 w-6"/>,
        label: 'Thank You Note',
        active: ['/thank-you']
    },
    {
        type: 'modal',
        href: '/invoice-mssg',
        icon: <FaBell className="h-6 w-6"/>,
        label: 'Invoice Reminders',
        active: ['/invoice-mssg']
    },
    {
        type: 'link',
        href: '/settings',
        icon: <AiFillSetting className="h-6 w-6"/>,
        label: 'Settings',
        active: ['/settings']
    },
];

export default list