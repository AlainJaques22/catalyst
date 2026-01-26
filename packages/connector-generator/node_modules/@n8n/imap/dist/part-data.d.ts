export declare abstract class PartData {
    readonly buffer: Buffer;
    constructor(buffer: Buffer);
    toString(): string;
    static fromData(data: string, encoding: string, charset?: string): PartData;
}
export declare class Base64PartData extends PartData {
    constructor(data: string);
}
export declare class QuotedPrintablePartData extends PartData {
    constructor(data: string, charset?: string);
}
export declare class SevenBitPartData extends PartData {
    constructor(data: string);
    toString(): string;
}
export declare class BinaryPartData extends PartData {
    readonly charset: string;
    constructor(data: string, charset?: string);
    toString(): string;
}
export declare class UuencodedPartData extends PartData {
    constructor(data: string);
}
