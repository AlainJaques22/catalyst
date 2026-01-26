"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const get = __importStar(require("./get.operation"));
const getAll = __importStar(require("./getAll.operation"));
const utils_1 = require("../../helpers/utils");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['list'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve details of a single list',
                routing: {
                    request: {
                        ignoreHttpStatusErrors: true,
                        method: 'GET',
                        url: '=/sites/{{ $parameter["site"] }}/lists/{{ $parameter["list"] }}',
                    },
                    output: {
                        postReceive: [utils_1.handleErrorPostReceive, utils_1.simplifyListPostReceive],
                    },
                },
                action: 'Get list',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Retrieve a list of lists',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/sites/{{ $parameter["site"] }}/lists',
                    },
                    output: {
                        postReceive: [
                            utils_1.handleErrorPostReceive,
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'value',
                                },
                            },
                            utils_1.simplifyListPostReceive,
                        ],
                    },
                },
                action: 'Get many lists',
            },
        ],
        default: 'getAll',
    },
    ...get.description,
    ...getAll.description,
];
//# sourceMappingURL=List.resource.js.map