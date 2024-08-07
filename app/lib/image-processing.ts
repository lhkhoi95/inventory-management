"use server";
import { OpenAI } from "openai";
require("dotenv");

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function itemsRecognizer(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          'You are a helpful assistant that can identify inventory items in a picture. Your response should be in the following JSON format: {"items": [{"name": "text", "quantity": number}]}.',
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Look for all possible items that can be stored in the inventory warehouse and count their quantities. If you cannot count the quantity, please set it to 1. If you cannot find any items in the image, please respond with an empty array.",
          },
          {
            type: "image_url",
            image_url: {
              url: `${imageUrl}`,
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 300,
  });
  // console.log(response.choices[0].message.content);
  const result = parseAndTransformResponse(response);

  return result;
}

export async function base64ImageRecognizer(base64Image: string) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Your response should be in the following JSON format: {'items' : [{name: 'text', quantity: 'number'}]}.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Look for all possible items that can be stored in the inventory warehouse and count their quantities?",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: "low",
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 300,
  };

  console.log(payload);

  async function analyzeImage() {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
      console.error("Error:", (error as any).message);
    }
  }

  analyzeImage();
}

const parseAndTransformResponse = (response: any): AIDetectedItems => {
  // Parse the JSON string from the response
  const parsedContent = JSON.parse(response.choices[0].message.content);

  // Transform the parsed content to remove quotes from keys
  const transformedItems = parsedContent.items.map((item: any) => ({
    name: item.name,
    quantity: item.quantity,
  }));

  return { items: transformedItems };
};
