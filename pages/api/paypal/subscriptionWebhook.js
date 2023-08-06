import {
    getSubscriptionExpirationDate,
    listTransactionsForSubscription,
    webhookSignatureVerification
} from 'utils/paypal'
export default async function Handler(req, res) {

    if(req.method !== "POST")
        return res.status(404).json({success: false, message: "Not Found"})

    const headers = req.headers;
    const requestBody = req.body;

    try {

         /*webhook signature verification*/
         const params = {
             webhook_id:process.env.PAYPAL_WEBHOOK_ID,
             transmission_id:headers['paypal-transmission-id'],
             transmission_time:headers['paypal-transmission-time'],
             cert_url:headers['paypal-cert-url'],
             auth_algo:headers['paypal-auth-algo'],
             transmission_sig:headers['paypal-transmission-sig'],
             webhook_event:requestBody
         }
        const signatureVerification = await webhookSignatureVerification(params)

        if (signatureVerification.verification_status === 'SUCCESS') {

            const event = requestBody;
            const eventType = event.event_type;
            const resource = event.resource
            // const custom_param = resource.custom_id ? resource.custom_id.split("|") : "8846|monthly|com.sirapp.onemonth|hvTH7VQM3TmkCky7SUPFKKd3TYDjAiRX".split("|")
            const custom_param = "8846|yearly|com.sirapp.onemonth|hvTH7VQM3TmkCky7SUPFKKd3TYDjAiRX".split("|")

            const sentFormData = new FormData();
            let subscriptionExpirationDate='';
            let transactionId='';
            let purchaseDate='';
            let webOrderLineItemId='';
            let subscription_type='';
            let productId='';
            let cancellationDate = '';
            let isTrialPeriod =  false;

            switch (eventType) {
                case 'BILLING.SUBSCRIPTION.ACTIVATED':

                    subscription_type = custom_param[1]
                    productId = custom_param[2]
                    subscriptionExpirationDate = await getSubscriptionExpirationDate(custom_param[1], resource.create_time)
                    const {transactions} = await listTransactionsForSubscription(resource.id, resource.create_time, resource.create_time)
                    transactionId = transactions ? transactions[0].id : ''
                    purchaseDate = resource.create_time
                    webOrderLineItemId = resource.id
                    isTrialPeriod = custom_param[1] === 'yearly';
                    // console.log(`${subscription_type}-${productId}-${subscriptionExpirationDate}-${transactionId}-${purchaseDate}-${webOrderLineItemId}`)

                    break;
                case 'PAYMENT.SALE.COMPLETED':

                    subscription_type = custom_param[1]
                    productId = custom_param[2]
                    subscriptionExpirationDate = await getSubscriptionExpirationDate(custom_param[1], resource.create_time)
                    const {transactions: paymentDetails} = await listTransactionsForSubscription(resource.id, resource.create_time, resource.create_time)
                    transactionId = paymentDetails ? paymentDetails[0].id : ''
                    purchaseDate = resource.create_time
                    webOrderLineItemId = resource.id
                    isTrialPeriod = custom_param[1] === 'yearly';

                    break;
                case 'BILLING.SUBSCRIPTION.CANCELLED':

                    cancellationDate = resource.status_update_time
                    break;

                case 'BILLING.SUBSCRIPTION.EXPIRED':

                    cancellationDate = resource.status_update_time
                    break;

                case 'BILLING.SUBSCRIPTION.SUSPENDED':

                    cancellationDate = new Date().toISOString()
                    break;

                case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':

                    break;

                default:
                    console.log(`Unhandled event type: ${eventType}`);
            }

            if (['BILLING.SUBSCRIPTION.ACTIVATED', 'PAYMENT.SALE.COMPLETED', 'BILLING.SUBSCRIPTION.CANCELLED', 'BILLING.SUBSCRIPTION.EXPIRED', 'BILLING.SUBSCRIPTION.SUSPENDED'].includes(eventType)) {

                const dataObj = {
                    subscription_type,
                    productId,
                    quantity: 1,
                    transactionId,
                    originalTransactionId: transactionId,
                    purchaseDate,
                    originalPurchaseDate: purchaseDate,
                    webOrderLineItemId,
                    subscriptionExpirationDate,
                    cancellationDate,
                    isTrialPeriod,
                    isInIntroOfferPeriod: false
                }

                sentFormData.append("subscription_type", subscription_type)
                sentFormData.append("productId", productId)
                sentFormData.append("quantity", 1)
                sentFormData.append("transactionId", transactionId)
                sentFormData.append("originalTransactionId", transactionId)
                sentFormData.append("purchaseDate", purchaseDate)
                sentFormData.append("originalPurchaseDate", purchaseDate)
                sentFormData.append("webOrderLineItemId", webOrderLineItemId)
                sentFormData.append("subscriptionExpirationDate", subscriptionExpirationDate)
                sentFormData.append("cancellationDate", cancellationDate)
                sentFormData.append("isTrialPeriod", isTrialPeriod)
                sentFormData.append("isInIntroOfferPeriod", false)

                console.log(dataObj)

                /*Store data into database*/
                const responseStoreSubscription = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}subscription/add`, {
                    method: 'POST',
                    headers: {"Access-Token": custom_param[3]}, /*need to be change*/
                    body: sentFormData
                }).then((r) => {
                    return r.json()
                });

                if (responseStoreSubscription.status) {
                    console.log(responseStoreSubscription)
                    res.status(200).json({success: true,message:"Data process successfully."});
                }
            }
        }
    } catch (error) {
        console.error('Error verifying webhook:', error);
    }

    res.status(200).end();
}