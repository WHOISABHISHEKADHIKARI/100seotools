/**
 * Rate limiting utility to prevent abuse and DoS attacks
 */

// Store rate limit data in memory (client-side)
const rateLimits = new Map();

/**
 * Check if request is within rate limit
 * @param {string} key - Unique identifier (e.g., tool slug)
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} - { allowed: boolean, remaining: number, resetAt: number, message?: string }
 */
export function checkRateLimit(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const windowKey = `${key}-${Math.floor(now / windowMs)}`;

    // Get current count for this window
    const current = rateLimits.get(windowKey) || { count: 0, startTime: now };

    // Check if limit exceeded
    if (current.count >= maxRequests) {
        const resetAt = current.startTime + windowMs;
        const waitSeconds = Math.ceil((resetAt - now) / 1000);

        return {
            allowed: false,
            remaining: 0,
            resetAt,
            message: `Rate limit exceeded. Please wait ${waitSeconds} seconds and try again.`
        };
    }

    // Increment count
    current.count++;
    current.startTime = current.startTime || now;
    rateLimits.set(windowKey, current);

    // Cleanup old entries (prevent memory leak)
    cleanupOldEntries(now, windowMs);

    return {
        allowed: true,
        remaining: maxRequests - current.count,
        resetAt: current.startTime + windowMs
    };
}

/**
 * Reset rate limit for a specific key
 */
export function resetRateLimit(key) {
    const now = Date.now();
    const keysToDelete = [];

    for (const [k] of rateLimits.entries()) {
        if (k.startsWith(key)) {
            keysToDelete.push(k);
        }
    }

    keysToDelete.forEach(k => rateLimits.delete(k));
}

/**
 * Clean up old rate limit entries
 */
function cleanupOldEntries(now, windowMs) {
    const cutoff = now - (windowMs * 2);
    const keysToDelete = [];

    for (const [key, data] of rateLimits.entries()) {
        if (data.startTime < cutoff) {
            keysToDelete.push(key);
        }
    }

    keysToDelete.forEach(key => rateLimits.delete(key));
}

/**
 * Get current rate limit status
 */
export function getRateLimitStatus(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const windowKey = `${key}-${Math.floor(now / windowMs)}`;
    const current = rateLimits.get(windowKey) || { count: 0, startTime: now };

    return {
        requests: current.count,
        limit: maxRequests,
        remaining: Math.max(0, maxRequests - current.count),
        resetAt: current.startTime + windowMs
    };
}

export default {
    checkRateLimit,
    resetRateLimit,
    getRateLimitStatus
};
