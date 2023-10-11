import { useState } from 'react';
import './style.css'

export default function Game() {
  const [gameBoard, setGameBoard] = useState(Array(30).fill(" "));
  const [currentCell, setCurrentCell] = useState(0);

  return (
    <>
      <GameBoard gameBoard = {gameBoard} setGameBoard = {setGameBoard} />
      <Keyboard currentCell={currentCell} setCurrentCell={setCurrentCell} gameBoard = {gameBoard} setGameBoard = {setGameBoard} />
    </>
  )
}

function GameBoard({ gameBoard, setGameBoard }) {
  function generateBoard() {
    const ret = [];
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        row.push(
          <div className="letter-cell col-1 p-0 m-2 d-flex flex-column justify-content-center">
            <div className="text-center letter">
              {gameBoard[i*5 + j]}
            </div>
          </div>)
      }

      ret.push(
        <div className="row">
          {row}
        </div>
      )
    }

    return ret;
  }

  return (
    <div className="d-flex flex-row justify-content-center">
      <div>
        {generateBoard()}
      </div>
    </div>
  )
}



function Keyboard({gameBoard, setGameBoard, currentCell, setCurrentCell}) {
  function onKeyDown(e) {
    const board = gameBoard.slice()

    if (e.key === "backspace") {

    }
    board[currentCell] = e.key;
    setGameBoard(board)
    setCurrentCell(currentCell + 1)
    console.log("pressed")
  }

  return (
    <div onKeyDown={onKeyDown} className="keyboard" tabIndex={0}>

    </div>
  )
}