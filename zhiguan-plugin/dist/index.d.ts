export interface ZhiguanConfig {
    database?: {
        type: "sqlite" | "postgres";
        connection?: string;
    };
    content?: {
        path?: string;
        cdnUrl?: string;
    };
    features?: {
        wearable?: boolean;
        eeg?: boolean;
        vr?: boolean;
        analytics?: boolean;
    };
}
declare const plugin: {
    id: string;
    name: string;
    description: string;
    version: string;
    register(api: any): Promise<void>;
};
export default plugin;
//# sourceMappingURL=index.d.ts.map