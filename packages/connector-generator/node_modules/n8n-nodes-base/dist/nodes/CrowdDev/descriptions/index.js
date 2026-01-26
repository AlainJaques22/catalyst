"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allProperties = void 0;
const activityFields_1 = require("./activityFields");
const automationFields_1 = require("./automationFields");
const memberFields_1 = require("./memberFields");
const noteFields_1 = require("./noteFields");
const organizationFields_1 = require("./organizationFields");
const resources_1 = require("./resources");
const taskFields_1 = require("./taskFields");
exports.allProperties = [
    resources_1.resources,
    activityFields_1.activityOperations,
    memberFields_1.memberOperations,
    noteFields_1.noteOperations,
    organizationFields_1.organizationOperations,
    taskFields_1.taskOperations,
    automationFields_1.automationOperations,
    ...activityFields_1.activityFields,
    ...memberFields_1.memberFields,
    ...noteFields_1.noteFields,
    ...organizationFields_1.organizationFields,
    ...taskFields_1.taskFields,
    ...automationFields_1.automationFields,
];
//# sourceMappingURL=index.js.map