import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizReview = ({
  questions,
  userAnswers,
  onReturnToResults,
  onReturnToDashboard
}) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  
  // Filter to show only incorrect answers
  const incorrectQuestions = questions?.filter((_, index) => 
    userAnswers?.[index] !== questions?.[index]?.correct_answer
  );

  const currentQuestion = incorrectQuestions?.[currentReviewIndex];
  const originalIndex = questions?.findIndex(q => q === currentQuestion);
  const userAnswer = userAnswers?.[originalIndex];

  const handleNext = () => {
    if (currentReviewIndex < incorrectQuestions?.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1);
    }
  };

  const getAnswerStatus = (answer) => {
    if (answer === currentQuestion?.correct_answer) return 'correct';
    if (answer === userAnswer) return 'incorrect';
    return 'neutral';
  };

  const getAnswerButtonVariant = (answer) => {
    const status = getAnswerStatus(answer);
    if (status === 'correct') return 'success';
    if (status === 'incorrect') return 'destructive';
    return 'outline';
  };

  const getAnswerIcon = (answer) => {
    const status = getAnswerStatus(answer);
    if (status === 'correct') return 'CheckCircle';
    if (status === 'incorrect') return 'XCircle';
    return null;
  };

  if (incorrectQuestions?.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border shadow-card p-8 text-center">
          <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Trophy" size={40} className="text-success" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Perfect Score! 🎉
          </h2>
          
          <p className="text-muted-foreground mb-6">
            You answered all questions correctly! There's nothing to review.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              onClick={onReturnToDashboard}
              iconName="Home"
              iconPosition="left"
            >
              Return to Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={onReturnToResults}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Review Header */}
      <div className="bg-card rounded-lg border shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Review Incorrect Answers
            </h1>
            <p className="text-muted-foreground">
              Learn from your mistakes to improve next time
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Question {currentReviewIndex + 1} of {incorrectQuestions?.length}
            </div>
            <div className="text-xs text-error font-medium">
              Originally Question {originalIndex + 1}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar h-2">
          <div 
            className="bg-error h-full transition-all duration-300"
            style={{ width: `${((currentReviewIndex + 1) / incorrectQuestions?.length) * 100}%` }}
          />
        </div>
      </div>
      {/* Question Review */}
      <div className="bg-card rounded-lg border shadow-card p-6">
        {/* Question */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-error/10 text-error px-3 py-1 rounded-full text-sm font-medium">
              Incorrect
            </div>
            <div className="text-sm text-muted-foreground">
              Category: {currentQuestion?.category}
            </div>
            <div className="text-sm text-muted-foreground">
              Difficulty: {currentQuestion?.difficulty}
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-foreground">
            {currentQuestion?.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion?.answers?.map((answer, index) => {
            const answerIcon = getAnswerIcon(answer);
            const status = getAnswerStatus(answer);
            
            return (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  status === 'correct' ? 'border-success bg-success/5' :
                  status === 'incorrect'? 'border-error bg-error/5' : 'border-border'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{answer}</span>
                  {answerIcon && (
                    <Icon name={answerIcon} size={20} className={
                      status === 'correct' ? 'text-success' : 'text-error'
                    } />
                  )}
                  {status === 'correct' && (
                    <span className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded">
                      Correct Answer
                    </span>
                  )}
                  {status === 'incorrect' && (
                    <span className="text-xs text-error font-medium bg-error/10 px-2 py-1 rounded">
                      Your Answer
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {currentQuestion?.explanation && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground mb-2">Why this is correct:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentQuestion?.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentReviewIndex === 0}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {incorrectQuestions?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReviewIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentReviewIndex ? 'bg-error' : 'bg-muted hover:bg-muted-foreground/30'
              }`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentReviewIndex === incorrectQuestions?.length - 1}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Next
        </Button>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button
          variant="default"
          onClick={onReturnToDashboard}
          iconName="Home"
          iconPosition="left"
        >
          Return to Dashboard
        </Button>
        
        <Button
          variant="outline"
          onClick={onReturnToResults}
          iconName="BarChart3"
          iconPosition="left"
        >
          Back to Results
        </Button>
      </div>
    </div>
  );
};

export default QuizReview;