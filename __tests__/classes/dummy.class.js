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
let Dummy = class Dummy {
    constructor() {
        this.valid = true;
    }
    verify(str) {
        this.value = str;
        return this.valid;
    }
    verifyClassDecorator(num, num2) {
        this.value = num + num2;
        return this.valid;
    }
};
__decorate([
    index_1.ValidateSchemaPolicy(400, {
        schema: index_1.ComparableSchema.ofType(index_1.SchemaTypes.STRING)
            .setRegex("([a-z])")
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Dummy.prototype, "verify", null);
Dummy = __decorate([
    index_1.ValidateSchemaPolicy(400, {
        schema: index_1.ComparableSchema.ofType(index_1.SchemaTypes.NUMBER).setMin(0).setMax(100000000000000),
        argIndex: 1
    })
], Dummy);
exports.Dummy = Dummy;
