import React, { Component } from 'react';
import './App.css';

import Main from './Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Form Builder</h2>
        </div>
        <Main />
      </div>
    );
  }
}

export default App;
