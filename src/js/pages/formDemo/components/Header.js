import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';
import Button from '../../../components/Button/Button';

class Header extends Component {
  state = { accent: 'Accent' };

  selectAccent = e => {
    const { selectAccent } = this.props;
    this.setState({ accent: e.target.value });
    selectAccent(e);
  }

  render() {
    const { onStart, logo } = this.props;
    const { accent } = this.state;
    return (
      <header className="page-header">
        <div className="logo">
          <div className="logo-container">
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="options">
          <div id="div_language">
            <select
              id="select_dialect"
              value={accent}
              onChange={this.selectAccent}
            >
              <option style={{ visibility: 'hidden' }}>Accent</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
              <option value="India">India</option>
              <option value="New Zealand">New Zealand</option>
              <option value="South Africa">South Africa</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
            </select>
          </div>
          <div className="btn-talk">
            <Button color="start" disabled={false} spinner={false} onClick={onStart}>
                 Start
            </Button>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  logo: PropTypes.string,
  selectAccent: PropTypes.func,
  onStart: PropTypes.func,
};

export default Header;
