import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Form,
  FormGroup,
  Schema,
  ControlLabel,
  FormControl,
  Divider,
  Alert
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import useToken from '../utils/useToken';
import { MainPageContainer, RegPanel } from '../style';
import LoginButton from '../components/LoginButton';
const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address')
    .isRequired('An email is required'),
  password: StringType()
    .isRequired('A password is required')
});

export default function LoginPage () {
  const history = useHistory();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const setToken = useToken().setToken;

  const handleSubmit = () => {
    const check = model.check(loginForm);
    if (check.email.hasError) {
      Alert.error(check.email.errorMessage, 3000);
      return;
    }
    if (check.password.hasError) {
      Alert.error(check.password.errorMessage, 3000);
      return;
    }
    login(loginForm.email, loginForm.password).then((data) => {
      if (data.error) {
        Alert.error(data.error, 3000);
      } else {
        setToken(data.token);
        history.push('/dashboard');
      }
    })
  }
  const login = (email, password) => {
    return fetch(new URL('admin/auth/login', 'http://localhost:5005/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then((data) => {
      return data.json();
    });
  }
  return (
    <MainPageContainer>
      <RegPanel header={<h2>Login</h2>} shaded>
        <Form
          model = {model}
          fluid
          layout = 'vertical'
          onSubmit = {handleSubmit}
          formValue = {loginForm}
          onChange = {newValue => setLoginForm(newValue)}
        >
          <FormGroup controlId='email-input'>
            <ControlLabel><h4>Email</h4></ControlLabel>
            <FormControl id='email-input' name='email'/>
          </FormGroup>
          <FormGroup controlId='password-input'>
            <ControlLabel><h4>Password</h4></ControlLabel>
            <FormControl id='password-input' name='password' type='password'/>
          </FormGroup>
          <FormGroup>
              <LoginButton
                style={{ margin: '10px' }} appearance="primary" type='submit' text="Login"
              />
              <Link style={{ margin: '10px' }} to="/register">Register here!</Link>
              <Divider>or</Divider>
              <Link to="/">Join a game!</Link>
          </FormGroup>
        </Form>
      </RegPanel>
    </MainPageContainer>
  )
}
