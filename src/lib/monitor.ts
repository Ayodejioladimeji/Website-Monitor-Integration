import axios from "axios";
import { MonitorSettings } from "@/types/settings";
import { sendWebhookNotification } from "@/utils/webhook";

/* eslint-disable */

export const monitorWebsite = async (settings: MonitorSettings) => {
    try {
        // Track response time manually
        const startTime = Date.now();

        const response = await axios.get(settings.url, {
            headers: {
                "User-Agent": settings.userAgent || "WebsiteMonitorBot/1.0",
            },
            timeout: 10000,  
            validateStatus: () => true,
        });

        const responseTime = Date.now() - startTime;

        // Log response time
        if (settings.trackResponseTime) {
            console.log(`Response Time: ${responseTime}ms`);
        }

        // Handle error status codes based on settings
        if (settings.notifyOnErrors.includes(response.status)) {
            await sendWebhookNotification(settings.webhookUrl, {
                username: "Admin",
                event_name: `HTTP ${response.status} - ${response.statusText} - ${responseTime}ms`,
                message: `Error detected on ${settings.url} at ${new Date().toISOString()}`,
                status: "error",
                userAgent: settings.userAgent,
            });
        }

        // SSL certificate monitoring
        if (settings.trackSSL) {
            const sslExpiry = response.headers["ssl-expiry"];
            if (sslExpiry) {
                const expiryDate = new Date(sslExpiry);
                const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                if (daysLeft < 14) {
                    await sendWebhookNotification(settings.webhookUrl, {
                        username: "Admin",
                        event_name: `SSL Certificate Expiry - ${responseTime}ms`,
                        message: `SSL Certificate for ${settings.url} is expiring in ${daysLeft} days (${expiryDate.toISOString()})`,
                        status: "warning",
                    });
                }
            }
        }

        // Detect content changes
        if (settings.contentHash) {
            const newContentHash = hashContent(response.data);
            if (settings.contentHash !== newContentHash) {
                await sendWebhookNotification(settings.webhookUrl, {
                    username: "Admin",
                    event_name: `Content Change Detected - ${responseTime}ms`,
                    message: `Content on ${settings.url} has changed at ${new Date().toISOString()}`,
                    status: "error",
                });
            }
        }

    } catch (error: any) {
        // Handle network failures and timeouts
        await sendWebhookNotification(settings.webhookUrl, {
            username: "Admin",
            event_name: "Website Down",
            message: `Website ${settings.url} is down. Reason: ${error.code || error.message} - ${new Date().toISOString()}`,
            status: "error"
        });

        console.error("Monitoring Error:", error.code || error.message);
    }
};

// Utility function to hash content
const hashContent = (content: string): string => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash;
    }
    return hash.toString();
};

// Function to start monitoring at intervals
export const startMonitoring = (settings: MonitorSettings) => {
    setInterval(async () => {
        // console.log(`Monitoring ${settings.url} every ${settings.checkInterval} seconds`);
      const res = await monitorWebsite(settings);
      console.log(res)
    }, settings.checkInterval * 1000);
};

// Call this function to start monitoring
startMonitoring({
    url: "https://app.wealthhat.com",
    checkInterval: 10,
    webhookUrl: "https://ping.telex.im/v1/webhooks/27668d32af45",
    notifyOnErrors: [200,400, 401, 404, 500],
    trackSSL: true,
    trackResponseTime: true,
    userAgent: "CustomMonitorBot/1.0",
});