import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';

const QuizComponent = ({ studentId, onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizState, setQuizState] = useState('loading'); // loading, active, completed
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch questions from Trivia DB API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      // Science & Nature category (category 17), 10 questions, mixed difficulty
      const response = await fetch('https://opentdb.com/api.php?amount=10&category=17&type=multiple');
      const data = await response.json();
      
      if (data.response_code === 0) {
        // Process questions to include shuffled answers
        const processedQuestions = data.results.map((q, index) => {
          const allAnswers = [...q.incorrect_answers, q.correct_answer];
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
          
          return {
            id: index + 1,
            question: decodeHtml(q.question),
            answers: shuffledAnswers.map(answer => decodeHtml(answer)),
            correctAnswer: decodeHtml(q.correct_answer),
            difficulty: q.difficulty,
            category: decodeHtml(q.category)
          };
        });
        
        setQuestions(processedQuestions);
        setQuizState('active');
      } else {
        throw new Error('Failed to fetch questions from Trivia DB');
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      // Fallback to local questions if API fails
      setQuestions(getFallbackQuestions());
      setQuizState('active');
    } finally {
      setLoading(false);
    }
  };

  // Decode HTML entities in questions/answers
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Fallback questions if API is unavailable
  const getFallbackQuestions = () => [
    {
      id: 1,
      question: "What is the chemical symbol for water?",
      answers: ["H2O", "CO2", "NaCl", "O2"],
      correctAnswer: "H2O",
      difficulty: "easy",
      category: "Science"
    },
    {
      id: 2,
      question: "Which part of the plant conducts photosynthesis?",
      answers: ["Roots", "Stem", "Leaves", "Flowers"],
      correctAnswer: "Leaves",
      difficulty: "easy",
      category: "Biology"
    },
    {
      id: 3,
      question: "What gas do plants absorb from the atmosphere during photosynthesis?",
      answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      correctAnswer: "Carbon Dioxide",
      difficulty: "medium",
      category: "Biology"
    },
    {
      id: 4,
      question: "What is the pH range for neutral soil?",
      answers: ["5.5-6.5", "6.5-7.5", "7.5-8.5", "8.5-9.5"],
      correctAnswer: "6.5-7.5",
      difficulty: "medium",
      category: "Agriculture"
    },
    {
      id: 5,
      question: "Which nutrient is most important for plant root development?",
      answers: ["Nitrogen", "Phosphorus", "Potassium", "Calcium"],
      correctAnswer: "Phosphorus",
      difficulty: "hard",
      category: "Agriculture"
    },
    {
      id: 6,
      question: "What is the process by which plants lose water through their leaves?",
      answers: ["Respiration", "Transpiration", "Photosynthesis", "Germination"],
      correctAnswer: "Transpiration",
      difficulty: "medium",
      category: "Biology"
    },
    {
      id: 7,
      question: "Which of these is a macronutrient for plants?",
      answers: ["Iron", "Zinc", "Nitrogen", "Boron"],
      correctAnswer: "Nitrogen",
      difficulty: "easy",
      category: "Agriculture"
    },
    {
      id: 8,
      question: "What type of soil particle is the smallest?",
      answers: ["Sand", "Silt", "Clay", "Gravel"],
      correctAnswer: "Clay",
      difficulty: "medium",
      category: "Soil Science"
    },
    {
      id: 9,
      question: "Which hormone is responsible for plant growth towards light?",
      answers: ["Auxin", "Cytokinin", "Gibberellin", "Ethylene"],
      correctAnswer: "Auxin",
      difficulty: "hard",
      category: "Biology"
    },
    {
      id: 10,
      question: "What is the optimal temperature range for most plant growth?",
      answers: ["10-15°C", "15-25°C", "25-35°C", "35-45°C"],
      correctAnswer: "15-25°C",
      difficulty: "medium",
      category: "Agriculture"
    }
  ];

  // Timer effect
  useEffect(() => {
    if (quizState === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizState === 'active') {
      handleQuizSubmit();
    }
  }, [timeLeft, quizState]);

  // Initialize quiz
  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizSubmit = async () => {
    // Calculate results
    let correctAnswers = 0;
    const questionResults = questions.map((question, index) => {
      const userAnswer = selectedAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer || 'Not answered',
        correctAnswer: question.correctAnswer,
        isCorrect,
        difficulty: question.difficulty
      };
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeTaken = 600 - timeLeft; // seconds

    const results = {
      id: Date.now().toString(),
      studentId,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      timeTaken,
      completedAt: new Date().toISOString(),
      questionResults,
      difficulty: 'mixed'
    };

    setQuizResults(results);
    setQuizState('completed');

    // Save to dataManager
    try {
      const { default: dataManager } = await import('../../utils/dataManager');
      dataManager.saveQuizResult(results);
      
      // Log activity
      dataManager.logActivity({
        type: 'quiz_completed',
        studentId,
        score,
        correctAnswers,
        totalQuestions: questions.length,
        timeTaken,
        details: `Science & Nature Quiz completed with ${score}% score`
      });

      // Notify parent component
      if (onQuizComplete) {
        onQuizComplete(results);
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimeLeft(600);
    setQuizResults(null);
    setQuizState('loading');
    fetchQuestions();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading || quizState === 'loading') {
    return (
      <div className="bg-card rounded-lg border border-border shadow-card p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Quiz Questions...</h3>
          <p className="text-muted-foreground">Fetching Science & Nature questions from Trivia DB</p>
        </div>
      </div>
    );
  }

  if (quizState === 'completed' && quizResults) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-card p-8">
        <div className="text-center mb-6">
          <Award className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Completed!</h2>
          <div className="text-4xl font-bold text-primary mb-2">{quizResults.score}%</div>
          <p className="text-muted-foreground">
            {quizResults.correctAnswers} out of {quizResults.totalQuestions} questions correct
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{quizResults.score}%</div>
            <div className="text-sm text-muted-foreground">Final Score</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{formatTime(quizResults.timeTaken)}</div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{quizResults.correctAnswers}/{quizResults.totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Correct Answers</div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">Question Review</h3>
          {quizResults.questionResults.map((result, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground flex-1">{result.question}</h4>
                {result.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 ml-2" />
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Your answer:</span>
                  <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {result.userAnswer}
                  </span>
                </div>
                {!result.isCorrect && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Correct answer:</span>
                    <span className="text-green-600">{result.correctAnswer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleRetakeQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-8">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Science & Nature Quiz</h2>
          <p className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQ.difficulty)}`}>
            {currentQ.difficulty}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className={`font-mono ${timeLeft < 60 ? 'text-red-600' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-6">{currentQ.question}</h3>
        
        <div className="space-y-3">
          {currentQ.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              className={`w-full p-4 text-left border rounded-lg transition-colors ${
                selectedAnswers[currentQuestion] === answer
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuestion] === answer
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground'
                }`}>
                  {selectedAnswers[currentQuestion] === answer && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                  )}
                </div>
                <span>{answer}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-primary text-primary-foreground'
                  : selectedAnswers[index]
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleQuizSubmit}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 text-primary hover:text-primary/80"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
