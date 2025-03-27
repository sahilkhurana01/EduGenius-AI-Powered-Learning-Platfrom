import axios from 'axios';

// Default API key - replace with your actual key or use environment variables
const API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your Google Gemini API key in production

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Function to generate quiz questions using Google Gemini API
export const generateQuizQuestions = async (topic = 'General Knowledge', count = 5, difficulty = 'medium') => {
  try {
    // Add timestamp to prevent caching
    const timestamp = Date.now();
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}&timestamp=${timestamp}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate ${count} unique quiz questions about ${topic} with ${difficulty} difficulty. 
                Include questions about modern topics and events up to 2023. 
                Make the questions diverse, engaging, and educational.
                
                Please format each question exactly as follows (with no deviation or extra text):
                {
                  "question": "The full question text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correctAnswer": "A" or "B" or "C" or "D"
                }
                
                Please provide the output as a valid JSON array containing ${count} question objects.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }
    );

    if (response.data && response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
      const text = response.data.candidates[0].content.parts[0].text;
      
      // Extract JSON array from response (handle cases where API might add extra text)
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      
      if (jsonMatch) {
        try {
          const questions = JSON.parse(jsonMatch[0]);
          
          // Validate the questions format
          if (Array.isArray(questions) && questions.length > 0) {
            const validQuestions = questions.filter(q => 
              q.question && 
              Array.isArray(q.options) && 
              q.options.length === 4 &&
              q.correctAnswer && 
              ['A', 'B', 'C', 'D'].includes(q.correctAnswer)
            );
            
            if (validQuestions.length > 0) {
              console.log(`Generated ${validQuestions.length} valid questions from API`);
              return validQuestions;
            }
          }
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
        }
      }
    }
    
    console.warn('Failed to get valid questions from API, using fallback questions');
    return getFallbackQuestions(topic, count);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getFallbackQuestions(topic, count);
  }
};

