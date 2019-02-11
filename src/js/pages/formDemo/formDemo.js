import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Form, change, reset } from 'redux-form';

import { Page, Helmet, Title, TextField, Button } from '../../components';
import validator from '../../configurations/validator';

import Header from './components';

import './style.css';

@reduxForm({ form: 'voiceForm', validate: validator })
class FormDemo extends Component {
  static propTypes = {

    dispatch: PropTypes.func,
    fields: PropTypes.shape({}),
    handleSubmit: PropTypes.func,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    submitting: PropTypes.bool,
    title: PropTypes.string,
  };

    state = {
      recognizing: false,
      recognition: {},
      counterQuest: 1,
      questions: [],
      fields: [],
      langs: 'Australia',
      fieldsData: this.props.fields,
      confirmQuestions: [],
      confirming: false,
      confirmResponse: '',
      countAppend: 1,
      askInputQuest: false,
      currentQuest: '',
    }

    componentDidMount() {
      this.getInputs();
      if (!('webkitSpeechRecognition' in window)) {
      // TODO
      // upgrade();
      } else {
        const SpeechRecognition = window.webkitSpeechRecognition;
        const speechSyn = window.speechSynthesis;
        const { confirmQuestions, questions, counterQuest } = this.state;

        this.state.recognition = new SpeechRecognition();
        const utterance = new SpeechSynthesisUtterance();

        const { recognition } = this.state;

        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
          const { confirming, questions } = this.state;
          utterance.lang = 'en-US';
          utterance.rate = 1.2;

          if (confirming) {
            utterance.text = confirmQuestions[this.getCounterQuest() - 1];
            confirmQuestions[this.getCounterQuest() - 1] = undefined;
          } else {
            utterance.text = questions[this.getCounterQuest()];

            this.setState(prevState => {
              return {
                counterQuest: prevState.counterQuest + 1,
                confirmResponse: '',
              };
            });
          }
          speechSyn.speak(utterance);
        };

        recognition.onresult = event => {
          let transcription = '';
          const { fields, confirming } = this.state;
          const { dispatch } = this.props;
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            transcription += event.results[i][0].transcript;
          }

          if (confirming) {
            this.setState({ confirmResponse: transcription });
          } else {
            dispatch(change('voiceForm', fields[this.getCounterQuest() - 1], this.capitalize(transcription)));
          }
        };

        recognition.onend = () => {
          this.addAnother();
          const { counterQuest, questions } = this.state;
          if (this.isThereConfirmQuest() || counterQuest < questions.length) {
            setTimeout(() => { recognition.start(); }, 2000);
            this.setState({ recognizing: false });
          }
        };
      }
    }

  addAnother = () => {
    const words = ['yes', 'jazz', 'just'];
    const { confirming, confirmResponse } = this.state;
    if (words.includes(confirmResponse) && confirming) {
      this.appendField();
    }
  }

  isThereConfirmQuest = () => {
    const { confirmQuestions } = this.state;
    if (typeof confirmQuestions[this.getCounterQuest() - 1] === 'undefined') {
      this.setState({ confirming: false });
      return false;
    }

    this.setState({ confirming: true });
    return true;
  }

  appendField = () => {
    const { fieldsData: { textFields }, counterQuest, fields, questions, confirmQuestions, countAppend } = this.state;
    const { id, name, type, question, errorText, className, confirmQuestion } = textFields[counterQuest - 1];
    const newTextfield = {
      id: id.concat(countAppend),
      name: name.concat(countAppend),
      type,
      question,
      errorText,
      className,
      confirmQuestion,
    };
    textFields.splice(counterQuest, 0, newTextfield);
    fields.splice(counterQuest, 0, newTextfield.name);
    questions.splice(counterQuest, 0, question);
    confirmQuestions.splice(counterQuest, 0, confirmQuestion);
    this.setState(prevState => {
      return {
        countAppend: prevState.countAppend + 1,
      };
    });
  }

  getCounterQuest = () => {
    const { counterQuest } = this.state;
    return counterQuest;
  }

  getInputs = () => {
    const { questions, fields, confirmQuestions, fieldsData: { textFields }, counterQuest } = this.state;

    for (let i = 0; i < textFields.length; i += 1) {
      fields[i] = textFields[i].name;
      questions[i] = textFields[i].question;
      confirmQuestions[i] = textFields[i].confirmQuestion;
    }

    this.setState({ currentQuest: questions[counterQuest - 1] });
  }

  capitalize = s => {
    const firstChar = /\S/;
    return s.replace(firstChar, m => m.toUpperCase());
  }

  mySubmit = data => {
    const { dispatch } = this.props;
    dispatch(reset('voiceForm'));
    console.log(data);
  };

   onStart = () => {
     const { recognizing, langs, recognition } = this.state;
     if (recognizing) {
       recognition.stop();
       return;
     }

     this.setState({
       recognizing: true,
       counterQuest: 0,
     });

     recognition.lang = langs;
     recognition.start();
   }

  selectAccent = e => {
    this.setState({ langs: e.target.value });
  }

  render() {
    const { handleSubmit, submitting, loading, invalid, title, logo } = this.props;
    const { fieldsData: { textFields } } = this.state;

    return (
      <Page background="white">

        <Helmet><title>BIOS</title></Helmet>
        <Header onStart={this.onStart} selectAccent={this.selectAccent} logo={logo} />

        <Title color="purple" tag="h3" className="title">{title}</Title>

        <Form name="voiceForm" onSubmit={handleSubmit(this.mySubmit)} className="form">
          <div className="row">

            {textFields.map(textfield => (
              <TextField
                key={textfield.id}
                id={textfield.id}
                name={textfield.name}
                type={textfield.type}
                label={textfield.label}
                errorText={textfield.errorText}
                className={textfield.className}
                multiLine={!!textfield.multiLine}
              />
            ))}

            <div className="button-space">
              <Button id="btn-submit" color="success" type="submit" disabled={invalid || submitting} spinner={loading}>
                   Send
              </Button>
            </div>
          </div>
        </Form>
      </Page>
    );
  }
}

export default FormDemo;
