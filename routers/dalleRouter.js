import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai"

dotenv.config();
const router = express.Router()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);


router.get("/",(req,res)=>{
    res.send("hello this is dalle router")
})

router.post("/", async(req,res)=>{
  try {
    const {prompt} = req.body;
    const aiResponse = await openai.createImage({
      prompt,
      n:1,
      size: "1024x1024",
      response_format:'b64_json'
    })
    const image = aiResponse.data.data[0].b64_json;
    res.status(200).json({photo:image})
  } catch (error) {
    console.log(error);
    res.status(500).send(error?.response.data.error.message)
  }
})

router.post("/text",async(req,res)=>{
  
  try {
      const prompt = req.body.prompt;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });

      res.status(200).send({
        bot: response.data.choices[0].text
      });
  } catch (error) {
      console.log(error)
      res.status(500).send({error})
  }
})

router.post("/product-dec",async(req,res)=>{
try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.5,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

      res.status(200).send({
        bot: response.data.choices[0].text
      });
} catch (error) {
    console.log(error)
    res.status(500).send({error})
}
})

export default router;