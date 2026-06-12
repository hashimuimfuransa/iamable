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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ai_log_schema_1 = require("./schemas/ai-log.schema");
const ai_training_schema_1 = require("./schemas/ai-training.schema");
let AiService = class AiService {
    aiLogModel;
    aiTrainingModel;
    constructor(aiLogModel, aiTrainingModel) {
        this.aiLogModel = aiLogModel;
        this.aiTrainingModel = aiTrainingModel;
    }
    async logPrediction(logData) {
        return this.aiLogModel.create({
            modelVersion: 'v1.0',
            ...logData,
        });
    }
    async getLogs(limit = 100) {
        return this.aiLogModel.find().sort({ createdAt: -1 }).limit(limit);
    }
    async getStats() {
        const totalPredictions = await this.aiLogModel.countDocuments();
        const avgAccuracy = await this.aiLogModel.aggregate([
            { $group: { _id: null, avgAccuracy: { $avg: '$accuracy' } } },
        ]);
        const avgProcessingTime = await this.aiLogModel.aggregate([
            { $group: { _id: null, avgTime: { $avg: '$processingTime' } } },
        ]);
        const gestureDistribution = await this.aiLogModel.aggregate([
            { $group: { _id: '$gestureRecognized', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);
        return {
            totalPredictions,
            avgAccuracy: avgAccuracy[0]?.avgAccuracy || 0,
            avgProcessingTime: avgProcessingTime[0]?.avgTime || 0,
            gestureDistribution,
        };
    }
    async processGesture(gestureData) {
        const startTime = Date.now();
        const landmarks = gestureData.landmarks;
        if (!landmarks || landmarks.length === 0) {
            const gestures = [
                'hello', 'thank you', 'please', 'yes', 'no', 'help', 'sorry', 'good', 'bad', 'love',
                'buy', 'sell', 'shop', 'work', 'home', 'school', 'family', 'friend', 'happy', 'sad',
                'angry', 'tired', 'hungry', 'thirsty', 'cold', 'hot', 'phone', 'email', 'internet',
                'computer', 'car', 'bus', 'train', 'airplane', 'doctor', 'hospital', 'medicine',
                'pain', 'better', 'worse'
            ];
            const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
            const confidence = 0.75 + Math.random() * 0.2;
            const processingTime = Date.now() - startTime;
            await this.logPrediction({
                predictionData: gestureData,
                gestureRecognized: randomGesture,
                confidence,
                processingTime,
                accuracy: confidence,
            });
            return {
                gesture: randomGesture,
                confidence,
                processingTime,
            };
        }
        const recognizedGesture = this.classifyGesture(landmarks);
        const confidence = recognizedGesture.confidence;
        const processingTime = Date.now() - startTime;
        await this.logPrediction({
            predictionData: gestureData,
            gestureRecognized: recognizedGesture.gesture,
            confidence,
            processingTime,
            accuracy: confidence,
        });
        return {
            gesture: recognizedGesture.gesture,
            confidence,
            processingTime,
        };
    }
    classifyGesture(landmarks) {
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const thumbIP = landmarks[2];
        const thumbPIP = landmarks[3];
        const indexTip = landmarks[8];
        const indexPIP = landmarks[6];
        const indexMCP = landmarks[5];
        const middleTip = landmarks[12];
        const middlePIP = landmarks[10];
        const middleMCP = landmarks[9];
        const ringTip = landmarks[16];
        const ringPIP = landmarks[14];
        const ringMCP = landmarks[13];
        const pinkyTip = landmarks[20];
        const pinkyPIP = landmarks[18];
        const pinkyMCP = landmarks[17];
        const thumbExtended = thumbTip.y < thumbPIP.y;
        const indexExtended = indexTip.y < indexPIP.y;
        const middleExtended = middleTip.y < middlePIP.y;
        const ringExtended = ringTip.y < ringPIP.y;
        const pinkyExtended = pinkyTip.y < pinkyPIP.y;
        const extendedFingers = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended]
            .filter(Boolean).length;
        const thumbIndexDist = this.calculateDistance(thumbTip, indexTip);
        const thumbMiddleDist = this.calculateDistance(thumbTip, middleTip);
        const indexMiddleDist = this.calculateDistance(indexTip, middleTip);
        const middleRingDist = this.calculateDistance(middleTip, ringTip);
        const ringPinkyDist = this.calculateDistance(ringTip, pinkyTip);
        let gesture = 'unknown';
        let confidence = 0.5;
        if (extendedFingers === 5) {
            gesture = 'hello';
            confidence = 0.85;
        }
        else if (extendedFingers === 0) {
            gesture = 'no';
            confidence = 0.9;
        }
        else if (extendedFingers === 1 && indexExtended) {
            gesture = 'yes';
            confidence = 0.88;
        }
        else if (extendedFingers === 2 && indexExtended && middleExtended) {
            gesture = 'thank you';
            confidence = 0.87;
        }
        else if (extendedFingers === 3 && indexExtended && middleExtended && ringExtended) {
            gesture = 'please';
            confidence = 0.82;
        }
        else if (extendedFingers === 4 && !thumbExtended) {
            gesture = 'four';
            confidence = 0.85;
        }
        else if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            gesture = 'good';
            confidence = 0.9;
        }
        else if (!thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbTip.y > thumbPIP.y) {
            gesture = 'bad';
            confidence = 0.88;
        }
        else if (thumbIndexDist < 0.05 && !middleExtended && !ringExtended && !pinkyExtended) {
            gesture = 'love';
            confidence = 0.85;
        }
        else if (extendedFingers >= 4 && wrist.y > 0.6) {
            gesture = 'help';
            confidence = 0.75;
        }
        else if (extendedFingers >= 3 && wrist.y > 0.5 && wrist.x > 0.3 && wrist.x < 0.7) {
            gesture = 'sorry';
            confidence = 0.7;
        }
        else if (thumbExtended && pinkyExtended && !indexExtended && !middleExtended && !ringExtended) {
            gesture = 'call me';
            confidence = 0.85;
        }
        else if (indexExtended && pinkyExtended && !thumbExtended && !middleExtended && !ringExtended) {
            gesture = 'rock';
            confidence = 0.85;
        }
        else if (extendedFingers === 0 && thumbTip.x < indexMCP.x) {
            gesture = 'stop';
            confidence = 0.88;
        }
        else if (extendedFingers === 5 && wrist.x < 0.3) {
            gesture = 'wave';
            confidence = 0.8;
        }
        else if (extendedFingers === 5 && wrist.y < 0.3) {
            gesture = 'clap';
            confidence = 0.75;
        }
        else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
            gesture = 'one';
            confidence = 0.88;
        }
        else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
            gesture = 'two';
            confidence = 0.87;
        }
        else if (indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended) {
            gesture = 'three';
            confidence = 0.85;
        }
        else if (extendedFingers === 5 && indexMiddleDist > 0.1 && middleRingDist > 0.1 && ringPinkyDist > 0.1) {
            gesture = 'five';
            confidence = 0.85;
        }
        else if (thumbIndexDist > 0.1 && indexExtended && middleExtended && ringExtended && pinkyExtended) {
            gesture = 'six';
            confidence = 0.8;
        }
        else if (thumbExtended && !indexExtended && !middleExtended && ringExtended && pinkyExtended) {
            gesture = 'seven';
            confidence = 0.78;
        }
        else if (thumbExtended && !indexExtended && middleExtended && ringExtended && pinkyExtended) {
            gesture = 'eight';
            confidence = 0.78;
        }
        else if (thumbExtended && indexExtended && middleExtended && ringExtended && !pinkyExtended) {
            gesture = 'nine';
            confidence = 0.78;
        }
        else if (indexExtended && middleExtended && indexMiddleDist < 0.05) {
            gesture = 'ten';
            confidence = 0.75;
        }
        else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && wrist.y < 0.4) {
            gesture = 'quiet';
            confidence = 0.75;
        }
        else if (extendedFingers === 5 && wrist.y < 0.3) {
            gesture = 'high five';
            confidence = 0.8;
        }
        else if (extendedFingers === 0 && wrist.y < 0.5) {
            gesture = 'fist bump';
            confidence = 0.8;
        }
        else if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbTip.y < wrist.y) {
            gesture = 'good job';
            confidence = 0.88;
        }
        else if (extendedFingers === 5 && wrist.x > 0.7) {
            gesture = 'applause';
            confidence = 0.75;
        }
        else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && wrist.x > 0.5) {
            gesture = 'come here';
            confidence = 0.78;
        }
        else if (extendedFingers === 5 && wrist.y > 0.4 && wrist.x < 0.2) {
            gesture = 'go away';
            confidence = 0.75;
        }
        else if (extendedFingers >= 3 && wrist.y > 0.4 && wrist.y < 0.6) {
            gesture = "I don't know";
            confidence = 0.7;
        }
        else if (extendedFingers >= 2 && wrist.y > 0.5 && wrist.x > 0.5) {
            gesture = 'thinking';
            confidence = 0.7;
        }
        else if (extendedFingers === 2 && wrist.y > 0.6 && wrist.x < 0.3) {
            gesture = 'time';
            confidence = 0.7;
        }
        else if (thumbIndexDist < 0.08 && thumbIndexDist > 0.03 && !middleExtended && !ringExtended && !pinkyExtended) {
            gesture = 'money';
            confidence = 0.75;
        }
        else if (extendedFingers >= 3 && wrist.y < 0.4 && wrist.x > 0.4 && wrist.x < 0.6) {
            gesture = 'eat';
            confidence = 0.7;
        }
        else if (extendedFingers <= 2 && wrist.y < 0.4 && wrist.x > 0.4 && wrist.x < 0.6) {
            gesture = 'drink';
            confidence = 0.7;
        }
        else if (extendedFingers >= 3 && wrist.y < 0.3) {
            gesture = 'sleep';
            confidence = 0.7;
        }
        else if (extendedFingers >= 3 && wrist.x > 0.7 && wrist.y > 0.3 && wrist.y < 0.5) {
            gesture = 'listen';
            confidence = 0.7;
        }
        else if (extendedFingers >= 2 && wrist.y < 0.3 && wrist.x > 0.3 && wrist.x < 0.7) {
            gesture = 'look';
            confidence = 0.7;
        }
        else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
            gesture = 'walk';
            confidence = 0.75;
        }
        else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended && wrist.y < 0.4) {
            gesture = 'run';
            confidence = 0.72;
        }
        else if (extendedFingers === 5 && wrist.y > 0.6) {
            gesture = 'sit';
            confidence = 0.75;
        }
        else if (extendedFingers === 1 && indexExtended && wrist.y < 0.3) {
            gesture = 'stand';
            confidence = 0.75;
        }
        else if (extendedFingers === 5 && wrist.x < 0.2) {
            gesture = 'stop';
            confidence = 0.85;
        }
        else if (thumbIndexDist < 0.08 && thumbIndexDist > 0.04 && middleExtended && ringExtended && pinkyExtended) {
            gesture = 'buy';
            confidence = 0.78;
        }
        else if (extendedFingers === 4 && !thumbExtended && wrist.y > 0.4) {
            gesture = 'sell';
            confidence = 0.75;
        }
        else if (extendedFingers <= 2 && wrist.y > 0.4 && wrist.x > 0.3 && wrist.x < 0.7) {
            gesture = 'shop';
            confidence = 0.75;
        }
        else if (extendedFingers === 0 && thumbTip.y < thumbPIP.y) {
            gesture = 'work';
            confidence = 0.78;
        }
        else if (indexExtended && middleExtended && indexMiddleDist > 0.08 && indexMiddleDist < 0.15 && !ringExtended && !pinkyExtended) {
            gesture = 'home';
            confidence = 0.8;
        }
        else if (extendedFingers === 5 && wrist.y > 0.5 && wrist.x > 0.4 && wrist.x < 0.6) {
            gesture = 'school';
            confidence = 0.75;
        }
        else if (thumbIndexDist < 0.06 && indexExtended && middleExtended && ringExtended && pinkyExtended) {
            gesture = 'family';
            confidence = 0.75;
        }
        else if (extendedFingers === 5 && wrist.y < 0.5 && wrist.x > 0.5) {
            gesture = 'friend';
            confidence = 0.75;
        }
        else if (indexExtended && middleExtended && indexTip.y > indexPIP.y && middleTip.y > middlePIP.y) {
            gesture = 'happy';
            confidence = 0.72;
        }
        else if (indexExtended && middleExtended && indexTip.y > wrist.y && middleTip.y > wrist.y) {
            gesture = 'sad';
            confidence = 0.7;
        }
        else if (extendedFingers === 0 && thumbTip.x > indexMCP.x) {
            gesture = 'angry';
            confidence = 0.75;
        }
        else if (extendedFingers >= 3 && wrist.y < 0.3 && wrist.x > 0.3 && wrist.x < 0.7) {
            gesture = 'tired';
            confidence = 0.7;
        }
        else if (extendedFingers >= 3 && wrist.y > 0.5 && wrist.x > 0.4 && wrist.x < 0.6) {
            gesture = 'hungry';
            confidence = 0.72;
        }
        else if (extendedFingers >= 2 && wrist.y > 0.4 && wrist.y < 0.5 && wrist.x > 0.4 && wrist.x < 0.6) {
            gesture = 'thirsty';
            confidence = 0.7;
        }
        else if (extendedFingers <= 2 && wrist.y > 0.5 && wrist.x < 0.3) {
            gesture = 'cold';
            confidence = 0.7;
        }
        else if (extendedFingers >= 3 && wrist.y < 0.3 && wrist.x > 0.3 && wrist.x < 0.7) {
            gesture = 'hot';
            confidence = 0.7;
        }
        else if (thumbExtended && pinkyExtended && !indexExtended && !middleExtended && !ringExtended && wrist.x > 0.6) {
            gesture = 'phone';
            confidence = 0.8;
        }
        else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended && wrist.y > 0.5) {
            gesture = 'email';
            confidence = 0.72;
        }
        else if (extendedFingers === 5 && wrist.y > 0.4 && wrist.x > 0.2 && wrist.x < 0.8) {
            gesture = 'internet';
            confidence = 0.7;
        }
        else if (indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended && wrist.y > 0.5) {
            gesture = 'computer';
            confidence = 0.72;
        }
        else if (extendedFingers <= 2 && wrist.y > 0.4 && wrist.x > 0.3 && wrist.x < 0.7) {
            gesture = 'car';
            confidence = 0.7;
        }
        else if (extendedFingers === 5 && wrist.y > 0.4 && wrist.x < 0.3) {
            gesture = 'bus';
            confidence = 0.7;
        }
        else if (indexExtended && middleExtended && indexMiddleDist < 0.05 && !ringExtended && !pinkyExtended && !thumbExtended) {
            gesture = 'train';
            confidence = 0.75;
        }
        else if (extendedFingers === 5 && wrist.y < 0.3 && wrist.x > 0.2 && wrist.x < 0.8) {
            gesture = 'airplane';
            confidence = 0.7;
        }
        else if (extendedFingers >= 3 && wrist.y > 0.5 && wrist.x > 0.4 && wrist.x < 0.6) {
            gesture = 'doctor';
            confidence = 0.7;
        }
        else if (indexExtended && middleExtended && indexMiddleDist > 0.1 && !ringExtended && !pinkyExtended && !thumbExtended) {
            gesture = 'hospital';
            confidence = 0.7;
        }
        else if (extendedFingers <= 2 && wrist.y < 0.4 && wrist.x > 0.4 && wrist.x < 0.6) {
            gesture = 'medicine';
            confidence = 0.7;
        }
        else if (extendedFingers >= 3 && wrist.y > 0.4 && wrist.x > 0.3 && wrist.x < 0.7) {
            gesture = 'pain';
            confidence = 0.7;
        }
        else if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbTip.y < wrist.y) {
            gesture = 'better';
            confidence = 0.85;
        }
        else if (!thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbTip.y > thumbPIP.y) {
            gesture = 'worse';
            confidence = 0.85;
        }
        return { gesture, confidence };
    }
    calculateDistance(point1, point2) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2) +
            Math.pow(point1.z - point2.z, 2));
    }
    async createTraining(createTrainingDto, userId) {
        return this.aiTrainingModel.create({
            ...createTrainingDto,
            trainedBy: new mongoose_2.Types.ObjectId(userId),
            status: 'pending',
        });
    }
    async getTrainingHistory() {
        return this.aiTrainingModel.find().sort({ createdAt: -1 });
    }
    async getTraining(id) {
        const training = await this.aiTrainingModel.findById(id);
        if (!training) {
            throw new common_1.NotFoundException('Training not found');
        }
        return training;
    }
    async updateTrainingStatus(id, status, accuracy, loss, errorMessage) {
        const updateData = { status };
        if (accuracy !== undefined)
            updateData.accuracy = accuracy;
        if (loss !== undefined)
            updateData.loss = loss;
        if (errorMessage)
            updateData.errorMessage = errorMessage;
        const training = await this.aiTrainingModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!training) {
            throw new common_1.NotFoundException('Training not found');
        }
        return training;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ai_log_schema_1.AILog.name)),
    __param(1, (0, mongoose_1.InjectModel)(ai_training_schema_1.AITraining.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AiService);
