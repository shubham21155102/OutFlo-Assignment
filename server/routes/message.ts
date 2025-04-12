
import express from 'express';
import fetch from 'node-fetch';

const messageRouter = express.Router();

// Reusing the same response helper for consistency
const createResponse = (data: any, message: string, success: boolean, statusCode: number) => {
  return {
    data,
    message,
    success,
    status_code: statusCode
  };
};
import dotenv from 'dotenv';
dotenv.config();
messageRouter.post('/', async (req, res) => {
  try {
    const { name, job_title, company, location, summary } = req.body;
    console.log(req.body)

    const prompt = `Write a natural, professional, and friendly LinkedIn outreach message that feels personally typed. 
    Avoid any templated language, AI-sounding phrases, or formatting like "Subject", "---", or placeholders. 
    
    Here are the details:
    Name: ${name}
    Job Title: ${job_title}
    Company: ${company}
    Location: ${location}
    Summary: ${summary}
    
    The message should reference their background in a genuine way, mention how OutFlo can help with lead generation, and end with a soft call to connect or chat. Keep it concise, human, and conversational.
    Example Payload:
{
"name": "John Doe",
"job_title": "Software Engineer",
"company": "TechCorp",
"location": "San Francisco, CA",
"summary": "Experienced in AI & ML..."
}
Example Response:
{
"message": "Hey John, I see you are working as a Software Engineer at TechCorp. Outflo
can help automate your outreach to increase meetings & sales. Let's connect!"
}
    `;
    

      // console.log(prompt)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-2.5-coder-32b',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const message = data.choices[0].message.content;
        res.status(200).json(
      createResponse(
        { message: message },
        'Message generated successfully',
        true,
        200
      )
    );
  } catch (error) {
    console.error('Error generating message:', error);
    // res.status(500).json({ message: 'Error generating personalized message', error: error.message });
        res.status(500).json(
      createResponse(
        null,
        error instanceof Error ? error.message : 'Error generating personalized message',
        false,
        500
      )
    );
  }
});



// messageRouter.post('/', async (req, res) => {
//   try {
//     const { name, job_title, company, location, summary } = req.body;

//     // Validate required fields
//     if (!name || !job_title || !company) {
//       return res.status(400).json(
//         createResponse(null, 'Missing required fields: name, job_title, and company are required', false, 400)
//       );
//     }

//     const prompt = `Write a personalized LinkedIn outreach message to:
//       Name: ${name}
//       Job Title: ${job_title}
//       Company: ${company}
//       Location: ${location || 'their location'}
//       Summary: ${summary || 'their background'}
      
//       The message should be professional, friendly, and mention how OutFlo can help with their lead generation needs.`;

//     const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'qwen-2.5-coder-32b',
//         messages: [
//           { role: 'user', content: prompt }
//         ],
//         temperature: 0.7,
//         max_tokens: 500,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Groq API error: ${response.statusText}`);
//     }

//     const data = await response.json();
//     const generatedMessage = data.choices[0].message.content;
    
//     res.status(200).json(
//       createResponse(
//         { message: generatedMessage },
//         'Message generated successfully',
//         true,
//         200
//       )
//     );
//   } catch (error) {
//     console.error('Error generating message:', error);
//     res.status(500).json(
//       createResponse(
//         null,
//         error instanceof Error ? error.message : 'Error generating personalized message',
//         false,
//         500
//       )
//     );
//   }
// });
export default messageRouter;