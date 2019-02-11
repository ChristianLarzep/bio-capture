import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';

function Title(props) {
  const { className, children, tag, color, icon, border, ...others } = props;

  const stylenames = classnames({
    'title-text': true,
    blue: color === 'blue',
    purple: color === 'purple',
  });

  const Element = tag;

  return (
    <Element {...others} className={className}>
      {icon && (
        <span styleName="title-icon" key="icon">
          {icon}
        </span>
      )}
      <span className={stylenames} key="text">
        {children}
      </span>
    </Element>
  );
}

Title.propTypes = {
  border: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'purple']),
  icon: PropTypes.node,
  tag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
};

Title.defaultProps = {
  className: '',
  tag: 'h1',
};

export default Title;
