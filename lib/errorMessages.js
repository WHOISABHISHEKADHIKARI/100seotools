/**
 * Standardized error messages for the application.
 * Use these messages to ensure consistency across all tools and validations.
 */

export const ERROR_MESSAGES = {
    // Field-specific required errors
    REQUIRED_FIELD: (fieldName) => `${fieldName} is required. Please provide a value.`,
    REQUIRED_URL: (fieldName = 'URL') => `${fieldName} is required. Please enter a valid URL.`,
    REQUIRED_KEYWORD: (fieldName = 'Keyword') => `${fieldName} is required. Please enter a target keyword.`,
    REQUIRED_CONTENT: (fieldName = 'Content') => `${fieldName} is empty. Please paste or type some content.`,

    // Format errors
    INVALID_URL: (url) => `Invalid URL format: "${url}". Please enter a valid http:// or https:// URL.`,
    INVALID_EMAIL: (email) => `Invalid email format: "${email}". Please enter a valid email address.`,
    INVALID_NUMBER: (fieldName, min, max) => `${fieldName} must be a number` + (min !== undefined ? ` between ${min} and ${max}` : '.'),
    INVALID_JSON: (fieldName = 'Input') => `${fieldName} contains invalid JSON. Please check the syntax.`,

    // Length/Size errors
    TOO_SHORT: (fieldName, min) => `${fieldName} is too short. It must be at least ${min} characters.`,
    TOO_LONG: (fieldName, max) => `${fieldName} is too long. It must be at most ${max} characters.`,
    INPUT_TOO_LARGE: (maxMB) => `Input is too large. Maximum allowed size is ${maxMB}MB.`,

    // Processing errors
    PROCESSING_FAILED: (reason) => `Processing failed${reason ? ': ' + reason : ''}. Please check your input and try again.`,
    NO_RESULTS: (context) => `No results found${context ? ' for ' + context : ''}. Try different criteria.`,
    API_ERROR: (details) => `The tool encountered an error: ${details || 'Unknown error'}.`,
    RATE_LIMIT: (seconds) => `Too many requests. Please wait ${seconds} seconds before trying again.`,

    // Specific tool errors (can be expanded)
    SITEMAP_FETCH_ERROR: (url) => `Could not fetch sitemap from "${url}". Please check if the URL is correct and accessible.`,
    ROBOTS_FETCH_ERROR: (url) => `Could not fetch robots.txt from "${url}". Please check if the file exists.`,
};

export default ERROR_MESSAGES;
