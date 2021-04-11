import React, {} from 'react';
import { useHistory } from 'react-router-dom';
import {
  Panel,
  Button
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import useToken from '../utils/useToken';

function logout (token) {
  return fetch(new URL('admin/auth/logout', 'http://localhost:5005/'), {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).then((data) => {
    if (data.status === 200) {
      return data.json();
    } else {
      // error handling later
      return data.json();
    }
  });
}

export default function DashboardPage () {
  const history = useHistory();

  const { token, setToken } = useToken();

  const handleLogout = () => {
    logout(token).then(data => {
      console.log('logging out');
      setToken('');
      history.push('/login');
    });
  }
  return (
    <Panel header={<h3>Welcome to your Dashboard</h3>} shaded>
        <Button appearance="primary" color="red" onClick={handleLogout}>Logout</Button>
    </Panel>
  )
}
