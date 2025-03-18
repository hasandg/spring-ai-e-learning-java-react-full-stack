import { mount } from 'cypress/react18';
import { Provider } from 'react-redux';
import { store } from '../../src/store';

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', (component) => {
  return mount(
    <Provider store={store}>
      {component}
    </Provider>
  );
}); 