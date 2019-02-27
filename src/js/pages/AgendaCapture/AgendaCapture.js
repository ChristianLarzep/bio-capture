import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import logo from '../../../assets/intersys_Logo.png';
import FormDemo from '../../components/formDemo';

import './style.css';

const data = require('../../configurations/agendaCapture/agendaCaptureFields.json');

const reducers = {
  form: formReducer,
};
const reducer = combineReducers(reducers);
const store = createStore(reducer);

class AgendaCapture extends Component {
  submit = value => {
    const { history } = this.props;
    console.log('Agenda Capture Data: ', value);
    history.push('/');
  }

  render() {
    return (
      <div>
        <Provider store={store}>
          <FormDemo onSubmit={this.submit} data={data} title="Agenda Capture" logo={logo} />
        </Provider>
      </div>
    );
  }
}

export default AgendaCapture;
