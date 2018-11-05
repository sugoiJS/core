"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const deprecated_decorator_1 = require("../../decorators/deprecated.decorator");
;
const EntitySchema = {
    num: index_1.ComparableSchema.ofType(index_1.SchemaTypes.NUMBER)
        .setExclusiveMin(2)
        .setExclusiveMax(10)
        .setArrayAllowed(true),
    id: index_1.ComparableSchema.ofType(index_1.SchemaTypes.STRING).setMandatory(true),
    active: index_1.ComparableSchema.ofType(index_1.SchemaTypes.BOOLEAN).setMandatory(true)
};
let PolicyCheck = class PolicyCheck {
    constructor() {
        this.verifyData = new Date().getTime();
    }
    setEntity(entity) {
        this.entity = entity;
    }
    myName() {
        return "Check";
    }
};
__decorate([
    index_1.ValidateSchemaPolicy(null, { schema: EntitySchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PolicyCheck.prototype, "setEntity", null);
__decorate([
    deprecated_decorator_1.Deprecated(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PolicyCheck.prototype, "myName", null);
PolicyCheck = __decorate([
    index_1.Injectable()
], PolicyCheck);
exports.PolicyCheck = PolicyCheck;
