import logo from "./logo.svg";
import "./App.css";
import GameBoard from "./components/GameBoard";

function App() {
  return (
    <div className="App">
      <div className="Game">
        <h1>Game</h1>
        <GameBoard />
      </div>
    </div>
  );
}

export default App;
