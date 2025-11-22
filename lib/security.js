/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize user input to prevent XSS and other injection attacks
 */
export function sanitizeInput(value, type = 'text') {
    if (typeof value !== 'string') {
        value = String(value);
    }

    // Remove null bytes
    value = value.replace(/\0/g, '');

    // Limit length based on type
    const maxLength = type === 'textarea' ? 50000 : type === 'code' ? 100000 : 5000;
    if (value.length > maxLength) {
        value = value.substring(0, maxLength);
    }

    // For HTML/code inputs, remove dangerous scripts but allow formatting
    if (type === 'code' || type === 'html') {
        // Remove script tags
        value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        // Remove event handlers
        value = value.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        // Remove javascript: protocol
        value = value.replace(/javascript:/gi, '');
    } else if (type === 'text' || type === 'textarea') {
        // For plain text, escape HTML entities
        value = value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    return value;
}

/**
 * Validate URL format and protocol
 */
export function validateURL(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const parsed = new URL(url);
        // Only allow http/https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return false;
        }
        // Check for valid hostname
        if (!parsed.hostname || parsed.hostname.length < 3) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate email format
 */
export function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate number within range
 */
export function validateNumber(value, min, max) {
    const num = parseFloat(value);
    if (isNaN(num)) {
        return { valid: false, error: 'Must be a number' };
    }
    if (min !== undefined && num < min) {
        return { valid: false, error: `Must be at least ${min}` };
    }
    if (max !== undefined && num > max) {
        return { valid: false, error: `Must be at most ${max}` };
    }
    return { valid: true, value: num };
}

/**
 * Validate required field
 */
export function validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true };
}

/**
 * Sanitize HTML output for display
 */
export function sanitizeOutput(html) {
    if (typeof html !== 'string') {
        return String(html);
    }

    // Remove dangerous tags and attributes
    const dangerous = /<script|<iframe|<object|<embed|javascript:|on\w+=/gi;
    if (dangerous.test(html)) {
        // If contains dangerous content, escape everything
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    return html;
}

/**
 * Check if input size is within limits
 */
export function checkInputSize(value, maxBytes = 1000000) {
    if (!value) return { valid: true };

    const bytes = new TextEncoder().encode(value).length;
    if (bytes > maxBytes) {
        const mb = (maxBytes / 1000000).toFixed(1);
        return {
            valid: false,
            error: `Input too large (max ${mb}MB)`,
            actualSize: bytes
        };
    }

    return { valid: true, size: bytes };
}

export default {
    sanitizeInput,
    validateURL,
    validateEmail,
    validateNumber,
    validateRequired,
    sanitizeOutput,
    checkInputSize
};
