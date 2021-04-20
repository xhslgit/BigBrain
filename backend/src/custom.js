/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  let media = 'none';
  if (question.mediainput === 'videoinput') {
    media = question.video;
  } else if (question.mediainput === 'imageinput') {
    media = question.image;
  }
  let pub_ans = [];
  for (const a of question.answers) {
    const temp = {
      id: a.id,
      answer: a.answer
    }
    pub_ans.push(temp);
  }
  const res = {
    id: question.id,
    question: question.question,
    media: media,
    points: question.points,
    time: question.time,
    type: question.type,
    answers: pub_ans
  };
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
  return correctAns;
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
  return Number(question.time);
};
