import { type MqttClient } from 'mqtt';
interface BaseMqttCredential {
    protocol: 'mqtt' | 'mqtts' | 'ws';
    host: string;
    port: number;
    username: string;
    password: string;
    clean: boolean;
    clientId: string;
    passwordless?: boolean;
}
type NonSslMqttCredential = BaseMqttCredential & {
    ssl: false;
};
type SslMqttCredential = BaseMqttCredential & {
    ssl: true;
    ca: string;
    cert: string;
    key: string;
    rejectUnauthorized?: boolean;
};
export type MqttCredential = NonSslMqttCredential | SslMqttCredential;
export declare const createClient: (credentials: MqttCredential) => Promise<MqttClient>;
export {};
//# sourceMappingURL=GenericFunctions.d.ts.map