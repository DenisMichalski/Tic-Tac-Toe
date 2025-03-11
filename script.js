//----------------------------Step 1: The Gameboard Module--------------------------------//

const Gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const placeMarker = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, placeMarker, resetBoard };
})();

//-----------------------------Step 2: The Player Function--------------------------------//

const Player = (name, marker) => {
  return { name, marker };
};

//-----------------------------Step 3: The Game Controller-----------------------------------//

const GameController = (function () {
  const moveSound = new Audio("sounds/move.mp3");
  const winSound = new Audio("sounds/win.wav");
  const drawSound = new Audio("sounds/draw.wav");

  let player1 = Player("Player 1", "X");
  let player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let isBotActive = false;
  let player1Score = 0;
  let player2Score = 0;
  let drawScore = 0;
  let roundCounter = 0;
  const maxRounds = 5; // Maximale Rundenanzahl

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    updateCurrentPlayerDisplay();
  };

  const getCurrentPlayer = () => currentPlayer;

  const checkWin = () => {
    const board = Gameboard.getBoard();
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        highlightWinningCells(combo);
        return true;
      }
    }
    return false;
  };

  const highlightWinningCells = (winningCombo) => {
    winningCombo.forEach((index) => {
      document.querySelectorAll(".cell")[index].classList.add("winner");
    });
  };

  const checkDraw = () => Gameboard.getBoard().every((cell) => cell !== "");

  const setBoardState = (enabled) => {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.style.pointerEvents = enabled ? "auto" : "none";
    });
  };

  const playRound = (index) => {
    if (Gameboard.placeMarker(index, currentPlayer.marker)) {
      const cell = document.querySelectorAll(".cell")[index];
      cell.textContent = currentPlayer.marker;
      moveSound.play();

      cell.classList.remove("animated");
      void cell.offsetWidth;
      cell.classList.add("animated");

      if (checkWin()) {
        currentPlayer === player1 ? player1Score++ : player2Score++;
        updateScoreboard();

        setTimeout(() => {
          winSound.play();
          alert(`${currentPlayer.name} wins! 🎉`);
        }, 300);

        roundCounter++;
        endGameCheck();
        return;
      }

      if (checkDraw()) {
        drawScore++;
        updateScoreboard();
        setTimeout(() => {
          drawSound.play();
          alert(`It's a Draw! 🤝`);
        }, 300);

        roundCounter++;
        endGameCheck();
        return;
      }

      switchPlayer();
      if (isBotActive && currentPlayer === player2) {
        setTimeout(botMove, 500);
      }
    } else {
      alert("This cell is already occupied!");
    }
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("winner");
    });
    setBoardState(true);
    currentPlayer = player1;
    updateCurrentPlayerDisplay();
  };

  const updateScoreboard = () => {
    document.getElementById("player1-score").textContent = player1Score;
    document.getElementById("player2-score").textContent = player2Score;
    document.getElementById("draw-score").textContent = drawScore;
  };

  const botMove = () => {
    if (!isBotActive || currentPlayer !== player2) return;

    const emptyCells = Gameboard.getBoard()
      .map((cell, index) => (cell === "" ? index : null))
      .filter((index) => index !== null);

    if (emptyCells.length === 0) return;

    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    setTimeout(() => playRound(randomIndex), 500);
  };

  const endGameCheck = () => {
    if (roundCounter >= maxRounds) {
      setTimeout(() => {
        let winner;
        if (player1Score > player2Score) {
          winner = "🎉 Player 1 wins the series!";
        } else if (player2Score > player1Score) {
          winner = "🏆 Player 2 wins the series!";
        } else {
          winner = "🤝 The series ends in a draw!";
        }
        alert(`Game over! ${winner}`);
        resetSeries();
      }, 500);
    } else {
      resetGame();
    }
  };

  const resetSeries = () => {
    player1Score = 0;
    player2Score = 0;
    drawScore = 0;
    roundCounter = 0;
    updateScoreboard();
    resetGame();
  };

  const setBotActive = (value) => {
    isBotActive = value;
  };
  const getBotActive = () => isBotActive;

  return {
    playRound,
    getCurrentPlayer,
    switchPlayer,
    resetGame,
    checkWin,
    checkDraw,
    botMove,
    setBotActive,
    getBotActive,
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

  document.getElementById("toggle-bot").addEventListener("click", () => {
    GameController.setBotActive(!GameController.getBotActive());
    document.getElementById("toggle-bot").textContent =
      GameController.getBotActive() ? "👤 Play vs Player" : "🤖 Play vs Bot";
    GameController.resetGame();
  });

  updateCurrentPlayerDisplay();
});
