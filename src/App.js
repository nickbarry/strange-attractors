import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Attractor from './attractor.component';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Straaaaaaange Attractors</h2>
        </div>
        <Attractor />
      </div>
    );
  }
}

export default App;
