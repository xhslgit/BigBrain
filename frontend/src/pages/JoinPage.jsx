import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Schema,
  Panel,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  Alert,
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
const { StringType } = Schema.Types;

const model = Schema.Model({
  code: StringType()
    .isRequired('Please enter a session code'),
  name: StringType()
    .isRequired('Please enter a player name')
    .minLength(1, 'Please enter atleast 1 character for your name')
});

export default function JoinPage () {
  const SessionId = useParams().SessionId;
  const [joinForm, setJoinForm] = useState({ code: '', name: '' });
  const history = useHistory();
  const joinSession = (code, name) => {
    return fetch(new URL(`play/join/${code}`, 'http://localhost:5005/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name }),
    }).then((data) => {
      return data.json();
    }).catch((error) => {
      Alert.error(error, 3000);
    })
  }
  const handleJoinGame = () => {
    joinSession(joinForm.code, joinForm.name).then((data) => {
      if (data.error) {
        Alert.error(data.error, 4000);
      } else {
        history.push(`/game/${joinForm.code}/${data.playerId}`);
      }
    })
  }

  return (
    <Panel header={<h2>Join a game</h2>} shaded>
      <Form
        model = {model}
        fluid
        layout = 'vertical'
        onSubmit = {handleJoinGame}
        formValue = {joinForm}
        onChange = {newValue => setJoinForm(newValue)}
      >
        <FormGroup controlId='code-input'>
          <ControlLabel>Session code</ControlLabel>
          <FormControl id='code-input' name='code' value={SessionId}/>
        </FormGroup>
        <FormGroup controlId='name-input'>
          <ControlLabel>Player Name</ControlLabel>
          <FormControl id='name-input' name='name' />
        </FormGroup>
        <FormGroup>
            <Button appearance="primary" type="submit">Join the Game!</Button>
            <Button appearance="ghost" onClick={() => history.push('/login')}>Create a game here!</Button>
        </FormGroup>
      </Form>
    </Panel>
  )
}
