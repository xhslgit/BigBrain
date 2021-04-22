import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'rsuite';

export default function PlayerGameEnded ({ finalResults, onJoin }) {
  return (
    <div>
      <h2>Your game has ended, here are your results!</h2>
      {finalResults.map((item, idx) => (
        <div key={item.question}>
          <h2>Question {idx + 1}</h2>
          <h3>{item.result ? <u>Correct!</u> : <u>Incorrect!</u>}</h3>
          <h4>This question took you <u>{item.timeTaken}</u> seconds to answer</h4>
        </div>
      ))}
      <br></br>
      <Button appearance='ghost' color='green' onClick={onJoin}>Join another game!</Button>
    </div>
  )
}

PlayerGameEnded.propTypes = {
  finalResults: PropTypes.array,
  onJoin: PropTypes.func,
}
