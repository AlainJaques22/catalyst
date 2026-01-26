"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldsTracker = void 0;
class FieldsTracker {
    fields = {};
    add(key) {
        if (this.fields[key] === undefined) {
            this.fields[key] = false;
        }
    }
    update(key, value) {
        if (!this.fields[key] && value) {
            this.fields[key] = true;
        }
    }
    getHints() {
        const hints = [];
        for (const [field, value] of Object.entries(this.fields)) {
            if (!value) {
                hints.push({
                    message: `The field '${field}' wasn't found in any input item`,
                    location: 'outputPane',
                });
            }
        }
        return hints;
    }
}
exports.FieldsTracker = FieldsTracker;
//# sourceMappingURL=utils.js.map