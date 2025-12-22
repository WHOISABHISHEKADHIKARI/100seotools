/**
 * Simple Procedural Grammar Engine
 * Assembles text from atomic parts defined in a grammar registry.
 * Supports recursion and placeholder replacement.
 */

export class GrammarEngine {
    constructor(grammar = {}) {
        this.grammar = grammar;
    }

    /**
     * Generates a string based on a starting rule
     * @param {string} rule - The starting key in the grammar
     * @param {Object} data - External data for template replacement (e.g. {keyword: 'SEO'})
     * @returns {string} - The generated text
     */
    generate(rule = 'origin', data = {}) {
        const raw = this.expand(rule);
        return this.fillPlaceholders(raw, data);
    }

    /**
     * Recursively expands symbols marked with # (e.g. #sentence#)
     */
    expand(symbol) {
        if (!symbol.startsWith('#') || !symbol.endsWith('#')) {
            // It's a key in the grammar, look it up
            const options = this.grammar[symbol];
            if (!options) return symbol; // Fallback to literal if not found

            const choice = Array.isArray(options)
                ? options[Math.floor(Math.random() * options.length)]
                : options;

            // Scan for sub-symbols in the choice
            return choice.replace(/#([^#]+)#/g, (match, subKey) => {
                return this.expand(subKey);
            });
        }

        // Strip padding # and expand
        const key = symbol.slice(1, -1);
        return this.expand(key);
    }

    /**
     * Fills ${key} placeholders with provided data
     */
    fillPlaceholders(text, data) {
        return text.replace(/\$\{([^}]+)\}/g, (match, key) => {
            return data[key] || match;
        });
    }
}

/**
 * Utility to create a generator function for a specific grammar
 */
export const createGenerator = (grammar) => {
    const engine = new GrammarEngine(grammar);
    return (rule, data) => engine.generate(rule, data);
};
