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
exports.SystemMetricSchema = exports.SystemMetric = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let SystemMetric = class SystemMetric {
    metricType;
    metricData;
    cpuUsage;
    memoryUsage;
    diskUsage;
    activeUsers;
    totalRequests;
    averageResponseTime;
    errorRate;
    uptime;
};
exports.SystemMetric = SystemMetric;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SystemMetric.prototype, "metricType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], SystemMetric.prototype, "metricData", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SystemMetric.prototype, "cpuUsage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SystemMetric.prototype, "memoryUsage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SystemMetric.prototype, "diskUsage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SystemMetric.prototype, "activeUsers", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SystemMetric.prototype, "totalRequests", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SystemMetric.prototype, "averageResponseTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SystemMetric.prototype, "errorRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SystemMetric.prototype, "uptime", void 0);
exports.SystemMetric = SystemMetric = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SystemMetric);
exports.SystemMetricSchema = mongoose_1.SchemaFactory.createForClass(SystemMetric);
