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
exports.LoadPyodide = LoadPyodide;
const node_path_1 = require("node:path");
const node_vm_1 = require("node:vm");
let pyodideInstance;
async function LoadPyodide(packageCacheDir) {
    if (pyodideInstance === undefined) {
        const { loadPyodide } = await Promise.resolve().then(() => __importStar(require('pyodide')));
        const { XMLHttpRequest } = await Promise.resolve().then(() => __importStar(require('xmlhttprequest-ssl')));
        const indexURL = (0, node_path_1.dirname)(require.resolve('pyodide'));
        const context = (0, node_vm_1.createContext)({
            loadPyodide,
            indexURL,
            packageCacheDir,
            jsglobals: {
                console,
                fetch,
                AbortController,
                AbortSignal,
                Object,
                XMLHttpRequest,
            },
        });
        pyodideInstance = (await (0, node_vm_1.runInContext)('loadPyodide({ indexURL, packageCacheDir, jsglobals })', context));
        await pyodideInstance.runPythonAsync(`
import os

def blocked_function(*args, **kwargs):
    raise RuntimeError("Blocked for security reasons")

os.system = blocked_function

from importlib.abc import MetaPathFinder
from importlib.machinery import ModuleSpec
from types import ModuleType
from typing import Sequence, Optional

from _pyodide_core import jsproxy_typedict
from js import Object

Object.constructor.constructor = blocked_function

import sys
class blocked_module:
    def __getattr__(self, name):
        blocked_function()

sys.modules['js'] = blocked_module()
`);
    }
    return pyodideInstance;
}
//# sourceMappingURL=Pyodide.js.map