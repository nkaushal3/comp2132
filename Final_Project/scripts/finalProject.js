class HangmanGame {
  constructor() {
    // DOM Elements
    this.hangmanContainer = document.getElementById("hangman-container");
    this.guessInput = document.getElementById("guess-input");
    this.submitGuessButton = document.getElementById("submit-guess");
    this.messageContainer = document.getElementById("message-container");
    this.playAgainButton = document.getElementById("play-again");
    this.hintElement = document.getElementById("hint");
    this.wordContainer = document.getElementById("word-container");
    this.guessedLettersContainer = document.getElementById("guessed-letters-container");
    this.incorrectGuessesContainer = document.getElementById("incorrect-guesses-container");

    // Game Variables
    this.wordData = [];
    this.selectedWord = "";
    this.hint = "";
    this.guessedLetters = [];
    this.correctGuesses = [];
    this.incorrectGuesses = [];
    this.totalGuesses = 6;
    this.moveImage = 15;

    // Initialize the game
    this.setupGame();
  }

  // Set up game events and fetch data
  setupGame() {
    this.createHangmanImage();
    this.fetchWords().then((data) => {
      this.wordData = data;
      this.initializeGame();
    });

    this.guessInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.handleGuess();
      }
    });

    this.submitGuessButton.addEventListener("click", () => this.handleGuess());
    this.playAgainButton.addEventListener("click", () => this.initializeGame());
  }

  // Create and append the hangman image
  createHangmanImage() {
    this.hangmanImage = document.createElement("img");
    this.hangmanImage.id = "hangman-image";
    this.hangmanImage.src = "images/1.jpg";
    this.hangmanContainer.appendChild(this.hangmanImage);
  }

  // Fetch words from JSON
  async fetchWords() {
    const response = await fetch("words.json");
    return response.json();
  }

  // Initialize the game state
  initializeGame() {
    this.guessedLetters = [];
    this.correctGuesses = [];
    this.incorrectGuesses = [];
    this.resetGameState();
    this.selectRandomWord();
    this.updateWordDisplay();
    this.updateHintDisplay();
  }

  // Reset UI and variables for a new game
  resetGameState() {
    this.messageContainer.textContent = "";
    this.hangmanImage.style.right = "0";
    this.hangmanImage.src = "images/1.jpg";
    this.guessInput.disabled = false;
    this.submitGuessButton.disabled = false;
    this.playAgainButton.style.display = "none";
    this.guessedLettersContainer.textContent = "";
    this.incorrectGuessesContainer.textContent = "";
  }

  // Select a random word and its hint
  selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * this.wordData.length);
    const randomWordData = this.wordData[randomIndex];
    this.selectedWord = randomWordData.word.toUpperCase();
    this.hint = randomWordData.hint;
  }

  // Update the word display with underscores and correct guesses
  updateWordDisplay() {
    this.wordContainer.textContent = this.selectedWord
      .split("")
      .map((letter) => (this.correctGuesses.includes(letter) ? letter : "_"))
      .join(" ");
  }

  // Display the hint
  updateHintDisplay() {
    this.hintElement.textContent = `Hint: ${this.hint}`;
  }

  // Handle a guessed letter
  handleGuess() {
    const guess = this.guessInput.value.toUpperCase();
    this.messageContainer.textContent = "";

    // Validate the guess
    if (!guess || this.guessedLetters.includes(guess)) {
      if (this.guessedLetters.includes(guess)) {
        this.messageContainer.textContent = "Try another letter, this one has been guessed!";
      }
      return;
    }

    this.guessedLetters.push(guess);

    if (this.selectedWord.includes(guess)) {
      this.correctGuesses.push(guess);
      this.updateWordDisplay();
      if (!this.wordContainer.textContent.includes("_")) {
        this.endGame("win");
      }
    } else {
      this.incorrectGuesses.push(guess);
      this.updateHangmanImage();
      this.updateIncorrectGuessesDisplay();
      if (this.incorrectGuesses.length === this.totalGuesses) {
        this.endGame("lose");
      }
    }

    this.updateGuessedLettersDisplay();
    this.guessInput.value = "";
  }

  // Update the guessed letters display with colors
  updateGuessedLettersDisplay() {
    this.incorrectGuessColor = "red";
    this.correctGuessColor = "green";

    this.guessedLettersContainer.innerHTML = ""; // Clear previous content

    this.guessedLetters.forEach((letter) => {
      const letterSpan = document.createElement("span");
      letterSpan.textContent = letter + " ";

      // Apply color based on correctness
      if (this.correctGuesses.includes(letter)) {
        letterSpan.style.color = this.correctGuessColor;
      } else if (this.incorrectGuesses.includes(letter)) {
        letterSpan.style.color = this.incorrectGuessColor;
      }

      this.guessedLettersContainer.appendChild(letterSpan);
    });
  }

  // Update the hangman image based on incorrect guesses
  updateHangmanImage() {
    this.hangmanImage.style.right = `${this.incorrectGuesses.length * this.moveImage}%`;
    this.hangmanImage.src = `images/${this.incorrectGuesses.length + 1}.jpg`;
  }

  // Update the incorrect guesses display
  updateIncorrectGuessesDisplay() {
    this.incorrectGuessesContainer.textContent = `${
      this.totalGuesses - this.incorrectGuesses.length
    } incorrect guesses left before the hangman escapes!`;
  }

  // End the game with a result
  endGame(result) {
    this.guessInput.disabled = true;
    this.submitGuessButton.disabled = true;
    this.playAgainButton.style.display = "inline";

    if (result === "win") {
      this.messageContainer.textContent = "Congratulations! You caught the hangman!";
    } else {
      this.messageContainer.textContent = `Oh no! The word was: ${this.selectedWord}`;
    }
  }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => new HangmanGame());