import { useState, useEffect, useRef, useCallback } from 'react';
import { generateQuizQuestions } from '../../services/aiServices';
import { speechService } from '../../services/speechService';
import confetti from 'canvas-confetti';

const DailyQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('General Knowledge');
  const [completedTopics, setCompletedTopics] = useState(() => {
    // Load completed topics from localStorage
    const saved = localStorage.getItem('completedQuizTopics');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastQuizDate, setLastQuizDate] = useState(() => {
    return localStorage.getItem('lastQuizDate') || '';
  });
  const [todaysScore, setTodaysScore] = useState(() => {
    return parseInt(localStorage.getItem('todaysQuizScore') || '0');
  });
  const [lastGenerated, setLastGenerated] = useState({});
  
  const confettiRef = useRef(null);
  const topicRef = useRef(null);

  // Check if speech synthesis is supported and reset daily topics
  useEffect(() => {
    // Need to wait until component is mounted to check browser features
    setSpeakEnabled(speechService.isSupported());
    
    // Check if it's a new day to reset completed topics
    const today = new Date().toDateString();
    if (lastQuizDate !== today) {
      localStorage.setItem('lastQuizDate', today);
      localStorage.setItem('completedQuizTopics', JSON.stringify([]));
      localStorage.setItem('todaysQuizScore', '0');
      setLastQuizDate(today);
      setCompletedTopics([]);
      setTodaysScore(0);
    }
  }, [lastQuizDate]);

  // Function to add points to leaderboard
  const addPointsToLeaderboard = (points) => {
    try {
      // Update today's score
      const newScore = todaysScore + points;
      setTodaysScore(newScore);
      localStorage.setItem('todaysQuizScore', newScore.toString());
      
      // Get the current user's leaderboard data
      const leaderboardData = JSON.parse(localStorage.getItem('leaderboardData') || '{}');
      const currentScore = leaderboardData.score || 0;
      const newTotalScore = currentScore + points;
      
      // Update leaderboard data
      localStorage.setItem('leaderboardData', JSON.stringify({
        ...leaderboardData,
        score: newTotalScore,
        lastUpdated: new Date().toISOString()
      }));
      
      // Show celebration animation
      triggerCelebration();
      
      console.log(`Added ${points} points to leaderboard. New total: ${newTotalScore}`);
    } catch (err) {
      console.error('Error updating leaderboard:', err);
    }
  };
  
  // Function to trigger the celebration animation
  const triggerCelebration = () => {
    setShowCongratulations(true);
    
    // Launch confetti
    const canvas = confettiRef.current;
    if (canvas) {
      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });
      
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Hide the congratulations message after 5 seconds
    setTimeout(() => {
      setShowCongratulations(false);
    }, 5000);
  };

  // Function to fetch questions and read the first one aloud
  const fetchQuestions = useCallback(async (topic) => {
    // Check if we've generated questions for this topic in the last 2 minutes
    const now = Date.now();
    const lastGen = lastGenerated[topic];
    const twoMinutesAgo = now - 2 * 60 * 1000;
    
    if (lastGen && lastGen.timestamp > twoMinutesAgo && lastGen.questions.length > 0) {
      console.log(`Using recently generated questions for ${topic} (generated ${Math.round((now - lastGen.timestamp)/1000)}s ago)`);
      setQuestions(lastGen.questions);
      setActiveQuestion(0);
      setSelectedAnswer(null);
      setCorrectAnswers(0);
      setCurrentTopic(topic);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setCurrentTopic(topic);
    
    try {
      console.log('Fetching NEW questions for topic:', topic);
      const generatedQuestions = await generateQuizQuestions(topic, 5, 'medium');
      console.log('Questions received:', generatedQuestions);
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        // Save the generated questions with timestamp
        setLastGenerated(prev => ({
          ...prev,
          [topic]: {
            questions: generatedQuestions,
            timestamp: Date.now()
          }
        }));
        
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
  }, [speakEnabled, lastGenerated]);

  // Force new questions generation
  const forceRefreshQuestions = () => {
    // Clear the cache for current topic
    setLastGenerated(prev => {
      const newCache = {...prev};
      delete newCache[currentTopic];
      return newCache;
    });
    
    // Then fetch new questions
    fetchQuestions(currentTopic);
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
    
    // Check if answer is correct and update score
    if (answerLetter === questions[activeQuestion].correctAnswer) {
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
      
      // Check if completed all 5 questions correctly
      if (newCorrectAnswers === 5 && !completedTopics.includes(currentTopic)) {
        // Add 5 points to the leaderboard
        addPointsToLeaderboard(5);
        
        // Mark this topic as completed for today
        const newCompletedTopics = [...completedTopics, currentTopic];
        setCompletedTopics(newCompletedTopics);
        localStorage.setItem('completedQuizTopics', JSON.stringify(newCompletedTopics));
      }
    }
  };

  // Fetch questions when component mounts
  useEffect(() => {
    fetchQuestions('General Knowledge');
    
    // Set up a reference to the select element for later use
    if (topicRef.current) {
      topicRef.current.value = 'General Knowledge';
    }
  }, [fetchQuestions]);

  return (
    <div className="p-6 relative">
      {/* Canvas for confetti */}
      <canvas 
        ref={confettiRef} 
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Congratulations message */}
      {showCongratulations && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto transform animate-bounce">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-indigo-600 mb-4">Congratulations! 🎉</h2>
              <p className="text-lg text-gray-700 mb-6">You've earned 5 points by answering all questions correctly!</p>
              <div className="flex justify-center mb-4">
                <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg font-semibold text-yellow-800">+5 coins added!</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCongratulations(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Keep Learning
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-800">Daily Quiz</h2>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-indigo-600">{correctAnswers}</span> correct out of 5
            </p>
          </div>
          <div className="flex space-x-2">
            <select 
              ref={topicRef}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => fetchQuestions(e.target.value)}
              disabled={loading}
              value={currentTopic}
            >
              <option value="General Knowledge">General Knowledge</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Technology">Technology</option>
              <option value="Mathematics">Mathematics</option>
            </select>
            <button
              onClick={forceRefreshQuestions}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
              disabled={loading}
              title="Generate new questions"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <>New Questions</>
              )}
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
        
        {/* Topic completion status */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['General Knowledge', 'Science', 'History', 'Geography', 'Technology', 'Mathematics'].map(topic => (
            <div 
              key={topic}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                completedTopics.includes(topic) 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {completedTopics.includes(topic) ? '✓ ' : ''}{topic}
            </div>
          ))}
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
                  <button 
                    onClick={forceRefreshQuestions}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200"
                  >
                    Try Again
                  </button>
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
                      disabled={selectedAnswer !== null}
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
              <p className="text-gray-500">Select a topic to start the quiz!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyQuiz;