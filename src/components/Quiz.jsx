import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Quiz = ({ 
  title, 
  questions, 
  onComplete, 
  showResults = true,
  allowRetake = true 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showFeedback, setShowFeedback] = useState({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [startTime] = useState(Date.now())
  const [endTime, setEndTime] = useState(null)

  useEffect(() => {
    if (quizCompleted && endTime) {
      const timeTaken = Math.round((endTime - startTime) / 1000)
      onComplete && onComplete({ score, total: questions.length, timeTaken, selectedAnswers })
    }
  }, [quizCompleted, score, endTime, startTime, questions.length, selectedAnswers, onComplete])

  const handleAnswerSelect = (questionIndex, answerIndex, isMultiple = false) => {
    const question = questions[questionIndex]
    
    if (isMultiple) {
      // Multiple choice - allow multiple selections
      const currentSelections = selectedAnswers[questionIndex] || []
      const newSelections = currentSelections.includes(answerIndex)
        ? currentSelections.filter(i => i !== answerIndex)
        : [...currentSelections, answerIndex]
      
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: newSelections
      }))
    } else {
      // Single choice
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answerIndex
      }))
    }
  }

  const handleSubmitAnswer = (questionIndex) => {
    const question = questions[questionIndex]
    const userAnswer = selectedAnswers[questionIndex]
    let isCorrect = false

    if (question.type === 'multiple-choice') {
      isCorrect = question.correctAnswer === userAnswer
    } else if (question.type === 'multiple-select') {
      const correctAnswers = question.correctAnswers.sort()
      const userAnswers = (userAnswer || []).sort()
      isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswers)
    } else if (question.type === 'true-false') {
      isCorrect = question.correctAnswer === userAnswer
    } else if (question.type === 'code-output') {
      isCorrect = question.correctAnswer === userAnswer
    }

    setShowFeedback(prev => ({
      ...prev,
      [questionIndex]: {
        isCorrect,
        explanation: question.explanation,
        userAnswer,
        correctAnswer: question.correctAnswer || question.correctAnswers
      }
    }))

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setQuizCompleted(true)
      setEndTime(Date.now())
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowFeedback({})
    setQuizCompleted(false)
    setScore(0)
    setEndTime(null)
  }

  const renderQuestion = (question, questionIndex) => {
    const userAnswer = selectedAnswers[questionIndex]
    const feedback = showFeedback[questionIndex]
    const hasAnswered = userAnswer !== undefined && userAnswer !== null

    return (
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Question {questionIndex + 1} of {questions.length}
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {question.type.replace('-', ' ')}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-800 mb-4">{question.question}</p>
            
            {question.code && (
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{question.code}</pre>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = question.type === 'multiple-select' 
                ? (userAnswer || []).includes(optionIndex)
                : userAnswer === optionIndex
              
              const isCorrect = question.type === 'multiple-select'
                ? question.correctAnswers.includes(optionIndex)
                : question.correctAnswer === optionIndex

              return (
                <motion.button
                  key={optionIndex}
                  whileHover={{ scale: feedback ? 1 : 1.02 }}
                  whileTap={{ scale: feedback ? 1 : 0.98 }}
                  disabled={!!feedback}
                  onClick={() => handleAnswerSelect(questionIndex, optionIndex, question.type === 'multiple-select')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    feedback
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : isSelected && !isCorrect
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  } ${feedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      feedback
                        ? isCorrect
                          ? 'border-green-500 bg-green-500'
                          : isSelected && !isCorrect
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        : isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {(feedback && isCorrect) || (!feedback && isSelected) ? (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      ) : null}
                    </div>
                    <span className={`${
                      feedback && isCorrect ? 'text-green-800' :
                      feedback && isSelected && !isCorrect ? 'text-red-800' :
                      'text-gray-800'
                    }`}>
                      {option}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {hasAnswered && !feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <button
                onClick={() => handleSubmitAnswer(questionIndex)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Answer
              </button>
            </motion.div>
          )}

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg ${
                feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <span className="text-white text-sm">
                    {feedback.isCorrect ? '✓' : '✗'}
                  </span>
                </div>
                <span className={`font-semibold ${
                  feedback.isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className={`text-sm ${
                feedback.isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {feedback.explanation}
              </p>
              
              <div className="mt-4">
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {questionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  const renderResults = () => {
    const percentage = Math.round((score / questions.length) * 100)
    const timeTaken = endTime ? Math.round((endTime - startTime) / 1000) : 0
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="p-8 bg-white rounded-lg shadow-sm border">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 ${
            percentage >= 80 ? 'bg-green-500' :
            percentage >= 60 ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {percentage}%
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
          <p className="text-gray-600 mb-6">
            You scored {score} out of {questions.length} questions correctly
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}/{questions.length}</div>
              <div className="text-sm text-blue-800">Correct Answers</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{percentage}%</div>
              <div className="text-sm text-purple-800">Accuracy</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{timeTaken}s</div>
              <div className="text-sm text-orange-800">Time Taken</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${
              percentage >= 80 ? 'bg-green-50 text-green-800' :
              percentage >= 60 ? 'bg-yellow-50 text-yellow-800' :
              'bg-red-50 text-red-800'
            }`}>
              {percentage >= 80 ? '🎉 Excellent work! You have a strong understanding of this topic.' :
               percentage >= 60 ? '👍 Good job! Consider reviewing the concepts you missed.' :
               '📚 Keep studying! Review the material and try again.'}
            </div>
            
            {allowRetake && (
              <button
                onClick={resetQuiz}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  if (quizCompleted && showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
        {renderResults()}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {renderQuestion(questions[currentQuestion], currentQuestion)}
      </AnimatePresence>
    </div>
  )
}

export default Quiz