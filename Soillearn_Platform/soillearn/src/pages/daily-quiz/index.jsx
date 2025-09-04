import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuizStart from './components/QuizStart';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import QuizReview from './components/QuizReview';


const DailyQuiz = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('start'); // start, quiz, results, review
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [userRole, setUserRole] = useState('student');
  const [userStats, setUserStats] = useState({
    currentStreak: 5,
    totalQuizzesTaken: 23,
    averageScore: 78,
    lastQuizDate: new Date(Date.now() - 86400000)?.toDateString(), // Yesterday
    lastQuizScore: 85,
    currentXP: 1250,
    currentLevel: 8,
    nextLevelXP: 1500
  });

  // Mock quiz questions data
  const mockQuestions = [
    {
      category: "Soil Science",
      type: "multiple",
      difficulty: "medium",
      question: "What is the ideal pH range for most agricultural crops?",
      correct_answer: "6.0 - 7.0",
      incorrect_answers: ["4.0 - 5.0", "8.0 - 9.0", "3.0 - 4.0"],
      answers: ["6.0 - 7.0", "4.0 - 5.0", "8.0 - 9.0", "3.0 - 4.0"],
      explanation: "Most crops grow best in slightly acidic to neutral soil with a pH between 6.0 and 7.0, as this range allows for optimal nutrient availability."
    },
    {
      category: "Plant Biology",
      type: "multiple",
      difficulty: "easy",
      question: "Which nutrient is primarily responsible for leaf growth and green color in plants?",
      correct_answer: "Nitrogen",
      incorrect_answers: ["Phosphorus", "Potassium", "Calcium"],
      answers: ["Nitrogen", "Phosphorus", "Potassium", "Calcium"],
      explanation: "Nitrogen is essential for chlorophyll production and protein synthesis, making it crucial for leaf development and the green color of plants."
    },
    {
      category: "Soil Composition",
      type: "multiple",
      difficulty: "hard",
      question: "What percentage of soil volume should ideally be pore space?",
      correct_answer: "50%",
      incorrect_answers: ["25%", "75%", "90%"],
      answers: ["50%", "25%", "75%", "90%"],
      explanation: "Healthy soil should have approximately 50% pore space (25% air and 25% water) and 50% solid particles (45% mineral and 5% organic matter)."
    },
    {
      category: "Water Management",
      type: "multiple",
      difficulty: "medium",
      question: "What is the term for the amount of water soil can hold against gravity?",
      correct_answer: "Field Capacity",
      incorrect_answers: ["Wilting Point", "Saturation Point", "Hygroscopic Water"],
      answers: ["Field Capacity", "Wilting Point", "Saturation Point", "Hygroscopic Water"],
      explanation: "Field capacity is the amount of water remaining in soil after excess water has drained away due to gravity, typically 1-3 days after irrigation."
    },
    {
      category: "Soil Organisms",
      type: "multiple",
      difficulty: "easy",
      question: "Which organisms are most important for breaking down organic matter in soil?",
      correct_answer: "Bacteria and Fungi",
      incorrect_answers: ["Earthworms only", "Plant roots", "Insects"],
      answers: ["Bacteria and Fungi", "Earthworms only", "Plant roots", "Insects"],
      explanation: "Bacteria and fungi are the primary decomposers in soil, breaking down organic matter and releasing nutrients for plant uptake."
    },
    {
      category: "Soil Testing",
      type: "multiple",
      difficulty: "medium",
      question: "What does EC stand for in soil testing?",
      correct_answer: "Electrical Conductivity",
      incorrect_answers: ["Essential Components", "Environmental Conditions", "Elemental Composition"],
      answers: ["Electrical Conductivity", "Essential Components", "Environmental Conditions", "Elemental Composition"],
      explanation: "Electrical Conductivity (EC) measures the salt content in soil, which affects plant growth and water uptake."
    },
    {
      category: "Plant Nutrition",
      type: "multiple",
      difficulty: "hard",
      question: "Which of these is NOT a macronutrient for plants?",
      correct_answer: "Iron",
      incorrect_answers: ["Nitrogen", "Phosphorus", "Potassium"],
      answers: ["Iron", "Nitrogen", "Phosphorus", "Potassium"],
      explanation: "Iron is a micronutrient needed in small quantities. The three primary macronutrients are Nitrogen (N), Phosphorus (P), and Potassium (K)."
    },
    {
      category: "Soil Structure",
      type: "multiple",
      difficulty: "easy",
      question: "What is the best soil texture for most plants?",
      correct_answer: "Loam",
      incorrect_answers: ["Clay", "Sand", "Silt"],
      answers: ["Loam", "Clay", "Sand", "Silt"],
      explanation: "Loam is ideal because it combines the drainage of sand, water retention of clay, and fertility of silt in balanced proportions."
    },
    {
      category: "Soil Chemistry",
      type: "multiple",
      difficulty: "medium",
      question: "What happens to nutrient availability when soil pH is too high?",
      correct_answer: "Nutrients become less available",
      incorrect_answers: ["Nutrients become more available", "No change in availability", "Only nitrogen is affected"],
      answers: ["Nutrients become less available", "Nutrients become more available", "No change in availability", "Only nitrogen is affected"],
      explanation: "In alkaline soils (high pH), many nutrients like iron, manganese, and phosphorus become chemically bound and less available to plants."
    },
    {
      category: "Sustainable Agriculture",
      type: "multiple",
      difficulty: "medium",
      question: "Which practice helps improve soil organic matter?",
      correct_answer: "Cover cropping",
      incorrect_answers: ["Excessive tillage", "Removing crop residues", "Using only synthetic fertilizers"],
      answers: ["Cover cropping", "Excessive tillage", "Removing crop residues", "Using only synthetic fertilizers"],
      explanation: "Cover cropping adds organic matter to soil through root biomass and above-ground plant material, improving soil health and structure."
    }
  ];

  useEffect(() => {
    // Load user data from localStorage
    const savedUserData = localStorage.getItem('soillearn_user');
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      setUserRole(userData?.role || 'student');
      setUserStats(prev => ({ ...prev, ...userData?.stats }));
    }

    // Check if quiz was already taken today
    const today = new Date()?.toDateString();
    const lastQuizDate = localStorage.getItem('soillearn_last_quiz_date');
    if (lastQuizDate === today) {
      const lastScore = localStorage.getItem('soillearn_last_quiz_score');
      setUserStats(prev => ({ 
        ...prev, 
        lastQuizDate: today, 
        lastQuizScore: parseInt(lastScore) || 0 
      }));
    }

    // Timer countdown effect
    let timerInterval;
    if (currentView === 'quiz' && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [currentView, timeRemaining]);

  const handleStartQuiz = () => {
    // Shuffle questions and prepare quiz
    const shuffledQuestions = [...mockQuestions]?.sort(() => Math.random() - 0.5);
    
    // Shuffle answers for each question
    const questionsWithShuffledAnswers = shuffledQuestions?.map(q => ({
      ...q,
      answers: [...q?.answers]?.sort(() => Math.random() - 0.5)
    }));

    setQuestions(questionsWithShuffledAnswers);
    setUserAnswers(new Array(questionsWithShuffledAnswers.length)?.fill(''));
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setTimeRemaining(300); // Reset timer
    setQuizStartTime(Date.now());
    setCurrentView('quiz');
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    
    // Auto-submit after selection with delay for UX
    setTimeout(() => {
      handleSubmitAnswer(answer);
    }, 500);
  };

  const handleSubmitAnswer = (answer = selectedAnswer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      handleFinishQuiz();
    }
  };

  const handleSkipQuestion = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = '';
    setUserAnswers(newAnswers);
    
    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
    
    // Calculate results
    const correctAnswers = userAnswers?.filter((answer, index) => 
      answer === questions?.[index]?.correct_answer
    )?.length;
    
    const incorrectAnswers = questions?.length - correctAnswers;
    const score = correctAnswers;
    const percentage = Math.round((score / questions?.length) * 100);
    
    // Calculate XP
    const xpGained = correctAnswers * 5;
    const xpLost = incorrectAnswers * 2;
    const netXP = xpGained - xpLost;
    
    // Update user stats
    const newStats = {
      ...userStats,
      currentXP: userStats?.currentXP + netXP,
      lastQuizDate: new Date()?.toDateString(),
      lastQuizScore: percentage,
      totalQuizzesTaken: userStats?.totalQuizzesTaken + 1,
      averageScore: Math.round(
        ((userStats?.averageScore * userStats?.totalQuizzesTaken) + percentage) / 
        (userStats?.totalQuizzesTaken + 1)
      )
    };

    // Update streak
    const yesterday = new Date(Date.now() - 86400000)?.toDateString();
    if (userStats?.lastQuizDate === yesterday) {
      newStats.currentStreak = userStats?.currentStreak + 1;
    } else if (userStats?.lastQuizDate !== new Date()?.toDateString()) {
      newStats.currentStreak = 1;
    }

    setUserStats(newStats);
    
    // Save to localStorage
    localStorage.setItem('soillearn_last_quiz_date', new Date()?.toDateString());
    localStorage.setItem('soillearn_last_quiz_score', percentage?.toString());
    localStorage.setItem('soillearn_user', JSON.stringify({
      role: userRole,
      stats: newStats
    }));

    setCurrentView('results');
  };

  const handleTimeUp = () => {
    handleFinishQuiz();
  };

  const handleReturnToDashboard = () => {
    navigate('/student-dashboard');
  };

  const handleReviewAnswers = () => {
    setCurrentView('review');
  };

  const handleReturnToResults = () => {
    setCurrentView('results');
  };

  const handleRetakeQuiz = () => {
    setCurrentView('start');
  };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  // Calculate quiz results for results view
  const getQuizResults = () => {
    const correctAnswers = userAnswers?.filter((answer, index) => 
      answer === questions?.[index]?.correct_answer
    )?.length;
    const incorrectAnswers = questions?.length - correctAnswers;
    const xpGained = correctAnswers * 5;
    const xpLost = incorrectAnswers * 2;
    const timeSpent = quizStartTime ? Math.floor((Date.now() - quizStartTime) / 1000) : 0;

    return {
      score: correctAnswers,
      totalQuestions: questions?.length,
      xpGained,
      xpLost,
      correctAnswers,
      incorrectAnswers,
      timeSpent
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        userName="Alex Chen"
        userXP={userStats?.currentXP}
        userLevel={userStats?.currentLevel}
        nextLevelXP={userStats?.nextLevelXP}
        onRoleChange={handleRoleChange}
        onNotificationClick={() => {}}
        onMarkAsRead={() => {}}
        onMarkAllAsRead={() => {}}
      />
      <main className="content-offset px-6 py-8">
        {currentView === 'start' && (
          <QuizStart
            onStartQuiz={handleStartQuiz}
            lastQuizDate={userStats?.lastQuizDate}
            lastQuizScore={userStats?.lastQuizScore}
            currentStreak={userStats?.currentStreak}
            totalQuizzesTaken={userStats?.totalQuizzesTaken}
            averageScore={userStats?.averageScore}
          />
        )}

        {currentView === 'quiz' && questions?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <QuizQuestion
              question={questions?.[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions?.length}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              showResult={showResult}
              isCorrect={selectedAnswer === questions?.[currentQuestionIndex]?.correct_answer}
              correctAnswer={questions?.[currentQuestionIndex]?.correct_answer}
              explanation={questions?.[currentQuestionIndex]?.explanation}
              onNext={handleNextQuestion}
              onSkip={handleSkipQuestion}
              timeRemaining={timeRemaining}
              isLastQuestion={currentQuestionIndex === questions?.length - 1}
            />
          </div>
        )}

        {currentView === 'results' && (
          <QuizResults
            {...getQuizResults()}
            onReturnToDashboard={handleReturnToDashboard}
            onReviewAnswers={handleReviewAnswers}
            onRetakeQuiz={handleRetakeQuiz}
          />
        )}

        {currentView === 'review' && (
          <QuizReview
            questions={questions}
            userAnswers={userAnswers}
            onReturnToResults={handleReturnToResults}
            onReturnToDashboard={handleReturnToDashboard}
          />
        )}
      </main>
    </div>
  );
};

export default DailyQuiz;