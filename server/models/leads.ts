import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  profileUrl: {
    type: String,
    required: true,
    unique: true
  },
  searchQuery: {
    type: String,
    required: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  }
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;