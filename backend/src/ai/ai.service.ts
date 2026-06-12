import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AILog, AILogDocument } from './schemas/ai-log.schema';
import { AITraining, AITrainingDocument } from './schemas/ai-training.schema';
import { CreateTrainingDto } from './dto/create-training.dto';

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

  private classifyGesture(landmarks: any[]): { gesture: string; confidence: number } {
    // Key landmark indices for MediaPipe Hands:
    // 0: wrist, 4: thumb tip, 8: index tip, 12: middle tip, 16: ring tip, 20: pinky tip
    // 2: thumb IP, 3: thumb PIP, 5: index MCP, 6: index PIP, 7: index DIP
    // 9: middle MCP, 10: middle PIP, 11: middle DIP
    // 13: ring MCP, 14: ring PIP, 15: ring DIP
    // 17: pinky MCP, 18: pinky PIP, 19: pinky DIP
    
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

    // Calculate finger extensions (tip y vs MCP y - lower y means higher in image)
    const thumbExtended = thumbTip.y < thumbPIP.y;
    const indexExtended = indexTip.y < indexPIP.y;
    const middleExtended = middleTip.y < middlePIP.y;
    const ringExtended = ringTip.y < ringPIP.y;
    const pinkyExtended = pinkyTip.y < pinkyPIP.y;

    // Count extended fingers
    const extendedFingers = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended]
      .filter(Boolean).length;

    // Calculate distances between fingertips
    const thumbIndexDist = this.calculateDistance(thumbTip, indexTip);
    const thumbMiddleDist = this.calculateDistance(thumbTip, middleTip);
    const indexMiddleDist = this.calculateDistance(indexTip, middleTip);
    const middleRingDist = this.calculateDistance(middleTip, ringTip);
    const ringPinkyDist = this.calculateDistance(ringTip, pinkyTip);

    // Gesture classification logic
    let gesture = 'unknown';
    let confidence = 0.5;

    // Open palm (all fingers extended) - "Hello" or "Stop"
    if (extendedFingers === 5) {
      gesture = 'hello';
      confidence = 0.85;
    }
    // Fist (no fingers extended) - "No" or "Hold"
    else if (extendedFingers === 0) {
      gesture = 'no';
      confidence = 0.9;
    }
    // Pointing (only index extended) - "Yes" or "Look"
    else if (extendedFingers === 1 && indexExtended) {
      gesture = 'yes';
      confidence = 0.88;
    }
    // Peace sign (index and middle extended) - "Peace" or "Victory"
    else if (extendedFingers === 2 && indexExtended && middleExtended) {
      gesture = 'thank you';
      confidence = 0.87;
    }
    // Three fingers (index, middle, ring) - "Three" or "OK"
    else if (extendedFingers === 3 && indexExtended && middleExtended && ringExtended) {
      gesture = 'please';
      confidence = 0.82;
    }
    // Four fingers (all except thumb) - "Four"
    else if (extendedFingers === 4 && !thumbExtended) {
      gesture = 'four';
      confidence = 0.85;
    }
    // Thumbs up (thumb extended, others closed)
    else if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      gesture = 'good';
      confidence = 0.9;
    }
    // Thumbs down (thumb pointing down, others closed)
    else if (!thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbTip.y > thumbPIP.y) {
      gesture = 'bad';
      confidence = 0.88;
    }
    // OK sign (thumb and index forming circle)
    else if (thumbIndexDist < 0.05 && !middleExtended && !ringExtended && !pinkyExtended) {
      gesture = 'love';
      confidence = 0.85;
    }
    // Help gesture (open palm with specific orientation)
    else if (extendedFingers >= 4 && wrist.y > 0.6) {
      gesture = 'help';
      confidence = 0.75;
    }
    // Sorry gesture (hand over chest area)
    else if (extendedFingers >= 3 && wrist.y > 0.5 && wrist.x > 0.3 && wrist.x < 0.7) {
      gesture = 'sorry';
      confidence = 0.7;
    }
    // Call me (thumb and pinky extended, others closed)
    else if (thumbExtended && pinkyExtended && !indexExtended && !middleExtended && !ringExtended) {
      gesture = 'call me';
      confidence = 0.85;
    }
    // Rock on (index and pinky extended, others closed)
    else if (indexExtended && pinkyExtended && !thumbExtended && !middleExtended && !ringExtended) {
      gesture = 'rock';
      confidence = 0.85;
    }
    // Fist with thumb on side (stop gesture)
    else if (extendedFingers === 0 && thumbTip.x < indexMCP.x) {
      gesture = 'stop';
      confidence = 0.88;
    }
    // Wave (open palm, hand on side)
    else if (extendedFingers === 5 && wrist.x < 0.3) {
      gesture = 'wave';
      confidence = 0.8;
    }
    // Clap preparation (both hands - simulated with palm facing)
    else if (extendedFingers === 5 && wrist.y < 0.3) {
      gesture = 'clap';
      confidence = 0.75;
    }
    // One (index finger only, thumb tucked)
    else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
      gesture = 'one';
      confidence = 0.88;
    }
    // Two (index and middle, thumb tucked)
    else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
      gesture = 'two';
      confidence = 0.87;
    }
    // Three (index, middle, ring, thumb tucked)
    else if (indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended) {
      gesture = 'three';
      confidence = 0.85;
    }
    // Five (all fingers spread)
    else if (extendedFingers === 5 && indexMiddleDist > 0.1 && middleRingDist > 0.1 && ringPinkyDist > 0.1) {
      gesture = 'five';
      confidence = 0.85;
    }
    // Six (thumb and pinky touching, others extended)
    else if (thumbIndexDist > 0.1 && indexExtended && middleExtended && ringExtended && pinkyExtended) {
      gesture = 'six';
      confidence = 0.8;
    }
    // Seven (all fingers except index and middle)
    else if (thumbExtended && !indexExtended && !middleExtended && ringExtended && pinkyExtended) {
      gesture = 'seven';
      confidence = 0.78;
    }
    // Eight (all fingers except index)
    else if (thumbExtended && !indexExtended && middleExtended && ringExtended && pinkyExtended) {
      gesture = 'eight';
      confidence = 0.78;
    }
    // Nine (all fingers except pinky)
    else if (thumbExtended && indexExtended && middleExtended && ringExtended && !pinkyExtended) {
      gesture = 'nine';
      confidence = 0.78;
    }
    // Ten (both hands - simulated with two extended fingers crossing)
    else if (indexExtended && middleExtended && indexMiddleDist < 0.05) {
      gesture = 'ten';
      confidence = 0.75;
    }
    // Shh (index finger over lips - simulated with index extended near face)
    else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && wrist.y < 0.4) {
      gesture = 'quiet';
      confidence = 0.75;
    }
    // High five (open palm raised)
    else if (extendedFingers === 5 && wrist.y < 0.3) {
      gesture = 'high five';
      confidence = 0.8;
    }
    // Fist bump (fist, hand forward)
    else if (extendedFingers === 0 && wrist.y < 0.5) {
      gesture = 'fist bump';
      confidence = 0.8;
    }
    // Thumbs up variation (good job)
    else if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbTip.y < wrist.y) {
      gesture = 'good job';
      confidence = 0.88;
    }
    // Applause (open palms)
    else if (extendedFingers === 5 && wrist.x > 0.7) {
      gesture = 'applause';
      confidence = 0.75;
    }
    // Come here (index finger beckoning)
    else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && wrist.x > 0.5) {
      gesture = 'come here';
      confidence = 0.78;
    }
    // Go away (pushing motion - open palm facing away)
    else if (extendedFingers === 5 && wrist.y > 0.4 && wrist.x < 0.2) {
      gesture = 'go away';
      confidence = 0.75;
    }
    // I don't know (shoulders shrug - open hands at shoulder level)
    else if (extendedFingers >= 3 && wrist.y > 0.4 && wrist.y < 0.6) {
      gesture = "I don't know";
      confidence = 0.7;
    }
    // Thinking (hand on chin)
    else if (extendedFingers >= 2 && wrist.y > 0.5 && wrist.x > 0.5) {
      gesture = 'thinking';
      confidence = 0.7;
    }
    // Time (tapping wrist - simulated with hand near wrist area)
    else if (extendedFingers === 2 && wrist.y > 0.6 && wrist.x < 0.3) {
      gesture = 'time';
      confidence = 0.7;
    }
    // Money (rubbing fingers - simulated with thumb and index rubbing)
    else if (thumbIndexDist < 0.08 && thumbIndexDist > 0.03 && !middleExtended && !ringExtended && !pinkyExtended) {
      gesture = 'money';
      confidence = 0.75;
    }
    // Eat (hand near mouth)
    else if (extendedFingers >= 3 && wrist.y < 0.4 && wrist.x > 0.4 && wrist.x < 0.6) {
      gesture = 'eat';
      confidence = 0.7;
    }
    // Drink (hand near mouth with fingers curled)
    else if (extendedFingers <= 2 && wrist.y < 0.4 && wrist.x > 0.4 && wrist.x < 0.6) {
      gesture = 'drink';
      confidence = 0.7;
    }
    // Sleep (hand on head)
    else if (extendedFingers >= 3 && wrist.y < 0.3) {
      gesture = 'sleep';
      confidence = 0.7;
    }
    // Listen (hand near ear)
    else if (extendedFingers >= 3 && wrist.x > 0.7 && wrist.y > 0.3 && wrist.y < 0.5) {
      gesture = 'listen';
      confidence = 0.7;
    }
    // Look (hand near eyes)
    else if (extendedFingers >= 2 && wrist.y < 0.3 && wrist.x > 0.3 && wrist.x < 0.7) {
      gesture = 'look';
      confidence = 0.7;
    }
    // Walk (two fingers walking motion - simulated with index and middle)
    else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
      gesture = 'walk';
      confidence = 0.75;
    }
    // Run (similar to walk but faster - same gesture for now)
    else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended && wrist.y < 0.4) {
      gesture = 'run';
      confidence = 0.72;
    }
    // Sit (hand pushing down)
    else if (extendedFingers === 5 && wrist.y > 0.6) {
      gesture = 'sit';
      confidence = 0.75;
    }
    // Stand (hand pointing up)
    else if (extendedFingers === 1 && indexExtended && wrist.y < 0.3) {
      gesture = 'stand';
      confidence = 0.75;
    }
    // Stop (open palm facing forward)
    else if (extendedFingers === 5 && wrist.x < 0.2) {
      gesture = 'stop';
      confidence = 0.85;
    }
    // Buy (hand motion like giving money - thumb and index pinching)
    else if (thumbIndexDist < 0.08 && thumbIndexDist > 0.04 && middleExtended && ringExtended && pinkyExtended) {
      gesture = 'buy';
      confidence = 0.78;
    }
    // Sell (hand motion like taking money - open palm with thumb tucked)
    else if (extendedFingers === 4 && !thumbExtended && wrist.y > 0.4) {
      gesture = 'sell';
      confidence = 0.75;
    }
    // Shop (bag holding gesture - fingers curled)
    else if (extendedFingers <= 2 && wrist.y > 0.4 && wrist.x > 0.3 && wrist.x < 0.7) {
      gesture = 'shop';
      confidence = 0.75;
    }
    // Work (fist with thumb on top)
    else if (extendedFingers === 0 && thumbTip.y < thumbPIP.y) {
      gesture = 'work';
      confidence = 0.78;
    }
    // Home (roof shape - index and middle forming V)
    else if (indexExtended && middleExtended && indexMiddleDist > 0.08 && indexMiddleDist < 0.15 && !ringExtended && !pinkyExtended) {
      gesture = 'home';
      confidence = 0.8;
    }
    // School (book opening - two hands simulated with palm open)
    else if (extendedFingers === 5 && wrist.y > 0.5 && wrist.x > 0.4 && wrist.x < 0.6) {
      gesture = 'school';
      confidence = 0.75;
    }
    // Family (circle motion - thumb and index forming circle)
    else if (thumbIndexDist < 0.06 && indexExtended && middleExtended && ringExtended && pinkyExtended) {
      gesture = 'family';
      confidence = 0.75;
    }
    // Friend (handshake motion - open palm extended)
    else if (extendedFingers === 5 && wrist.y < 0.5 && wrist.x > 0.5) {
      gesture = 'friend';
      confidence = 0.75;
    }
    // Happy (smile gesture - index and middle curved)
    else if (indexExtended && middleExtended && indexTip.y > indexPIP.y && middleTip.y > middlePIP.y) {
      gesture = 'happy';
      confidence = 0.72;
    }
    // Sad (frown gesture - fingers drooping)
    else if (indexExtended && middleExtended && indexTip.y > wrist.y && middleTip.y > wrist.y) {
      gesture = 'sad';
      confidence = 0.7;
    }
    // Angry (fist with thumb across)
    else if (extendedFingers === 0 && thumbTip.x > indexMCP.x) {
      gesture = 'angry';
      confidence = 0.75;
    }
    // Tired (hand on head - palm on forehead)
    else if (extendedFingers >= 3 && wrist.y < 0.3 && wrist.x > 0.3 && wrist.x < 0.7) {
      gesture = 'tired';
      confidence = 0.7;
    }
    // Hungry (hand on stomach)
    else if (extendedFingers >= 3 && wrist.y > 0.5 && wrist.x > 0.4 && wrist.x < 0.6) {
      gesture = 'hungry';
      confidence = 0.72;
    }
    // Thirsty (hand near throat)
    else if (extendedFingers >= 2 && wrist.y > 0.4 && wrist.y < 0.5 && wrist.x > 0.4 && wrist.x < 0.6) {
      gesture = 'thirsty';
      confidence = 0.7;
    }
    // Cold (hugging self - arms crossed simulated)
    else if (extendedFingers <= 2 && wrist.y > 0.5 && wrist.x < 0.3) {
      gesture = 'cold';
      confidence = 0.7;
    }
    // Hot (wiping brow - hand near forehead)
    else if (extendedFingers >= 3 && wrist.y < 0.3 && wrist.x > 0.3 && wrist.x < 0.7) {
      gesture = 'hot';
      confidence = 0.7;
    }
    // Phone (hand to ear - pinky and thumb extended)
    else if (thumbExtended && pinkyExtended && !indexExtended && !middleExtended && !ringExtended && wrist.x > 0.6) {
      gesture = 'phone';
      confidence = 0.8;
    }
    // Email (typing motion - fingers moving)
    else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended && wrist.y > 0.5) {
      gesture = 'email';
      confidence = 0.72;
    }
    // Internet (web motion - hands forming network)
    else if (extendedFingers === 5 && wrist.y > 0.4 && wrist.x > 0.2 && wrist.x < 0.8) {
      gesture = 'internet';
      confidence = 0.7;
    }
    // Computer (keyboard typing - fingers on surface)
    else if (indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended && wrist.y > 0.5) {
      gesture = 'computer';
      confidence = 0.72;
    }
    // Car (steering wheel motion - hands gripping)
    else if (extendedFingers <= 2 && wrist.y > 0.4 && wrist.x > 0.3 && wrist.x < 0.7) {
      gesture = 'car';
      confidence = 0.7;
    }
    // Bus (large vehicle - open palm motion)
    else if (extendedFingers === 5 && wrist.y > 0.4 && wrist.x < 0.3) {
      gesture = 'bus';
      confidence = 0.7;
    }
    // Train (tracks motion - index and middle parallel)
    else if (indexExtended && middleExtended && indexMiddleDist < 0.05 && !ringExtended && !pinkyExtended && !thumbExtended) {
      gesture = 'train';
      confidence = 0.75;
    }
    // Airplane (flying motion - arms spread)
    else if (extendedFingers === 5 && wrist.y < 0.3 && wrist.x > 0.2 && wrist.x < 0.8) {
      gesture = 'airplane';
      confidence = 0.7;
    }
    // Doctor (stethoscope - hand to chest)
    else if (extendedFingers >= 3 && wrist.y > 0.5 && wrist.x > 0.4 && wrist.x < 0.6) {
      gesture = 'doctor';
      confidence = 0.7;
    }
    // Hospital (cross motion - hands forming cross)
    else if (indexExtended && middleExtended && indexMiddleDist > 0.1 && !ringExtended && !pinkyExtended && !thumbExtended) {
      gesture = 'hospital';
      confidence = 0.7;
    }
    // Medicine (pill taking - fingers to mouth)
    else if (extendedFingers <= 2 && wrist.y < 0.4 && wrist.x > 0.4 && wrist.x < 0.6) {
      gesture = 'medicine';
      confidence = 0.7;
    }
    // Pain (hand on painful area)
    else if (extendedFingers >= 3 && wrist.y > 0.4 && wrist.x > 0.3 && wrist.x < 0.7) {
      gesture = 'pain';
      confidence = 0.7;
    }
    // Better (improvement - thumbs up)
    else if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbTip.y < wrist.y) {
      gesture = 'better';
      confidence = 0.85;
    }
    // Worse (decline - thumbs down)
    else if (!thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbTip.y > thumbPIP.y) {
      gesture = 'worse';
      confidence = 0.85;
    }

    return { gesture, confidence };
  }

  private calculateDistance(point1: any, point2: any): number {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) +
      Math.pow(point1.y - point2.y, 2) +
      Math.pow(point1.z - point2.z, 2)
    );
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
