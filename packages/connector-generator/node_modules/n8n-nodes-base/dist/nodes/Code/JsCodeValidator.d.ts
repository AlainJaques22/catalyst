/**
 * Validates that no disallowed methods are used in the
 * runCodeForEachItem JS code. Throws `ValidationError` if
 * a disallowed method is found.
 */
export declare function validateNoDisallowedMethodsInRunForEach(code: string, itemIndex: number): void;
/**
 * Checks if the error message indicates that `items` is not defined and
 * modifies the error message to suggest using `$input.all()`.
 */
export declare function mapItemsNotDefinedErrorIfNeededForRunForAll(code: string, error: Error): void;
/**
 * Maps the "item is not defined" error message to provide a more helpful suggestion
 * for users who may expect `items` to pre-exist
 */
export declare function mapItemNotDefinedErrorIfNeededForRunForEach(code: string, error: Error): void;
//# sourceMappingURL=JsCodeValidator.d.ts.map