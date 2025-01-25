import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { monitorWebsite } from "@/lib/monitor";
import { MonitorSettings } from "@/types/settings";

const cors = Cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
});

// Middleware function to run CORS
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

    if (req.method === "POST") {
        try {
            const settings: MonitorSettings = req.body;
            console.log(settings)
            
            if (!settings.url || !settings.url || !settings.checkInterval) {
                return res.status(400).json({ error: "Missing required settings" });
            }
            

            await monitorWebsite(settings);

            return res.status(200).json({ message: "Monitoring started successfully." });
        } catch (error) {
            console.error("Error starting monitor:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
