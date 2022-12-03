import './App.css';
import React from "react";
import {BrowserRouter} from "react-router-dom";
import MainComponent from "./components/main.component";

function App() {
    return (
            <div className="App">
              <header className="App-wrapper">
                  <BrowserRouter>
                      <MainComponent/>
                  </BrowserRouter>
              </header>
            </div>
  );
}

export default App;
