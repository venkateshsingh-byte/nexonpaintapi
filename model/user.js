const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Pending', 'Approve', 'Reject'],
      default: 'Pending'
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  });
  
  userSchema.virtual('id').get(function () {
    return this._id.toHexString();
  });
  
  userSchema.set('toJSON', {
    virtuals: true
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
