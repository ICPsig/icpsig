export declare const notify: ({ network, triggerName, args }: {
    network: string;
    triggerName: string;
    args: any;
}) => Promise<{
    message: string;
    error?: undefined;
} | {
    error: any;
    message?: undefined;
} | undefined>;
