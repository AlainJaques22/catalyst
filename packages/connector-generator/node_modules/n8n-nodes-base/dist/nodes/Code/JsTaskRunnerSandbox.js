"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsTaskRunnerSandbox = void 0;
const JsCodeValidator_1 = require("./JsCodeValidator");
const result_validation_1 = require("./result-validation");
const throw_execution_error_1 = require("./throw-execution-error");
const JS_TEXT_KEYS = {
    object: { singular: 'object', plural: 'objects' },
};
/**
 * JS Code execution sandbox that executes the JS code using task runner.
 */
class JsTaskRunnerSandbox {
    jsCode;
    nodeMode;
    workflowMode;
    executeFunctions;
    chunkSize;
    additionalProperties;
    constructor(jsCode, nodeMode, workflowMode, executeFunctions, chunkSize = 1000, additionalProperties = {}) {
        this.jsCode = jsCode;
        this.nodeMode = nodeMode;
        this.workflowMode = workflowMode;
        this.executeFunctions = executeFunctions;
        this.chunkSize = chunkSize;
        this.additionalProperties = additionalProperties;
    }
    async runCodeAllItems() {
        const itemIndex = 0;
        const executionResult = await this.executeFunctions.startJob('javascript', {
            code: this.jsCode,
            nodeMode: this.nodeMode,
            workflowMode: this.workflowMode,
            continueOnFail: this.executeFunctions.continueOnFail(),
            additionalProperties: this.additionalProperties,
        }, itemIndex);
        if (!executionResult.ok) {
            (0, throw_execution_error_1.throwExecutionError)('error' in executionResult ? executionResult.error : {});
        }
        return (0, result_validation_1.validateRunCodeAllItems)(executionResult.result, JS_TEXT_KEYS, this.executeFunctions.helpers.normalizeItems.bind(this.executeFunctions.helpers));
    }
    async runCodeForTool() {
        const itemIndex = 0;
        const executionResult = await this.executeFunctions.startJob('javascript', {
            code: this.jsCode,
            nodeMode: this.nodeMode,
            workflowMode: this.workflowMode,
            continueOnFail: this.executeFunctions.continueOnFail(),
            additionalProperties: this.additionalProperties,
        }, itemIndex);
        if (!executionResult.ok) {
            (0, throw_execution_error_1.throwExecutionError)('error' in executionResult ? executionResult.error : {});
        }
        return executionResult.result;
    }
    async runCodeForEachItem(numInputItems) {
        (0, JsCodeValidator_1.validateNoDisallowedMethodsInRunForEach)(this.jsCode, 0);
        const itemIndex = 0;
        const chunks = this.chunkInputItems(numInputItems);
        let executionResults = [];
        for (const chunk of chunks) {
            const executionResult = await this.executeFunctions.startJob('javascript', {
                code: this.jsCode,
                nodeMode: this.nodeMode,
                workflowMode: this.workflowMode,
                continueOnFail: this.executeFunctions.continueOnFail(),
                chunk: {
                    startIndex: chunk.startIdx,
                    count: chunk.count,
                },
                additionalProperties: this.additionalProperties,
            }, itemIndex);
            if (!executionResult.ok) {
                return (0, throw_execution_error_1.throwExecutionError)('error' in executionResult ? executionResult.error : {});
            }
            for (let i = 0; i < executionResult.result.length; i++) {
                const actualItemIndex = chunk.startIdx + i;
                const validatedItem = (0, result_validation_1.validateRunCodeEachItem)(executionResult.result[i], actualItemIndex, JS_TEXT_KEYS, this.executeFunctions.helpers.normalizeItems.bind(this.executeFunctions.helpers));
                executionResult.result[i] = validatedItem;
            }
            executionResults = executionResults.concat(executionResult.result);
        }
        return executionResults;
    }
    /** Chunks the input items into chunks of 1000 items each */
    chunkInputItems(numInputItems) {
        const numChunks = Math.ceil(numInputItems / this.chunkSize);
        const chunks = [];
        for (let i = 0; i < numChunks; i++) {
            const startIdx = i * this.chunkSize;
            const isLastChunk = i === numChunks - 1;
            const count = isLastChunk ? numInputItems - startIdx : this.chunkSize;
            chunks.push({
                startIdx,
                count,
            });
        }
        return chunks;
    }
}
exports.JsTaskRunnerSandbox = JsTaskRunnerSandbox;
//# sourceMappingURL=JsTaskRunnerSandbox.js.map