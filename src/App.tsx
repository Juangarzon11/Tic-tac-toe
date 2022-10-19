import { useState } from 'react'

import './App.css'

enum Player {
  X = "X",
  O = "O"
}

enum Status {
  Playing,
  Draw,
  Finished
}

const WINNING_COMPS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
]

const INITIAL_STATE = new Array(9).fill("")

const INITIAL_SCOREBOARD = {
  [Player.X]: 0,
  [Player.O]: 0
}

function App() {
  const [turn, setTurn] = useState<Player>(Player.X)
  const [cells, setCells] = useState<(Player | "")[]>(() => new Array(9).fill(""))
  const [status, setStatus] = useState<Status>(Status.Playing)
  const [scoreBoard, setScoreBoard] = useState<Record<Player, number>>(INITIAL_SCOREBOARD)

  function handleClick(index: number) {

    if(status !== Status.Playing) return

    if(cells[index] === '') {
      const draft = [...cells]
      draft[index] = turn

      const hasWon = WINNING_COMPS.some((comp) => comp.every((cell) => turn === draft[cell]) )

      if(hasWon) {
        setStatus(Status.Finished)
          setScoreBoard(scoreBoard => ({
            ...scoreBoard,
            [turn]: scoreBoard[turn]++
          }))
      } else if(draft.every(cell => cell !== "")) {
        setStatus(Status.Draw)
      }
  
      setTurn(turn => turn === Player.X ? Player.O : Player.X)
      setCells(draft)
    }
  }

  function handleReset() {
    setCells(INITIAL_STATE)
    setStatus(Status.Playing)
  }

  return (
    <main>
      <section>
        <p>Turno de: {turn}</p>
        <p>X ganó: {scoreBoard[Player.X]}</p>
        <p>O ganó: {scoreBoard[Player.O]}</p>
      </section>
      <div className="board">
        {cells.map((cell, index) => (
          <div key={index} className="cell" onClick={() => handleClick(index)}>
            {cell}
          </div>
        ))}
      </div>

      {status !== Status.Playing && (
        <section>
          <article role="alert">
            {status === Status.Draw && "Empate!"}
            {status === Status.Finished && `Ganó ${turn === Player.O ? "X" : "O"}!`}
          </article>
          <button onClick={handleReset}>Reiniciar</button>
        </section>
      )}
    </main>
  )
}

export default App
