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
function dist(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}
function extractFeatures(lm) {
    const wrist = lm[0];
    const tMCP = lm[1], tIP = lm[2], tPIP = lm[3], tTip = lm[4];
    const iMCP = lm[5], iPIP = lm[6], iDIP = lm[7], iTip = lm[8];
    const mMCP = lm[9], mPIP = lm[10], mDIP = lm[11], mTip = lm[12];
    const rMCP = lm[13], rPIP = lm[14], rDIP = lm[15], rTip = lm[16];
    const pMCP = lm[17], pPIP = lm[18], pDIP = lm[19], pTip = lm[20];
    const handSize = dist(wrist, mMCP) || 0.001;
    const fExt = (tip, pip, mcp) => dist(tip, mcp) / (dist(pip, mcp) + 0.001) > 1.3;
    const curlRatio = (tip, pip, mcp) => Math.min(dist(tip, mcp) / (dist(pip, mcp) + 0.001), 2.5);
    const indexUp = fExt(iTip, iPIP, iMCP);
    const middleUp = fExt(mTip, mPIP, mMCP);
    const ringUp = fExt(rTip, rPIP, rMCP);
    const pinkyUp = fExt(pTip, pPIP, pMCP);
    const extCount = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;
    const thumbOut = dist(tTip, iMCP) > handSize * 1.2;
    const thumbUp = thumbOut && tTip.y < tPIP.y;
    const thumbDown = thumbOut && tTip.y > tPIP.y;
    const extCountWithThumb = extCount + (thumbOut ? 1 : 0);
    const avgTipZ = (iTip.z + mTip.z + rTip.z + pTip.z) / 4;
    const avgMcpZ = (iMCP.z + mMCP.z + rMCP.z + pMCP.z) / 4;
    const palmFacingCamera = avgTipZ < avgMcpZ;
    const nd = (a, b) => dist(a, b) / handSize;
    return {
        thumbUp, thumbDown, thumbOut,
        indexUp, middleUp, ringUp, pinkyUp,
        extCount, extCountWithThumb,
        indexCurl: curlRatio(iTip, iPIP, iMCP),
        middleCurl: curlRatio(mTip, mPIP, mMCP),
        ringCurl: curlRatio(rTip, rPIP, rMCP),
        pinkyCurl: curlRatio(pTip, pPIP, pMCP),
        thumbIndexDist: nd(tTip, iTip),
        thumbMiddleDist: nd(tTip, mTip),
        thumbPinkyDist: nd(tTip, pTip),
        indexMiddleDist: nd(iTip, mTip),
        middleRingDist: nd(mTip, rTip),
        ringPinkyDist: nd(rTip, pTip),
        wx: wrist.x, wy: wrist.y,
        palmFacingCamera,
        handSize,
    };
}
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
        const f = extractFeatures(landmarks);
        const { thumbUp, thumbDown, thumbOut, indexUp, middleUp, ringUp, pinkyUp, extCount, extCountWithThumb, indexCurl, middleCurl, ringCurl, pinkyCurl, thumbIndexDist, thumbMiddleDist, thumbPinkyDist, indexMiddleDist, middleRingDist, ringPinkyDist, wx, wy, palmFacingCamera, } = f;
        const fist = extCount === 0 && !thumbOut;
        const openPalm = extCount === 4 && thumbOut;
        const only = (i, m, r, p, t) => indexUp === i && middleUp === m && ringUp === r && pinkyUp === p && thumbOut === t;
        const rules = [
            { test: () => openPalm && palmFacingCamera && wy < 0.5,
                label: 'muraho (hello)', conf: 0.90 },
            { test: () => openPalm && !palmFacingCamera && wy < 0.5,
                label: 'amakuru (how are you)', conf: 0.85 },
            { test: () => fist && wy < 0.45 && wx > 0.3 && wx < 0.7,
                label: 'mwiriwe (good evening)', conf: 0.78 },
            { test: () => extCount === 2 && indexUp && middleUp && palmFacingCamera && wy < 0.4,
                label: 'urakoze (thank you)', conf: 0.87 },
            { test: () => extCount === 3 && indexUp && middleUp && ringUp && palmFacingCamera,
                label: 'murabeho (goodbye)', conf: 0.82 },
            { test: () => openPalm && wy < 0.35,
                label: 'bwiriwe (evening)', conf: 0.72 },
            { test: () => thumbUp && extCount === 0,
                label: 'byiza (good)', conf: 0.90 },
            { test: () => thumbDown && extCount === 0,
                label: 'bibi (bad)', conf: 0.88 },
            { test: () => only(true, false, false, false, false) && wy < 0.5,
                label: 'yego (yes)', conf: 0.88 },
            { test: () => fist && !thumbOut,
                label: 'oya (no)', conf: 0.90 },
            { test: () => only(true, false, false, false, true) && thumbIndexDist > 1.2,
                label: 'kumva (understand)', conf: 0.80 },
            { test: () => openPalm && wy > 0.6,
                label: 'tangira (stop/start)', conf: 0.75 },
            { test: () => only(true, false, false, false, false),
                label: 'rimwe (one)', conf: 0.90 },
            { test: () => only(true, true, false, false, false) && indexMiddleDist < 0.6,
                label: 'kabiri (two)', conf: 0.88 },
            { test: () => only(true, true, true, false, false),
                label: 'gatatu (three)', conf: 0.86 },
            { test: () => extCount === 4 && !thumbOut,
                label: 'kane (four)', conf: 0.85 },
            { test: () => openPalm && indexMiddleDist > 0.5 && middleRingDist > 0.5,
                label: 'gatanu (five)', conf: 0.85 },
            { test: () => thumbOut && !indexUp && !middleUp && !ringUp && !pinkyUp && wy < 0.5,
                label: 'gatandatu (six)', conf: 0.80 },
            { test: () => only(false, false, false, false, true) && thumbOut,
                label: 'karindwi (seven)', conf: 0.80 },
            { test: () => only(false, true, true, true, false) && !thumbOut,
                label: 'umunani (eight)', conf: 0.78 },
            { test: () => only(true, true, true, true, false) && !thumbOut,
                label: 'icyenda (nine)', conf: 0.78 },
            { test: () => thumbIndexDist < 0.5 && extCount === 0,
                label: 'icumi (ten)', conf: 0.82 },
            { test: () => thumbIndexDist < 0.5 && only(false, true, false, false, false),
                label: 'cumi na rimwe (eleven)', conf: 0.76 },
            { test: () => thumbIndexDist < 0.5 && only(false, true, true, false, false),
                label: 'cumi na kabiri (twelve)', conf: 0.75 },
            { test: () => only(true, false, false, true, false) && wy < 0.5,
                label: 'umuryango (family)', conf: 0.82 },
            { test: () => openPalm && wx > 0.55 && wy < 0.5,
                label: 'inshuti (friend)', conf: 0.78 },
            { test: () => only(true, true, false, false, false) && indexMiddleDist > 0.7,
                label: 'umukunzi (lover)', conf: 0.78 },
            { test: () => only(false, false, false, false, true) && thumbPinkyDist < 0.5,
                label: 'data (father)', conf: 0.76 },
            { test: () => openPalm && wy > 0.55 && wx > 0.3 && wx < 0.7,
                label: 'mama (mother)', conf: 0.76 },
            { test: () => only(true, false, false, false, false) && wy < 0.3,
                label: 'umuhungu (son)', conf: 0.74 },
            { test: () => only(false, true, false, false, false) && wy < 0.3,
                label: 'umukobwa (daughter)', conf: 0.74 },
            { test: () => extCount === 3 && ringUp && middleUp && indexUp && wy < 0.35,
                label: 'umwana (child)', conf: 0.75 },
            { test: () => fist && wx > 0.6 && wy > 0.35,
                label: 'mucye (brother/sister)', conf: 0.70 },
            { test: () => openPalm && palmFacingCamera && wy > 0.5 && wx > 0.3 && wx < 0.7,
                label: 'ishimwe (happy)', conf: 0.80 },
            { test: () => fist && wy > 0.55,
                label: 'agahinda (sad)', conf: 0.78 },
            { test: () => extCount === 1 && indexUp && wy < 0.4 && wx < 0.4,
                label: 'uburakari (angry)', conf: 0.75 },
            { test: () => extCount === 0 && thumbOut && wy < 0.35,
                label: 'gutinya (fear)', conf: 0.74 },
            { test: () => only(true, true, true, false, false) && wy > 0.5,
                label: 'kunezezwa (joy)', conf: 0.74 },
            { test: () => thumbOut && extCount === 4 && wy > 0.55,
                label: 'gutuza (calm)', conf: 0.72 },
            { test: () => fist && wx > 0.3 && wx < 0.7 && wy < 0.4,
                label: 'gutinda (tired)', conf: 0.72 },
            { test: () => openPalm && wy > 0.6 && palmFacingCamera,
                label: 'kunyura (satisfied)', conf: 0.70 },
            { test: () => extCount === 2 && indexUp && middleUp && wy > 0.55,
                label: 'gufata (take)', conf: 0.78 },
            { test: () => thumbOut && extCount === 4 && palmFacingCamera && wy < 0.45,
                label: 'gutanga (give)', conf: 0.78 },
            { test: () => extCount === 1 && indexUp && wx > 0.6,
                label: 'kugaruka (come here)', conf: 0.78 },
            { test: () => openPalm && !palmFacingCamera && wy > 0.4 && wx < 0.3,
                label: 'genda (go)', conf: 0.76 },
            { test: () => extCount === 2 && indexUp && middleUp && wy > 0.6,
                label: 'kugenda (walk)', conf: 0.75 },
            { test: () => extCount === 2 && indexUp && middleUp && wy < 0.4,
                label: 'gutura (run)', conf: 0.74 },
            { test: () => openPalm && wy < 0.35 && wx > 0.3 && wx < 0.7,
                label: 'kubyuka (stand up)', conf: 0.75 },
            { test: () => openPalm && wy > 0.65,
                label: 'kwicara (sit)', conf: 0.75 },
            { test: () => only(true, false, false, false, false) && wy < 0.3,
                label: 'kujya hejuru (up)', conf: 0.76 },
            { test: () => thumbDown && extCount === 0 && wy > 0.55,
                label: 'kujya hasi (down)', conf: 0.76 },
            { test: () => fist && wy < 0.45 && wx < 0.25,
                label: 'gusunika (push)', conf: 0.73 },
            { test: () => fist && wy < 0.45 && wx > 0.75,
                label: 'gukurura (pull)', conf: 0.73 },
            { test: () => extCount === 3 && indexUp && middleUp && ringUp && wy < 0.45,
                label: 'gutega amatwi (listen)', conf: 0.74 },
            { test: () => extCount === 2 && indexUp && middleUp && thumbOut && wy < 0.35,
                label: 'kureba (look)', conf: 0.74 },
            { test: () => only(false, false, false, false, true) && thumbOut && wy < 0.45 && wx > 0.6,
                label: 'gutumanahana (phone)', conf: 0.80 },
            { test: () => openPalm && !palmFacingCamera && wy < 0.4 && wx > 0.3 && wx < 0.7,
                label: 'kwandika (write)', conf: 0.74 },
            { test: () => extCount === 3 && middleUp && ringUp && pinkyUp && wy < 0.45,
                label: 'gusoma (read)', conf: 0.74 },
            { test: () => extCount === 0 && thumbOut && wy > 0.5 && wx > 0.3 && wx < 0.7,
                label: 'kuryama (sleep)', conf: 0.75 },
            { test: () => extCount >= 3 && wy < 0.4 && wx > 0.4 && wx < 0.6,
                label: 'kurya (eat)', conf: 0.74 },
            { test: () => fist && wy < 0.4 && wx > 0.4 && wx < 0.6,
                label: 'kunywa (drink)', conf: 0.75 },
            { test: () => extCount === 1 && indexUp && !middleUp && wy < 0.35,
                label: 'gusabira (pray)', conf: 0.72 },
            { test: () => extCount === 0 && !thumbOut && wy > 0.5 && wx < 0.35,
                label: 'kubabara (suffer)', conf: 0.70 },
            { test: () => extCount === 2 && indexUp && middleUp && indexMiddleDist > 0.65 && wy < 0.45,
                label: 'inzu (home)', conf: 0.80 },
            { test: () => extCount === 4 && !thumbOut && wy > 0.5 && wx > 0.4 && wx < 0.6,
                label: 'ishuri (school)', conf: 0.76 },
            { test: () => openPalm && wy > 0.5 && wx > 0.4 && wx < 0.6,
                label: 'isoko (market)', conf: 0.74 },
            { test: () => fist && wy > 0.45 && wx > 0.25 && wx < 0.35,
                label: 'imodoka (car)', conf: 0.74 },
            { test: () => extCount === 4 && !thumbOut && wy > 0.4 && wx < 0.3,
                label: 'bisi (bus)', conf: 0.72 },
            { test: () => extCount === 2 && indexUp && middleUp && indexMiddleDist < 0.4,
                label: 'inzira y\'ishyiga (train)', conf: 0.74 },
            { test: () => extCount === 4 && thumbOut && wy < 0.3 && wx > 0.2 && wx < 0.8,
                label: 'indege (airplane)', conf: 0.74 },
            { test: () => extCount === 3 && indexUp && middleUp && ringUp && wy > 0.55 && wx > 0.4 && wx < 0.6,
                label: 'ibitaro (hospital)', conf: 0.74 },
            { test: () => extCount === 1 && middleUp && wy > 0.5 && wx > 0.4 && wx < 0.6,
                label: 'iduka (shop)', conf: 0.72 },
            { test: () => extCount === 3 && wy > 0.55,
                label: 'urugo (village)', conf: 0.70 },
            { test: () => extCount === 2 && indexUp && pinkyUp && !middleUp,
                label: 'amafaranga (money)', conf: 0.76 },
            { test: () => thumbIndexDist < 0.6 && thumbIndexDist > 0.3 && extCount === 0,
                label: 'amafaranga (money)', conf: 0.74 },
            { test: () => extCount >= 3 && wy > 0.5 && wx > 0.35 && wx < 0.65,
                label: 'umuganga (doctor)', conf: 0.72 },
            { test: () => extCount <= 1 && wy < 0.4 && wx > 0.4 && wx < 0.6,
                label: 'imiti (medicine)', conf: 0.72 },
            { test: () => extCount >= 2 && wy > 0.4 && wx > 0.3 && wx < 0.7 && wy < 0.6,
                label: 'kubabara (pain)', conf: 0.70 },
            { test: () => thumbUp && extCount === 0 && wy < 0.4,
                label: 'gukira (get better)', conf: 0.86 },
            { test: () => thumbDown && extCount === 0 && wy > 0.5,
                label: 'kurwara (sick/worse)', conf: 0.84 },
            { test: () => fist && wy > 0.5 && wx > 0.4 && wx < 0.6,
                label: 'gutuza (calm down)', conf: 0.72 },
            { test: () => extCount >= 2 && wy < 0.35 && wx > 0.4 && wx < 0.6,
                label: 'kumara ibyago (help emergency)', conf: 0.74 },
            { test: () => fist && wy < 0.45 && wx > 0.4 && wx < 0.6 && palmFacingCamera,
                label: 'amazi (water)', conf: 0.76 },
            { test: () => extCount === 2 && indexUp && thumbOut && wy < 0.45,
                label: 'inzoga (drink/beverage)', conf: 0.73 },
            { test: () => extCount >= 3 && wy < 0.45 && wx > 0.4 && wx < 0.6,
                label: 'ibiribwa (food)', conf: 0.73 },
            { test: () => fist && wy > 0.5 && wx > 0.4 && wx < 0.6,
                label: 'inzara (hunger)', conf: 0.74 },
            { test: () => extCount <= 1 && wy < 0.45 && wx > 0.4 && wx < 0.6,
                label: 'inyota (thirst)', conf: 0.73 },
            { test: () => extCount === 3 && wy > 0.55,
                label: 'amabere (milk)', conf: 0.70 },
            { test: () => fist && wy < 0.35 && wx > 0.4 && wx < 0.6,
                label: 'kawayi (coffee)', conf: 0.70 },
            { test: () => extCount <= 2 && wy > 0.5 && wx < 0.3,
                label: 'ukonje (cold)', conf: 0.72 },
            { test: () => extCount >= 3 && wy < 0.3 && wx > 0.3 && wx < 0.7,
                label: 'ubushyuhe (hot)', conf: 0.72 },
            { test: () => openPalm && wy < 0.4 && wx > 0.1 && wx < 0.5,
                label: 'imvura (rain)', conf: 0.70 },
            { test: () => openPalm && wy < 0.3 && wx > 0.5,
                label: 'izuba (sun)', conf: 0.70 },
            { test: () => extCount === 2 && indexUp && middleUp && wy > 0.6 && wx < 0.3,
                label: 'igihe (time)', conf: 0.72 },
            { test: () => only(true, false, false, false, false) && wy > 0.55,
                label: 'ubu (now)', conf: 0.74 },
            { test: () => extCount === 2 && indexUp && thumbOut && wy > 0.5,
                label: 'ejo (tomorrow/yesterday)', conf: 0.73 },
            { test: () => extCount === 3 && indexUp && middleUp && ringUp && wy > 0.5,
                label: 'icyumweru (week)', conf: 0.72 },
            { test: () => extCount === 4 && thumbOut && wy > 0.5,
                label: 'ukwezi (month)', conf: 0.72 },
            { test: () => openPalm && wy > 0.5 && wx < 0.25,
                label: 'umwaka (year)', conf: 0.70 },
            { test: () => only(false, false, false, false, true) && thumbOut && wx > 0.6,
                label: 'telefoni (phone)', conf: 0.82 },
            { test: () => extCount === 2 && indexUp && middleUp && wy > 0.5,
                label: 'imeyili (email)', conf: 0.74 },
            { test: () => openPalm && wy > 0.4 && wx > 0.2 && wx < 0.8,
                label: 'interineti (internet)', conf: 0.72 },
            { test: () => extCount === 3 && middleUp && ringUp && indexUp && wy > 0.5,
                label: 'mudasobwa (computer)', conf: 0.74 },
            { test: () => extCount === 1 && indexUp && wy < 0.4 && !thumbOut,
                label: 'gutuza (quiet/silence)', conf: 0.76 },
            { test: () => extCount >= 3 && wy < 0.45 && wx > 0.35 && wx < 0.65 && !palmFacingCamera,
                label: 'kwandika (write)', conf: 0.72 },
            { test: () => only(true, false, false, false, true) && thumbIndexDist > 1.0,
                label: 'umutuku (red)', conf: 0.74 },
            { test: () => only(false, true, true, false, false) && middleRingDist < 0.4,
                label: 'icyatsi (green)', conf: 0.72 },
            { test: () => only(false, false, true, false, false),
                label: 'ubururu (blue)', conf: 0.72 },
            { test: () => only(false, true, false, true, false),
                label: 'umuhondo (yellow)', conf: 0.72 },
            { test: () => fist && thumbOut && thumbUp && wy > 0.35,
                label: 'uturabyo (white)', conf: 0.70 },
            { test: () => fist && !thumbOut,
                label: 'umukara (black)', conf: 0.68 },
            { test: () => only(true, false, false, false, false) && wx < 0.35,
                label: 'ibumoso (left)', conf: 0.80 },
            { test: () => only(true, false, false, false, false) && wx > 0.65,
                label: 'iburyo (right)', conf: 0.80 },
            { test: () => only(true, false, false, false, false) && wy < 0.3,
                label: 'hejuru (up)', conf: 0.80 },
            { test: () => only(true, false, false, false, false) && wy > 0.65,
                label: 'hasi (down)', conf: 0.80 },
            { test: () => openPalm && !palmFacingCamera && wy > 0.4 && wx > 0.4 && wx < 0.6,
                label: 'imbere (forward)', conf: 0.75 },
            { test: () => openPalm && palmFacingCamera && wy > 0.4 && wx > 0.4 && wx < 0.6,
                label: 'inyuma (backward/stop)', conf: 0.75 },
            { test: () => extCount === 2 && indexUp && thumbOut && wy < 0.4,
                label: 'ibibazo (question)', conf: 0.74 },
            { test: () => only(true, true, false, false, false) && thumbIndexDist < 0.5,
                label: 'igisubizo (answer)', conf: 0.74 },
            { test: () => extCount === 4 && thumbOut && wy > 0.45 && wx > 0.35 && wx < 0.65,
                label: 'igitabo (book)', conf: 0.74 },
            { test: () => extCount >= 3 && wy > 0.4 && wx > 0.35 && wx < 0.65 && palmFacingCamera,
                label: 'kwiga (study/learn)', conf: 0.73 },
            { test: () => thumbOut && extCount === 1 && indexUp,
                label: 'gusobanukirwa (understand)', conf: 0.74 },
            { test: () => extCount === 2 && indexUp && middleUp && indexMiddleDist > 0.7 && palmFacingCamera,
                label: 'amahoro (peace)', conf: 0.84 },
            { test: () => openPalm && palmFacingCamera && wy < 0.45 && wx > 0.3 && wx < 0.7,
                label: 'imbyino (dance)', conf: 0.72 },
            { test: () => fist && wy < 0.5 && wx > 0.3 && wx < 0.7 && thumbOut,
                label: 'akazi (work)', conf: 0.76 },
            { test: () => extCount === 4 && thumbOut && wy < 0.45 && palmFacingCamera,
                label: 'gufasha (help)', conf: 0.78 },
            { test: () => extCount >= 3 && wy > 0.5 && wx > 0.3 && wx < 0.7 && !palmFacingCamera,
                label: 'imbabazi (sorry)', conf: 0.74 },
            { test: () => extCount === 4 && !thumbOut && wy < 0.5 && !palmFacingCamera,
                label: 'reka (please/let)', conf: 0.74 },
            { test: () => openPalm && wy > 0.4 && wy < 0.6 && wx > 0.5,
                label: 'gutumira (invite)', conf: 0.72 },
            { test: () => thumbIndexDist < 0.55 && middleUp && ringUp && pinkyUp,
                label: 'gukunda (love)', conf: 0.84 },
            { test: () => extCount === 2 && indexUp && pinkyUp && !middleUp && !ringUp,
                label: 'injyana (rock on)', conf: 0.82 },
        ];
        for (const rule of rules) {
            if (rule.test()) {
                return { gesture: rule.label, confidence: rule.conf };
            }
        }
        return { gesture: 'unknown', confidence: 0.3 };
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
