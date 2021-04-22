import * as React from 'react';
import RegisterPage from './RegisterPage';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
describe('RegisterPage', () => {
  it('check if register page exists', () => {
    const history = createMemoryHistory();
    render(<Router history={history}>
      <RegisterPage />
    </Router>
    );
    const register = screen.getByText('Register for an account');
    expect(register).toBeInTheDocument();
    const join = screen.getByText('Join a game!');
    expect(join).toBeInTheDocument();
  })
});
