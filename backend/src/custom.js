/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  // let res = [];
  // for (const q of question) {
  //   if(q !== 'answers') {
  //     res.push(q);
  //   }
  // }
  const res = {question: question.question};
  return res;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  let correctAns = [];
  for (const answer of question.answers) {
    if (answer.is_correct) {
      correctAns.push(answer.id);
    }
  }
  return correctAns; // For a single answer
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  let ans = [];
  for (const answer of question.answers) {
    ans.push(answer.id);
  }
  return ans; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.time;
};
