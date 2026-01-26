"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eq = Eq;
exports.Gt = Gt;
exports.Gte = Gte;
exports.Lt = Lt;
exports.Lte = Lte;
exports.And = And;
exports.Or = Or;
exports.Not = Not;
exports.In = In;
exports.Contains = Contains;
exports.Id = Id;
exports.Between = Between;
exports.ParentId = ParentId;
exports.Parent = Parent;
exports.Child = Child;
exports.Type = Type;
exports.queryString = queryString;
exports.Like = Like;
exports.StartsWith = StartsWith;
exports.EndsWith = EndsWith;
exports.ContainsString = ContainsString;
// Query Functions
function Eq(field, value) {
    return { _field: field, _value: value };
}
function Gt(_field, value) {
    return { _gt: { field: value } };
}
function Gte(_field, value) {
    return { _gte: { field: value } };
}
function Lt(_field, value) {
    return { _lt: { field: value } };
}
function Lte(_field, value) {
    return { _lte: { field: value } };
}
function And(...criteria) {
    return { _and: criteria };
}
function Or(...criteria) {
    return { _or: criteria };
}
function Not(criteria) {
    return { _not: criteria };
}
function In(field, values) {
    return { _in: { _field: field, _values: values } };
}
function Contains(field) {
    return { _contains: field };
}
function Id(id) {
    return { _id: id };
}
function Between(field, fromValue, toValue) {
    return { _between: { _field: field, _from: fromValue, _to: toValue } };
}
function ParentId(tpe, id) {
    return { _parent: { _type: tpe, _id: id } };
}
function Parent(tpe, criterion) {
    return { _parent: { _type: tpe, _query: criterion } };
}
function Child(tpe, criterion) {
    return { _child: { _type: tpe, _query: criterion } };
}
function Type(tpe) {
    return { _type: tpe };
}
function queryString(query) {
    return { _string: query };
}
function Like(field, value) {
    return { _like: { _field: field, _value: value } };
}
function StartsWith(field, value) {
    if (!value.startsWith('*')) {
        value = value + '*';
    }
    return { _wildcard: { _field: field, _value: value } };
}
function EndsWith(field, value) {
    if (!value.endsWith('*')) {
        value = '*' + value;
    }
    return { _wildcard: { _field: field, _value: value } };
}
function ContainsString(field, value) {
    if (!value.endsWith('*')) {
        value = value + '*';
    }
    if (!value.startsWith('*')) {
        value = '*' + value;
    }
    return { _wildcard: { _field: field, _value: value } };
}
//# sourceMappingURL=QueryFunctions.js.map