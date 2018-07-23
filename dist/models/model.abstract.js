"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
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
            .then(function (res) {
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
        return this.find(query, options)
            .then(function (res) { return res ? res[0] : null; });
    };
    ModelAbstract.findEmitter = function (query, options) {
        throw new index_1.ModelException(index_1.Exceptions.NOT_IMPLEMENTED.message, index_1.Exceptions.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
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
        return this.saveEmitter(options)
            .then(function (savedData) {
            _this.afterSave();
            return savedData;
        });
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
        return this.updateEmitter(options)
            .then(function (updatedData) {
            _this.afterUpdate();
            return updatedData;
        });
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
        return this.removeEmitter(query);
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
    return ModelAbstract;
}());
exports.ModelAbstract = ModelAbstract;
