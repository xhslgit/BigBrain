import React from 'react';
import { Button } from 'rsuite';
import PropTypes from 'prop-types';

export default function LoginButton ({ text, appearance, type }) {
  return (
    <Button appearance={appearance} type={type}>
      {text}
    </Button>
  )
}

LoginButton.propTypes = {
  text: PropTypes.string,
  appearance: PropTypes.string,
  type: PropTypes.string,
}
