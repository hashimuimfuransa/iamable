import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: any) {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async findAll(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnread(userId: string) {
    return this.notificationModel
      .find({ userId, read: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true },
    );
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, read: false },
      { read: true },
    );
  }

  async remove(id: string, userId: string) {
    const notification = await this.notificationModel.findOneAndDelete({
      _id: id,
      userId,
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return { message: 'Notification deleted successfully' };
  }

  async clearAll(userId: string) {
    await this.notificationModel.deleteMany({ userId });
    return { message: 'All notifications cleared' };
  }

  async getUnreadCount(userId: string) {
    return this.notificationModel.countDocuments({ userId, read: false });
  }
}
