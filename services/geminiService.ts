
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const plateRecognitionSchema = {
  type: Type.OBJECT,
  properties: {
    plateNumber: {
      type: Type.STRING,
      description: "The recognized characters from the license plate, formatted without spaces or special characters. For example, 'ABC1234'.",
    },
    found: {
      type: Type.BOOLEAN,
      description: "True if a license plate was clearly detected and read in the image, otherwise false.",
    },
  },
  required: ['plateNumber', 'found'],
};


export const recognizeNumberPlate = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: `
              Analyze the image to find the vehicle's license plate. 
              Extract the alphanumeric characters from the license plate.
              Return the result in the requested JSON format.
              If no license plate is visible or readable, set 'found' to false and 'plateNumber' to an empty string.
              Only return characters that are clearly part of the plate number.
            `,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: plateRecognitionSchema,
      },
    });

    const jsonText = response.text.trim();
    // It's good practice to parse the returned JSON to ensure it's valid
    const parsedResult = JSON.parse(jsonText);
    
    return {
        plateNumber: parsedResult.plateNumber || "",
        found: parsedResult.found || false
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to recognize number plate via Gemini API.");
  }
};
