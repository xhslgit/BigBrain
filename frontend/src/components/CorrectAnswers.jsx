import React from 'react';
import PropTypes from 'prop-types';
export default function CorrectAnswers ({ displayCorrectAnswers }) {
  return (
    <div>
      <h2>
      {displayCorrectAnswers.length > 1 ? 'The correct answers were:' : 'The correct answer was:'}
      </h2>
      {displayCorrectAnswers.map((item) => (<h2 style={{ display: 'inline' }}key={item.id}>{item.answer}<br></br></h2>))}
      <br></br>
      <br></br>
      <h4>Waiting for admin to continue to next question</h4>
    </div>
  )
}

CorrectAnswers.propTypes = {
  displayCorrectAnswers: PropTypes.array,
}
