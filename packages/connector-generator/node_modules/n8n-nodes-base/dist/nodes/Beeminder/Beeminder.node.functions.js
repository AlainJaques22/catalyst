"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatapoint = createDatapoint;
exports.getAllDatapoints = getAllDatapoints;
exports.updateDatapoint = updateDatapoint;
exports.deleteDatapoint = deleteDatapoint;
exports.createCharge = createCharge;
exports.uncleGoal = uncleGoal;
exports.createAllDatapoints = createAllDatapoints;
exports.getSingleDatapoint = getSingleDatapoint;
exports.getGoal = getGoal;
exports.getAllGoals = getAllGoals;
exports.getArchivedGoals = getArchivedGoals;
exports.createGoal = createGoal;
exports.updateGoal = updateGoal;
exports.refreshGoal = refreshGoal;
exports.shortCircuitGoal = shortCircuitGoal;
exports.stepDownGoal = stepDownGoal;
exports.cancelStepDownGoal = cancelStepDownGoal;
exports.getUser = getUser;
const GenericFunctions_1 = require("./GenericFunctions");
async function createDatapoint(data) {
    const endpoint = `/users/me/goals/${data.goalName}/datapoints.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'POST', endpoint, data, {});
}
async function getAllDatapoints(data) {
    const endpoint = `/users/me/goals/${data.goalName}/datapoints.json`;
    if (data.count !== undefined) {
        return await GenericFunctions_1.beeminderApiRequest.call(this, 'GET', endpoint, {}, data);
    }
    return await GenericFunctions_1.beeminderApiRequestAllItems.call(this, 'GET', endpoint, {}, data);
}
async function updateDatapoint(data) {
    const endpoint = `/users/me/goals/${data.goalName}/datapoints/${data.datapointId}.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'PUT', endpoint, data, {});
}
async function deleteDatapoint(data) {
    const endpoint = `/users/me/goals/${data.goalName}/datapoints/${data.datapointId}.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'DELETE', endpoint);
}
async function createCharge(data) {
    const endpoint = '/charges.json';
    const body = {
        user_id: 'me',
        amount: data.amount,
        ...(data.note && { note: data.note }),
        ...(data.dryrun && { dryrun: data.dryrun }),
    };
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'POST', endpoint, body, {});
}
async function uncleGoal(data) {
    const endpoint = `/users/me/goals/${data.goalName}/uncleme.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'POST', endpoint);
}
async function createAllDatapoints(data) {
    const endpoint = `/users/me/goals/${data.goalName}/datapoints/create_all.json`;
    const body = {
        datapoints: data.datapoints,
    };
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'POST', endpoint, body, {});
}
async function getSingleDatapoint(data) {
    const endpoint = `/users/me/goals/${data.goalName}/datapoints/${data.datapointId}.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'GET', endpoint);
}
// Goal Operations
async function getGoal(data) {
    const endpoint = `/users/me/goals/${data.goalName}.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'GET', endpoint, {}, data);
}
async function getAllGoals(data) {
    const endpoint = '/users/me/goals.json';
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'GET', endpoint, {}, data || {});
}
async function getArchivedGoals(data) {
    const endpoint = '/users/me/goals/archived.json';
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'GET', endpoint, {}, data || {});
}
async function createGoal(data) {
    const endpoint = '/users/me/goals.json';
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'POST', endpoint, data, {});
}
async function updateGoal(data) {
    const endpoint = `/users/me/goals/${data.goalName}.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'PUT', endpoint, data, {});
}
async function refreshGoal(data) {
    const endpoint = `/users/me/goals/${data.goalName}/refresh_graph.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'GET', endpoint);
}
async function shortCircuitGoal(data) {
    const endpoint = `/users/me/goals/${data.goalName}/shortcircuit.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'POST', endpoint);
}
async function stepDownGoal(data) {
    const endpoint = `/users/me/goals/${data.goalName}/stepdown.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'POST', endpoint);
}
async function cancelStepDownGoal(data) {
    const endpoint = `/users/me/goals/${data.goalName}/cancel_stepdown.json`;
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'POST', endpoint);
}
// User Operations
async function getUser(data) {
    const endpoint = '/users/me.json';
    return await GenericFunctions_1.beeminderApiRequest.call(this, 'GET', endpoint, {}, data);
}
//# sourceMappingURL=Beeminder.node.functions.js.map