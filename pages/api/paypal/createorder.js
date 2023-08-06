import client from 'utils/paypal'
import paypal from '@paypal/checkout-server-sdk'

export default async function Handler(req, res) {

    if(req.method !== "POST")
        return res.status(404).json({success: false, message: "Not Found"})

    if(!req.body.subscriptionType || !req.body.user_id)
        return res.status(400).json({success: false, message: "Please Provide Subscription Type And User ID"})

    try{

        let price;
        const currencyCode = "USD"
        const userId = req.body.user_id
        const subscriptionType = req.body.subscriptionType;
        let productId;

        switch(subscriptionType) {
            case "monthly":
                price = 0.99;
                productId = "com.sirapp.onemonth";
                break;
            case 'yearly':
                price = 1.99;
                productId = "com.sir.oneyear";
                break;
            case 'lifetime':
                price = 2.99;
                productId = "com.sirapp.lifetime";
                break;
            default:
            // code block
        }

        const PaypalClient = client()
        //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
        const request = new paypal.orders.OrdersCreateRequest()
        request.headers['prefer'] = 'return=representation'
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    "custom_id": `${userId}|${subscriptionType}|${productId}`,
                    amount: {
                        currency_code: currencyCode,
                        value: price,
                    },
                },
            ],
        })
        const response = await PaypalClient.execute(request)
        if (response.statusCode !== 201) {
            console.log("RES: ", response)
            return res.status(500).json({success: false, message: "Some Error Occured at backend"})
        }

        res.status(200).json({success: true, data: response.result.id})
    }
    catch(err){
        console.log("Err at Create Order: ", err)
        return res.status(500).json({success: false, message: "Could Not Found the user"})
    }

}