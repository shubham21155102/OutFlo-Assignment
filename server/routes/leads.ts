import express from 'express';
import Leads from '../models/Leads.ts';

const leadRouter = express.Router();
const createResponse = (data: any, message: string, success: boolean, statusCode: number) => {
    return {
      data,
      message,
      success,
      status_code: statusCode
    };
  };
  leadRouter.get('/', async (req, res) => {
    try {
      const leads = await Leads.find({})
      res.status(200).json(
        createResponse(leads, 'Campaigns fetched successfully', true, 200)
      );
    } catch (error) {
      console.log(error)
      res.status(500).json(
        createResponse(null, 'Error fetching campaigns', false, 500)
      );
    }
  });
export default leadRouter;