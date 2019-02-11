import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Field } from 'redux-form';
import { autobind } from 'core-decorators';
import './style.css';

class TextField extends Component {
  @autobind
  renderField(field) {
    const {
      id,
      label,
      name,
      type,
      errorText,
      className,
      multiLine,
    } = this.props;

    const hasError = field.meta.touched && field.meta.invalid;
    const fieldType = multiLine ? 'textarea' : 'textfield';
    const textfield = `${fieldType} ${className}`;
    let inputStyle; let textAreaStyle; let inputElement;
    const spanError = hasError ? 'display-error-text' : 'error-hidden';

    if (multiLine) {
      textAreaStyle = classnames({ multiLine: (hasError === false), errorTextarea: hasError });
      inputElement = (<textarea {...field.input} name={name} className={textAreaStyle} />);
    } else {
      inputStyle = classnames({ 'input-text': (hasError === false), errorInput: hasError });
      inputElement = (
        <input
          id={id}
          className={inputStyle}
          name={name}
          type={type}
          {...field.input}
        />
      );
    }

    return (
      <div className={textfield}>
        {label && <div className="label"><span className="label-text">{label}</span></div>}
        {inputElement}

        <span className={spanError}>{errorText}</span>
      </div>
    );
  }

  render() {
    return <Field {...this.props} component={this.renderField} />;
  }
}

TextField.propTypes = {
  disabled: PropTypes.bool,
  errorText: PropTypes.node,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  multiLine: PropTypes.bool,
  name: PropTypes.string.isRequired,
  question: PropTypes.string,
  type: PropTypes.string,
};

TextField.defaultProps = {
  type: 'text',
  multiLine: false,
  errorText: 'Valor requerido',
};

export default TextField;
