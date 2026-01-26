export declare const getLightsResponse: {
    '1': {
        state: {
            on: boolean;
            bri: number;
            hue: number;
            sat: number;
            effect: string;
            xy: number[];
            ct: number;
            alert: string;
            colormode: string;
            mode: string;
            reachable: boolean;
        };
        swupdate: {
            state: string;
            lastinstall: string;
        };
        type: string;
        name: string;
        modelid: string;
        manufacturername: string;
        productname: string;
        capabilities: {
            certified: boolean;
            control: {
                mindimlevel: number;
                maxlumen: number;
                colorgamuttype: string;
                colorgamut: number[][];
                ct: {
                    min: number;
                    max: number;
                };
            };
            streaming: {
                renderer: boolean;
                proxy: boolean;
            };
        };
        config: {
            archetype: string;
            function: string;
            direction: string;
        };
        uniqueid: string;
        swversion: string;
    };
};
export declare const getConfigResponse: {
    name: string;
    zigbeechannel: number;
    mac: string;
    dhcp: boolean;
    ipaddress: string;
    netmask: string;
    gateway: string;
    proxyaddress: string;
    proxyport: number;
    UTC: string;
    localtime: string;
    timezone: string;
    whitelist: {
        ffffffffe0341b1b376a2389376a2389: {
            'last use date': string;
            'create date': string;
            name: string;
        };
        pAtwdCV8NZId25Gk: {
            'last use date': string;
            'create date': string;
            name: string;
        };
    };
    swversion: string;
    apiversion: string;
    swupdate: {
        updatestate: number;
        url: string;
        text: string;
        notify: boolean;
    };
    linkbutton: boolean;
    portalservices: boolean;
    portalconnection: string;
    portalstate: {
        signedon: boolean;
        incoming: boolean;
        outgoing: boolean;
        communication: string;
    };
};
export declare const updateLightResponse: ({
    success: {
        '/lights/1/state/bri': number;
        '/lights/1/state/on'?: undefined;
        '/lights/1/state/hue'?: undefined;
    };
} | {
    success: {
        '/lights/1/state/on': boolean;
        '/lights/1/state/bri'?: undefined;
        '/lights/1/state/hue'?: undefined;
    };
} | {
    success: {
        '/lights/1/state/hue': number;
        '/lights/1/state/bri'?: undefined;
        '/lights/1/state/on'?: undefined;
    };
})[];
export declare const deleteLightResponse: {
    success: string;
};
//# sourceMappingURL=apiResponses.d.ts.map