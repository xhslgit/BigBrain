import * as React from 'react';
import JoinPage from './JoinPage';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
describe('JoinPage', () => {
  it('check if join page exists', () => {
    const history = createMemoryHistory();
    render(<Router history={history}>
      <JoinPage />
    </Router>
    );
    const code = screen.getByText("Session Code:");
    expect(code).toBeInTheDocument();
    const name = screen.getByText("Choose your name:");
    expect(name).toBeInTheDocument();
    const create = screen.getByText("Create a game here!");
    expect(create).toBeInTheDocument();
  })
});
