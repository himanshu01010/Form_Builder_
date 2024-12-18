import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Untitled Form' },
  createdAt: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
});

export default mongoose.model('Template', templateSchema);
