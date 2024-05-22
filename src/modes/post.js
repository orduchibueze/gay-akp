const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  media: { type: String },
  text: { type: String },
  likes: { type: Number, default: 0 },
  comments: [{ text: String, userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
