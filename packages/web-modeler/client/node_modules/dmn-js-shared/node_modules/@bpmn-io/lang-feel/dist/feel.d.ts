import { LRLanguage, LanguageSupport } from '@codemirror/language';
import { CompletionSource } from '@codemirror/autocomplete';
/**
 * A FEEL language provider based on the
 * [Lezer FEEL parser](https://github.com/nikku/lezer-feel),
 * extended with highlighting and indentation information.
 */
export declare const feelLanguage: LRLanguage;
/**
 * A language provider for FEEL Unary Tests
 */
export declare const unaryTestsLanguage: LRLanguage;
/**
 * Language provider for FEEL Expression
 */
export declare const expressionLanguage: LRLanguage;
/**
 * Feel language support for CodeMirror.
 *
 * Includes [snippet](#lang-feel.snippets)
 */
export declare function feel(config?: {
    dialect?: 'expression' | 'unaryTests';
    parserDialect?: string;
    completions?: CompletionSource[];
    context?: Record<string, any>;
}): LanguageSupport;
