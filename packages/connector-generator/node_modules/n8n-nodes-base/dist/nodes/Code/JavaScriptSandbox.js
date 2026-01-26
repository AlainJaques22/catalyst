"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptSandbox = exports.vmResolver = void 0;
const vm2_1 = require("vm2");
const ExecutionError_1 = require("./ExecutionError");
const JsCodeValidator_1 = require("./JsCodeValidator");
const Sandbox_1 = require("./Sandbox");
const ValidationError_1 = require("./ValidationError");
const { NODE_FUNCTION_ALLOW_BUILTIN: builtIn, NODE_FUNCTION_ALLOW_EXTERNAL: external } = process.env;
exports.vmResolver = (0, vm2_1.makeResolverFromLegacyOptions)({
    external: external
        ? {
            modules: external.split(','),
            transitive: false,
        }
        : false,
    builtin: builtIn?.split(',') ?? [],
});
class JavaScriptSandbox extends Sandbox_1.Sandbox {
    jsCode;
    vm;
    constructor(context, jsCode, helpers, options) {
        super({
            object: {
                singular: 'object',
                plural: 'objects',
            },
        }, helpers);
        this.jsCode = jsCode;
        this.vm = new vm2_1.NodeVM({
            console: 'redirect',
            sandbox: context,
            require: options?.resolver ?? exports.vmResolver,
            wasm: false,
        });
        this.vm.on('console.log', (...args) => this.emit('output', ...args));
    }
    async runCode() {
        const script = `module.exports = async function() {${this.jsCode}\n}()`;
        try {
            const executionResult = (await this.vm.run(script, __dirname));
            return executionResult;
        }
        catch (error) {
            throw new ExecutionError_1.ExecutionError(error);
        }
    }
    async runCodeAllItems(options) {
        const script = `module.exports = async function() {${this.jsCode}\n}()`;
        let executionResult;
        try {
            executionResult = await this.vm.run(script, __dirname);
        }
        catch (error) {
            // anticipate user expecting `items` to pre-exist as in Function Item node
            (0, JsCodeValidator_1.mapItemsNotDefinedErrorIfNeededForRunForAll)(this.jsCode, error);
            throw new ExecutionError_1.ExecutionError(error);
        }
        if (executionResult === null)
            return [];
        if (options?.multiOutput === true) {
            // Check if executionResult is an array of arrays
            if (!Array.isArray(executionResult) || executionResult.some((item) => !Array.isArray(item))) {
                throw new ValidationError_1.ValidationError({
                    message: "The code doesn't return an array of arrays",
                    description: 'Please return an array of arrays. One array for the different outputs and one for the different items that get returned.',
                });
            }
            return executionResult.map((data) => {
                return this.validateRunCodeAllItems(data);
            });
        }
        return this.validateRunCodeAllItems(executionResult);
    }
    async runCodeEachItem(itemIndex) {
        const script = `module.exports = async function() {${this.jsCode}\n}()`;
        (0, JsCodeValidator_1.validateNoDisallowedMethodsInRunForEach)(this.jsCode, itemIndex);
        let executionResult;
        try {
            executionResult = await this.vm.run(script, __dirname);
        }
        catch (error) {
            // anticipate user expecting `item` to pre-exist as in Function Item node
            (0, JsCodeValidator_1.mapItemNotDefinedErrorIfNeededForRunForEach)(this.jsCode, error);
            throw new ExecutionError_1.ExecutionError(error, itemIndex);
        }
        if (executionResult === null)
            return undefined;
        return this.validateRunCodeEachItem(executionResult, itemIndex);
    }
}
exports.JavaScriptSandbox = JavaScriptSandbox;
//# sourceMappingURL=JavaScriptSandbox.js.map