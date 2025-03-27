import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IRoom } from './Room';

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  sender: IUser['_id'];
  room: IRoom['_id'];
  recipientId?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    recipientId: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema); 