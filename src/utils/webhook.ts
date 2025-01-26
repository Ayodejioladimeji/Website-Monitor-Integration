import axios from "axios";

/* eslint-disable */

export const sendWebhookNotification = async (webhookUrl: string, payload: any) => {
    try {
        await axios.post(webhookUrl, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Failed to send webhook:", error);
    }
};
