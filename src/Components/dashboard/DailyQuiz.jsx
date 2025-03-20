import { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../../services/aiServices';
import { speechService } from '../../services/speechService';

const DailyQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [speakEnabled, setSpeakEnabled] = useState(false);

  // Check if speech synthesis is supported
  useEffect(() => {
    // Need to wait until component is mounted to check browser features
    setSpeakEnabled(speechService.isSupported());
  }, []);

  // Function to fetch questions and read the first one aloud
  const fetchQuestions = async (topic) => {
    setLoading(true);
    setError(null);
    setSelectedAnswer(null);
    
    try {
      console.log('Fetching questions for topic:', topic);
      const generatedQuestions = await generateQuizQuestions(topic, 5, 'medium');
      console.log('Questions received:', generatedQuestions);
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setActiveQuestion(0);
        
        // Read the first question and options aloud if speech is enabled
        if (speakEnabled) {
          try {
            const firstQuestion = generatedQuestions[0];
            const textToSpeak = `${firstQuestion.question} A: ${firstQuestion.options[0]}, B: ${firstQuestion.options[1]}, C: ${firstQuestion.options[2]}, D: ${firstQuestion.options[3]}`;
            speechService.speak(textToSpeak, { lang: 'en-US' });
          } catch (speechError) {
            console.error('Speech synthesis error:', speechError);
            // Continue even if speech fails
          }
        }
      } else {
        setError('No questions were generated. Please try again.');
      }
    } catch (err) {
      console.error('Error in fetchQuestions:', err);
      setError(`Failed to generate quiz questions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Move to the next question
  const nextQuestion = () => {
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion(activeQuestion + 1);
      setSelectedAnswer(null);
      
      // Read the next question aloud if speech is enabled
      if (speakEnabled) {
        try {
          const question = questions[activeQuestion + 1];
          const textToSpeak = `${question.question} A: ${question.options[0]}, B: ${question.options[1]}, C: ${question.options[2]}, D: ${question.options[3]}`;
          speechService.speak(textToSpeak, { lang: 'en-US' });
        } catch (speechError) {
          console.error('Speech synthesis error:', speechError);
        }
      }
    }
  };

  // Previous question
  const prevQuestion = () => {
    if (activeQuestion > 0) {
      setActiveQuestion(activeQuestion - 1);
      setSelectedAnswer(null);
      
      // Read the previous question aloud if speech is enabled
      if (speakEnabled) {
        try {
          const question = questions[activeQuestion - 1];
          const textToSpeak = `${question.question} A: ${question.options[0]}, B: ${question.options[1]}, C: ${question.options[2]}, D: ${question.options[3]}`;
          speechService.speak(textToSpeak, { lang: 'en-US' });
        } catch (speechError) {
          console.error('Speech synthesis error:', speechError);
        }
      }
    }
  };

  // Speak current question
  const speakCurrentQuestion = () => {
    if (speakEnabled && questions.length > 0) {
      try {
        const question = questions[activeQuestion];
        const textToSpeak = `${question.question} A: ${question.options[0]}, B: ${question.options[1]}, C: ${question.options[2]}, D: ${question.options[3]}`;
        speechService.speak(textToSpeak, { lang: 'en-US' });
      } catch (speechError) {
        console.error('Speech synthesis error:', speechError);
      }
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    const answerLetter = String.fromCharCode(65 + answerIndex);
    setSelectedAnswer(answerLetter);
  };

  // Fetch questions when component mounts
  useEffect(() => {
    fetchQuestions('General Knowledge');
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-indigo-800">Daily Quiz</h2>
          <div className="flex space-x-2">
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => fetchQuestions(e.target.value)}
              disabled={loading}
            >
              <option value="General Knowledge">General Knowledge</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Technology">Technology</option>
              <option value="Mathematics">Mathematics</option>
            </select>
            <button
              onClick={() => fetchQuestions('General Knowledge')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'New Quiz'}
            </button>
            {speakEnabled && (
              <button
                onClick={speakCurrentQuestion}
                className="px-2 py-2 text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
                title="Read question aloud"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600">Loading questions...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {!loading && questions.length > 0 && (
            <div>
              <div className="mb-2 text-sm text-gray-500">
                Question {activeQuestion + 1} of {questions.length}
              </div>
              
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {questions[activeQuestion].question}
              </h3>
              
              <ul className="space-y-3">
                {questions[activeQuestion].options.map((option, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-3 rounded-lg border ${
                        selectedAnswer === String.fromCharCode(65 + index)
                          ? selectedAnswer === questions[activeQuestion].correctAnswer
                            ? 'bg-green-100 border-green-500'
                            : 'bg-red-100 border-red-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
              
              {selectedAnswer && (
                <div className={`mt-4 p-3 rounded-lg ${
                  selectedAnswer === questions[activeQuestion].correctAnswer
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedAnswer === questions[activeQuestion].correctAnswer
                    ? '✓ Correct answer!'
                    : `✗ Incorrect. The correct answer is ${questions[activeQuestion].correctAnswer}.`}
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={prevQuestion}
                  disabled={activeQuestion === 0}
                  className={`px-4 py-2 rounded-md ${
                    activeQuestion === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  } transition-colors`}
                >
                  Previous
                </button>
                
                <button
                  onClick={nextQuestion}
                  disabled={activeQuestion === questions.length - 1}
                  className={`px-4 py-2 rounded-md ${
                    activeQuestion === questions.length - 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } transition-colors`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {!loading && questions.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-gray-600">Daily quiz content will be displayed here.</p>
              <button
                onClick={() => fetchQuestions('General Knowledge')}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyQuiz;