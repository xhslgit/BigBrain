import React from 'react';
import {
  Button,
  Modal
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';
import { ModalStyle } from '../style';
export default function GameEndedModal ({ showModal, onHide, onResults }) {
  return (
    <ModalStyle backdrop="static" show={showModal} onHide={onHide} size="xs" >
      <Modal.Body >
      <Modal.Header>
        <h1>Game Ended</h1>
        <br></br>
      </Modal.Header>
        <h3>You have ended your session</h3>
        <br></br>
        <b>If you would like to view results, click below</b>
      </Modal.Body>
      <Modal.Footer style={{ textAlign: 'center' }}>
        <Button onClick={onResults} appearance='primary' id='toresults-button'>See results</Button>
        <Button onClick={onHide} appearance='ghost' color='green' id='todash-button'>Back to dashboard</Button>
      </Modal.Footer>
    </ModalStyle>
  )
}

GameEndedModal.propTypes = {
  showModal: PropTypes.bool,
  onHide: PropTypes.func,
  onResults: PropTypes.func,
}
