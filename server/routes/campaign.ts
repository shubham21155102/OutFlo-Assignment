import express from 'express';
import { Campaign, CampaignStatus } from '../models/Campaign.js';

const campaignRouter = express.Router();
const createResponse = (data: any, message: string, success: boolean, statusCode: number) => {
  return {
    data,
    message,
    success,
    status_code: statusCode
  };
};

campaignRouter.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: CampaignStatus.DELETED } });
    res.status(200).json(
      createResponse(campaigns, 'Campaigns fetched successfully', true, 200)
    );
  } catch (error) {
    console.log(error)
    res.status(500).json(
      createResponse(null, 'Error fetching campaigns', false, 500)
    );
  }
});

campaignRouter.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign || campaign.status === CampaignStatus.DELETED) {
      return res.status(404).json(
        createResponse(null, 'Campaign not found', false, 404)
      );
    }
    res.status(200).json(
      createResponse(campaign, 'Campaign fetched successfully', true, 200)
    );
  } catch (error) {
    console.log(error)
    res.status(500).json(
      createResponse(null, 'Error fetching campaign', false, 500)
    );
  }
});

campaignRouter.post('/', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(
      createResponse(campaign, 'Campaign created successfully', true, 201)
    );
  } catch (error) {
    console.log(error)
    res.status(400).json(
      createResponse(null, 'Error creating campaign', false, 400)
    );
  }
});

campaignRouter.put('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign || campaign.status === CampaignStatus.DELETED) {
      return res.status(404).json(
        createResponse(null, 'Campaign not found', false, 404)
      );
    }
    
    Object.assign(campaign, req.body);
    await campaign.save();
    res.status(200).json(
      createResponse(campaign, 'Campaign updated successfully', true, 200)
    );
  } catch (error) {
    console.log(error)
    res.status(400).json(
      createResponse(null, 'Error updating campaign', false, 400)
    );
  }
});

campaignRouter.patch('/:id/status', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign || campaign.status === CampaignStatus.DELETED) {
      return res.status(404).json(
        createResponse(null, 'Campaign not found', false, 404)
      );
    }
    
    campaign.status = req.body.status;
    await campaign.save();
    res.status(200).json(
      createResponse(campaign, 'Campaign status updated successfully', true, 200)
    );
  } catch (error) {
    console.log(error)
    res.status(400).json(
      createResponse(null, 'Error updating campaign status', false, 400)
    );
  }
});

campaignRouter.delete('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign || campaign.status === CampaignStatus.DELETED) {
      return res.status(404).json(
        createResponse(null, 'Campaign not found', false, 404)
      );
    }
    
    campaign.status = CampaignStatus.DELETED;
    await campaign.save();
    res.status(200).json(
      createResponse(null, 'Campaign deleted successfully', true, 200)
    );
  } catch (error) {
    console.log(error)
    res.status(500).json(
      createResponse(null, 'Error deleting campaign', false, 500)
    );
  }
});

export default campaignRouter;