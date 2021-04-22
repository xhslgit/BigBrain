import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  Divider,
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';

export default function StartGameModal ({ showModal, onHide, onAdvance, onCopyCode, onCopyLink, quizInfo }) {
  return (
    <Modal backdrop="static" show={showModal} onHide={onHide} size="xs">
      <Modal.Header style={{ textAlign: 'center' }}>
        <h2>Game Started</h2>
      </Modal.Header>
      <Modal.Body style={{ textAlign: 'center' }}>
        Your game has started, your Session ID is<span onClick={onCopyCode}><h2>{quizInfo.active}</h2></span>
        <Divider>Game controls</Divider>
        <Button appearance='primary' color='green' onClick={onAdvance}>Advance to next question</Button>
        <Divider>to Join</Divider>
        <p>Click the code above to copy or <Link to={{ pathname: '/join/' + quizInfo.active }}>this</Link> to join the game</p>
        <Divider>Or</Divider>
        <p>Click the button below to copy the link</p>
      </Modal.Body>
      <Modal.Footer style={{ textAlign: 'center' }}>
        <Button onClick={onCopyLink} appearance="primary">Copy link to clipboard</Button>
        <Button onClick={onHide} appearance="ghost">Back to dashboard</Button>
      </Modal.Footer>
    </Modal>
  )
}

StartGameModal.propTypes = {
  showModal: PropTypes.bool,
  onHide: PropTypes.func,
  onAdvance: PropTypes.func,
  onCopyCode: PropTypes.func,
  onCopyLink: PropTypes.func,
  quizInfo: PropTypes.array,
}