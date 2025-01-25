export interface MonitorSettings {
    url: string;
    checkInterval: number;
    webhookUrl: string;
    notifyOnErrors: number[];
    trackSSL: boolean;
    trackResponseTime: boolean;
    contentHash?: string; 
    userAgent?: string;
}
