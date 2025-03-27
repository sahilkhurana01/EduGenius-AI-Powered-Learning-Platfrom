import React, { useState, useEffect } from 'react';
import { useOfflineDB } from '../hooks/useOfflineDB';

const OfflineQuiz = () => {
  const db = useOfflineDB();
  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // In a real app, you'd get the quiz ID from props or route params
        const quizData = await db.getQuiz('quiz-1');
        setQuiz(quizData);
      } catch (error) {
        setMessage('Error loading quiz. Please check your connection.');
        console.error('Error loading quiz:', error);
      }
    };

    loadQuiz();
  }, []);

  const handleAnswer = (questionIndex, answer) => {
    if (!quiz) return;

    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].userAnswer = answer;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setIsSubmitting(true);
    try {
      // Calculate score
      const calculatedScore = quiz.questions.reduce((acc, question) => {
        return acc + (question.userAnswer === question.correctAnswer ? 1 : 0);
      }, 0);

      // Save score locally first
      await db.saveScore({
        id: `score-${Date.now()}`,
        quizId: quiz.id,
        score: calculatedScore,
        timestamp: new Date().toISOString(),
        answers: quiz.questions.map(q => ({
          questionId: q.id,
          answer: q.userAnswer
        }))
      });

      setScore(calculatedScore);
      setMessage('Score saved successfully!');
    } catch (error) {
      setMessage('Error saving score. Please try again.');
      console.error('Error saving score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        <p className="text-sm text-gray-600">
          {db.isOnline ? 'Online' : 'Offline'} Mode
          {db.isSyncing && ' - Syncing...'}
        </p>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {score > 0 ? (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Your Score: {score}/{quiz.questions.length}</h3>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="mb-6 p-4 border rounded">
              <p className="font-medium mb-2">{index + 1}. {question.text}</p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={question.userAnswer === option}
                      onChange={() => handleAnswer(index, option)}
                      className="form-radio"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OfflineQuiz; 