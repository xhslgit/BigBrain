import { useState } from 'react';
// useToken function altered from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
export default function useToken () {
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (token) => {
    sessionStorage.setItem('token', token);
    setToken(token);
  };

  return {
    setToken: saveToken,
    token
  }
}
