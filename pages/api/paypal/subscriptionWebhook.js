import client from 'utils/paypal'
import paypal from '@paypal/checkout-server-sdk'

export default async function Handler(req, res) {

    // return res.status(200).json({success: true, message: "Everything ook"})
    const headers = req.headers;
    const requestBody = req.body;

    try {
        // Verify the incoming webhook signature
        const signatureVerification = await paypal.webhooks.Event.verifyReceivedEvent(
            headers, requestBody, client
        );

        if (signatureVerification.statusCode === 200) {
            // Process the event data here
            const event = requestBody;
            console.log('Webhook event received:', event);
        } else {
            console.error('Webhook signature verification failed.');
        }
    } catch (error) {
        console.error('Error verifying webhook:', error);
    }

    res.status(200).end();
}