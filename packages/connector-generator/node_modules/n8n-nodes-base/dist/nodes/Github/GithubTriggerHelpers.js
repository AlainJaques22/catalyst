"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = verifySignature;
const crypto_1 = require("crypto");
/**
 * Verifies the GitHub webhook signature using HMAC-SHA256.
 *
 * GitHub sends a signature in the `X-Hub-Signature-256` header in the format:
 * `sha256=<HMAC hex digest>`
 *
 * This function computes the expected signature using the stored webhook secret
 * and compares it with the provided signature using a constant-time comparison.
 *
 * @returns true if signature is valid or no secret is configured, false otherwise
 */
function verifySignature() {
    // Get the secret from workflow static data (set during webhook creation)
    const webhookData = this.getWorkflowStaticData('node');
    const webhookSecret = webhookData.webhookSecret;
    // If no secret is configured, skip verification (backwards compatibility)
    if (!webhookSecret) {
        return true;
    }
    const req = this.getRequestObject();
    // Get the signature from GitHub's header
    const signature = req.header('x-hub-signature-256');
    if (!signature) {
        return false;
    }
    // Validate signature format (must start with "sha256=")
    if (!signature.startsWith('sha256=')) {
        return false;
    }
    // Extract just the hex digest part
    const providedSignature = signature.substring(7);
    try {
        // Get the raw request body
        if (!req.rawBody) {
            return false;
        }
        // Compute HMAC-SHA256 of the raw body using our secret
        const hmac = (0, crypto_1.createHmac)('sha256', webhookSecret);
        if (Buffer.isBuffer(req.rawBody)) {
            hmac.update(req.rawBody);
        }
        else {
            const rawBodyString = typeof req.rawBody === 'string' ? req.rawBody : JSON.stringify(req.rawBody);
            hmac.update(rawBodyString);
        }
        const computedSignature = hmac.digest('hex');
        const computedBuffer = Buffer.from(computedSignature, 'utf8');
        const providedBuffer = Buffer.from(providedSignature, 'utf8');
        // Buffers must be same length for timingSafeEqual
        if (computedBuffer.length !== providedBuffer.length) {
            return false;
        }
        return (0, crypto_1.timingSafeEqual)(computedBuffer, providedBuffer);
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=GithubTriggerHelpers.js.map