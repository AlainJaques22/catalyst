"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonSandbox = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const Pyodide_1 = require("./Pyodide");
const Sandbox_1 = require("./Sandbox");
const envAccessBlocked = process.env.N8N_BLOCK_ENV_ACCESS_IN_NODE === 'true';
class PythonSandbox extends Sandbox_1.Sandbox {
    pythonCode;
    context;
    constructor(context, pythonCode, helpers) {
        super({
            object: {
                singular: 'dictionary',
                plural: 'dictionaries',
            },
        }, helpers);
        this.pythonCode = pythonCode;
        // Since python doesn't allow variable names starting with `$`,
        // rename them to all to start with `_` instead
        this.context = Object.keys(context).reduce((acc, key) => {
            acc[key.startsWith('$') ? key.replace(/^\$/, '_') : key] = context[key];
            return acc;
        }, {});
    }
    async runCode() {
        return await this.runCodeInPython();
    }
    async runCodeAllItems() {
        const executionResult = await this.runCodeInPython();
        return this.validateRunCodeAllItems(executionResult);
    }
    async runCodeEachItem(itemIndex) {
        const executionResult = await this.runCodeInPython();
        return this.validateRunCodeEachItem(executionResult, itemIndex);
    }
    async runCodeInPython() {
        const packageCacheDir = this.helpers.getStoragePath();
        const pyodide = await (0, Pyodide_1.LoadPyodide)(packageCacheDir);
        let executionResult;
        try {
            await pyodide.runPythonAsync('jsproxy_typedict[0] = type(Object.new().as_object_map())');
            await pyodide.loadPackagesFromImports(this.pythonCode);
            const dict = pyodide.globals.get('dict');
            const globalsDict = dict();
            for (const key of Object.keys(this.context)) {
                if ((key === '_env' && envAccessBlocked) || key === '_node')
                    continue;
                const value = this.context[key];
                globalsDict.set(key, value);
            }
            pyodide.setStdout({ batched: (str) => this.emit('output', str) });
            const runCode = `
async def __main():
${this.pythonCode
                .split('\n')
                .map((line) => '  ' + line)
                .join('\n')}
await __main()`;
            executionResult = await pyodide.runPythonAsync(runCode, { globals: globalsDict });
            globalsDict.destroy();
        }
        catch (error) {
            throw this.getPrettyError(error);
        }
        if (executionResult?.toJs) {
            return executionResult.toJs({
                dict_converter: Object.fromEntries,
                create_proxies: false,
            });
        }
        return executionResult;
    }
    getPrettyError(error) {
        const errorTypeIndex = error.message.indexOf(error.type);
        if (errorTypeIndex !== -1) {
            return new n8n_workflow_1.ApplicationError(error.message.slice(errorTypeIndex), {
                level: ['TypeError', 'AttributeError'].includes(error.type) ? 'warning' : 'error',
            });
        }
        return error;
    }
}
exports.PythonSandbox = PythonSandbox;
//# sourceMappingURL=PythonSandbox.js.map