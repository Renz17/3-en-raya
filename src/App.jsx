/* eslint-disable no-unused-vars */
import { useState } from "react";
import confetti from "canvas-confetti"
import { Square } from "./components/Square";
import { TURNS } from "./components/constants";
import { checkWinnerFrom } from "./logic/board";

function App() {


  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  });


  const [winner, setWinner] = useState(null)


  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const checkEndGame = (newBoard) => {

    return newBoard.every((Square) => Square != null)
  }

  const updateBoard = (index) => {
    // no actualizamos si esa posicion ya tiene escrito algo
    if (board[index] || winner) return
    // actualizar tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    const newWinner = checkWinnerFrom(newBoard)
    if(newWinner) {
      confetti()
      setWinner(newWinner)
    } else if(checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <main className="board">
      <h1>Tic tac</h1>
      <button onClick={resetGame}>Reiniciar</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square 
            key={index} 
            index={index}
            updateBoard={updateBoard}
            >
              {board[index]}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      {
        winner != null && (
        <section className="winner">
          <div className="text">
            <h2>
              {
                winner === false
                ? 'Empate'
                : 'Ganó'
              }
            </h2>
            <header>
              {winner && <Square>{winner}</Square>}
            </header>

            <footer>
              <button onClick={resetGame}>Empezar de nuevo</button>
            </footer>
          </div>
        </section>
        )
      }
    </main>
  )
}

export default App;
