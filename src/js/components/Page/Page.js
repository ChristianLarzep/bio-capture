import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';

function Page(props) {
  const { children, background } = props;
  const styles = classnames({
    [`${background}-background`]: !!background,
    'page-body': true,
  });
  return (
    <div className={styles}>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

Page.propTypes = {
  background: PropTypes.string,
  children: PropTypes.node,
};

export default Page;
