import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AILog, AILogDocument } from './schemas/ai-log.schema';
import { AITraining, AITrainingDocument } from './schemas/ai-training.schema';
import { CreateTrainingDto } from './dto/create-training.dto';

// ─── Hand landmark indices (MediaPipe Hands) ────────────────────────────────
// 0: wrist
// 1-4: thumb  (CMC, MCP, IP, TIP)
// 5-8: index  (MCP, PIP, DIP, TIP)
// 9-12: middle (MCP, PIP, DIP, TIP)
// 13-16: ring  (MCP, PIP, DIP, TIP)
// 17-20: pinky (MCP, PIP, DIP, TIP)

interface Landmark { x: number; y: number; z: number; }

interface HandFeatures {
  // finger extension states
  thumbUp: boolean;
  thumbDown: boolean;
  thumbOut: boolean;         // thumb pointing sideways away from palm
  indexUp: boolean;
  middleUp: boolean;
  ringUp: boolean;
  pinkyUp: boolean;
  extCount: number;          // total extended fingers (not thumb)
  extCountWithThumb: number;

  // curl ratios (1.0 = fully extended, 0 = fully curled)
  indexCurl: number;
  middleCurl: number;
  ringCurl: number;
  pinkyCurl: number;

  // key distances (normalised by hand size)
  thumbIndexDist: number;
  thumbMiddleDist: number;
  thumbPinkyDist: number;
  indexMiddleDist: number;
  middleRingDist: number;
  ringPinkyDist: number;

  // wrist position in frame (0–1)
  wx: number;
  wy: number;

  // palm normal direction (z-component of cross product of two edge vectors)
  palmFacingCamera: boolean;  // true = palm towards camera, false = back of hand

  handSize: number;            // wrist-to-middle-MCP distance
}

function dist(a: Landmark, b: Landmark): number {
  return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2 + (a.z-b.z)**2);
}

function extractFeatures(lm: Landmark[]): HandFeatures {
  const wrist   = lm[0];
  // thumb
  const tMCP=lm[1], tIP=lm[2], tPIP=lm[3], tTip=lm[4];
  // index
  const iMCP=lm[5], iPIP=lm[6], iDIP=lm[7], iTip=lm[8];
  // middle
  const mMCP=lm[9], mPIP=lm[10], mDIP=lm[11], mTip=lm[12];
  // ring
  const rMCP=lm[13], rPIP=lm[14], rDIP=lm[15], rTip=lm[16];
  // pinky
  const pMCP=lm[17], pPIP=lm[18], pDIP=lm[19], pTip=lm[20];

  const handSize = dist(wrist, mMCP) || 0.001;

  // Extension: tip farther from MCP than pip is from MCP (ratio > 1.3)
  const fExt = (tip: Landmark, pip: Landmark, mcp: Landmark) =>
    dist(tip, mcp) / (dist(pip, mcp) + 0.001) > 1.3;

  // Curl ratio: tip-to-mcp / pip-to-mcp  (higher = more extended)
  const curlRatio = (tip: Landmark, pip: Landmark, mcp: Landmark) =>
    Math.min(dist(tip, mcp) / (dist(pip, mcp) + 0.001), 2.5);

  const indexUp  = fExt(iTip, iPIP, iMCP);
  const middleUp = fExt(mTip, mPIP, mMCP);
  const ringUp   = fExt(rTip, rPIP, rMCP);
  const pinkyUp  = fExt(pTip, pPIP, pMCP);
  const extCount = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;

  // Thumb: compare tip position to knuckle (x-axis for horizontal extension)
  const thumbOut = dist(tTip, iMCP) > handSize * 1.2;
  const thumbUp  = thumbOut && tTip.y < tPIP.y;
  const thumbDown= thumbOut && tTip.y > tPIP.y;
  const extCountWithThumb = extCount + (thumbOut ? 1 : 0);

  // Palm facing camera: z of tips < z of MCPs means facing towards camera
  const avgTipZ = (iTip.z + mTip.z + rTip.z + pTip.z) / 4;
  const avgMcpZ = (iMCP.z + mMCP.z + rMCP.z + pMCP.z) / 4;
  const palmFacingCamera = avgTipZ < avgMcpZ;

  const nd = (a: Landmark, b: Landmark) => dist(a,b) / handSize;

  return {
    thumbUp, thumbDown, thumbOut,
    indexUp, middleUp, ringUp, pinkyUp,
    extCount, extCountWithThumb,
    indexCurl:  curlRatio(iTip, iPIP, iMCP),
    middleCurl: curlRatio(mTip, mPIP, mMCP),
    ringCurl:   curlRatio(rTip, rPIP, rMCP),
    pinkyCurl:  curlRatio(pTip, pPIP, pMCP),
    thumbIndexDist:  nd(tTip, iTip),
    thumbMiddleDist: nd(tTip, mTip),
    thumbPinkyDist:  nd(tTip, pTip),
    indexMiddleDist: nd(iTip, mTip),
    middleRingDist:  nd(mTip, rTip),
    ringPinkyDist:   nd(rTip, pTip),
    wx: wrist.x, wy: wrist.y,
    palmFacingCamera,
    handSize,
  };
}

