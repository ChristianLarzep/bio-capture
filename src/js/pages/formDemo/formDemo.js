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

    data: PropTypes.shape({}),
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    submitting: PropTypes.bool,
    title: PropTypes.string,
  };

    state = {
      askInputQuest: false,
      confirmQuestions: [],
      confirming: false,
      confirmResponse: '',
      counterQuest: 1,
      countAppend: 1,
      countIterable: 1,
      currentQuest: '',
      questions: [],
      fields: [],
      fieldsData: this.props.data,
      langs: 'United States',
      recognizing: false,
      recognition: {},
      repeating: false,
    }

    componentDidMount() {
      this.getInputs();
      if (!('webkitSpeechRecognition' in window)) {
      // TODO
      // upgrade();
      } else {
        const SpeechRecognition = window.webkitSpeechRecognition;
        const speechSyn = window.speechSynthesis;

        this.state.recognition = new SpeechRecognition();
        const utterance = new SpeechSynthesisUtterance();

        const { recognition } = this.state;

        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
          const { currentQuest } = this.state;
          utterance.lang = 'en-US';
          utterance.rate = 1.2;
          utterance.text = currentQuest;
          speechSyn.speak(utterance);
        };

        recognition.onresult = event => {
          let transcription = '';
          const { fields, confirming, repeating } = this.state;
          const { dispatch } = this.props;
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            transcription += event.results[i][0].transcript;
          }

          if (confirming || repeating) {
            this.setState({ confirmResponse: transcription });
          } else {
            dispatch(change('voiceForm', fields[this.getCounterQuest() - 1], this.capitalize(transcription)));
          }
        };

        recognition.onend = () => {
          this.dinamycAnswer();
          if (this.restart()) {
            setTimeout(() => { recognition.start(); }, 1100);
            this.setState({ recognizing: false });
          }
        };
      }
    }

  dinamycAnswer = () => {
    const words = ['yes', 'jazz', 'just'];
    const { confirming, confirmResponse, repeating } = this.state;
    const affirmation = words.includes(confirmResponse);
    if (affirmation && confirming) {
      this.appendField();
    } else if (affirmation === false && confirming) {
      this.setState({ countAppend: 1 });
    } else if (affirmation && repeating) {
      this.setState(prevState => {
        return {
          counterQuest: prevState.counterQuest - 1,
          countIterable: prevState.countIterable - 1,
          askInputQuest: true,
        };
      });
    }
  }

  restart = () => {
    const { repeating, counterQuest } = this.state;
    if (repeating === false) {
      this.setState({
        currentQuest: 'Would you like to repeat this question?',
        repeating: true,
      });
      return true;
    }

    if (this.isThereConfirmQuest()) {
      const { confirmQuestions } = this.state;
      this.setState({ currentQuest: confirmQuestions[counterQuest - 1] });
      confirmQuestions[this.getCounterQuest() - 1] = undefined;
      return true;
    }

    const { askInputQuest, questions } = this.state;
    if (askInputQuest && counterQuest < questions.length) {
      this.setState(prevState => {
        return {
          currentQuest: questions[counterQuest],
          counterQuest: prevState.counterQuest + 1,
          countIterable: prevState.countIterable + 1,
          askInputQuest: false,
          repeating: false,
          confirmResponse: '',
        };
      });
      return true;
    }

    return false;
  }

  isThereConfirmQuest = () => {
    const { confirmQuestions } = this.state;

    if (typeof confirmQuestions[this.getCounterQuest() - 1] === 'undefined') {
      this.setState({ confirming: false, askInputQuest: true });
      return false;
    }

    this.setState({ confirming: true });
    return true;
  }

  appendField = () => {
    const {
      fieldsData: { textFields },
      counterQuest,
      fields,
      questions,
      confirmQuestions,
      countAppend,
      countIterable,
    } = this.state;

    const { name, question, confirmQuestion } = textFields[countIterable - 1];
    const newName = name.concat(countAppend);
    textFields[countIterable - 1].iterations.push(countAppend);
    fields.splice(counterQuest, 0, newName);
    questions.splice(counterQuest, 0, question);
    confirmQuestions.splice(counterQuest, 0, confirmQuestion);
    this.setState(prevState => {
      return {
        countAppend: prevState.countAppend + 1,
        countIterable: prevState.countIterable - 1,
        askInputQuest: true,
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
       counterQuest: 1,
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
          <div className="form-body">
            {textFields.map(textfield => (
              <div className={`row ${textfield.className}`} key={textfield.id}>
                <div className="column">
                  <TextField
                    key={textfield.id}
                    id={textfield.id}
                    name={textfield.name}
                    type={textfield.type}
                    label={textfield.label}
                    errorText={textfield.errorText}
                    multiLine={!!textfield.multiLine}
                    iterable={!!textfield.iterations}
                  />

                  {textfield.iterations
                      && textfield.iterations.map(iteration => (
                        <TextField
                          key={`${textfield.id}${iteration}`}
                          id={`${textfield.id}${iteration}`}
                          name={`${textfield.name}${iteration}`}
                          type={textfield.type}
                          errorText={textfield.errorText}
                          multiLine={!!textfield.multiLine}
                          iterable={!!textfield.iterations}
                        />
                      ))
                  }
                </div>
              </div>
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
