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
exports.AITrainingSchema = exports.AITraining = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AITraining = class AITraining {
    trainingName;
    modelVersion;
    status;
    trainingData;
    datasetSize;
    epochs;
    batchSize;
    learningRate;
    accuracy;
    loss;
    trainingTime;
    errorMessage;
    trainedBy;
    modelMetrics;
};
exports.AITraining = AITraining;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AITraining.prototype, "trainingName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AITraining.prototype, "modelVersion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['pending', 'training', 'completed', 'failed'], default: 'pending' }),
    __metadata("design:type", String)
], AITraining.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AITraining.prototype, "trainingData", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AITraining.prototype, "datasetSize", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AITraining.prototype, "epochs", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AITraining.prototype, "batchSize", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AITraining.prototype, "learningRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AITraining.prototype, "accuracy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AITraining.prototype, "loss", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AITraining.prototype, "trainingTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AITraining.prototype, "errorMessage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AITraining.prototype, "trainedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AITraining.prototype, "modelMetrics", void 0);
exports.AITraining = AITraining = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AITraining);
exports.AITrainingSchema = mongoose_1.SchemaFactory.createForClass(AITraining);
