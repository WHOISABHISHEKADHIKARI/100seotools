/**
 * Input validation utilities
 */

import { validateURL, validateEmail, validateNumber, validateRequired, checkInputSize } from './security';

/**
 * Validate field based on its configuration
 */
export function validateField(value, field) {
    const errors = [];

    // Required validation
    if (field.required) {
        const requiredCheck = validateRequired(value, field.label);
        if (!requiredCheck.valid) {
            errors.push(requiredCheck.error);
            return { valid: false, errors };
        }
    }

    // Skip other validations if empty and not required
    if (!value || value === '') {
        return { valid: true, errors: [] };
    }

    // Type-specific validation
    switch (field.type) {
        case 'url':
            if (!validateURL(value)) {
                errors.push(`${field.label} must be a valid URL (http:// or https://)`);
            }
            break;

        case 'email':
            if (!validateEmail(value)) {
                errors.push(`${field.label} must be a valid email address`);
            }
            break;

        case 'number':
            const numCheck = validateNumber(value, field.min, field.max);
            if (!numCheck.valid) {
                errors.push(`${field.label}: ${numCheck.error}`);
            }
            break;

        case 'text':
        case 'textarea':
            // Length validation
            if (field.minLength && value.length < field.minLength) {
                errors.push(`${field.label} must be at least ${field.minLength} characters`);
            }
            if (field.maxLength && value.length > field.maxLength) {
                errors.push(`${field.label} must be at most ${field.maxLength} characters`);
            }
            break;
    }

    // Pattern validation
    if (field.pattern) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
            errors.push(field.patternError || `${field.label} format is invalid`);
        }
    }

    // Size validation
    const sizeCheck = checkInputSize(value, field.maxBytes || 1000000);
    if (!sizeCheck.valid) {
        errors.push(sizeCheck.error);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate all fields in a form
 */
export function validateAllFields(inputs, fields) {
    const allErrors = {};
    let isValid = true;

    fields.forEach(field => {
        const value = inputs[field.name];
        const validation = validateField(value, field);

        if (!validation.valid) {
            allErrors[field.name] = validation.errors;
            isValid = false;
        }
    });

    return {
        valid: isValid,
        errors: allErrors,
        errorMessages: Object.values(allErrors).flat()
    };
}

/**
 * Validate keyword density inputs
 */
export function validateKeywordDensity(text, keyword) {
    const errors = [];

    if (!text || text.trim().length < 10) {
        errors.push('Text must be at least 10 characters long');
    }

    if (!keyword || keyword.trim().length === 0) {
        errors.push('Keyword is required');
    }

    if (keyword && keyword.length > 100) {
        errors.push('Keyword must be at most 100 characters');
    }

    if (text && text.length > 100000) {
        errors.push('Text is too long (maximum 100,000 characters)');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate meta description
 */
export function validateMetaDescription(description) {
    const errors = [];
    const warnings = [];

    if (!description || description.trim().length === 0) {
        errors.push('Meta description is required');
        return { valid: false, errors, warnings };
    }

    const length = [...description].length; // Account for emojis

    if (length < 50) {
        warnings.push('Meta description is very short (recommended: 150-160 characters)');
    } else if (length < 120) {
        warnings.push('Meta description could be longer (recommended: 150-160 characters)');
    }

    if (length > 160) {
        warnings.push('Meta description may be truncated in search results (recommended: 150-160 characters)');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        length
    };
}

/**
 * Validate robots.txt content
 */
export function validateRobotsTxt(content) {
    const errors = [];
    const warnings = [];

    if (!content || content.trim().length === 0) {
        errors.push('Robots.txt content is required');
        return { valid: false, errors, warnings };
    }

    const lines = content.split('\n');
    let currentUserAgent = null;
    const validDirectives = ['user-agent', 'disallow', 'allow', 'sitemap', 'crawl-delay'];

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();

        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) return;

        // Parse directive
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1) {
            errors.push(`Line ${lineNum}: Invalid syntax - missing colon`);
            return;
        }

        const directive = trimmed.substring(0, colonIndex).trim().toLowerCase();
        const value = trimmed.substring(colonIndex + 1).trim();

        // Validate directive
        if (!validDirectives.includes(directive)) {
            warnings.push(`Line ${lineNum}: Unknown directive "${directive}"`);
        }

        // Validate user-agent
        if (directive === 'user-agent') {
            if (!value) {
                errors.push(`Line ${lineNum}: User-agent cannot be empty`);
            }
            currentUserAgent = value;
        }

        // Validate disallow/allow
        if (directive === 'disallow' || directive === 'allow') {
            if (!currentUserAgent) {
                errors.push(`Line ${lineNum}: ${directive} must follow a User-agent`);
            }
            if (value && !value.startsWith('/') && value !== '') {
                warnings.push(`Line ${lineNum}: Path should start with / or be empty`);
            }
        }

        // Validate sitemap
        if (directive === 'sitemap') {
            if (!validateURL(value)) {
                errors.push(`Line ${lineNum}: Invalid sitemap URL`);
            }
        }

        // Validate crawl-delay
        if (directive === 'crawl-delay') {
            const delay = parseFloat(value);
            if (isNaN(delay) || delay < 0) {
                errors.push(`Line ${lineNum}: Invalid crawl-delay value`);
            }
            if (delay > 10) {
                warnings.push(`Line ${lineNum}: Crawl-delay > 10 seconds may be excessive`);
            }
        }
    });

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

export default {
    validateField,
    validateAllFields,
    validateKeywordDensity,
    validateMetaDescription,
    validateRobotsTxt
};
