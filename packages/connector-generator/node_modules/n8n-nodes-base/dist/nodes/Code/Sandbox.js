"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandbox = void 0;
exports.getSandboxContext = getSandboxContext;
const events_1 = require("events");
const result_validation_1 = require("./result-validation");
function getSandboxContext(index) {
    const helpers = {
        ...this.helpers,
        httpRequestWithAuthentication: this.helpers.httpRequestWithAuthentication.bind(this),
        requestWithAuthenticationPaginated: this.helpers.requestWithAuthenticationPaginated.bind(this),
    };
    return {
        // from NodeExecuteFunctions
        $getNodeParameter: this.getNodeParameter.bind(this),
        $getWorkflowStaticData: this.getWorkflowStaticData.bind(this),
        helpers,
        // to bring in all $-prefixed vars and methods from WorkflowDataProxy
        // $node, $items(), $parameter, $json, $env, etc.
        ...this.getWorkflowDataProxy(index),
    };
}
class Sandbox extends events_1.EventEmitter {
    textKeys;
    helpers;
    constructor(textKeys, helpers) {
        super();
        this.textKeys = textKeys;
        this.helpers = helpers;
    }
    validateRunCodeEachItem(executionResult, itemIndex) {
        return (0, result_validation_1.validateRunCodeEachItem)(executionResult, itemIndex, this.textKeys, this.helpers.normalizeItems.bind(this.helpers));
    }
    validateRunCodeAllItems(executionResult) {
        return (0, result_validation_1.validateRunCodeAllItems)(executionResult, this.textKeys, this.helpers.normalizeItems.bind(this.helpers));
    }
}
exports.Sandbox = Sandbox;
//# sourceMappingURL=Sandbox.js.map