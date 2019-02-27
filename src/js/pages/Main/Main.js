import React from 'react';
import { Link } from 'react-router-dom';

import './style.css';


function Main() {
  return (
    <div>
      <h1>Voice Forms</h1>
      <ul>
        <li><Link to="/bio-capture">Bio Capture</Link></li>
        <li><Link to="/agenda-capture">Agenda Capture</Link></li>
      </ul>
    </div>
  );
}

export default Main;
