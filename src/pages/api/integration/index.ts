import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

const cors = Cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://telex.im",
        "https://staging.telex.im",
    ],
    methods: ["GET"],
});

/* eslint-disable */

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);

    if (req.method === "GET") {
        return res.status(200).json({
            data: {
                date: {
                    created_at: "2025-01-26",
                    updated_at: "2025-01-26",
                },
                description: {
                    app_name: "Website Monitor",
                    app_description: "Monitors website uptime, SSL, and detects errors.",
                    app_logo: "https://res.cloudinary.com/devsource/image/upload/v1737921448/energy-monitoring-icon-vectoreditable-strokelinear-260nw-2555258609_ztkh89.webp",
                    app_url: "https://website-monitor.vercel.app/api/integration",
                    background_color: "#ffffff",
                },
                key_features: [
                    "Monitor website uptime and send alerts for downtime.",
                    "Detect common HTTP errors (400, 401, 403,404, 500, 501, 503 etc.).",
                    "Monitor SSL certificate expiration and notify before expiry.",
                    "Track website response time for performance monitoring.",
                    "Detect unexpected content changes on the website.",
                    "Provide detailed error messages such as 400 'Invalid Request'.",
                    "Log user agent and request details for audit purposes.",
                ],
                permissions: {
                    events: [
                        "Send webhook alerts for downtime and errors.",
                        "Allow tracking of response times and SSL expiration.",
                        "Monitor website content changes and alert on discrepancies.",
                    ],
                },
                author: "Your Company",
                website: "https://website-monitor.vercel.app",
                settings: [
                    {
                        label: "websiteUrl",
                        type: "text",
                        description: "Enter the website URL to monitor.",
                        required: true,
                        default: "https://example.com",
                    },
                    {
                        label: "webhookUrl",
                        type: "text",
                        description: "Enter the webhook URL to receive alerts.",
                        required: true,
                        default: "https://webhook.site/sample",
                    },
                    {
                        label: "checkInterval",
                        type: "number",
                        description: "Monitoring interval in minutes.",
                        required: true,
                        default: 5,
                    },
                    {
                        label: "alertOnError",
                        type: "checkbox",
                        description: "Enable alerts for website errors.",
                        required: false,
                        default: true,
                    },
                    {
                        label: "sslCheck",
                        type: "checkbox",
                        description: "Monitor SSL certificate expiration.",
                        required: false,
                        default: true,
                    },
                    {
                        label: "responseTimeTracking",
                        type: "checkbox",
                        description: "Enable response time tracking.",
                        required: false,
                        default: true,
                    },
                    {
                        label: "contentChangeDetection",
                        type: "checkbox",
                        description: "Detect unexpected content changes.",
                        required: false,
                        default: false,
                    },
                    {
                        label: "errorDetails",
                        type: "checkbox",
                        description: "Return detailed error messages.",
                        required: false,
                        default: true,
                    },
                    {
                        label: "userAgentTracking",
                        type: "checkbox",
                        description: "Track user agent and request information.",
                        required: false,
                        default: true,
                    },
                ],
                target_url: "https://website-monitor.vercel.app/api/monitor",
            },
        });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
