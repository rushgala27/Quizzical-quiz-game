import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Question from "./components/Question";

export default function App() {
  const [start, setStart] = useState(false);
  const [play, setPlay] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [answers, setAnswers] = useState({
    clicked: false,
    right: [false, false, false, false, false],
    count: 0,
  });

  function startGame() {
    setStart((prevStart) => !prevStart);
  }

  useEffect(() => {
    async function getQuestions() {
      const res = await fetch(
        "https://opentdb.com/api.php?amount=5&type=multiple"
      );
      const data = await res.json();
      setAllQuestions(() => {
        const newArray = data.results.map((ques) => {
          const randomNumber = Math.floor(Math.random() * 4);
          ques.incorrect_answers.splice(randomNumber, 0, ques.correct_answer);
          const optArray = ques.incorrect_answers.map((option) => {
            return {
              id: nanoid(),
              isSelected: 0,
              opt: option,
            };
          });
          return { ...ques, id: nanoid(), incorrect_answers: optArray };
        });
        return newArray;
      });

      setAnswers({
        clicked: false,
        right: [false, false, false, false, false],
        count: 0,
      });
    }
    getQuestions();
  }, [play]);

  const displayQuestions = allQuestions.map((question) => (
    <Question
      key={question.id}
      quesid={question.id}
      ques={question.question}
      options={question.incorrect_answers}
      correct={question.correct_answer}
      isCorrect={answers.right[allQuestions.indexOf(question)]}
      selectOption={selectOption}
      isClicked={answers.clicked}
    />
  ));

  function selectOption(quesid, optid) {
    setAllQuestions((oldQuestionsArray) =>
      oldQuestionsArray.map((oldQuestions) => {
        if (oldQuestions.id === quesid) {
          const a = oldQuestions.incorrect_answers.map((oldOptions) => {
            if (oldOptions.id === optid) {
              return {
                ...oldOptions,
                isSelected: 1,
              };
            }
            return {
              ...oldOptions,
              isSelected: 0,
            };
          });

          return {
            ...oldQuestions,
            incorrect_answers: a,
          };
        }
        return oldQuestions;
      })
    );
  }

  function checkAnswers() {
    let count = answers.count;
    const index = answers.right;
    for (let i = 0; i < 5; i++) {
      const quest = allQuestions[i];
      for (let j = 0; j < 4; j++) {
        const opts = quest.incorrect_answers[j];
        if (opts.isSelected === 1 && opts.opt === quest.correct_answer) {
          index[i] = true;
          count = count + 1;
        }
      }
    }
    setAnswers({ clicked: true, right: index, count: count });
    console.log(index);
  }

  function playAgain() {
    setPlay((oldPlay) => !oldPlay);
  }

  return (
    <>
      {start ? (
        <main className="main questions-page-background">
          {displayQuestions}
          {!answers.clicked ? (
            <button className="check-answers" onClick={checkAnswers}>
              Check Answers
            </button>
          ) : (
            <div className="after-click-bottom-part">
              <p className="show-correct-count">
                {"You scored " + answers.count + "/5 correct answers"}
              </p>
              <button className="check-answers play-again" onClick={playAgain}>
                Play Again
              </button>
              <button className="check-answers play-again" onClick={startGame}>
                End
              </button>
            </div>
          )}
        </main>
      ) : (
        <main className="main">
          <div>
            <h1 className="title">Quizzical</h1>
            <p className="instructions">Some description if needed</p>
            <button className="start-game" onClick={startGame}>
              Start quiz
            </button>
          </div>
        </main>
      )}
    </>
  );
}
