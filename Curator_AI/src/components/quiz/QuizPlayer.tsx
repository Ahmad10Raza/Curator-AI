"use client"

import { useState } from "react"
import { Quiz, QuizQuestion } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface QuizPlayerProps {
    quiz: Quiz & { questions: QuizQuestion[] }
    onComplete?: (score: number) => void
}

export function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
    const [currentIdx, setCurrentIdx] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const currentQuestion = quiz.questions[currentIdx]
    const progress = ((currentIdx + 1) / quiz.questions.length) * 100

    const handleAnswer = (optionIdx: number) => {
        if (isAnswered) return
        setSelectedOption(optionIdx)
        setIsAnswered(true)

        const isCorrect = optionIdx === currentQuestion.correctIdx
        if (isCorrect) setScore(score + 1)

        setAnswers({ ...answers, [currentQuestion.id]: optionIdx })
    }

    const handleNext = async () => {
        if (currentIdx < quiz.questions.length - 1) {
            setCurrentIdx(currentIdx + 1)
            setSelectedOption(null)
            setIsAnswered(false)
        } else {
            await finishQuiz()
        }
    }

    const finishQuiz = async () => {
        setSubmitting(true)
        try {
            const finalScore = Math.round((score / quiz.questions.length) * 100)

            await fetch(`/api/quizzes/${quiz.id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
            })

            setShowResults(true)
            if (onComplete) onComplete(finalScore)
        } catch (error) {
            toast.error("Failed to submit results")
        } finally {
            setSubmitting(false)
        }
    }

    if (showResults) {
        const finalScore = Math.round((score / quiz.questions.length) * 100)
        return (
            <Card className="w-full max-w-2xl mx-auto text-center p-8">
                <CardHeader>
                    <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-6xl font-bold text-primary">{finalScore}%</div>
                    <p className="text-muted-foreground">
                        You got {score} out of {quiz.questions.length} questions correct.
                    </p>
                    <Progress value={finalScore} className="h-3" />
                </CardContent>
                <CardFooter className="justify-center">
                    <Button onClick={() => window.location.reload()}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Take Another Quiz
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                        Question {currentIdx + 1} of {quiz.questions.length}
                    </span>
                    <span className="text-sm font-medium">Score: {score}</span>
                </div>
                <Progress value={progress} className="h-2" />
                <CardTitle className="mt-4 text-xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                    let variant = "outline"
                    let className = "justify-start text-left h-auto py-4 px-6"

                    if (isAnswered) {
                        if (idx === currentQuestion.correctIdx) {
                            variant = "default"
                            className += " bg-green-600 hover:bg-green-700 border-green-600"
                        } else if (idx === selectedOption) {
                            variant = "destructive"
                        } else {
                            className += " opacity-50"
                        }
                    } else if (idx === selectedOption) {
                        variant = "default"
                    }

                    return (
                        <Button
                            key={idx}
                            variant={variant as any}
                            className={cn("w-full", className)}
                            onClick={() => handleAnswer(idx)}
                            disabled={isAnswered}
                        >
                            <span className="mr-4 font-bold opacity-50">{String.fromCharCode(65 + idx)}.</span>
                            {option}
                            {isAnswered && idx === currentQuestion.correctIdx && (
                                <CheckCircle className="ml-auto h-5 w-5" />
                            )}
                            {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIdx && (
                                <XCircle className="ml-auto h-5 w-5" />
                            )}
                        </Button>
                    )
                })}

                {isAnswered && currentQuestion.explanation && (
                    <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
                        <span className="font-semibold">Explanation: </span>
                        {currentQuestion.explanation}
                    </div>
                )}
            </CardContent>
            <CardFooter className="justify-end">
                <Button onClick={handleNext} disabled={!isAnswered || submitting}>
                    {currentIdx < quiz.questions.length - 1 ? (
                        <>
                            Next Question
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                    ) : (
                        "Finish Quiz"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
