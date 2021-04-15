import React from 'react';
import { List } from 'rsuite';
import PropTypes from 'prop-types';

export default function QuestionsList ({ questions }) {
  return (
    <List bordered hover>
        {questions.map((item, idx) => {
          return (<List.item key={item} index={idx}>
            {item}
          </List.item>)
        })}
    </List>
  );
}

QuestionsList.propTypes = {
  questions: PropTypes.array,
}
