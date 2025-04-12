import mongoose from 'mongoose';

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(CampaignStatus),
    default: CampaignStatus.INACTIVE
  },
  leads: [{
    type: String,
    validate: {
      validator: function(v: string) {
        console.log(v)
        return /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_%]+\/?$/.test(v);
      },
      message: 'LinkedIn URL must be valid'
    }
  }],
  accountIDs: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
campaignSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Campaign = mongoose.model('Campaign', campaignSchema);