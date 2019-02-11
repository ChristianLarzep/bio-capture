import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

function CustomHelmet(props) {
  const {
    children,
  } = props;

  return (
    <Helmet
      titleTemplate="%s - Frontend"
    >
      {children}
    </Helmet>
  );
}

CustomHelmet.propTypes = {
  children: PropTypes.node,
};

export default CustomHelmet;
