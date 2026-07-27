// src/repositories/userRepository.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const mockUsers = [
  // Seed admin user: admin@prabha.com / Admin1234
  {
    _id: '6584f23b8f1c8b21c4b9d001',
    name: 'Admin User',
    email: 'admin@prabha.com',
    password: '', // Will be updated on first load or checked directly
    role: 'admin',
    isActive: true,
    profileImage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    toSafeObject() {
      const { password, ...safe } = this;
      return safe;
    },
    comparePassword(pwd) {
      return pwd === 'Admin1234' || bcrypt.compareSync(pwd, this.password);
    }
  }
];

// Hash admin password initially
bcrypt.hash('Admin1234', 10).then(hash => {
  mockUsers[0].password = hash;
});

export const userRepository = {
  async create(userData) {
    if (global.dbMode === 'mock') {
      const newUser = {
        _id: 'mock_user_' + Math.random().toString(36).substr(2, 9),
        isActive: true,
        profileImage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userData,
        toSafeObject() {
          const { password, ...safe } = this;
          return safe;
        },
        async comparePassword(pwd) {
          return bcrypt.compare(pwd, this.password);
        }
      };
      // Hash password mock
      newUser.password = await bcrypt.hash(userData.password, 10);
      mockUsers.push(newUser);
      return newUser;
    }
    return User.create(userData);
  },

  async findByEmail(email) {
    if (global.dbMode === 'mock') {
      const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      return user || null;
    }
    return User.findOne({ email }).select('+password');
  },

  async findById(id) {
    if (global.dbMode === 'mock') {
      const user = mockUsers.find((u) => u._id === id);
      return user || null;
    }
    return User.findById(id);
  },

  async findAll(query = {}, options = {}) {
    if (global.dbMode === 'mock') {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;
      const users = mockUsers.slice(skip, skip + limit);
      return {
        users,
        total: mockUsers.length,
        page,
        limit,
        totalPages: Math.ceil(mockUsers.length / limit),
      };
    }
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).sort(sort).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateById(id, updates) {
    if (global.dbMode === 'mock') {
      const index = mockUsers.findIndex((u) => u._id === id);
      if (index === -1) return null;
      mockUsers[index] = { ...mockUsers[index], ...updates, updatedAt: new Date() };
      return mockUsers[index];
    }
    return User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  },

  async deleteById(id) {
    if (global.dbMode === 'mock') {
      const index = mockUsers.findIndex((u) => u._id === id);
      if (index === -1) return null;
      const deleted = mockUsers[index];
      mockUsers.splice(index, 1);
      return deleted;
    }
    return User.findByIdAndDelete(id);
  },

  async countAll() {
    if (global.dbMode === 'mock') {
      return mockUsers.length;
    }
    return User.countDocuments();
  },

  async updateLastLogin(id) {
    if (global.dbMode === 'mock') {
      const index = mockUsers.findIndex((u) => u._id === id);
      if (index !== -1) {
        mockUsers[index].lastLogin = new Date();
      }
      return;
    }
    return User.findByIdAndUpdate(id, { lastLogin: new Date() });
  },
};

