import { Request, Response } from "express";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod validation schemas are defined in the route handlers

export const OpenAIController = {
  /**
   * Generate text using OpenAI's chat completion API
   */
  async generateText(req: Request, res: Response) {
    try {
      const { prompt, max_tokens = 500 } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Optional: Check user permissions here if needed

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert social media content creator with expertise in marketing, especially for professional accounting services. Create engaging, platform-appropriate content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: max_tokens > 2000 ? 2000 : max_tokens, // Limit max tokens for safety
        temperature: 0.7,
      });

      // Extract the generated text
      const text = completion.choices[0]?.message?.content || "";

      return res.status(200).json({ text });
    } catch (error: any) {
      console.error("Error generating text:", error);
      return res.status(500).json({ 
        error: "Failed to generate text", 
        details: error.message 
      });
    }
  },

  /**
   * Generate an image using OpenAI's DALL-E API
   */
  async generateImage(req: Request, res: Response) {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Optional: Check user permissions here if needed

      // Enhance the prompt with professional accounting context
      const enhancedPrompt = `Create a professional, high-quality image suitable for a social media post by an accounting firm: ${prompt}. The image should be clean, modern, and professional.`;

      const response = await openai.images.generate({
        model: "dall-e-3", // Latest DALL-E model at the time of writing
        prompt: enhancedPrompt,
        n: 1, // Number of images to generate
        size: "1024x1024", // Image size
        quality: "standard",
      });

      // Extract the image URL
      const url = response.data[0]?.url;

      if (!url) {
        throw new Error("No image was generated");
      }

      return res.status(200).json({ url });
    } catch (error: any) {
      console.error("Error generating image:", error);
      return res.status(500).json({ 
        error: "Failed to generate image", 
        details: error.message 
      });
    }
  },

  /**
   * Analyze an image using OpenAI's vision capability
   * Note: This is implemented but not currently used in the UI flow
   */
  async analyzeImage(req: Request, res: Response) {
    try {
      const { image_url, prompt } = req.body;

      if (!image_url) {
        return res.status(400).json({ error: "Image URL is required" });
      }

      const analysisPrompt = prompt || "Describe this image in detail, focusing on elements that would be relevant for a social media post for an accounting firm.";

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing images and extracting relevant information for social media content creation."
          },
          {
            role: "user",
            content: [
              { type: "text", text: analysisPrompt },
              {
                type: "image_url",
                image_url: {
                  url: image_url,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      // Extract the analysis
      const analysis = response.choices[0]?.message?.content || "";

      return res.status(200).json({ analysis });
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      return res.status(500).json({ 
        error: "Failed to analyze image", 
        details: error.message 
      });
    }
  },
};