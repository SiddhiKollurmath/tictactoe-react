import './styles.scss';
import { useState } from 'react';
import Board from './components/Board';
import StatusMessage from './components/StatusMessage';
import History from './components/History';
import { calculateWinner } from './components/winner';

const NEW_GAME = [{ squares: Array(9).fill(null), isXNext: false }];

function App() {
  const [history, setHistory] = useState(NEW_GAME);
  const [currentMove, setCurrentMove] = useState(0);

  const gamingBoard = history[currentMove];

  const { winner, winningSquares } = calculateWinner(gamingBoard.squares);

  const handleSquareClick = clickedPosition => {
    if (gamingBoard.squares[clickedPosition] || winner) {
      return;
    }

    setHistory(currentHistory => {
      const isTraversing = currentMove + 1 !== currentHistory.length;

      const lastGamingState = isTraversing
        ? currentHistory[currentMove]
        : history[history.length - 1];

      const nextSquaresState = lastGamingState.squares.map(
        (squareValue, position) => {
          if (clickedPosition === position) {
            return lastGamingState.isXNext ? 'O' : 'X';
          }
          return squareValue;
        }
      );

      const base = isTraversing
        ? currentHistory.slice(0, currentHistory.indexOf(lastGamingState) + 1)
        : currentHistory;

      return base.concat({
        squares: nextSquaresState,
        isXNext: !lastGamingState.isXNext,
      });
    });

    setCurrentMove(move => move + 1);
  };

  const moveTo = move => {
    setCurrentMove(move);
  };

  const onNewGameStart = () => {
    setHistory(NEW_GAME);
    setCurrentMove(0);
  };

  return (
    <div className="app">
      <h1>
        TIC <span className="text-tac">TAC</span> TOE
      </h1>
      <StatusMessage winner={winner} gamingBoard={gamingBoard} />

      <div className="board-container">
        <Board
          squares={gamingBoard.squares}
          handleSquareClick={handleSquareClick}
          winningSquares={winningSquares}
        />
      </div>

      <button
        type="button"
        onClick={onNewGameStart}
        className={`btn-reset ${winner ? 'active' : ''}`}
      >
        <h4> Start New Game</h4>
      </button>

      <h2
        style={{
          fontWeight: 'normal',
        }}
      >
        Current game history
      </h2>
      <History history={history} moveTo={moveTo} currentMove={currentMove} />
    </div>
  );
}

export default App;