import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
  origin_account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  destination_account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  type: {
    type: String,
    enum: ['transferencia', 'ingreso', 'retirada'],
  },
  subject: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
}, { timestamps: true });

export default model('Transaction', transactionSchema);
