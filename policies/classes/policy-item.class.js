"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var exceptions_constant_1 = require("../../constants/exceptions.constant");
var policy_error_exception_1 = require("../exceptions/policy-error.exception");
var policy_decorator_1 = require("../decorators/policy.decorator");
var PolicyItem = /** @class */ (function () {
    function PolicyItem(policyValidator, name) {
        if (name === void 0) { name = policyValidator.constructor.name; }
        this.name = name;
        this.setPolicyValidator(policyValidator);
    }
    PolicyItem.add = function (policy) {
        PolicyItem.policies.set(policy.name, policy.policyValidator);
    };
    PolicyItem.get = function (policyName) {
        return PolicyItem.policies.get(policyName);
    };
    PolicyItem.has = function (policyName) {
        return PolicyItem.policies.has(policyName);
    };
    PolicyItem.remove = function (policyName) {
        PolicyItem.policies.delete(policyName);
    };
    PolicyItem.setPolicyDescriptor = function (contextClass, propertyKey, next, failedResponseCode) {
        return function () {
            var functionArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                functionArgs[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var policies, promises, _loop_1, _a, policies_1, policyId, state_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            policies = Reflect.getMetadata(policy_decorator_1.POLICY_KEY, contextClass, propertyKey) || [];
                            promises = [];
                            _loop_1 = function (policyId) {
                                var policy = PolicyItem.get(policyId);
                                if (!policy) {
                                    console.info(policy + " policy not found");
                                    return { value: Promise.resolve() };
                                }
                                var policyMeta = Reflect.getMetadata(policy_decorator_1.POLICY_META_KEY, contextClass, propertyKey + "_" + policyId);
                                var promise = policy({ functionArgs: functionArgs, policyMeta: policyMeta })
                                    .then(function (validationResult) {
                                    if (validationResult != true) {
                                        throw new policy_error_exception_1.SugoiPolicyError(exceptions_constant_1.EXCEPTIONS.POLICY_BLOCKED.message, failedResponseCode || exceptions_constant_1.EXCEPTIONS.POLICY_BLOCKED.code, { type: "policy", policyId: policyId, validationResult: validationResult });
                                    }
                                });
                                promises.push(promise);
                            };
                            for (_a = 0, policies_1 = policies; _a < policies_1.length; _a++) {
                                policyId = policies_1[_a];
                                state_1 = _loop_1(policyId);
                                if (typeof state_1 === "object")
                                    return [2 /*return*/, state_1.value];
                            }
                            ;
                            return [4 /*yield*/, Promise.all(promises)
                                    .then(function () {
                                    return next.apply(void 0, functionArgs);
                                })
                                    .catch(function (err) {
                                    return err;
                                })];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        };
    };
    PolicyItem.prototype.setPolicyValidator = function (guardianValidator) {
        this.policyValidator = function (arg) {
            var result = guardianValidator(arg);
            if (result instanceof Promise)
                return result;
            else
                return Promise.resolve(result);
        };
    };
    PolicyItem.policies = new Map();
    return PolicyItem;
}());
exports.PolicyItem = PolicyItem;
