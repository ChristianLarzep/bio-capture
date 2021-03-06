import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Form, change, reset } from 'redux-form';

import { Page, Helmet, Title, TextField, Button } from '..';

import validator from '../../configurations/validator';

import Header from './components';

import './style.css';

const SpeechRecognition = window.webkitSpeechRecognition;
const initialstate = data => {
  return {
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
    fieldsData: { ...data },
    langs: 'United States',
    recognizing: false,
    recognition: new SpeechRecognition(),
    repeating: false,
  };
};


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
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const dataCopy = JSON.parse(JSON.stringify(props.data));
    this.state = { ...initialstate(dataCopy) };
  }

  componentDidMount() {
    this.getInputs();
    if (!('webkitSpeechRecognition' in window)) {
    // TODO
    // upgrade();
    } else {
      const speechSyn = window.speechSynthesis;

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
      fieldsData,
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

    fieldsData.textFields[countIterable - 1].iterations.push(countAppend);

    fields.splice(counterQuest, 0, newName);
    questions.splice(counterQuest, 0, question);
    confirmQuestions.splice(counterQuest, 0, confirmQuestion);

    this.setState(prevState => {
      return {
        fieldsData: { ...fieldsData },
        fields: [...fields],
        questions: [...questions],
        confirmQuestions: [...confirmQuestions],
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
    const { fieldsData: { textFields }, counterQuest } = this.state;
    const fields = [];
    const questions = [];
    const confirmQuestions = [];
    for (let i = 0; i < textFields.length; i += 1) {
      fields[i] = textFields[i].name;
      questions[i] = textFields[i].question;
      confirmQuestions[i] = textFields[i].confirmQuestion;
    }

    this.setState({
      currentQuest: questions[counterQuest - 1],
      fields,
      questions,
      confirmQuestions,
    });
  }

  capitalize = s => {
    const firstChar = /\S/;
    return s.replace(firstChar, m => m.toUpperCase());
  }

  mySubmit = values => {
    const { dispatch, onSubmit } = this.props;
    dispatch(reset('voiceForm'));
    onSubmit(values);
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

  deleteIterable = (indexT, indexE, fieldName) => {
    const { fieldsData, fields } = this.state;
    const { dispatch } = this.props;
    const element = fieldsData.textFields[indexT].iterations;
    const indexF = fields.indexOf(fieldName);

    fieldsData.textFields[indexT].iterations.splice(element.indexOf(element[indexE]), 1);
    dispatch(change('voiceForm', fields[indexF], ''));

    this.setState({ fieldsData });
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
            {textFields.map((textfield, indexT) => (
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
                      && textfield.iterations.map((element, indexE) => (
                        <div key={`${textfield.id}${element}`}>
                          <div className="editable">
                            <TextField
                              id={`${textfield.id}${element}`}
                              name={`${textfield.name}${element}`}
                              type={textfield.type}
                              errorText={textfield.errorText}
                              multiLine={!!textfield.multiLine}
                              iterable={!!textfield.iterations}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => this.deleteIterable(indexT, indexE, `${textfield.id}${element}`)}
                            className="close"
                          >
                            X
                          </button>
                        </div>
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
