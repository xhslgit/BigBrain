import React from 'react';
// import { Link, useHistory } from 'react-router-dom';
import {
  Form,
  FormGroup,
  Schema,
  Panel,
  ControlLabel,
  FormControl
} from 'rsuite';

import 'rsuite/dist/styles/rsuite-default.css';

const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address')
    .isRequired('An email is required'),
  password: StringType()
    .isRequired('A password is required')
});

export default function LoginPage () {
  // const [loginForm, setLoginForm] = useState({email: "", password: ""})
  return (
    <Panel header={<h3>Login</h3>} shaded>
      <Form
        model = {model}
        fluid
        layout = "vertical"
      >
        <FormGroup controlId='email-input'>
          <ControlLabel>Email</ControlLabel>
          <FormControl id='email-input' name='email'/>
        </FormGroup>
      </Form>
    </Panel>
  )
}
