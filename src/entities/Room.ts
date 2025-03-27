import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IRoom extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  isPrivate: boolean;
  creator: IUser['_id'];
  participants: IUser['_id'][];
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model<IRoom>('Room', RoomSchema); 