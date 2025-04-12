import dotenv from 'dotenv';
dotenv.config();
import fs from "fs"
import mongoose from 'mongoose';
import Lead from "./models/Leads"
// import data from "./linkedin_results.json"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
fs.readFile('/Users/shubham/Downloads/shubham/outflo/server/linkedin_results.json','utf-8',async(err,data)=>{
  // console.log(data[0])
  if(err){
    console.log(err)
    return;
  }
  connectDB();
  const parsedData=JSON.parse(data)

  
  
  // Full Name, Current Job Title, Company Name, Location, Profile URL
  parsedData.map(async(e,i)=>{
    const fullName=e?.name;
    let currentStatus=await getDataFromGrok(e?.currentJob)
    currentStatus=JSON.parse(currentStatus)
    const currentCompany=currentStatus?.currentCompany;
    const currentPosition=currentStatus?.currentPosition;
    const location=e?.location;
    const profileLink=e?.profileLink;
    const description=e?.headline+"\n \n"+e?.currentJob
    const newLead=new Lead();
    newLead.name=fullName;
    newLead.currentCompany=currentCompany;
    newLead.currentPosition=currentPosition;
    newLead.location=location
    newLead.profileUrl=profileLink
    newLead.description=description;
    await newLead.save();
    console.log(`Lead ${i}:${fullName} saved ✅`)

  })
  
}
)

const getDataFromGrok = async (prompt) => {
  const SYSTEM_PROMPT = `You are an information extraction assistant.

Your task is to extract **only the current job** (company name or organization) and **current position** (role or title) from a given sentence.

Return the response strictly in this JSON format:

{
  "currentCompany": "<company name or null>",
  "currentPosition": "<position title or null>"
}

### Examples:

Input: "Current: Founder at TLC Ads - ..., we're not just another Google Ads agency..."
Output:
{
  "currentCompany": "TLC Ads",
  "currentPosition": "Founder"
}

Input: "Currently at Microsoft working as a Software Engineer"
Output:
{
  "currentCompany": "Microsoft",
  "currentPosition": "Software Engineer"
}

Input: "Unemployed, currently looking for opportunities"
Output:
{
  "currentCompany": null,
  "currentPosition": null
}

Input: "Working in a stealth startup"
Output:
{
  "currentCompany": "stealth startup",
  "currentPosition": null
}

Do not return any extra text, explanation, or formatting. Return only the JSON response.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen-2.5-coder-32b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`);
  }

  const data = await response.json();
  const message = data.choices[0].message.content;
  console.log(message)
  return message;
};
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));