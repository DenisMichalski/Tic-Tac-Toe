Tic-Tac-Toe Game

Introduction

This project is a simple Tic-Tac-Toe game built with HTML, CSS, and JavaScript. It follows a modular approach using JavaScript modules and factory functions to keep the code organized and scalable.

Features

- Players take turns placing their markers (X or O) on a 3x3 grid.

- The game detects wins, draws, and prevents invalid moves.

- A reset button allows restarting the game at any time.

- Interactive UI with basic animations for better user experience.

Project Structure

Tic-Tac-Toe/
│── index.html        # Main HTML file
│── styles.css        # Styles for the game
│── script.js         # JavaScript game logic
│── README.md         # Project documentation

How to Run the Game

1. Download or Clone the Repository

git clone https://github.com/yourusername/tic-tac-toe.git
cd tic-tac-toe

2. Open index.html in a browser

No additional dependencies or setup is required.

-----------------Step-by-Step Guide----------------

1. Step 1: Create the Gameboard Module

The Gameboard module manages the 3x3 grid.

It stores the board state in an array and provides functions to update it.

2. Step 2: Define Player Objects

The Player factory function creates player objects with names and assigned markers (X or O).

3. Step 3: Implement the Game Controller

The GameController module manages player turns, checks for wins, and handles game logic.

It switches players and validates moves.

4. Step 4: Connect JavaScript to the DOM

JavaScript listens for user clicks on the game board.

Updates the UI dynamically based on player actions.

5. Step 5: Handle Win and Draw Conditions

Checks if a player has won by matching a row, column, or diagonal.

If all spaces are filled without a winner, it's a draw.

6. Step 6: Implement the Reset Function

Resets the board and starts a new game while keeping the player order.

---------------Future Improvements-------------------------

- Add animations and sound effects.

- Implement an AI opponent.

- Improve responsiveness for mobile devices.

License

This project is open-source and free to use for learning and development purposes.

Best regards, Denis Michalski