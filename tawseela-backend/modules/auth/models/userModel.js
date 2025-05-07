const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    role: {
      type: String,
      enum: ['customer', 'driver', 'store-admin', 'admin'],
      default: 'customer'
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    addresses: [
      {
        title: {
          type: String,
          required: true
        },
        address: {
          type: String,
          required: true
        },
        location: {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: {
            type: [Number],
            required: true
          }
        },
        isDefault: {
          type: Boolean,
          default: false
        }
      }
    ],
    favoriteStores: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Store'
      }
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    // Driver specific fields
    driverStatus: {
      type: String,
      enum: ['available', 'on-trip', 'offline'],
      default: 'offline'
    },
    currentLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    // Store admin specific fields
    stores: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Store'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create index for location-based queries
userSchema.index({ currentLocation: '2dsphere' });
userSchema.index({ 'addresses.location': '2dsphere' });

// Virtual populate for orders
userSchema.virtual('orders', {
  ref: 'Order',
  foreignField: 'user',
  localField: '_id'
});

// Document middleware: runs before .save() and .create()
userSchema.pre('save', async function(next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Query middleware: don't show inactive users
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Instance methods
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
