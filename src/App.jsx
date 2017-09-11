import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import promise from 'redux-promise';
import reduxThunk from 'redux-thunk';

import InvoicesIndex from './components/invoices-index';
import InvoicesNew from './components/invoices-new';
import reducers from './reducers';

const createStoreWithMiddleWare = applyMiddleware(promise, reduxThunk)(createStore);

class App extends React.Component {
  render () {
    return (
      <Provider store={createStoreWithMiddleWare(reducers)}>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={InvoicesIndex}/>
            <Route exact path="/invoices/new" component={InvoicesNew}/>
          </div>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App;
