"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXCEPTIONS = {
    INVALID: { code: 4000, message: "INVALID" },
    NOT_IMPLEMENTED: { code: 4001, message: "NOT_IMPLEMENTED" },
    POLICY_BLOCKED: { code: 400, message: "Request blocked by resource policy" },
    INVALID_POLICY: { code: 500, message: "Decorate Policy use on property which is not a function" }
};
