context('Happy path', () => {
  // Registers successfully
  // Creates a new game successfully
  // (Not required) Updates the thumbnail and name of the game successfully (yes, it will have no questions)
  // Starts a game successfully
  // Ends a game successfully (yes, no one will have played it)
  // Loads the results page successfully
  // Logs out of the application successfully
  // Logs back into the application successfully
  beforeEach(() => {
    cy.visit('localhost:3000');
    cy.viewport(1890, 1000);
    // doesn't work, need to reset db before each test
    // cy.exec('cd ../../../backend && yarn reset && yarn start'); 
  });

  it('Happy path Success', () => {
    const name = 'Tony Tony';
    const email = 'Tony@example.com';
    const password = 'Tonypassword';
    
    // on join page go to login
    cy.get('button[type="button"]').click();

    // on login page go to register
    cy.get('a[href="/register"]').click();
    
    // Registers account
    cy.get('#name-input').focus().type(name);
    cy.get('#email-input').focus().type(email);
    cy.get('#password-input').focus().type(password);
    cy.get('button[type="submit"]').click();

    // Logs into dashboard
    cy.wait(300);
    cy.get('#email-input').focus().type(email);
    cy.get('#password-input').focus().type(password);
    cy.get('button[type="submit"]').click();

    // dashboard click new game
    cy.get('#newgame-button').click();
    cy.get('#newgamename-input').focus().type('test game');
    cy.get('#creategame-button').click();

    // start the game and end the game
    cy.get('#startgame-button0').click();
    cy.get('#backtodash-button').click();
    cy.get('#stopgame-button0').click();

    // go to results page
    cy.get('#toresults-button').click();

    // back to dashboard
    cy.get('button').click();

    // logout
    cy.get('#logout-button').click();
    
    // login
    cy.get('#email-input').focus().type(email);
    cy.get('#password-input').focus().type(password);
    cy.get('button[type="submit"]').click();
  })
});