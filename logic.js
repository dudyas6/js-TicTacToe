// Data Structures
//module - one, factory - many

const playerFactory = (playerSign) => {
    this.playerSign = playerSign;

    const getSign = () => {
        return playerSign;
    };

    return { getSign };
};

const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const setCell = (index, sign) => {
        if (index > board.length) return;
        board[index] = sign;
      };

    const getCell = (index) => {
        if (index > board.length) {
            alert("Invalid index");
            return;
        }
        return board[index];
    }

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    }

    return { setCell, getCell, resetBoard };
})();


const displayController = (() => {
    const cellElements = document.querySelectorAll(".cell");
    const turnMsg = document.getElementById("message");
    const restartButton = document.getElementById("restartButton");
    const playAgainButton = document.getElementById("playAgainButton");

    cellElements.forEach((cell) => {
        cell.addEventListener("click", (e) => {
            if (gameController.getGameOver() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        });
    });

    restartButton.addEventListener("click", (e) => {
        gameBoard.resetBoard();
        gameController.updateScoreBoard(true);
        gameController.reset();
        updateGameboard();
        setMessageElement("Player X's turn");
    });

    playAgainButton.addEventListener("click", (e) => {
        if (!gameController.getGameOver()) {
            alert("Please finish the game first, or click the restart button");
            return;
        }
        gameBoard.resetBoard();
        gameController.updateScoreBoard(false);
        gameController.reset();
        updateGameboard();
        setMessageElement("Player X's turn");
    });

    const updateGameboard = () => {
        for (let i = 0; i < cellElements.length; i++) {
            cellElements[i].textContent = gameBoard.getCell(i);
        }
    };


    const setResultMessage = (winner) => {
        if (winner === "Draw") {
            setMessageElement("It's a draw!");
        } else {
            setMessageElement(`Player ${winner} has won!`);
        }
    };

    const setMessageElement = (message) => {
        turnMsg.textContent = message;
    };

    return { setResultMessage, setMessageElement };

})();


const gameController = (() => {
    const playerOne = playerFactory("X");
    const playerTwo = playerFactory("O");
    const playerOneScore = document.getElementById("playerOneScore");
    const playerTwoScore = document.getElementById("playerTwoScore");
    let scoreOne = 0;
    let scoreTwo = 0;
    let round = 1;
    let draw = false;
    let gameDone = false;

    const playRound = (index) => {
        gameBoard.setCell(index, getCurrentPlayerSign());
        if (checkWin(index)) {
            displayController.setResultMessage(getCurrentPlayerSign());
            gameDone = true;
            return
        }
        if (round === 9) {
            displayController.setResultMessage("Draw");
            draw = true
            gameDone = true;
            return
        }
        round++;
        displayController.setMessageElement(
            `Player ${getCurrentPlayerSign()}'s turn`
        );
    };

    const updateScoreBoard = (flag) => {
        if (flag) {
            scoreOne = 0;
            scoreTwo = 0;
            playerOneScore.textContent = scoreOne;
            playerTwoScore.textContent = scoreTwo;
        }
        else {
            if (draw) {
                draw = false;
                return
            }
            else if (gameDone && getCurrentPlayerSign() === "X") {
                scoreOne++;
                playerOneScore.textContent = scoreOne;
            }
            else {
                scoreTwo++;
                playerTwoScore.textContent = scoreTwo;
            }
        }
    }

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerOne.getSign() : playerTwo.getSign();
    };

    const checkWin = (index) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winConditions
        .filter((combination) => combination.includes(index))
        .some((possibleCombination) =>
          possibleCombination.every(
            (someIndex) => gameBoard.getCell(someIndex) === getCurrentPlayerSign()
          )
        );
    };

    const getGameOver = () => {
        return gameDone;
    };

    const reset = () => {
        round = 1;
        gameDone = false;
    };

    return {playRound,getGameOver,reset,updateScoreBoard};

})();

const mainMenu = (() => {
    const startButton = document.getElementById("start");
    const playerBtn = document.getElementById("player");
    const computerBtn = document.getElementById("ai");
    const mainContainer = document.getElementById("wrapper");
    const menuContainer = document.getElementById("menu");
    let choice = ""

    playerBtn.onclick = () => {
        choice = "player";
    }
    computerBtn.onclick = () => {
        choice = "ai";
    }
    
    startButton.onclick = () => {
        if (choice === "player") {
            mainContainer.classList.add("active");
            menuContainer.classList.add("unactive");
            gameController.reset();
            updateGameboard();
        }
    }

    return {};
})();
