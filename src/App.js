import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="background h-screen flex flex-col justify-center items-center">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-black">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link text-primary underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;