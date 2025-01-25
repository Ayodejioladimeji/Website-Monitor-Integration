import axios from "axios";
import { MonitorSettings } from "@/types/settings";
import { sendWebhookNotification } from "@/utils/webhook";

export const monitorWebsite = async (settings: MonitorSettings) => {
    try {
        const response = await axios.get(settings.url, {
            headers: {
                "User-Agent": settings.userAgent || "WebsiteMonitorBot/1.0",
            },
        });

        if (settings.trackResponseTime) {
            console.log(`Response Time: ${response.headers['request-duration']}ms`);
        }

        if (settings.notifyOnErrors.includes(response.status)) {
            await sendWebhookNotification(settings.webhookUrl, {
                username:"Admin",
                event_name: `${response.statusText} ${response.statusText} ${response.config.headers['User-Agent']}`,
                message: `Error detected on ${settings.url} ${new Date().toISOString() }`,
                status: "error",
            });
        }
        // else{
        //     await sendWebhookNotification(settings.webhookUrl, {
        //         username: "Admin",
        //         event_name: `${response.statusText} ${response.statusText} ${response.config.headers['User-Agent']}`,
        //         message: `Success ${settings.url} ${new Date().toISOString()}`,
        //         status: "success",
        //     });
        // }

        if (settings.trackSSL) {
            const sslExpiry = response.headers["ssl-expiry"];
            if (sslExpiry) {
                const expiryDate = new Date(sslExpiry);
                const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                if (daysLeft < 14) {
                    await sendWebhookNotification(settings.webhookUrl, {
                        username:'Admin',
                        event_name: "SSL Certificate",
                        message: `SSL Certificate for ${settings.url} is expiring soon. ${expiryDate.toISOString() }`,
                        status:'error',
                    });
                }
            }
        }

        if (settings.contentHash) {
            const newContentHash = hashContent(response.data);
            if (settings.contentHash !== newContentHash) {
                await sendWebhookNotification(settings.webhookUrl, {
                    username:"Admin",
                    event_name:"Content Change",
                    message: `Content change detected on ${settings.url} ${new Date().toISOString() }`,
                    status:"error"
                });
            }
        }

    } catch (error: any) {
        if (error.response) {
            await sendWebhookNotification(settings.webhookUrl, {
                username:"Admin",
                event_name: error.response.data || error.message,
                message: `Website down: ${settings.url} ${new Date().toISOString()}`,
                status: "error"
            });
        } else {
            console.error("Error:", error.message);
        }
    }
};

const hashContent = (content: string): string => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash;
    }
    return hash.toString();
};
