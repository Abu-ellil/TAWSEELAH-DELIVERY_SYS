const User = require('../../auth/models/userModel');
const Store = require('../../store/models/storeModel');
const { AppError } = require('../../../middlewares/errorHandler');

// Get user profile
exports.getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-__v');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
};

// Update user profile
exports.updateUserProfile = async (userId, updateData) => {
  // Check if email or phone is being updated
  if (updateData.email) {
    const existingUser = await User.findOne({ email: updateData.email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new AppError('Email already in use', 400);
    }
  }
  
  if (updateData.phone) {
    const existingUser = await User.findOne({ phone: updateData.phone });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new AppError('Phone number already in use', 400);
    }
  }
  
  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      name: updateData.name,
      email: updateData.email,
      phone: updateData.phone,
      photo: updateData.photo
    },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }
  
  return updatedUser;
};

// Add user address
exports.addUserAddress = async (userId, addressData) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // If this is the first address or isDefault is true, set as default
  if (user.addresses.length === 0 || addressData.isDefault) {
    // Set all existing addresses to non-default
    user.addresses.forEach(address => {
      address.isDefault = false;
    });
    
    addressData.isDefault = true;
  }
  
  // Add new address
  user.addresses.push(addressData);
  await user.save();
  
  return user;
};

// Update user address
exports.updateUserAddress = async (userId, addressId, updateData) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Find address
  const addressIndex = user.addresses.findIndex(
    address => address._id.toString() === addressId
  );
  
  if (addressIndex === -1) {
    throw new AppError('Address not found', 404);
  }
  
  // If setting as default, update all other addresses
  if (updateData.isDefault) {
    user.addresses.forEach(address => {
      address.isDefault = false;
    });
  }
  
  // Update address
  Object.keys(updateData).forEach(key => {
    user.addresses[addressIndex][key] = updateData[key];
  });
  
  await user.save();
  
  return user;
};

// Delete user address
exports.deleteUserAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Find address
  const addressIndex = user.addresses.findIndex(
    address => address._id.toString() === addressId
  );
  
  if (addressIndex === -1) {
    throw new AppError('Address not found', 404);
  }
  
  // Check if it's the default address
  const isDefault = user.addresses[addressIndex].isDefault;
  
  // Remove address
  user.addresses.splice(addressIndex, 1);
  
  // If it was the default address and there are other addresses, set a new default
  if (isDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }
  
  await user.save();
  
  return user;
};

// Add store to favorites
exports.addFavoriteStore = async (userId, storeId) => {
  // Check if store exists
  const store = await Store.findById(storeId);
  
  if (!store) {
    throw new AppError('Store not found', 404);
  }
  
  // Add store to favorites
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteStores: storeId } },
    { new: true }
  );
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
};

// Remove store from favorites
exports.removeFavoriteStore = async (userId, storeId) => {
  // Remove store from favorites
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteStores: storeId } },
    { new: true }
  );
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
};

// Get user favorite stores
exports.getFavoriteStores = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'favoriteStores',
    select: 'name logo description category rating location'
  });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user.favoriteStores;
};
