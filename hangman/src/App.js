import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import './App.css';

const dictionaryUrl = '/dictionary.txt'; // Path to the dictionary file in the public folder

function HangmanGame() {
  const [word, setWord] = useState('');
  const [hiddenWord, setHiddenWord] = useState('');
  const [guesses, setGuesses] = useState(new Set());
  const [guessCount, setGuessCount] = useState(0);
  const [maxGuesses] = useState(6); // Maximum number of incorrect guesses allowed
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const hangmanImageUrl =('/hangmandrawings.zip') 

  // Fetch the dictionary file and select a random word
  async function selectWord() {
    const response = await fetch(dictionaryUrl);
    const words = await response.text();
    const wordList = words.split('\n');
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const newWord = wordList[randomIndex].toUpperCase().trim();
    setWord(newWord);
    setHiddenWord('_'.repeat(newWord.length));
  }

  // Handle a user's guess
  function handleGuess(event) {
    event.preventDefault();
    const guess = event.target.elements.guess.value.toUpperCase().trim();
    event.target.elements.guess.value = '';
    if (!guess || guesses.has(guess) || gameOver) return;
    const newGuesses = new Set(guesses);
    newGuesses.add(guess);
    setGuesses(newGuesses);
    if (word.includes(guess)) {
      let newHiddenWord = '';
      for (let i = 0; i < word.length; i++) {
        if (word[i] === guess) {
          newHiddenWord += guess;
        } else {
          newHiddenWord += hiddenWord[i];
        }
      }
      setHiddenWord(newHiddenWord);
      if (newHiddenWord === word) {
        setGameWon(true);
        setGameOver(true);
      }
    } else {
      setGuessCount(guessCount + 1);
      if (guessCount + 1 === maxGuesses) {
        setGameOver(true);
      }
    }
  }

  // Restart the game
  function restartGame() {
    setWord('');
    setHiddenWord('');
    setGuesses(new Set());
    setGuessCount(0);
    setGameOver(false);
    setGameWon(false);
    selectWord();
  }

  // Render the game
  return (
    <div className="HangmanGame">
      <h1>Hangman</h1>
      {!word && <Button onClick={selectWord}>Start Game</Button>}
      {word && (
        <div>
          <h2>{hiddenWord}</h2>
          {!gameOver && (
            <div>
              <Form onSubmit={handleGuess}>
                <Form.Group as={Row}>
                  <Form.Label column sm={2}>
                    Guess a letter:
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control type="text" name="guess" maxLength="1" />
                  </Col>
                </Form.Group>
                <Button type="submit">Submit</Button>
              </Form>
              <p>Incorrect guesses: {guessCount}</p>
              <p>Previous guesses: {[...guesses].join(', ')}</p>
            </div>
          )}
          {gameOver && (
            <div>
              <p>The word was: {word}</p>
              {gameWon ? (
                <p>Congratulations, you won</p>
                ) : (
                  <p>Game over, you lost</p>
                )}:(
                  <div>
                  <p>Incorrect guesses: {guessCount}</p>
                  <p>Previous guesses: {guesses.join(", ")}</p>
                  <Form onSubmit={handleGuess}>
                    <Form.Group controlId="guess">
                      <Form.Label>Guess a letter:</Form.Label>
                      <Form.Control
                        type="text"
                        value={guessInput}
                        onChange={(e) => setGuessInput(e.target.value.toUpperCase())}
                        maxLength="1"
                        pattern="[A-Z]"
                        required
                        disabled={gameOver}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={gameOver}>
                      Guess
                    </Button>
                  </Form>
                </div>
              ){'}'}
              <Button onClick={restartGame}>Restart Game</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
          
                
                }
export default HangmanGame;