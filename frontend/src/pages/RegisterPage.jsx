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

const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address')
    .isRequired('An email is required'),
  password: StringType()
    .isRequired('A password is required'),
  name: StringType()
    .isRequired('A name is required')
});

function register (email, password, name) {
  return fetch(new URL('admin/auth/register', 'http://localhost:5005/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  }).then((data) => {
    if (data.status === 200) {
      return data.json();
    }
    return data.json();
  });
}

export default function RegisterPage () {
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' })
  const history = useHistory();
  const handleSubmit = () => {
    register(registerForm.email, registerForm.password, registerForm.name).then((data) => {
      history.push('/login');
    })
  }
  return (
    <Panel header={<h3>Register</h3>} shaded>
      <Form
        model = {model}
        fluid
        layout = 'vertical'
        onSubmit = {handleSubmit}
        formValue = {registerForm}
        onChange = {newValue => setRegisterForm(newValue)}
      >
        <FormGroup controlId='name-input'>
          <ControlLabel>Name</ControlLabel>
          <FormControl id='name-input' name='name'/>
        </FormGroup>
        <FormGroup controlId='email-input'>
          <ControlLabel>Email</ControlLabel>
          <FormControl id='email-input' name='email'/>
        </FormGroup>
        <FormGroup controlId='password-input'>
          <ControlLabel>Password</ControlLabel>
          <FormControl id='password-input' name='password' type='password'/>
        </FormGroup>
        <FormGroup>
            <Button appearance="primary" type="submit">Register</Button>
            <Link to="/login">Login here!</Link>
        </FormGroup>
      </Form>
    </Panel>
  )
}
