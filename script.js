//----------------------------Step 1: The Gameboard Module--------------------------------//

// Gameboard Module: Manages the Tic-Tac-Toe board
const Gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  // Get current board state
  const getBoard = () => board;

  // Place a marker if the spot is empty
  const placeMarker = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  // Reset the board
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, placeMarker, resetBoard };
})();

//-----------------------------Step 2: The Player Function--------------------------------//

// Player Factory Function: creates player objects
const Player = (name, marker) => {
  return { name, marker };
};

//-----------------------------Step 3: The Game Controller-----------------------------------//

// Game Controller: Manages game flow
const GameController = (function () {
  let player1 = Player("Player 1", "X");
  let player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let player1Score = 0;
  let player2Score = 0;
  let drawScore = 0;

  // Switch players after a valid move
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    updateCurrentPlayerDisplay();
  };

  // Get the current player
  const getCurrentPlayer = () => currentPlayer;

  const checkWin = () => {
    const board = Gameboard.getBoard();

    // All possible winning combinations
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Vertical
      [0, 4, 8],
      [2, 4, 6], // Diagonal
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;

      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        highlightWinningCells(combo); // highlight winning cells
        return true; // One player has won
      }
    }

    return false;
  };

  // New cell highlighting feature
  const highlightWinningCells = (winningCombo) => {
    winningCombo.forEach((index) => {
      document.querySelectorAll(".cell")[index].classList.add("winner");
    });
  };

  // Check if it's a Draw
  const checkDraw = () => {
    return Gameboard.getBoard().every((cell) => cell !== ""); // All fields are filled
  };

  // function to deactivate the playing field and Function to activate the playing field (when resetting)
  const setBoardState = (enabled) => {
    document.querySelectorAll(".cell").forEach(cell => {
      cell.style.pointerEvents = enabled ? "auto" : "none";
    });
  };

  const playRound = (index) => {
    if (Gameboard.placeMarker(index, currentPlayer.marker)) {
      document.querySelectorAll(".cell")[index].textContent =
        currentPlayer.marker; // Update UI

      document.querySelectorAll(".cell")[index].classList.add("animated");

      // Remove animation after a short time so that it will be played again on the next turn
      setTimeout(() => {
        document.querySelectorAll(".cell")[index].classList.remove("animated");
      }, 300);

      if (checkWin()) {
        if (currentPlayer === player1) {
          player1Score++;
        } else {
          player2Score++;
        }

        updateScoreboard();

        setTimeout(() => {
          winSound.play();
          alert(`${currentPlayer.name} wins! 🎉`);
        }, 300);
        setBoardState(false);
        return;
      }

      if (checkDraw()) {
        drawScore++;
        updateScoreboard();
        setTimeout(() => {
          drawScore.play();
          alert(`It's a Draw! 🤝`);
        }, 300);
        setBoardState(false);
        return;
      }

      switchPlayer();
    } else {
      alert("This cell is already occupied!");
    }
  };

  // Reset game
  const resetGame = () => {
    Gameboard.resetBoard();
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = ""; // clear the playing field
      cell.classList.remove("winner");
    });
    setBoardState(true);
    currentPlayer = player1; // Restart with Player 1
    updateCurrentPlayerDisplay();
  };

  const updateScoreboard = () => {
    document.getElementById("player1-score").textContent = player1Score;
    document.getElementById("player2-score").textContent = player2Score;
    document.getElementById("draw-score").textContent = drawScore;
  }

  return {
    playRound,
    getCurrentPlayer,
    switchPlayer,
    resetGame,
    checkWin,
    checkDraw,
  };
})();

//----------------------------Step 4: Display of current players--------------------------------//

const updateCurrentPlayerDisplay = () => {
  const currentPlayer = GameController.getCurrentPlayer();
  document.getElementById(
    "current-player"
  ).textContent = `${currentPlayer.name}'s turn (${currentPlayer.marker})`;
};

//----------------------------Step 5: DOM Events--------------------------------//

document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      GameController.playRound(index);
    });
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    GameController.resetGame();
  });

  updateCurrentPlayerDisplay(); // Start with display of player 1
});
