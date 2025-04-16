import { Schema, model } from 'mongoose';

const accountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  account_number: {
    type: String,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['activa', 'cerrada'],
    default: 'activa'
  }
}, {timestamps: true});

export default model('Account', accountSchema);
