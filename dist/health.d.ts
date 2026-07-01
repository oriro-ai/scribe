interface Health {
    lastWriteAt?: string;
    faultCount: number;
    lastFault?: string;
}
/** Heartbeat: a successful write happened just now. */
export declare function recordHealth(): void;
/** Medic: append a fault to the durable fault log and bump the count. Never throws. */
export declare function recordFault(role: string, err: unknown): void;
export declare function readHealth(): Health;
export {};
//# sourceMappingURL=health.d.ts.map