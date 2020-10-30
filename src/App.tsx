import React, {useState} from 'react';
import {Difficulty, fetchQuizQuestions, QuestionState} from "./API";
import QuestionCard from "./components/QuestionCard";
import { GlobalStyle, Wrapper } from "./App.styles";

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string,
  answer: string,
  correct: boolean,
  correctAnswer: string
}

const App =  () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUSerAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOVer] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOVer(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    )

    setQuestions(newQuestions);
    setScore(0);
    setUSerAnswers([]);
    setNumber(0);
    setLoading(false);

    console.log(newQuestions);

  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore(prevState => prevState + 1)
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUSerAnswers(prevState => [...prevState, answerObject])
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS){
      setGameOVer(true);
    }
    else {
      setNumber(nextQuestion);
    }
  }

  return (
    <>
    <GlobalStyle />
      <Wrapper>
        <h1>Trivia Quiz</h1>
        {
          gameOver || userAnswers.length === TOTAL_QUESTIONS ?
          <button className={"start"} onClick={startTrivia}>
            Start
          </button> : null
        }

        {
          !gameOver ? <p className="score">Score: {score}</p> : null
        }
        {
          loading ? <p>Loading questions...</p> : null
        }
        {
          !loading && !gameOver ?
            <QuestionCard
              questionNumber={number + 1}
              totalQuestions={TOTAL_QUESTIONS}
              question={questions[number].question}
              answers={questions[number].answers}
              userAnswer={userAnswers ? userAnswers[number] : undefined}
              callback={checkAnswer}
            />
        : null
        }
        {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS ?
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button> : null
        }
        <footer>
          Built with React, Typescript, Styled-Components
        </footer>
      </Wrapper>
    </>
  );
}

export default App;

