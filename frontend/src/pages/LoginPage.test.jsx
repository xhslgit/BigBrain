import * as React from 'react';
import LoginPage from './LoginPage';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
describe('LoginPage', () => {
  it('Check if login page exists', () => {
    const history = createMemoryHistory();
    render(<Router history={history}>
        <LoginPage />
    </Router>
    );
    const element = screen.getAllByText("Login");
    expect(element).toHaveLength(2);
    expect(element[0]).toBeInTheDocument();
    expect(element[1]).toBeInTheDocument();
  })
});
