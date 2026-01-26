"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orbit = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const ActivityDescription_1 = require("./ActivityDescription");
const MemberDescription_1 = require("./MemberDescription");
const NoteDescription_1 = require("./NoteDescription");
const PostDescription_1 = require("./PostDescription");
class Orbit {
    description = {
        displayName: 'Orbit',
        name: 'orbit',
        icon: { light: 'file:orbit.svg', dark: 'file:orbit.dark.svg' },
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Orbit API',
        hidden: true,
        defaults: {
            name: 'Orbit',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'orbitApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Orbit has been shutdown and will no longer function from July 11th, You can read more <a target="_blank" href="https://orbit.love/blog/orbit-is-joining-postman">here</a>.',
                name: 'deprecated',
                type: 'notice',
                default: '',
            },
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Activity',
                        value: 'activity',
                    },
                    {
                        name: 'Member',
                        value: 'member',
                    },
                    {
                        name: 'Note',
                        value: 'note',
                    },
                    {
                        name: 'Post',
                        value: 'post',
                    },
                ],
                default: 'member',
            },
            // ACTIVITY
            ...ActivityDescription_1.activityOperations,
            ...ActivityDescription_1.activityFields,
            // MEMBER
            ...MemberDescription_1.memberOperations,
            ...MemberDescription_1.memberFields,
            // NOTE
            ...NoteDescription_1.noteOperations,
            ...NoteDescription_1.noteFields,
            // POST
            ...PostDescription_1.postOperations,
            ...PostDescription_1.postFields,
        ],
    };
    methods = {
        loadOptions: {
            async getWorkspaces() {
                return [{ name: 'Deprecated', value: 'Deprecated' }];
            },
            async getActivityTypes() {
                return [{ name: 'Deprecated', value: 'Deprecated' }];
            },
        },
    };
    async execute() {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: 'Service is deprecated, From July 11th Orbit will no longer function.',
            level: 'warning',
        });
    }
}
exports.Orbit = Orbit;
//# sourceMappingURL=Orbit.node.js.map