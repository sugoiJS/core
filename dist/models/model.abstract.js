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
var index_1 = require("../index");
var Observable_1 = require("rxjs/Observable");
var ModelAbstract = /** @class */ (function () {
    function ModelAbstract() {
        this.collectionName = this.constructor['name'];
    }
    ModelAbstract.find = function (query, options) {
        if (query === void 0) { query = {}; }
        if (options === void 0) { options = {}; }
        var that = this;
        query = ModelAbstract.castStringQuery(query);
        return that.findEmitter(query, options)
            .map(function (res) {
            res = res.map(function (collection) {
                return that.clone(that, collection);
            });
            return res;
        });
    };
    ModelAbstract.findOne = function (query, options) {
        if (query === void 0) { query = {}; }
        if (options === void 0) { options = {}; }
        options.limit = 1;
        return this.find(query, options).map(function (res) { return res ? res[0] : null; });
    };
    ModelAbstract.findEmitter = function (query, options) {
        var error = new index_1.ModelException(index_1.Exceptions.NOT_IMPLEMENTED.message, index_1.Exceptions.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
        return Observable_1.Observable.throw(error);
    };
    ;
    ModelAbstract.prototype.save = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.beforeValidate();
        var valid;
        if ((valid = this.validate()) !== true)
            throw new index_1.ModelException(index_1.Exceptions.INVALID.message, index_1.Exceptions.INVALID.code, valid);
        this.beforeSave();
        var observable = Observable_1.Observable.fromPromise(this.saveEmitter(options))
            .do(function () { return _this.afterSave(); })
            .publish();
        observable.connect();
        return observable;
    };
    ModelAbstract.prototype.beforeValidate = function () {
        if ('sugBeforeValidate' in this) {
            this.sugBeforeValidate();
        }
    };
    ModelAbstract.prototype.validate = function () {
        if ('sugValidate' in this) {
            var validate = this.sugValidate();
            return (validate === null || validate === undefined) ? true : validate;
        }
        else
            return true;
    };
    ;
    ModelAbstract.prototype.beforeSave = function () {
        if ("sugBeforeSave" in this) {
            this.sugBeforeSave();
        }
    };
    ;
    ModelAbstract.prototype.afterSave = function () {
        if ('sugAfterSave' in this) {
            this.sugAfterSave();
        }
    };
    ;
    ModelAbstract.prototype.update = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.beforeValidate();
        var valid;
        if ((valid = this.validate()) !== true)
            throw new index_1.ModelException(index_1.Exceptions.INVALID.message, index_1.Exceptions.INVALID.code, valid);
        this.beforeUpdate();
        var observable = Observable_1.Observable.fromPromise(this.updateEmitter(options))
            .do(function () { return _this.afterUpdate(); })
            .publish();
        observable.connect();
        return observable;
    };
    ModelAbstract.prototype.beforeUpdate = function () {
        if ('sugBeforeUpdate' in this)
            this.sugBeforeUpdate();
    };
    ;
    ModelAbstract.prototype.afterUpdate = function () {
        if ('sugAfterUpdate' in this) {
            this.sugAfterUpdate();
        }
    };
    ;
    ModelAbstract.prototype.remove = function (query) {
        var observable = Observable_1.Observable.fromPromise(this.removeEmitter(query))
            .publish();
        observable.connect();
        return observable;
    };
    ModelAbstract.clone = function (classIns, data) {
        var func = function () {
        };
        func.prototype = classIns.prototype;
        var temp = new func();
        classIns.apply(temp, []);
        temp.constructor = classIns;
        Object.assign(temp, data);
        return temp;
    };
    ModelAbstract.castStringQuery = function (query) {
        if (typeof query === "string") {
            query = { id: query };
        }
        return query;
    };
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Observable_1.Observable)
    ], ModelAbstract.prototype, "save", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ModelAbstract.prototype, "beforeValidate", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], ModelAbstract.prototype, "validate", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ModelAbstract.prototype, "beforeSave", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ModelAbstract.prototype, "afterSave", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Observable_1.Observable)
    ], ModelAbstract.prototype, "update", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ModelAbstract.prototype, "beforeUpdate", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ModelAbstract.prototype, "afterUpdate", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Observable_1.Observable)
    ], ModelAbstract.prototype, "remove", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Observable_1.Observable)
    ], ModelAbstract, "find", null);
    __decorate([
        index_1.Final(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Observable_1.Observable)
    ], ModelAbstract, "findOne", null);
    return ModelAbstract;
}());
exports.ModelAbstract = ModelAbstract;
