import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  phone: String,
  addresses: [{
    type: {
      type: String,
      enum: ['shipping', 'billing', 'both'],
      default: 'both'
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    firstName: String,
    lastName: String,
    company: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    phone: String
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  receiveEmailOffers: {
    type: Boolean,
    default: false
  },
  receiveSmsOffers: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);