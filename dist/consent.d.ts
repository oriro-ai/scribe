interface ScribeConsent {
    enabled: boolean;
    consentedAt?: string;
}
/** True only if the user explicitly enabled the scribe. Default off. Never throws. */
export declare function isScribeEnabled(): boolean;
/** Record the user's choice. Returns the stored state. */
export declare function setScribeConsent(enabled: boolean): ScribeConsent;
/** True once the user has been asked (consent file exists), regardless of choice. */
export declare function hasScribeChoice(): boolean;
export {};
//# sourceMappingURL=consent.d.ts.map