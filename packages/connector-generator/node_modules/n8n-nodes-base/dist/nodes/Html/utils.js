"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = getValue;
const html_to_text_1 = require("html-to-text");
// The extraction functions
const extractFunctions = {
    attribute: ($, valueData) => $.attr(valueData.attribute),
    html: ($, _valueData) => $.html() || undefined,
    text: ($, _valueData, nodeVersion) => {
        if (nodeVersion <= 1.1)
            return $.text() || undefined;
        const html = $.html() || '';
        let options;
        if (_valueData.skipSelectors) {
            options = {
                selectors: _valueData.skipSelectors.split(',').map((s) => ({
                    selector: s.trim(),
                    format: 'skip',
                })),
            };
        }
        return (0, html_to_text_1.convert)(html, options);
    },
    value: ($, _valueData) => $.val(),
};
/**
 * Simple helper function which applies options
 */
function getValue($, valueData, options, nodeVersion) {
    let value = extractFunctions[valueData.returnValue]($, valueData, nodeVersion);
    if (value === undefined) {
        return value;
    }
    if (options.trimValues) {
        value = value.trim();
    }
    if (options.cleanUpText) {
        value = value
            .replace(/^\s+|\s+$/g, '')
            .replace(/(\r\n|\n|\r)/gm, '')
            .replace(/\s+/g, ' ');
    }
    return value;
}
//# sourceMappingURL=utils.js.map