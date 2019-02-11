import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import logo from './assets/intersys_Logo.png';
import FormDemo from './js/pages/formDemo';

import './App.css';

const data = require('./js/configurations/formVoice/formVoiceFields.json');

const reducers = {
  form: formReducer,
};
const reducer = combineReducers(reducers);
const store = createStore(reducer);

class App extends Component {
  submit = value => {
    console.log(value);
  }

  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <FormDemo onSubmit={this.submit} fields={data} title="Bio capture" logo={logo} />
        </Provider>
      </div>
    );
  }
}

export default App;
