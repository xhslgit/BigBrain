import React, { useState } from 'react';
import {
  Button,
  Modal,
  Input
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';
import useToken from '../utils/useToken';
export default function NewGameModal ({ showModal, onHide, onCreate }) {
  const [gameName, setGameName] = useState('');
  const token = useToken().token;
  const newGame = (token, name) => {
    return fetch(new URL('admin/quiz/new', 'http://localhost:5005/'), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        name: name
      }),
    }).then((data) => {
      if (data.status === 200) {
        return data.json();
      } else {
        // error handling later
        return data.json();
      }
    });
  }

  const handleSubmit = () => {
    console.log(gameName);
    if (gameName === '') {
      console.log('invalid name');
      onHide();
    } else {
      newGame(token, gameName);
      onHide();
      return onCreate();
    }
  }

  const handleHide = () => {
    return onHide();
  }

  return (
    <Modal backdrop={true} show={showModal} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Create a new quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input placeholder='New quiz name' onChange={e => setGameName(e)} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleSubmit}
          appearance="primary"
        >
          Ok
        </Button>
        <Button onClick={handleHide} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

NewGameModal.propTypes = {
  showModal: PropTypes.bool,
  onHide: PropTypes.func,
  onCreate: PropTypes.func,
}
