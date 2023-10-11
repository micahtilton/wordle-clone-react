import { useState } from 'react';
import './style.css'
import validWords from "./ValidWordle";

class Cell {
  constructor(letter = "") {
    this.letter = letter;
    this.highlight = ""
  }
  reset() {
    this.letter = ""
    this.highlight = ""
  }

  setLetter(letter) {
    this.letter = letter;
  }
}

class WordleKeyboard {
  constructor() {
    this.keyboard = this.generateKeyboard();
  }

  generateKeyboard() {
    const keys = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']];
    return keys.map(row => row.map(letter => new Cell(letter)))
  }

  highlightKeyboard(wordle) {

  }
}

class Wordle {
  constructor(wordGuess) {
    this.wordGuess = wordGuess;
    this.board = this.generateBoard();
    this.currentRow = 0;
    this.currentLetter = 0;
  }

  generateBoard() {
    return Array(6).fill("").map(() => Array(5).fill("").map(() => new Cell()));
  }

  deleteLetter() {
    if (this.currentLetter === 0) {
      return;
    }
    this.currentLetter -= 1;
    this.board[this.currentRow][this.currentLetter].reset();
  }

  addLetter(letter) {
    if (this.currentLetter === 5) {
      return;
    }

    const acceptedLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    if (!acceptedLetters.includes(letter.toLowerCase())) {
      return;
    }

    this.board[this.currentRow][this.currentLetter].setLetter(letter.toUpperCase());
    this.currentLetter += 1;
  }

  submitWord() {
    if (this.currentLetter !== 5) {
      return;
    }

    let userGuess = this.extractWord();

    if (!validWords.includes(userGuess.toLowerCase())) {
      return;
    }

    for (let i = 0; i < 5; i++) {
      this.board[this.currentRow][i].highlight = this.guessColor(this.wordGuess.toLowerCase(), userGuess.toLowerCase(), i);
    }

    this.currentRow += 1;
    this.currentLetter = 0;
    console.log(this.board)
  }

  guessColor(word, guess, index) {
    if (guess[index] === word[index]) {
      return "correct";
    }

    let wrongWord = 0
    let wrongGuess = 0;

    for (let i = 0; i < word.length; i++) {
      // count the wrong (unmatched) letters
      if (word[i] === guess[index] && guess[i] !== guess[index] ) {
        wrongWord++;
      }
      if (i <= index) {
        if (guess[i] === guess[index] && word[i] !== guess[index]) {
          wrongGuess++;
        }
      }

      if (i >= index) {
        if (wrongGuess === 0) {
          break;
        }
        if (wrongGuess <= wrongWord) {
          return "incorrect-location";
        }
      }
    }

    return "incorrect";
  }

  extractWord() {
    let userGuess = "";
    for (let i = 0; i < this.wordGuess.length; i++) {
      userGuess += this.board[this.currentRow][i].letter;
    }
    return userGuess;
  }
}
const wordle = new Wordle("hello");
const keyboard = new WordleKeyboard();
export default function Game() {
  const [gameBoard, setGameBoard] = useState(wordle.board);

  return (
    <div className="d-flex flex-column align-items-center">
      <Title />
      <GameBoard wordle = {wordle} gameBoard = {gameBoard} setGameBoard = {setGameBoard} />
      <Keyboard keyboard = {keyboard} wordle = {wordle} gameBoard = {gameBoard} setGameBoard = {setGameBoard} />
    </div>
  )
}

function Title() {
  return (
      <h1 className="text-center py-3">Wordle</h1>
  )
}

function GameBoard({ wordle, gameBoard, setGameBoard }) {
  return (
    <div className="conatiner d-flex flex-row justify-content-center py-5">
      <div>
        {
          wordle.board.map(row => {
            return (
                <div className="row">
                  {row.map(cell => {
                    return  <LetterCell cell={cell} />
                  })}
                </div>
            )
          })
        }
      </div>
    </div>
  )
}


function LetterCell({cell}) {
  return (
      <div className={"letter-cell col-1 p-0 m-1 d-flex flex-column justify-content-center " + cell.highlight}>
        <div className="text-center letter">
          {cell.letter}
        </div>
      </div>
  )
}

function KeyboardLetterCell({cell, onClick}) {
  let addClass = "";
  let addClassLetter = "";
  if (cell.letter === "ENTER") {
    addClass = " flex-grow-1 ";
    addClassLetter = " enter"
  } else if (cell.letter === "DEL") {
    addClass = " flex-grow-1 ";
    addClassLetter = " del"
  }

  return (
      <div className={"keyboard-cell col-1 p-0 m-1 d-flex flex-column justify-content-center" + addClass + cell.highlight}>
        <div className={"text-center keyboard-letter" + addClassLetter}>
          {cell.letter}
        </div>
      </div>
  )
}

function Keyboard({keyboard, wordle, gameBoard, setGameBoard}) {
  function pressKey(letter) {
    if (letter.toLowerCase() === "backspace") {
      wordle.deleteLetter();
    } else if (letter.toLowerCase() === "enter") {
      wordle.submitWord()
    }
    wordle.addLetter(letter);
    setGameBoard(wordle.board.slice());
  }
  function onKeyDown(e) {
    pressKey(e.key)
  }

  return (
    <div onKeyDown={onKeyDown} className="keyboard d-flex flex-column" tabIndex={0}>
      {
        keyboard.keyboard.map(row => {
          return (
              <div className="d-flex flex-row justify-content-center">
                {row.map(cell => <KeyboardLetterCell cell = {cell}/>)}
              </div>
          )
        })
      }
    </div>
  )
}