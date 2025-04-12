import mongoose from 'mongoose';
// newLead.name=fullName;
//     newLead.currentCompany=currentCompany;
//     newLead.currentPosition=currentPosition;
//     newLead.location=location
//     newLead.profileUrl=profileLink
//     newLead.description=description;
const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  currentCompany: {
    type: String,
    // required: true
  },
  currentPosition: {
    type: String,
    // required: true
  },
  location: {
    type: String
  },
  profileUrl: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    // required: true
  },
  // scrapedAt: {
  //   type: Date,
  //   default: Date.now
  // }
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;