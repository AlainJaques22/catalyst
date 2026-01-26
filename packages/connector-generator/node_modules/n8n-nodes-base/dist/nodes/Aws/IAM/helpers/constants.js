"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_DESCRIPTIONS = exports.BASE_URL = exports.CURRENT_VERSION = void 0;
exports.CURRENT_VERSION = '2010-05-08';
exports.BASE_URL = 'https://iam.amazonaws.com';
exports.ERROR_DESCRIPTIONS = {
    EntityAlreadyExists: {
        User: 'The given user name already exists - try entering a unique name for the user.',
        Group: 'The given group name already exists - try entering a unique name for the group.',
    },
    NoSuchEntity: {
        User: 'The given user was not found - try entering a different user.',
        Group: 'The given group was not found - try entering a different group.',
    },
    DeleteConflict: {
        Default: 'Cannot delete entity, please remove users from group first.',
    },
};
//# sourceMappingURL=constants.js.map