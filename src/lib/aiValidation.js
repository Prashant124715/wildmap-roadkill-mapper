/**
 * Live OpenAI Vision Validation Service for WILDMAP.
 * Uses OpenAI's gpt-4o model to analyze images of reported wildlife incidents.
 */

export const analyzeImage = async (imageUrl, description = '') => {
  // If no image URL is provided, return default low score
  if (!imageUrl) {
    return {
      aiScore: 0,
      labels: ['no-image'],
      isFlagged: true,
      timestamp: new Date().toISOString()
    };
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Fallback to simulator if no API key is found
  if (!apiKey) {
    console.warn("No OpenAI API key found in .env. Falling back to simulated analysis.");
    return fallbackSimulator(imageUrl, description);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for a wildlife conservation app. Your task is to analyze an image of a reported wildlife incident (usually roadkill or animal crossing). 
You must output ONLY raw JSON data with no markdown blocks or formatting. The JSON must contain:
1. "aiScore": an integer from 0 to 100 representing the confidence that the image shows an animal and/or a road/vehicle context. (e.g. animal + road = high score, only animal = medium, neither = low).
2. "labels": an array of short lowercase strings identifying key elements (e.g. ["animal", "road", "leopard", "blood"]).`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this incident image. The user described it as: "${description}".`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return fallbackSimulator(imageUrl, description);
    }

    // Parse the JSON response
    const content = data.choices[0].message.content.trim();
    // In case the model accidentally includes markdown blocks (```json ... ```)
    const cleanJsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanJsonString);
    const score = parsedData.aiScore !== undefined ? parsedData.aiScore : 0;
    
    return {
      aiScore: score,
      labels: parsedData.labels || ['unrecognized'],
      isFlagged: score < 40,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Failed to connect to OpenAI:", error);
    // Fallback to simulator if the API call fails
    return fallbackSimulator(imageUrl, description);
  }
};

/**
 * Fallback simulator used when API key is missing or network fails
 */
const fallbackSimulator = async (imageUrl, description) => {
  const delay = Math.floor(Math.random() * 1500) + 1500;
  await new Promise(resolve => setTimeout(resolve, delay));

  const descLower = description.toLowerCase();
  const ANIMAL_KEYWORDS = ['leopard', 'elephant', 'tiger', 'deer', 'snake', 'macaque', 'bear', 'animal', 'bird', 'reptile'];
  const ROAD_KEYWORDS = ['road', 'highway', 'tarmac', 'crossing', 'vehicle', 'car', 'truck'];

  let hasAnimal = false;
  let hasRoad = false;

  ANIMAL_KEYWORDS.forEach(kw => { if (descLower.includes(kw)) hasAnimal = true; });
  ROAD_KEYWORDS.forEach(kw => { if (descLower.includes(kw)) hasRoad = true; });

  let baseScore = 0;
  const labels = [];

  if (hasAnimal && hasRoad) {
    baseScore = 80 + Math.floor(Math.random() * 18);
    labels.push('animal', 'road/vehicle', 'high-risk context');
  } else if (hasAnimal) {
    baseScore = 50 + Math.floor(Math.random() * 25);
    labels.push('animal');
  } else if (hasRoad) {
    baseScore = 20 + Math.floor(Math.random() * 20);
    labels.push('road');
  } else {
    baseScore = Math.floor(Math.random() * 35);
    labels.push('unrecognized');
  }

  return {
    aiScore: baseScore,
    labels: labels,
    isFlagged: baseScore < 40,
    timestamp: new Date().toISOString()
  };
};
