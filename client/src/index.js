import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { Provider } from 'react-redux';
import 'fontsource-roboto';

import configureStore from './store/configureStore';

const link = createHttpLink({ uri: '/graphql' });
const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link,
});

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
