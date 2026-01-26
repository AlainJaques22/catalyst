export declare const TLPs: {
    white: number;
    green: number;
    amber: number;
    red: number;
};
export type TLP = (typeof TLPs)[keyof typeof TLPs];
export type QueryScope = {
    query: string;
    id?: string;
    restrictTo?: string;
};
//# sourceMappingURL=interfaces.d.ts.map