import axios from "axios";

export const sendWebhookNotification = async (webhookUrl: string, payload: any) => {
    try {
        await axios.post(webhookUrl, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Webhook sent successfully");
    } catch (error) {
        console.error("Failed to send webhook:", error);
    }
};
