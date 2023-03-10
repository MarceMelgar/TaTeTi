import './App.css'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

import { Square } from './component/Square'
import { TURNS } from './constants'
import { checkWinnerFrom, checkEndGame } from './logic/board'
import { WinnerModal } from './component/WinnerModal'
import { saveGameToStorage, resetGameStorage } from './storage'

function App() {

  const [board, setBoard] = useState(() => {
    // leo aquí el localStorage para que no se ejecute cada vez que se apreta un div.
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  }) 
    
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  const updateBoard = (i) => {
    //no acutualizamos si ya tiene algo
    if (board[i] || winner) return
    // actualizamos tablero
    const newBoard = [...board]
    newBoard[i] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // guardar partida con LOCAL STORAGE
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })
    // revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      confetti()
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  

  return (
    <main className="board">
      <h1>Tateti</h1> 

      <section className="game">
        {
          board.map((_, i) => {
            return (
              <Square 
                key={i}   // identificador único en este caso, sino dería su ID
                i={i}
                updateBoard={updateBoard}
              >
                {board[i]} 
              </Square>
            )
          })
        }
      </section>
      
      <section className="turn">  
        <h2>Turno: </h2>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      <section className='btn-reset'>  
        <button onClick={resetGame}>Resetear el juego</button>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>

    )
}

export default App
