import React, { useState } from 'react';
import {
  Button,
  Modal,
  Input,
  Alert
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
      return data.json();
    });
  }

  const handleSubmit = () => {
    if (gameName === '') {
      Alert.error('Invalid game name', 3000);
    } else {
      newGame(token, gameName).then((data) => {
        if (data.error) {
          Alert.error(data.error, 3000);
        } else {
          Alert.success('Game created', 3000);
          onHide();
          return onCreate();
        }
      })
    }
  }

  const handleHide = () => {
    return onHide();
  }

  return (
    <Modal backdrop={true} show={showModal} onHide={onHide} style={{ textAlign: 'center' }}>
      <Modal.Header>
        <h2>Create a new quiz</h2>
      </Modal.Header>
      <Modal.Body>
        <Input id='newgamename-input' placeholder='Enter quiz name' onChange={e => setGameName(e)} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} appearance="primary" id='creategame-button'>Create game</Button>
        <Button onClick={handleHide} appearance="subtle">Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

NewGameModal.propTypes = {
  showModal: PropTypes.bool,
  onHide: PropTypes.func,
  onCreate: PropTypes.func,
}
