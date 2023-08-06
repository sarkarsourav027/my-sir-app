import client from 'utils/paypal'
import paypal from '@paypal/checkout-server-sdk'

export default async function Handler(req, res) {

    if(req.method !== "POST")
        return res.status(404).json({success: false, message: "Not Found"})

    if(!req.body.orderID)
        return res.status(400).json({success: false, message: "Please Provide Order ID"})

    const { orderID } = req.body
    const PaypalClient = client()
    const request = new paypal.orders.OrdersCaptureRequest(orderID)
    request.requestBody({})
    const response = await PaypalClient.execute(request)
    if (!response) {
        return res.status(500).json({success: false, message: "Some Error Occured at backend"})
    }

    if(response.statusCode ===201){
        const result = response.result
        const custom_param = result.purchase_units[0].payments.captures[0].custom_id.split("|")

        let subscriptionExpirationDate;

        switch(custom_param[1]) {
            case "monthly":
                const currentDate = new Date(result.purchase_units[0].payments.captures[0].create_time);
                const nextMonth = new Date(currentDate);
                nextMonth.setMonth(currentDate.getMonth() + 1)
                subscriptionExpirationDate = nextMonth.toISOString()
                break;
            case 'yearly':
                subscriptionExpirationDate = new Date(new Date(result.purchase_units[0].payments.captures[0].create_time).setFullYear(new Date().getFullYear() + 1))
                break;
            case 'lifetime':
                subscriptionExpirationDate = new Date(new Date(result.purchase_units[0].payments.captures[0].create_time).setFullYear(new Date().getFullYear() + 100))
                break;
            default:
            // code block
        }

        /*const dataObj = {
            subscription_type:custom_param[1],
            productId:custom_param[2],
            quantity:1,
            transactionId: result.purchase_units[0].payments.captures[0].id,
            originalTransactionId: result.purchase_units[0].payments.captures[0].id,
            purchaseDate: result.purchase_units[0].payments.captures[0].create_time,
            originalPurchaseDate: result.purchase_units[0].payments.captures[0].create_time,
            webOrderLineItemId:result.id,
            subscriptionExpirationDate,
            cancellationDate:"",
            isTrialPeriod:"",
            isInIntroOfferPeriod:""
        }*/

        const sentFormData = new FormData();
        sentFormData.append("subscription_type", custom_param[1])
        sentFormData.append("productId", custom_param[2])
        sentFormData.append("quantity", 1)
        sentFormData.append("transactionId", result.purchase_units[0].payments.captures[0].id)
        sentFormData.append("originalTransactionId", result.purchase_units[0].payments.captures[0].id)
        sentFormData.append("purchaseDate", result.purchase_units[0].payments.captures[0].create_time)
        sentFormData.append("originalPurchaseDate", result.purchase_units[0].payments.captures[0].create_time)
        sentFormData.append("webOrderLineItemId", result.id)
        sentFormData.append("subscriptionExpirationDate", subscriptionExpirationDate)
        sentFormData.append("cancellationDate", "")
        sentFormData.append("isTrialPeriod", "")
        sentFormData.append("isInIntroOfferPeriod", "")

        /*Store data into database*/
        const responseStoreSubscription = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}subscription/add`, {
            method: 'POST',
            headers: {"Access-Token": req.body.AccessToken},
            body:sentFormData
        }).then((r) => {
                return r.json()
            });

        if(responseStoreSubscription.status){
            res.status(200).json({success: true, data: result})
        }
    }
}