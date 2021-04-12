import React from 'react';
import {
  Button,
  Modal
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';
export default function NewGameModal ({ showModal, onHide, onCreate }) {
  return (
    <Modal backdrop={true} show={showModal} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Modal Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1> yooo haha</h1>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={onCreate}
          appearance="primary"
        >
          Ok
        </Button>
        <Button onClick={onHide} appearance="subtle">
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
