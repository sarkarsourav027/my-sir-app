import checkoutNodeJssdk from '@paypal/checkout-server-sdk'

const API = {
    SANDBOX : 'https://api.sandbox.paypal.com',
    LIVE : 'https://api.paypal.com',
    SANDBOX_WEB_URL : 'https://www.sandbox.paypal.com',
    LIVE_WEB_URL : 'https://www.paypal.com'
}

const paypalBaseUrl = process.env.PAYPAL_MODE === 'production' ? API.LIVE : API.SANDBOX
const configureEnvironment = function () {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    return process.env.PAYPAL_MODE === 'production'
        ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
        : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
}

const client = function () {
    return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment())
}

const generateToken = async () =>{

    let myHeaders = new Headers();
    const encodedCredentials = btoa(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${encodedCredentials}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, requestOptions)
        .then((res) => {return res.json()});
    return response;
}

const listTransactionsForSubscription = async (transactionId,start_time,end_time) => {

    const token =  await generateToken()
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token.access_token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const response = await fetch(`${paypalBaseUrl}/v1/billing/subscriptions/${transactionId}/transactions?start_time=${start_time}&end_time=${end_time}`, requestOptions)
        .then((res) => {return res.json()} );
    return response;
}
const webhookSignatureVerification = async (params) =>{
    const {webhook_id,transmission_id,transmission_time,cert_url,auth_algo,transmission_sig,webhook_event} = params
    const token =  await generateToken()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token.access_token}`);

    const raw = JSON.stringify({
        "webhook_id": webhook_id,
        "transmission_id": transmission_id,
        "transmission_time": transmission_time,
        "cert_url": cert_url,
        "auth_algo": auth_algo,
        "transmission_sig": transmission_sig,
        "webhook_event": webhook_event
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(`${paypalBaseUrl}/v1/notifications/verify-webhook-signature`, requestOptions)
        .then((res) => {return res.json()})
}
const getSubscriptionExpirationDate = async (subscriptionType,dateTime) =>{

    let subscriptionExpirationDate;

    switch(subscriptionType) {
        case "monthly":
            const currentDate = new Date(dateTime);
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(currentDate.getMonth() + 1)
            subscriptionExpirationDate = nextMonth.toISOString()
            break;
        case 'yearly':
            subscriptionExpirationDate = new Date(new Date(dateTime).setFullYear(new Date().getFullYear() + 1))
            break;
        case 'lifetime':
            subscriptionExpirationDate = new Date(new Date(dateTime).setFullYear(new Date().getFullYear() + 100))
            break;
        default:
        // code block
    }
    return subscriptionExpirationDate.toISOString()
}
export default client
export {API,generateToken,listTransactionsForSubscription,webhookSignatureVerification,getSubscriptionExpirationDate}