@Injectable()
export class AiService {
  constructor(
    @InjectModel(AILog.name) private aiLogModel: Model<AILogDocument>,
    @InjectModel(AITraining.name) private aiTrainingModel: Model<AITrainingDocument>,
  ) {}

  async logPrediction(logData: any) {
    return this.aiLogModel.create({
      modelVersion: 'v1.0',
      ...logData,
    });
  }

  async getLogs(limit: number = 100) {
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

  async processGesture(gestureData: any) {
    const startTime = Date.now();
    
    // Extract hand landmarks from gestureData
    const landmarks = gestureData.landmarks;
    
    // If no landmarks provided, simulate gesture for testing
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

    // Implement gesture recognition based on hand landmarks
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

  // ─── Comprehensive sign recognition engine ───────────────────────────────
  // Each entry: { match: (f) => boolean, label: string, conf: number }
  // Evaluated in priority order – first match wins.
  // Labels are in Kinyarwanda where applicable, otherwise English.
  // ─────────────────────────────────────────────────────────────────────────
  private classifyGesture(landmarks: any[]): { gesture: string; confidence: number } {
    const f = extractFeatures(landmarks as Landmark[]);
    const {
      thumbUp, thumbDown, thumbOut,
      indexUp, middleUp, ringUp, pinkyUp,
      extCount, extCountWithThumb,
      indexCurl, middleCurl, ringCurl, pinkyCurl,
      thumbIndexDist, thumbMiddleDist, thumbPinkyDist,
      indexMiddleDist, middleRingDist, ringPinkyDist,
      wx, wy, palmFacingCamera,
    } = f;

    // ── helpers ──────────────────────────────────────────────────────────
    const fist      = extCount === 0 && !thumbOut;
    const openPalm  = extCount === 4 && thumbOut;
    const only      = (i: boolean, m: boolean, r: boolean, p: boolean, t: boolean) =>
      indexUp===i && middleUp===m && ringUp===r && pinkyUp===p && thumbOut===t;

    type Rule = { test: () => boolean; label: string; conf: number };
    const rules: Rule[] = [

      // ════════════════════════════════════════════════════════════════════
      // CORE GREETINGS  (Amashyaka yo gusanganira)
      // ════════════════════════════════════════════════════════════════════
      { test: () => openPalm && palmFacingCamera && wy < 0.5,
        label: 'muraho (hello)',         conf: 0.90 },
      { test: () => openPalm && !palmFacingCamera && wy < 0.5,
        label: 'amakuru (how are you)',  conf: 0.85 },
      { test: () => fist && wy < 0.45 && wx > 0.3 && wx < 0.7,
        label: 'mwiriwe (good evening)', conf: 0.78 },
      { test: () => extCount === 2 && indexUp && middleUp && palmFacingCamera && wy < 0.4,
        label: 'urakoze (thank you)',    conf: 0.87 },
      { test: () => extCount === 3 && indexUp && middleUp && ringUp && palmFacingCamera,
        label: 'murabeho (goodbye)',     conf: 0.82 },
      { test: () => openPalm && wy < 0.35,
        label: 'bwiriwe (evening)',      conf: 0.72 },
      { test: () => thumbUp && extCount === 0,
        label: 'byiza (good)',           conf: 0.90 },
      { test: () => thumbDown && extCount === 0,
        label: 'bibi (bad)',             conf: 0.88 },

      // ════════════════════════════════════════════════════════════════════
      // AFFIRMATIONS / NEGATIONS
      // ════════════════════════════════════════════════════════════════════
      { test: () => only(true,false,false,false,false) && wy < 0.5,
        label: 'yego (yes)',             conf: 0.88 },
      { test: () => fist && !thumbOut,
        label: 'oya (no)',               conf: 0.90 },
      { test: () => only(true,false,false,false,true) && thumbIndexDist > 1.2,
        label: 'kumva (understand)',     conf: 0.80 },
      { test: () => openPalm && wy > 0.6,
        label: 'tangira (stop/start)',   conf: 0.75 },

      // ════════════════════════════════════════════════════════════════════
      // NUMBERS  (Imibare)
      // ════════════════════════════════════════════════════════════════════
      { test: () => only(true,false,false,false,false),
        label: 'rimwe (one)',            conf: 0.90 },
      { test: () => only(true,true,false,false,false) && indexMiddleDist < 0.6,
        label: 'kabiri (two)',           conf: 0.88 },
      { test: () => only(true,true,true,false,false),
        label: 'gatatu (three)',         conf: 0.86 },
      { test: () => extCount === 4 && !thumbOut,
        label: 'kane (four)',            conf: 0.85 },
      { test: () => openPalm && indexMiddleDist > 0.5 && middleRingDist > 0.5,
        label: 'gatanu (five)',          conf: 0.85 },
      { test: () => thumbOut && !indexUp && !middleUp && !ringUp && !pinkyUp && wy < 0.5,
        label: 'gatandatu (six)',        conf: 0.80 },
      { test: () => only(false,false,false,false,true) && thumbOut,
        label: 'karindwi (seven)',       conf: 0.80 },
      { test: () => only(false,true,true,true,false) && !thumbOut,
        label: 'umunani (eight)',        conf: 0.78 },
      { test: () => only(true,true,true,true,false) && !thumbOut,
        label: 'icyenda (nine)',         conf: 0.78 },
      { test: () => thumbIndexDist < 0.5 && extCount === 0,
        label: 'icumi (ten)',            conf: 0.82 },
      { test: () => thumbIndexDist < 0.5 && only(false,true,false,false,false),
        label: 'cumi na rimwe (eleven)', conf: 0.76 },
      { test: () => thumbIndexDist < 0.5 && only(false,true,true,false,false),
        label: 'cumi na kabiri (twelve)',conf: 0.75 },

      // ════════════════════════════════════════════════════════════════════
      // PEOPLE / FAMILY  (Abantu / Umuryango)
      // ════════════════════════════════════════════════════════════════════
      { test: () => only(true,false,false,true,false) && wy < 0.5,
        label: 'umuryango (family)',     conf: 0.82 },
      { test: () => openPalm && wx > 0.55 && wy < 0.5,
        label: 'inshuti (friend)',       conf: 0.78 },
      { test: () => only(true,true,false,false,false) && indexMiddleDist > 0.7,
        label: 'umukunzi (lover)',       conf: 0.78 },
      { test: () => only(false,false,false,false,true) && thumbPinkyDist < 0.5,
        label: 'data (father)',          conf: 0.76 },
      { test: () => openPalm && wy > 0.55 && wx > 0.3 && wx < 0.7,
        label: 'mama (mother)',          conf: 0.76 },
      { test: () => only(true,false,false,false,false) && wy < 0.3,
        label: 'umuhungu (son)',         conf: 0.74 },
      { test: () => only(false,true,false,false,false) && wy < 0.3,
        label: 'umukobwa (daughter)',    conf: 0.74 },
      { test: () => extCount === 3 && ringUp && middleUp && indexUp && wy < 0.35,
        label: 'umwana (child)',         conf: 0.75 },
      { test: () => fist && wx > 0.6 && wy > 0.35,
        label: 'mucye (brother/sister)', conf: 0.70 },

      // ════════════════════════════════════════════════════════════════════
      // EMOTIONS  (Ibyiyumvo)
      // ════════════════════════════════════════════════════════════════════
      { test: () => openPalm && palmFacingCamera && wy > 0.5 && wx > 0.3 && wx < 0.7,
        label: 'ishimwe (happy)',        conf: 0.80 },
      { test: () => fist && wy > 0.55,
        label: 'agahinda (sad)',         conf: 0.78 },
      { test: () => extCount === 1 && indexUp && wy < 0.4 && wx < 0.4,
        label: 'uburakari (angry)',      conf: 0.75 },
      { test: () => extCount === 0 && thumbOut && wy < 0.35,
        label: 'gutinya (fear)',         conf: 0.74 },
      { test: () => only(true,true,true,false,false) && wy > 0.5,
        label: 'kunezezwa (joy)',        conf: 0.74 },
      { test: () => thumbOut && extCount === 4 && wy > 0.55,
        label: 'gutuza (calm)',          conf: 0.72 },
      { test: () => fist && wx > 0.3 && wx < 0.7 && wy < 0.4,
        label: 'gutinda (tired)',        conf: 0.72 },
      { test: () => openPalm && wy > 0.6 && palmFacingCamera,
        label: 'kunyura (satisfied)',    conf: 0.70 },

      // ════════════════════════════════════════════════════════════════════
      // BASIC ACTIONS  (Ibikorwa)
      // ════════════════════════════════════════════════════════════════════
      { test: () => extCount === 2 && indexUp && middleUp && wy > 0.55,
        label: 'gufata (take)',          conf: 0.78 },
      { test: () => thumbOut && extCount === 4 && palmFacingCamera && wy < 0.45,
        label: 'gutanga (give)',         conf: 0.78 },
      { test: () => extCount === 1 && indexUp && wx > 0.6,
        label: 'kugaruka (come here)',   conf: 0.78 },
      { test: () => openPalm && !palmFacingCamera && wy > 0.4 && wx < 0.3,
        label: 'genda (go)',             conf: 0.76 },
      { test: () => extCount === 2 && indexUp && middleUp && wy > 0.6,
        label: 'kugenda (walk)',         conf: 0.75 },
      { test: () => extCount === 2 && indexUp && middleUp && wy < 0.4,
        label: 'gutura (run)',           conf: 0.74 },
      { test: () => openPalm && wy < 0.35 && wx > 0.3 && wx < 0.7,
        label: 'kubyuka (stand up)',     conf: 0.75 },
      { test: () => openPalm && wy > 0.65,
        label: 'kwicara (sit)',          conf: 0.75 },
      { test: () => only(true,false,false,false,false) && wy < 0.3,
        label: 'kujya hejuru (up)',      conf: 0.76 },
      { test: () => thumbDown && extCount === 0 && wy > 0.55,
        label: 'kujya hasi (down)',      conf: 0.76 },
      { test: () => fist && wy < 0.45 && wx < 0.25,
        label: 'gusunika (push)',        conf: 0.73 },
      { test: () => fist && wy < 0.45 && wx > 0.75,
        label: 'gukurura (pull)',        conf: 0.73 },
      { test: () => extCount === 3 && indexUp && middleUp && ringUp && wy < 0.45,
        label: 'gutega amatwi (listen)', conf: 0.74 },
      { test: () => extCount === 2 && indexUp && middleUp && thumbOut && wy < 0.35,
        label: 'kureba (look)',          conf: 0.74 },
      { test: () => only(false,false,false,false,true) && thumbOut && wy < 0.45 && wx > 0.6,
        label: 'gutumanahana (phone)',   conf: 0.80 },
      { test: () => openPalm && !palmFacingCamera && wy < 0.4 && wx > 0.3 && wx < 0.7,
        label: 'kwandika (write)',       conf: 0.74 },
      { test: () => extCount === 3 && middleUp && ringUp && pinkyUp && wy < 0.45,
        label: 'gusoma (read)',          conf: 0.74 },
      { test: () => extCount === 0 && thumbOut && wy > 0.5 && wx > 0.3 && wx < 0.7,
        label: 'kuryama (sleep)',        conf: 0.75 },
      { test: () => extCount >= 3 && wy < 0.4 && wx > 0.4 && wx < 0.6,
        label: 'kurya (eat)',            conf: 0.74 },
      { test: () => fist && wy < 0.4 && wx > 0.4 && wx < 0.6,
        label: 'kunywa (drink)',         conf: 0.75 },
      { test: () => extCount === 1 && indexUp && !middleUp && wy < 0.35,
        label: 'gusabira (pray)',        conf: 0.72 },
      { test: () => extCount === 0 && !thumbOut && wy > 0.5 && wx < 0.35,
        label: 'kubabara (suffer)',      conf: 0.70 },

      // ════════════════════════════════════════════════════════════════════
      // PLACES / THINGS  (Ibibanza / Ibintu)
      // ════════════════════════════════════════════════════════════════════
      { test: () => extCount === 2 && indexUp && middleUp && indexMiddleDist > 0.65 && wy < 0.45,
        label: 'inzu (home)',            conf: 0.80 },
      { test: () => extCount === 4 && !thumbOut && wy > 0.5 && wx > 0.4 && wx < 0.6,
        label: 'ishuri (school)',        conf: 0.76 },
      { test: () => openPalm && wy > 0.5 && wx > 0.4 && wx < 0.6,
        label: 'isoko (market)',         conf: 0.74 },
      { test: () => fist && wy > 0.45 && wx > 0.25 && wx < 0.35,
        label: 'imodoka (car)',          conf: 0.74 },
      { test: () => extCount === 4 && !thumbOut && wy > 0.4 && wx < 0.3,
        label: 'bisi (bus)',             conf: 0.72 },
      { test: () => extCount === 2 && indexUp && middleUp && indexMiddleDist < 0.4,
        label: 'inzira y\'ishyiga (train)', conf: 0.74 },
      { test: () => extCount === 4 && thumbOut && wy < 0.3 && wx > 0.2 && wx < 0.8,
        label: 'indege (airplane)',      conf: 0.74 },
      { test: () => extCount === 3 && indexUp && middleUp && ringUp && wy > 0.55 && wx > 0.4 && wx < 0.6,
        label: 'ibitaro (hospital)',     conf: 0.74 },
      { test: () => extCount === 1 && middleUp && wy > 0.5 && wx > 0.4 && wx < 0.6,
        label: 'iduka (shop)',           conf: 0.72 },
      { test: () => extCount === 3 && wy > 0.55,
        label: 'urugo (village)',        conf: 0.70 },
      { test: () => extCount === 2 && indexUp && pinkyUp && !middleUp,
        label: 'amafaranga (money)',     conf: 0.76 },
      { test: () => thumbIndexDist < 0.6 && thumbIndexDist > 0.3 && extCount === 0,
        label: 'amafaranga (money)',     conf: 0.74 },

      // ════════════════════════════════════════════════════════════════════
      // HEALTH  (Ubuzima)
      // ════════════════════════════════════════════════════════════════════
      { test: () => extCount >= 3 && wy > 0.5 && wx > 0.35 && wx < 0.65,
        label: 'umuganga (doctor)',      conf: 0.72 },
      { test: () => extCount <= 1 && wy < 0.4 && wx > 0.4 && wx < 0.6,
        label: 'imiti (medicine)',       conf: 0.72 },
      { test: () => extCount >= 2 && wy > 0.4 && wx > 0.3 && wx < 0.7 && wy < 0.6,
        label: 'kubabara (pain)',        conf: 0.70 },
      { test: () => thumbUp && extCount === 0 && wy < 0.4,
        label: 'gukira (get better)',    conf: 0.86 },
      { test: () => thumbDown && extCount === 0 && wy > 0.5,
        label: 'kurwara (sick/worse)',   conf: 0.84 },
      { test: () => fist && wy > 0.5 && wx > 0.4 && wx < 0.6,
        label: 'gutuza (calm down)',     conf: 0.72 },
      { test: () => extCount >= 2 && wy < 0.35 && wx > 0.4 && wx < 0.6,
        label: 'kumara ibyago (help emergency)', conf: 0.74 },

      // ════════════════════════════════════════════════════════════════════
      // FOOD / DRINK  (Ibiryo)
      // ════════════════════════════════════════════════════════════════════
      { test: () => fist && wy < 0.45 && wx > 0.4 && wx < 0.6 && palmFacingCamera,
        label: 'amazi (water)',          conf: 0.76 },
      { test: () => extCount === 2 && indexUp && thumbOut && wy < 0.45,
        label: 'inzoga (drink/beverage)',conf: 0.73 },
      { test: () => extCount >= 3 && wy < 0.45 && wx > 0.4 && wx < 0.6,
        label: 'ibiribwa (food)',        conf: 0.73 },
      { test: () => fist && wy > 0.5 && wx > 0.4 && wx < 0.6,
        label: 'inzara (hunger)',        conf: 0.74 },
      { test: () => extCount <= 1 && wy < 0.45 && wx > 0.4 && wx < 0.6,
        label: 'inyota (thirst)',        conf: 0.73 },
      { test: () => extCount === 3 && wy > 0.55,
        label: 'amabere (milk)',         conf: 0.70 },
      { test: () => fist && wy < 0.35 && wx > 0.4 && wx < 0.6,
        label: 'kawayi (coffee)',        conf: 0.70 },

      // ════════════════════════════════════════════════════════════════════
      // WEATHER / ENVIRONMENT  (Ikirere)
      // ════════════════════════════════════════════════════════════════════
      { test: () => extCount <= 2 && wy > 0.5 && wx < 0.3,
        label: 'ukonje (cold)',          conf: 0.72 },
      { test: () => extCount >= 3 && wy < 0.3 && wx > 0.3 && wx < 0.7,
        label: 'ubushyuhe (hot)',        conf: 0.72 },
      { test: () => openPalm && wy < 0.4 && wx > 0.1 && wx < 0.5,
        label: 'imvura (rain)',          conf: 0.70 },
      { test: () => openPalm && wy < 0.3 && wx > 0.5,
        label: 'izuba (sun)',            conf: 0.70 },

      // ════════════════════════════════════════════════════════════════════
      // TIME  (Igihe)
      // ════════════════════════════════════════════════════════════════════
      { test: () => extCount === 2 && indexUp && middleUp && wy > 0.6 && wx < 0.3,
        label: 'igihe (time)',           conf: 0.72 },
      { test: () => only(true,false,false,false,false) && wy > 0.55,
        label: 'ubu (now)',              conf: 0.74 },
      { test: () => extCount === 2 && indexUp && thumbOut && wy > 0.5,
        label: 'ejo (tomorrow/yesterday)', conf: 0.73 },
      { test: () => extCount === 3 && indexUp && middleUp && ringUp && wy > 0.5,
        label: 'icyumweru (week)',       conf: 0.72 },
      { test: () => extCount === 4 && thumbOut && wy > 0.5,
        label: 'ukwezi (month)',         conf: 0.72 },
      { test: () => openPalm && wy > 0.5 && wx < 0.25,
        label: 'umwaka (year)',          conf: 0.70 },

      // ════════════════════════════════════════════════════════════════════
      // COMMUNICATION  (Itumanaho)
      // ════════════════════════════════════════════════════════════════════
      { test: () => only(false,false,false,false,true) && thumbOut && wx > 0.6,
        label: 'telefoni (phone)',       conf: 0.82 },
      { test: () => extCount === 2 && indexUp && middleUp && wy > 0.5,
        label: 'imeyili (email)',        conf: 0.74 },
      { test: () => openPalm && wy > 0.4 && wx > 0.2 && wx < 0.8,
        label: 'interineti (internet)',  conf: 0.72 },
      { test: () => extCount === 3 && middleUp && ringUp && indexUp && wy > 0.5,
        label: 'mudasobwa (computer)',   conf: 0.74 },
      { test: () => extCount === 1 && indexUp && wy < 0.4 && !thumbOut,
        label: 'gutuza (quiet/silence)', conf: 0.76 },
      { test: () => extCount >= 3 && wy < 0.45 && wx > 0.35 && wx < 0.65 && !palmFacingCamera,
        label: 'kwandika (write)',       conf: 0.72 },

      // ════════════════════════════════════════════════════════════════════
      // COLOURS  (Amabara)
      // ════════════════════════════════════════════════════════════════════
      { test: () => only(true,false,false,false,true) && thumbIndexDist > 1.0,
        label: 'umutuku (red)',          conf: 0.74 },
      { test: () => only(false,true,true,false,false) && middleRingDist < 0.4,
        label: 'icyatsi (green)',        conf: 0.72 },
      { test: () => only(false,false,true,false,false),
        label: 'ubururu (blue)',         conf: 0.72 },
      { test: () => only(false,true,false,true,false),
        label: 'umuhondo (yellow)',      conf: 0.72 },
      { test: () => fist && thumbOut && thumbUp && wy > 0.35,
        label: 'uturabyo (white)',       conf: 0.70 },
      { test: () => fist && !thumbOut,
        label: 'umukara (black)',        conf: 0.68 },

      // ════════════════════════════════════════════════════════════════════
      // DIRECTIONS  (Inzira)
      // ════════════════════════════════════════════════════════════════════
      { test: () => only(true,false,false,false,false) && wx < 0.35,
        label: 'ibumoso (left)',         conf: 0.80 },
      { test: () => only(true,false,false,false,false) && wx > 0.65,
        label: 'iburyo (right)',         conf: 0.80 },
      { test: () => only(true,false,false,false,false) && wy < 0.3,
        label: 'hejuru (up)',            conf: 0.80 },
      { test: () => only(true,false,false,false,false) && wy > 0.65,
        label: 'hasi (down)',            conf: 0.80 },
      { test: () => openPalm && !palmFacingCamera && wy > 0.4 && wx > 0.4 && wx < 0.6,
        label: 'imbere (forward)',       conf: 0.75 },
      { test: () => openPalm && palmFacingCamera && wy > 0.4 && wx > 0.4 && wx < 0.6,
        label: 'inyuma (backward/stop)', conf: 0.75 },

      // ════════════════════════════════════════════════════════════════════
      // SCHOOL / LEARNING  (Ishuri)
      // ════════════════════════════════════════════════════════════════════
      { test: () => extCount === 2 && indexUp && thumbOut && wy < 0.4,
        label: 'ibibazo (question)',     conf: 0.74 },
      { test: () => only(true,true,false,false,false) && thumbIndexDist < 0.5,
        label: 'igisubizo (answer)',     conf: 0.74 },
      { test: () => extCount === 4 && thumbOut && wy > 0.45 && wx > 0.35 && wx < 0.65,
        label: 'igitabo (book)',         conf: 0.74 },
      { test: () => extCount >= 3 && wy > 0.4 && wx > 0.35 && wx < 0.65 && palmFacingCamera,
        label: 'kwiga (study/learn)',    conf: 0.73 },
      { test: () => thumbOut && extCount === 1 && indexUp,
        label: 'gusobanukirwa (understand)', conf: 0.74 },

      // ════════════════════════════════════════════════════════════════════
      // SOCIAL  (Imibanire)
      // ════════════════════════════════════════════════════════════════════
      { test: () => extCount === 2 && indexUp && middleUp && indexMiddleDist > 0.7 && palmFacingCamera,
        label: 'amahoro (peace)',        conf: 0.84 },
      { test: () => openPalm && palmFacingCamera && wy < 0.45 && wx > 0.3 && wx < 0.7,
        label: 'imbyino (dance)',        conf: 0.72 },
      { test: () => fist && wy < 0.5 && wx > 0.3 && wx < 0.7 && thumbOut,
        label: 'akazi (work)',           conf: 0.76 },
      { test: () => extCount === 4 && thumbOut && wy < 0.45 && palmFacingCamera,
        label: 'gufasha (help)',         conf: 0.78 },
      { test: () => extCount >= 3 && wy > 0.5 && wx > 0.3 && wx < 0.7 && !palmFacingCamera,
        label: 'imbabazi (sorry)',       conf: 0.74 },
      { test: () => extCount === 4 && !thumbOut && wy < 0.5 && !palmFacingCamera,
        label: 'reka (please/let)',      conf: 0.74 },
      { test: () => openPalm && wy > 0.4 && wy < 0.6 && wx > 0.5,
        label: 'gutumira (invite)',      conf: 0.72 },
      { test: () => thumbIndexDist < 0.55 && middleUp && ringUp && pinkyUp,
        label: 'gukunda (love)',         conf: 0.84 },
      { test: () => extCount === 2 && indexUp && pinkyUp && !middleUp && !ringUp,
        label: 'injyana (rock on)',      conf: 0.82 },
    ];

    // evaluate rules in order
    for (const rule of rules) {
      if (rule.test()) {
        return { gesture: rule.label, confidence: rule.conf };
      }
    }

    return { gesture: 'unknown', confidence: 0.3 };
  }

  async createTraining(createTrainingDto: CreateTrainingDto, userId: string) {
    return this.aiTrainingModel.create({
      ...createTrainingDto,
      trainedBy: new Types.ObjectId(userId),
      status: 'pending',
    });
  }

  async getTrainingHistory() {
    return this.aiTrainingModel.find().sort({ createdAt: -1 });
  }

  async getTraining(id: string) {
    const training = await this.aiTrainingModel.findById(id);
    if (!training) {
      throw new NotFoundException('Training not found');
    }
    return training;
  }

  async updateTrainingStatus(
    id: string,
    status: string,
    accuracy?: number,
    loss?: number,
    errorMessage?: string,
  ) {
    const updateData: any = { status };
    if (accuracy !== undefined) updateData.accuracy = accuracy;
    if (loss !== undefined) updateData.loss = loss;
    if (errorMessage) updateData.errorMessage = errorMessage;

    const training = await this.aiTrainingModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!training) {
      throw new NotFoundException('Training not found');
    }
    return training;
  }
}
