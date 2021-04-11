import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Form,
  FormGroup,
  Schema,
  Panel,
  ControlLabel,
  FormControl,
  Button
} from 'rsuite';

import 'rsuite/dist/styles/rsuite-default.css';
import useToken from '../utils/useToken';
const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address')
    .isRequired('An email is required'),
  password: StringType()
    .isRequired('A password is required')
});

function login (email, password) {
  return fetch(new URL('admin/auth/login', 'http://localhost:5005/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((data) => {
    if (data.status === 200) {
      return data.json();
    }
  });
}

export default function LoginPage () {
  const history = useHistory();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const temp = useToken();
  const setToken = temp.setToken;
  const handleSubmit = () => {
    login(loginForm.email, loginForm.password).then((data) => {
      console.log('logging in');
      console.log(data.token)
      setToken(data.token);
      history.push('/dashboard');
    })
  }
  return (
    <Panel header={<h3>Login</h3>} shaded>
      <Form
        model = {model}
        fluid
        layout = 'vertical'
        onSubmit = {handleSubmit}
        formValue = {loginForm}
        onChange = {newValue => setLoginForm(newValue)}
      >
        <FormGroup controlId='email-input'>
          <ControlLabel>Email</ControlLabel>
          <FormControl id='email-input' name='email'/>
        </FormGroup>
        <FormGroup controlId='password-input'>
          <ControlLabel>Password</ControlLabel>
          <FormControl id='password-input' name='password' type='password'/>
        </FormGroup>
        <FormGroup>
            <Button appearance="primary" type="submit">Login</Button>
            <Link to="/register">Register here!</Link>
        </FormGroup>
      </Form>
    </Panel>
  )
}
