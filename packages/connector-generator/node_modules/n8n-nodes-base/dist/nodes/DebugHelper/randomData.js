"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomUser = generateRandomUser;
exports.generateRandomAddress = generateRandomAddress;
exports.generateRandomEmail = generateRandomEmail;
exports.generateUUID = generateUUID;
exports.generateNanoid = generateNanoid;
exports.generateCreditCard = generateCreditCard;
exports.generateURL = generateURL;
exports.generateIPv4 = generateIPv4;
exports.generateIPv6 = generateIPv6;
exports.generateMAC = generateMAC;
exports.generateLocation = generateLocation;
exports.generateVersion = generateVersion;
const minifaker_1 = require("minifaker");
require("minifaker/locales/en");
function generateRandomUser() {
    return {
        uid: minifaker_1.uuid.v4(),
        email: (0, minifaker_1.email)(),
        firstname: (0, minifaker_1.firstName)(),
        lastname: (0, minifaker_1.lastName)(),
        password: (0, minifaker_1.password)(),
    };
}
function generateRandomAddress() {
    return {
        firstname: (0, minifaker_1.firstName)(),
        lastname: (0, minifaker_1.lastName)(),
        street: (0, minifaker_1.streetAddress)(),
        city: (0, minifaker_1.cityName)(),
        zip: (0, minifaker_1.zipCode)({ format: '#####' }),
        state: (0, minifaker_1.state)(),
        country: (0, minifaker_1.country)(),
    };
}
function generateRandomEmail() {
    return {
        email: (0, minifaker_1.email)(),
        confirmed: (0, minifaker_1.boolean)(),
    };
}
function generateUUID() {
    return { uuid: minifaker_1.uuid.v4() };
}
function generateNanoid(customAlphabet, length) {
    return { nanoId: minifaker_1.nanoId.customAlphabet(customAlphabet, parseInt(length, 10))().toString() };
}
function generateCreditCard() {
    return {
        type: (0, minifaker_1.boolean)() ? 'MasterCard' : 'Visa',
        number: (0, minifaker_1.creditCardNumber)(),
        ccv: (0, minifaker_1.creditCardCVV)(),
        exp: `${(0, minifaker_1.number)({ min: 1, max: 12, float: false }).toString().padStart(2, '0')}/${(0, minifaker_1.number)({
            min: 1,
            max: 40,
            float: false,
        })
            .toString()
            .padStart(2, '0')}`,
        holder_name: `${(0, minifaker_1.firstName)()} ${(0, minifaker_1.lastName)()}`,
    };
}
function generateURL() {
    return { url: (0, minifaker_1.domainUrl)() };
}
function generateIPv4() {
    return { ip: (0, minifaker_1.ip)() };
}
function generateIPv6() {
    return { ipv6: (0, minifaker_1.ipv6)() };
}
function generateMAC() {
    return { mac: (0, minifaker_1.macAddress)() };
}
function generateLocation() {
    return { location: (0, minifaker_1.latLong)() };
}
function generateVersion() {
    return { version: (0, minifaker_1.semver)() };
}
//# sourceMappingURL=randomData.js.map