// Fallback questions if API fails
const getFallbackQuestions = (topic, count) => {
  // Select questions based on the topic
  let questions = [];
  
  switch (topic.toLowerCase()) {
    case 'technology':
      questions = [
        {
          question: "Which company developed the first widely used graphical web browser?",
          options: ["Microsoft", "Netscape", "Apple", "IBM"],
          correctAnswer: "B"
        },
        {
          question: "What programming language was developed by James Gosling at Sun Microsystems in the 1990s?",
          options: ["Python", "C++", "Java", "Ruby"],
          correctAnswer: "C"
        },
        {
          question: "What does AI stand for in the technology world?",
          options: ["Advanced Integration", "Artificial Intelligence", "Automated Information", "Augmented Interface"],
          correctAnswer: "B"
        },
        {
          question: "Which technology company's headquarters is known as the 'Infinite Loop'?",
          options: ["Google", "Microsoft", "Apple", "Facebook"],
          correctAnswer: "C"
        },
        {
          question: "Which of these is NOT a cryptocurrency?",
          options: ["Bitcoin", "Ethereum", "Litecoin", "ChromeCoin"],
          correctAnswer: "D"
        },
        {
          question: "What year was the first iPhone released?",
          options: ["2005", "2007", "2009", "2010"],
          correctAnswer: "B"
        },
        {
          question: "What does the acronym 'VR' stand for in technology?",
          options: ["Virtual Reality", "Visual Rendering", "Variable Response", "Vector Representation"],
          correctAnswer: "A"
        }
      ];
      break;
    case 'history':
      questions = [
        {
          question: "In which year did World War II end?",
          options: ["1943", "1945", "1947", "1950"],
          correctAnswer: "B"
        },
        {
          question: "Who was the first President of the United States?",
          options: ["Thomas Jefferson", "John Adams", "George Washington", "James Madison"],
          correctAnswer: "C"
        },
        {
          question: "The French Revolution began in which year?",
          options: ["1789", "1793", "1798", "1801"],
          correctAnswer: "A"
        },
        {
          question: "Which ancient civilization built the Machu Picchu complex in Peru?",
          options: ["Maya", "Aztec", "Inca", "Olmec"],
          correctAnswer: "C"
        },
        {
          question: "Who was the first female Prime Minister of the United Kingdom?",
          options: ["Margaret Thatcher", "Theresa May", "Angela Merkel", "Queen Victoria"],
          correctAnswer: "A"
        },
        {
          question: "Which country was the first to send a human to space?",
          options: ["United States", "Russia", "China", "Germany"],
          correctAnswer: "B"
        },
        {
          question: "The Berlin Wall fell in which year?",
          options: ["1987", "1989", "1991", "1993"],
          correctAnswer: "B"
        }
      ];
      break;
    case 'geography':
      questions = [
        {
          question: "Which is the largest ocean on Earth?",
          options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
          correctAnswer: "D"
        },
        {
          question: "Which desert is the largest in the world?",
          options: ["Gobi Desert", "Sahara Desert", "Arabian Desert", "Antarctic Desert"],
          correctAnswer: "D"
        },
        {
          question: "What is the capital city of Australia?",
          options: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correctAnswer: "C"
        },
        {
          question: "The Great Barrier Reef is located off the coast of which country?",
          options: ["Indonesia", "Australia", "Philippines", "Japan"],
          correctAnswer: "B"
        },
        {
          question: "Which mountain is the tallest in the world from base to peak?",
          options: ["Mount Everest", "K2", "Mauna Kea", "Mount Kilimanjaro"],
          correctAnswer: "A"
        },
        {
          question: "The Amazon River flows through which continent?",
          options: ["Asia", "Africa", "South America", "North America"],
          correctAnswer: "C"
        },
        {
          question: "Which country has the most islands in the world?",
          options: ["Indonesia", "Philippines", "Sweden", "Norway"],
          correctAnswer: "C"
        }
      ];
      break;
    case 'science':
      questions = [
        {
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gl", "Au", "Ag"],
          correctAnswer: "C"
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Mercury"],
          correctAnswer: "B"
        },
        {
          question: "What is the smallest unit of matter?",
          options: ["Molecule", "Atom", "Proton", "Quark"],
          correctAnswer: "D"
        },
        {
          question: "What process do plants use to convert sunlight into energy?",
          options: ["Photosynthesis", "Respiration", "Fermentation", "Digestion"],
          correctAnswer: "A"
        },
        {
          question: "Who developed the theory of general relativity?",
          options: ["Isaac Newton", "Niels Bohr", "Albert Einstein", "Stephen Hawking"],
          correctAnswer: "C"
        },
        {
          question: "What is the main component of the Sun?",
          options: ["Oxygen", "Helium", "Carbon", "Hydrogen"],
          correctAnswer: "D"
        },
        {
          question: "What is the function of white blood cells in the human body?",
          options: ["Transport oxygen", "Fight infections", "Clot blood", "Produce insulin"],
          correctAnswer: "B"
        }
      ];
      break;
    case 'mathematics':
      questions = [
        {
          question: "What is the value of Pi (π) to two decimal places?",
          options: ["3.14", "3.16", "3.12", "3.18"],
          correctAnswer: "A"
        },
        {
          question: "Which of these numbers is a prime number?",
          options: ["15", "21", "57", "17"],
          correctAnswer: "D"
        },
        {
          question: "What is the square root of 144?",
          options: ["10", "12", "14", "16"],
          correctAnswer: "B"
        },
        {
          question: "What is the next number in the Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, ...?",
          options: ["18", "20", "21", "24"],
          correctAnswer: "C"
        },
        {
          question: "In a right-angled triangle, what is the relationship between the sides according to the Pythagorean theorem?",
          options: ["a² + b² = c²", "a + b = c", "a × b = c²", "a² - b² = c²"],
          correctAnswer: "A"
        },
        {
          question: "What is the result of 7³?",
          options: ["21", "49", "243", "343"],
          correctAnswer: "D"
        },
        {
          question: "What is the value of x in the equation 2x + 5 = 15?",
          options: ["3", "5", "7", "10"],
          correctAnswer: "B"
        }
      ];
      break;
    default: // General Knowledge
      questions = [
        {
          question: "Which planet is known as the 'Morning Star'?",
          options: ["Mars", "Venus", "Jupiter", "Mercury"],
          correctAnswer: "B"
        },
        {
          question: "Who painted the Mona Lisa?",
          options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
          correctAnswer: "C"
        },
        {
          question: "What is the chemical formula for water?",
          options: ["CO2", "H2O", "NaCl", "O2"],
          correctAnswer: "B"
        },
        {
          question: "Which country is home to the Great Barrier Reef?",
          options: ["Brazil", "Philippines", "Australia", "Mexico"],
          correctAnswer: "C"
        },
        {
          question: "Who wrote 'Romeo and Juliet'?",
          options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
          correctAnswer: "B"
        },
        {
          question: "What is the largest species of big cat in the world?",
          options: ["Lion", "Leopard", "Jaguar", "Tiger"],
          correctAnswer: "D"
        },
        {
          question: "In which year did the Titanic sink?",
          options: ["1910", "1912", "1915", "1918"],
          correctAnswer: "B"
        }
      ];
  }
  
  // Shuffle and return only the requested number of questions
  return shuffleArray(questions).slice(0, count);
};