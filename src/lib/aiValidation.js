/**
 * Google Gemini AI Validation Service for WILDMAP.
 * Acts as a validation engine for citizen-reported wildlife incidents.
 */

export const analyzeImage = async (imageUrl, description = '') => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  // Default fallback if API key is missing or fails
  const errorResponse = {
    aiScore: 50,
    confidence: "Medium",
    explanation: "AI analysis unavailable",
    isFlagged: false,
    timestamp: new Date().toISOString()
  };

  if (!apiKey) {
    console.warn("No Google API key found in .env. Using default AI response.");
    return errorResponse;
  }

  try {
    // Add a timeout to prevent hanging the submission
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze this wildlife incident report for authenticity and roadkill presence.
Context: This is a system for detecting and mapping wildlife roadkill incidents.
User Description: "${description}"

Based on the description and the context of wildlife roadkill detection, evaluate if this report is likely real, suspicious, or fake.

Return your analysis in exactly this JSON format:
{
  "score": [number 0-100],
  "confidence": ["High" | "Medium" | "Low"],
  "explanation": "[1-2 line short explanation]"
}

Scoring Logic:
- 70-100: High confidence (likely real)
- 40-69: Medium confidence (needs review)
- 0-39: Low confidence (likely fake)

Only return the raw JSON.`
              }
            ]
          }
        ]
      })
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      console.error("Gemini API error or empty response:", data);
      return errorResponse;
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON from the text response
    try {
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson);
      
      const score = result.score !== undefined ? Number(result.score) : 50;
      
      return {
        aiScore: score,
        confidence: result.confidence || (score >= 70 ? "High" : score >= 40 ? "Medium" : "Low"),
        explanation: result.explanation || "Analyzed by Gemini AI",
        isFlagged: score < 40,
        timestamp: new Date().toISOString()
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", textResponse);
      return errorResponse;
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Gemini API request timed out");
    } else {
      console.error("Failed to connect to Gemini API:", error);
    }
    return errorResponse;
  }
};
