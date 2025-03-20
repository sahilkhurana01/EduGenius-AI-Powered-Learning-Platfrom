import axios from 'axios';

// Gemini API endpoint - Updated to the correct URL
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''; // Get from .env file

// Static fallback questions for when the API is unavailable
const FALLBACK_QUESTIONS = {
  "General Knowledge": [
    {
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correctAnswer: "B"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correctAnswer: "C"
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: "B"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "D"
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: "C"
    }
  ],
  "Science": [
    {
      question: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correctAnswer: "A"
    },
    {
      question: "Which of these is not a state of matter?",
      options: ["Solid", "Liquid", "Gas", "Energy"],
      correctAnswer: "D"
    },
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Titanium"],
      correctAnswer: "C"
    },
    {
      question: "Which of these is not a primary color of light?",
      options: ["Red", "Green", "Blue", "Yellow"],
      correctAnswer: "D"
    },
    {
      question: "What force keeps us on the ground?",
      options: ["Magnetism", "Gravity", "Friction", "Tension"],
      correctAnswer: "B"
    }
  ],
  "Mathematics": [
    {
      question: "What is the value of π (pi) to two decimal places?",
      options: ["3.14", "3.16", "3.12", "3.18"],
      correctAnswer: "A"
    },
    {
      question: "What is the square root of 64?",
      options: ["6", "7", "8", "9"],
      correctAnswer: "C"
    },
    {
      question: "If x + 5 = 12, what is the value of x?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "C"
    },
    {
      question: "What is 25% of 80?",
      options: ["15", "20", "25", "30"],
      correctAnswer: "B"
    },
    {
      question: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
      options: ["24", "30", "32", "36"],
      correctAnswer: "C"
    }
  ]
};

/**
 * Generates quiz questions using Gemini AI or falls back to static data
 * @param {string} topic - The topic for the quiz
 * @param {number} numQuestions - Number of questions to generate
 * @param {string} difficulty - Difficulty level (easy, medium, hard)
 * @returns {Promise<Array>} - Array of quiz questions
 */
export const generateQuizQuestions = async (topic, numQuestions = 5, difficulty = 'medium') => {
  try {
    console.log('Generating quiz questions with API key length:', API_KEY?.length);
    
    // Check if we should use fallback data instead of making API call
    const useFallback = !API_KEY;
    
    if (useFallback) {
      console.log('Using fallback questions data');
      // Return fallback questions for the requested topic, or general knowledge if not available
      return FALLBACK_QUESTIONS[topic] || FALLBACK_QUESTIONS["General Knowledge"];
    }

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate ${numQuestions} ${difficulty} difficulty multiple-choice questions about ${topic}. 
              For each question, provide:
              1. The question text
              2. Four options labeled A, B, C, D
              3. The correct answer letter
              
              Format the response as a JSON array with objects having the structure:
              {
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "A"
              }`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    };

    console.log('Sending request to Gemini API...');
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`, // Gemini uses the API key as a query param
      payload
    );

    console.log('Received response from Gemini API');
    
    // For debugging
    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      console.error('Unexpected API response structure:', JSON.stringify(response.data));
      throw new Error('Unexpected API response structure');
    }

    // Parse the response from Gemini
    const content = response.data.candidates[0].content.parts[0].text;
    console.log('Raw content from API:', content.substring(0, 100) + '...');
    
    // Try to find a JSON array in the response
    let questionData;
    try {
      // First try to extract JSON array
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questionData = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array is found, try parsing the entire response as JSON
        questionData = JSON.parse(content);
      }
      
      console.log('Successfully parsed question data:', questionData.length);
      return questionData;
    } catch (parseError) {
      console.error('Error parsing JSON from response:', parseError);
      console.error('Content that failed to parse:', content);
      
      // Fallback to static questions
      return FALLBACK_QUESTIONS[topic] || FALLBACK_QUESTIONS["General Knowledge"];
    }
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('API error response:', error.response.data);
    }
    
    // Return fallback questions instead of throwing an error
    return FALLBACK_QUESTIONS[topic] || FALLBACK_QUESTIONS["General Knowledge"];
  }
};