const OpenAI = require("openai");
require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

async function itemsRecognizer() {
  const response = await openai.chat.completions.create({
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
              url: "https://m.media-amazon.com/images/I/61hh5PBw3GL._AC_UF894,1000_QL80_.jpg",
              detail: "low",
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 300,
  });
  console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
}

// async function base64ImageRecognizer(base64Image: string) {
//   const base64_image = "YOUR_BASE64_ENCODED_IMAGE_HERE"; // Replace with your base64 encoded image

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${apiKey}`,
//   };

//   const payload = {
//     model: "gpt-4-vision-preview",
//     messages: [
//       {
//         role: "user",
//         content: [
//           {
//             type: "text",
//             text: "What's in this image?",
//           },
//           {
//             type: "image_url",
//             image_url: {
//               url: `data:image/jpeg;base64,${base64_image}`,
//             },
//           },
//         ],
//       },
//     ],
//     max_tokens: 300,
//   };

//   async function analyzeImage() {
//     try {
//       const response = await fetch(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           method: "POST",
//           headers: headers,
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//       console.error("Error:", (error as any).message);
//     }
//   }

//   analyzeImage();
// }

itemsRecognizer();
