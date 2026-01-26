"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPresend = activityPresend;
exports.automationPresend = automationPresend;
exports.memberPresend = memberPresend;
exports.notePresend = notePresend;
exports.organizationPresend = organizationPresend;
exports.taskPresend = taskPresend;
const addOptName = 'additionalOptions';
const getAllParams = (execFns) => {
    const params = execFns.getNode().parameters;
    const keys = Object.keys(params);
    const paramsWithValues = keys
        .filter((i) => i !== addOptName)
        .map((name) => [name, execFns.getNodeParameter(name)]);
    const paramsWithValuesObj = Object.fromEntries(paramsWithValues);
    if (keys.includes(addOptName)) {
        const additionalOptions = execFns.getNodeParameter(addOptName);
        return Object.assign(paramsWithValuesObj, additionalOptions);
    }
    return paramsWithValuesObj;
};
const formatParams = (obj, filters, mappers) => {
    return Object.fromEntries(Object.entries(obj)
        .filter(([name, value]) => !filters || (name in filters ? filters[name](value) : false))
        .map(([name, value]) => !mappers || !(name in mappers) ? [name, value] : [name, mappers[name](value)]));
};
const objectFromProps = (src, props) => {
    const result = props.filter((p) => src.hasOwnProperty(p)).map((p) => [p, src[p]]);
    return Object.fromEntries(result);
};
const idFn = (i) => i;
const keyValueToObj = (arr) => {
    const obj = {};
    arr.forEach((item) => {
        obj[item.key] = item.value;
    });
    return obj;
};
const transformSingleProp = (prop) => (values) => (values.itemChoice || []).map((i) => i[prop]);
async function activityPresend(opts) {
    const params = getAllParams(this);
    const isCreateWithMember = params.operation === 'createWithMember';
    const isCreateForMember = params.operation === 'createForMember';
    if (isCreateWithMember) {
        // Move following props into "member" subproperty
        const memberProps = ['displayName', 'emails', 'joinedAt', 'username'];
        params.member = objectFromProps(params, memberProps);
        memberProps.forEach((p) => delete params[p]);
    }
    opts.body = formatParams(params, {
        member: (v) => (isCreateWithMember || isCreateForMember) && v,
        type: idFn,
        timestamp: idFn,
        platform: idFn,
        title: idFn,
        body: idFn,
        channel: idFn,
        sourceId: idFn,
        sourceParentId: idFn,
    }, {
        member: (v) => typeof v === 'object'
            ? formatParams(v, {
                username: (un) => un.itemChoice,
                displayName: idFn,
                emails: idFn,
                joinedAt: idFn,
            }, {
                username: (un) => keyValueToObj(un.itemChoice),
                emails: transformSingleProp('email'),
            })
            : v,
    });
    return opts;
}
async function automationPresend(opts) {
    const params = getAllParams(this);
    opts.body = {
        data: {
            settings: {
                url: params.url,
            },
            type: 'webhook',
            trigger: params.trigger,
        },
    };
    return opts;
}
async function memberPresend(opts) {
    const params = getAllParams(this);
    opts.body = formatParams(params, {
        platform: idFn,
        username: idFn,
        displayName: idFn,
        emails: (i) => i.itemChoice,
        joinedAt: idFn,
        organizations: (i) => i.itemChoice,
        tags: (i) => i.itemChoice,
        tasks: (i) => i.itemChoice,
        notes: (i) => i.itemChoice,
        activities: (i) => i.itemChoice,
    }, {
        emails: transformSingleProp('email'),
        organizations: (i) => i.itemChoice.map((org) => formatParams(org, {
            name: idFn,
            url: idFn,
            description: idFn,
            logo: idFn,
            employees: idFn,
            members: (j) => j.itemChoice,
        }, {
            members: transformSingleProp('member'),
        })),
        tags: transformSingleProp('tag'),
        tasks: transformSingleProp('task'),
        notes: transformSingleProp('note'),
        activities: transformSingleProp('activity'),
    });
    return opts;
}
async function notePresend(opts) {
    const params = getAllParams(this);
    opts.body = {
        body: params.body,
    };
    return opts;
}
async function organizationPresend(opts) {
    const params = getAllParams(this);
    opts.body = formatParams(params, {
        name: idFn,
        url: idFn,
        description: idFn,
        logo: idFn,
        employees: idFn,
        members: (j) => j.itemChoice,
    }, {
        members: transformSingleProp('member'),
    });
    return opts;
}
async function taskPresend(opts) {
    const params = getAllParams(this);
    opts.body = formatParams(params, {
        name: idFn,
        body: idFn,
        status: idFn,
        members: (i) => i.itemChoice,
        activities: (i) => i.itemChoice,
        assigneess: idFn,
    }, {
        members: transformSingleProp('member'),
        activities: transformSingleProp('activity'),
    });
    return opts;
}
//# sourceMappingURL=GenericFunctions.js.map