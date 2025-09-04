import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizQuestion = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showResult,
  isCorrect,
  correctAnswer,
  explanation,
  onNext,
  onSkip,
  timeRemaining,
  isLastQuestion
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getAnswerButtonVariant = (answer) => {
    if (!showResult) return selectedAnswer === answer ? 'default' : 'outline';
    
    if (answer === correctAnswer) return 'success';
    if (answer === selectedAnswer && !isCorrect) return 'destructive';
    return 'outline';
  };

  const getAnswerIcon = (answer) => {
    if (!showResult) return null;
    
    if (answer === correctAnswer) return 'CheckCircle';
    if (answer === selectedAnswer && !isCorrect) return 'XCircle';
    return null;
  };

  return (
    <div className="bg-card rounded-lg border shadow-card p-6 animate-fade-in">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground">
            Category: {question?.category}
          </div>
        </div>
        
        {/* Timer */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
          timeRemaining <= 10 ? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
        }`}>
          <Icon name="Clock" size={16} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="progress-bar h-2 mb-6">
        <div 
          className="progress-fill"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>
      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {question?.question}
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Target" size={16} />
          <span>Difficulty: {question?.difficulty}</span>
        </div>
      </div>
      {/* Answer Options */}
      <div className="space-y-3 mb-8">
        {question?.answers?.map((answer, index) => {
          const answerIcon = getAnswerIcon(answer);
          
          return (
            <Button
              key={index}
              variant={getAnswerButtonVariant(answer)}
              onClick={() => !showResult && onAnswerSelect(answer)}
              disabled={showResult}
              className="w-full justify-start text-left p-4 h-auto min-h-[60px]"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 text-wrap">{answer}</span>
                {answerIcon && (
                  <Icon name={answerIcon} size={20} className="flex-shrink-0" />
                )}
              </div>
            </Button>
          );
        })}
      </div>
      {/* Result Explanation */}
      {showResult && explanation && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-2">Explanation</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onSkip}
          disabled={showResult}
          iconName="SkipForward"
          iconPosition="right"
        >
          Skip Question
        </Button>

        {showResult && (
          <Button
            variant="default"
            onClick={onNext}
            iconName={isLastQuestion ? "Flag" : "ArrowRight"}
            iconPosition="right"
          >
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;