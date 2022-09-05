document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board'),
    gameBoardBase = document.querySelector('.game-board-base'),
    gameScoreEl = document.getElementById('game-score'),
    highScoreEl = document.getElementById('high-score');

  document
    .querySelector('.new-game-button')
    .addEventListener('click', resetGame);
  document
    .getElementById('game-over-button')
    .addEventListener('click', closeGameOverDialog);
  document
    .getElementById('game-win-button')
    .addEventListener('click', closeGameWinDialog);
  
  let squares = [],
    rows = [],
    columns = [],
    animationData = {
      moves: [],
      popUps: [],
      newNumbers: [],
    },
    gameWon = false,
    dialogOpen = false,
    waitTime = 50,
    gameScore = 0,
    storedHighScore = localStorage.getItem('stored-high-score'),
    highScore = storedHighScore ? storedHighScore : 0;
  
    highScoreEl.innerHTML = highScore;

  fillSquares();
  createBoard();
  addTouchScreenSwipes();
  fillRandomSquare();
  fillRandomSquare();
  fillBoard();
  createOperationArrays();
  animateNew();

  //  touch screen move functions
  function addTouchScreenSwipes() {
    let startX, startY, startTime;
    gameBoard.addEventListener('touchstart', function (event) {
      let touchObj = event.changedTouches[0];
      startX = touchObj.pageX;
      startY = touchObj.pageY;
      startTime = new Date().getTime();
      event.preventDefault();
    });

    gameBoard.addEventListener('touchmove', function (event) {
      event.preventDefault();
    });

    gameBoard.addEventListener('touchend', function (event) {
      let touchObj = event.changedTouches[0],
        endX = touchObj.pageX,
        endY = touchObj.pageY,
        endTime = new Date().getTime(),
        minTime = 50,
        minDistance = 30,
        elapsedTime = endTime - startTime,
        distanceX = endX - startX,
        distanceY = endY - startY,
        absoluteDistanceX = Math.abs(endX - startX),
        absoluteDistanceY = Math.abs(endY - startY);

      console.log(
        'distanceX:',
        distanceX,
        'distanceY:',
        distanceY,
        'absolute distanceX:',
        absoluteDistanceX,
        'absolute distanceY:',
        absoluteDistanceY,
        'elapsedTime:',
        elapsedTime
      );

      if (elapsedTime > minTime) {
        if (
          absoluteDistanceY > absoluteDistanceX &&
          absoluteDistanceY > minDistance
        ) {
          distanceY > 0 ? moveDown() : moveUp();
        } else if (
          absoluteDistanceX > absoluteDistanceY &&
          absoluteDistanceX > minDistance
        ) {
          distanceX > 0 ? moveRight() : moveLeft();
        }
      }
      event.preventDefault();
    });
  }
  function fillSquares() {
    let zeroSquares = Array(16).fill(0);
    squares = zeroSquares;
  }
  function fillRandomSquare() {
    if (squares.includes(0)) {
      let num = Math.floor(Math.random() * squares.length);
      let twoOrFour = Math.random() > 0.1 ? 2 : 4;
      if (squares[num] === 0) {
        squares[num] = twoOrFour;
        animationData.newNumbers.push(num);
      } else fillRandomSquare();
    }
  }
  function createBoard() {
    //  squares = [0, 0, 0, 4, 8, 16, 32, 0, 64, 128, 256, 512, 1024, 2048, 8192, 4096,];
    for (let i = 0; i < 16; i++) {
      let squareBase = document.createElement('div');
      squareBase.className = 'game-square-base';
      gameBoardBase.appendChild(squareBase);
      let square = document.createElement('div');
      square.className = 'game-square';
      square.id = 'sq-' + i;
      gameBoard.appendChild(square);
    }
  }
  function fillGameScore() {
    gameScoreEl.innerHTML = gameScore;
  }
  function digitCheck(index, num) {
    let square = document.getElementById('sq-' + index);
    square.classList.remove('two-digits', 'three-digits', 'four-digits');
    if (num > 9 && num < 100) {
      square.classList.add('two-digits');
    } else if (num > 99 && num < 1000) {
      square.classList.add('three-digits');
    } else if (num > 999) {
      square.classList.add('four-digits');
    }
  }
  function numberCheck(index, num) {
    let square = document.getElementById('sq-' + index);
    square.classList.remove(
      ...Array.from(square.classList).filter(
        (className) => className !== 'game-square'
      )
    );
    if (num !== 0) {
      square.classList.add(`color-${num}`);
    }
  }
  function columnsMoveCheck(direction) {
    animationData.moves = [];
    animationColumns = [[0], [0], [0], [0]];
    for (let i = 0; i < 4; i++) {
      const checkColumn =
        direction === 'up' ? columns[i] : columns[i].reverse();

      if (checkColumn.every((num) => num !== 0)) {
        if (checkColumn[0] === checkColumn[1]) {
          checkColumn[2] === checkColumn[3]
            ? animationColumns[i].push(1, 1, 2)
            : animationColumns[i].push(1, 1, 1);
        } else {
          if (checkColumn[2] === checkColumn[3]) {
            animationColumns[i].push(0, 0, 1);
          } else if (checkColumn[1] === checkColumn[2]) {
            animationColumns[i].push(0, 1, 1);
          } else {
            animationColumns[i].push(0, 0, 0);
          }
        }
      } else if (checkColumn[0] !== 0 && checkColumn[0] === checkColumn[1]) {
        if (checkColumn[2] && !checkColumn[3]) {
          animationColumns[i].push(1, 1, 0);
        } else if (!checkColumn[2] && checkColumn[3]) {
          animationColumns[i].push(1, 0, 2);
        } else {
          animationColumns[i].push(1, 0, 0);
        }
      } else if (checkColumn[2] !== 0) {
        if (checkColumn[2] === checkColumn[0] && checkColumn[1] === 0) {
          checkColumn[3]
            ? animationColumns[i].push(0, 2, 2)
            : animationColumns[i].push(0, 2, 0);
        } else if (checkColumn[2] === checkColumn[1] && checkColumn[0] === 0) {
          checkColumn[3]
            ? animationColumns[i].push(1, 2, 2)
            : animationColumns[i].push(1, 2, 0);
        } else {
          checkColumn.reduce((_, current, index) => {
            if (current === 0) {
              animationColumns[i].push(0);
            } else {
              let moveCount = index;
              let blocker = false;
              for (let j = index - 1; j > -1; j--) {
                let num = checkColumn[j];
                if (num !== 0 && num !== current) {
                  blocker = true;
                  moveCount--;
                } else if (blocker && num === current) {
                  moveCount--;
                }
              }
              animationColumns[i].push(moveCount);
            }
          });
        }
      } else {
        checkColumn.reduce((_, current, index) => {
          if (current === 0) {
            animationColumns[i].push(0);
          } else {
            let moveCount = index;
            let blocker = false;
            for (let j = index - 1; j > -1; j--) {
              let num = checkColumn[j];
              if (num !== 0 && num !== current) {
                blocker = true;
                moveCount--;
              } else if (blocker && num === current) {
                moveCount--;
              }
            }
            animationColumns[i].push(moveCount);
          }
        });
      }
    }
    if (direction !== 'up') {
      animationColumns.forEach((column) => {
        column.reverse();
      });
    }
    for (let i = 0; i < 4; i++) {
      animationColumns.forEach((column) => {
        animationData.moves.push(column[i]);
      });
    }
  }
  function rowsMoveCheck(direction) {
    animationData.moves = [];
    animationRows = [[0], [0], [0], [0]];
    for (let i = 0; i < 4; i++) {
      const checkRow = direction === 'left' ? rows[i] : rows[i].reverse();
      if (checkRow.every((num) => num !== 0)) {
        if (checkRow[0] === checkRow[1]) {
          checkRow[2] === checkRow[3]
            ? animationRows[i].push(1, 1, 2)
            : animationRows[i].push(1, 1, 1);
        } else {
          if (checkRow[2] === checkRow[3]) {
            animationRows[i].push(0, 0, 1);
          } else if (checkRow[1] === checkRow[2]) {
            animationRows[i].push(0, 1, 1);
          } else {
            animationRows[i].push(0, 0, 0);
          }
        }
      } else if (checkRow[0] !== 0 && checkRow[0] === checkRow[1]) {
        if (checkRow[2] && !checkRow[3]) {
          animationRows[i].push(1, 1, 0);
        } else if (!checkRow[2] && checkRow[3]) {
          animationRows[i].push(1, 0, 2);
        } else {
          animationRows[i].push(1, 0, 0);
        }
      } else if (checkRow[2] !== 0) {
        if (checkRow[2] === checkRow[0] && checkRow[1] === 0) {
          checkRow[3]
            ? animationRows[i].push(0, 2, 2)
            : animationRows[i].push(0, 2, 0);
        } else if (checkRow[2] === checkRow[1] && checkRow[0] === 0) {
          checkRow[3]
            ? animationRows[i].push(1, 2, 2)
            : animationRows[i].push(1, 2, 0);
        } else {
          checkRow.reduce((_, current, index) => {
            if (current === 0) {
              animationRows[i].push(0);
            } else {
              let moveCount = index;
              let blocker = false;
              for (let j = index - 1; j > -1; j--) {
                let num = checkRow[j];
                if (num !== 0 && num !== current) {
                  blocker = true;
                  moveCount--;
                } else if (blocker && num === current) {
                  moveCount--;
                }
              }
              animationRows[i].push(moveCount);
            }
          });
        }
      } else {
        checkRow.reduce((_, current, index) => {
          if (current === 0) {
            animationRows[i].push(0);
          } else {
            let moveCount = index;
            let blocker = false;
            for (let j = index - 1; j > -1; j--) {
              let num = checkRow[j];
              if (num !== 0 && num !== current) {
                blocker = true;
                moveCount--;
              } else if (blocker && num === current) {
                moveCount--;
              }
            }
            animationRows[i].push(moveCount);
          }
        });
      }
    }
    if (direction !== 'left') {
      animationRows.forEach((row) => {
        row.reverse();
      });
    }
    animationRows.forEach((row) => {
      for (let i = 0; i < 4; i++) {
        animationData.moves.push(row[i]);
      }
    });
  }
  function fillBoard() {
    for (let i = 0; i < 16; i++) {
      let square = document.getElementById('sq-' + i);
      numberCheck(i, squares[i]);
      digitCheck(i, squares[i]);
      squares[i] === 0
        ? (square.innerHTML = '')
        : (square.innerHTML = squares[i]);
    }
  }
  // Creating operation arrays on horizontal and vertical moves
  function createOperationArrays() {
    const [firstRow, secondRow, thirdRow, fourthRow] = [[], [], [], []];
    const newRows = [];
    for (let i = 0; i < 16; i++) {
      if (i < 4) {
        firstRow.push(squares[i]);
      } else if (i < 8) {
        secondRow.push(squares[i]);
      } else if (i < 12) {
        thirdRow.push(squares[i]);
      } else {
        fourthRow.push(squares[i]);
      }
    }
    newRows.push(firstRow, secondRow, thirdRow, fourthRow);
    rows = newRows;
    const [firstColumn, secondColumn, thirdColumn, fourthColumn] = [
      [],
      [],
      [],
      [],
    ];
    const newColumns = [];
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        firstColumn.push(squares[i]);
      } else if (i % 4 === 1) {
        secondColumn.push(squares[i]);
      } else if (i % 4 === 2) {
        thirdColumn.push(squares[i]);
      } else {
        fourthColumn.push(squares[i]);
      }
    }
    newColumns.push(firstColumn, secondColumn, thirdColumn, fourthColumn);
    columns = newColumns;
  }
  function noMoveCheck(current, previous) {
    return current.every((num, index) => num === previous[index]);
  }
  function lastMoveCheck() {
    let checkedRowSquares = 0;
    let checkedColumnSquares = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (rows[i][j] === rows[i][j + 1]) {
          checkedRowSquares++;
        }
      }
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          if (columns[i][j] === columns[i][j + 1]) {
            checkedColumnSquares++;
          }
        }
      }
    }
    if (checkedRowSquares + checkedColumnSquares < 1 && !squares.includes(0)) {
      gameOver();
    } else if (!gameWon && squares.includes(2048)) {
      gameWin();
    }
  }
  function highScoreCheck() {
    if (gameScore > highScore) {
      highScore = gameScore;
      highScoreEl.innerHTML = highScore;

      // Passing high score data to local storage
      localStorage.setItem('stored-high-score', highScore);

      document.getElementById('game-over-score-title').style.display = 'none';
      document.getElementById('new-high-score-title').style.display = 'block';
    } else {
      document.getElementById('game-over-score-title').style.display = 'block';
      document.getElementById('new-high-score-title').style.display = 'none';
    }
  }
  // Win game
  function gameWin() {
    console.log('YOU WIN!');
    gameWon = true;
    document.getElementById('game-win-score').innerHTML = gameScore;
    document.getElementById('game-win-dialog').classList.add('dialog-fade-in');
    dialogOpen = true;
  }
  // Game over
  function gameOver() {
    console.log('GAME OVER');
    highScoreCheck();
    document.getElementById('game-over-score').innerHTML = gameScore;
    document.getElementById('game-over-dialog').classList.add('dialog-fade-in');
    dialogOpen = true;
  }
  // Close dialogs
  function closeGameWinDialog() {
    document
      .getElementById('game-win-dialog')
      .classList.remove('dialog-fade-in');
    document.getElementById('game-win-dialog').classList.add('dialog-fade-out');
    setTimeout(() => {
      document
        .getElementById('game-win-dialog')
        .classList.remove('dialog-fade-out');
    }, 500);
    dialogOpen = false;
  }
  function closeGameOverDialog() {
    document
      .getElementById('game-over-dialog')
      .classList.remove('dialog-fade-in');
    document
      .getElementById('game-over-dialog')
      .classList.add('dialog-fade-out');
    setTimeout(() => {
      document
        .getElementById('game-over-dialog')
        .classList.remove('dialog-fade-out');
    }, 500);
    dialogOpen = false;
  }
  // Reset game
  function resetGame() {
    gameScore = 0;
    animationData.newNumbers = [];
    fillGameScore();
    fillSquares();
    fillRandomSquare();
    fillRandomSquare();
    createOperationArrays();
    fillBoard();
    animateNew();
  }
  // Move direction controller
  document.addEventListener('keyup', controlArrows);
  document.addEventListener('keydown', cancelKeyScroll, false);
  function cancelKeyScroll(x) {
    let arrowKeys = [37, 38, 39, 40]
    if (arrowKeys.includes(x.keyCode)) {
      x.preventDefault();
      return false;
    }
  }  
  function controlArrows(x) {
    if (!dialogOpen && x.keyCode === 38) {
      x.preventDefault();
      moveUp();
    } else if (!dialogOpen && x.keyCode === 40) {
      x.preventDefault();
      moveDown();
    } else if (!dialogOpen && x.keyCode === 37) {
      x.preventDefault();
      moveLeft();
    } else if (!dialogOpen && x.keyCode === 39) {
      x.preventDefault();
      moveRight();
    }
  }
  function moveUp() {
    let orderedColumns = [];
    for (let i = 0; i < 4; i++) {
      let nums = [];
      let zeros = [];
      for (let j = 0; j < 4; j++) {
        columns[i][j] ? nums.push(columns[i][j]) : zeros.push(columns[i][j]);
      }
      let newColumn = nums.concat(zeros);
      orderedColumns.push(newColumn);
    }
    animationData.popUps = [];
    animationData.newNumbers = [];

    let animationColumns = [[], [], [], []];
    let mergedColumns = [];
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedColumns[i].every((num) => num !== 0) &&
        orderedColumns[i][0] === orderedColumns[i][1] &&
        orderedColumns[i][2] === orderedColumns[i][3]
      ) {
        animationColumns[i] = [1, 1, 0, 0];
        moveScore += ((orderedColumns[i][0] + orderedColumns[i][2]) * 2);
        orderedColumns[i][0] *= 2;
        orderedColumns[i][1] = orderedColumns[i][2] * 2;
        orderedColumns[i][2] = 0;
        orderedColumns[i][3] = 0;
      } else {
        for (let j = 0; j < 3; j++) {
          let firstNum = orderedColumns[i][j];
          let secondNum = orderedColumns[i][j + 1];
          if (firstNum !== 0) {
            if (secondNum === firstNum) {
              moveScore += (firstNum * 2);
              orderedColumns[i][j] = firstNum + secondNum;
              orderedColumns[i][j + 1] = 0;
              animationColumns[i].push(1);
            } else if (secondNum === 0) {
              animationColumns[i].push(0);
            } else if (secondNum !== 0 && secondNum !== firstNum) {
              animationColumns[i].push(0);
            }
          } else {
            if (secondNum !== 0) {
              orderedColumns[i][j] = secondNum;
              orderedColumns[i][j + 1] = 0;
              animationColumns[i].push(0);
            } else {
              animationColumns[i].push(0);
            }
          }
        }
      }
      if (animationColumns[i].length < 4) {
        animationColumns[i].push(0);
      }
    }
    mergedColumns = orderedColumns;
    for (let i = 0; i < 4; i++) {
      animationColumns.forEach((column) => {
        animationData.popUps.push(column[i]);
      });
    }

    let mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][0]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][1]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][2]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][3]);
    }
    if (!noMoveCheck(mergedSquares, squares)) {
      squares = mergedSquares;
      gameScore += moveScore;

      columnsMoveCheck('up');
      animateMove('up');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
        animatePopUp();
        animateNew();
      }, waitTime);
    }
  }
  function moveDown() {
    let orderedColumns = [];
    for (let i = 0; i < 4; i++) {
      let nums = [];
      let zeros = [];
      for (let j = 0; j < 4; j++) {
        columns[i][j] ? nums.push(columns[i][j]) : zeros.push(columns[i][j]);
      }
      let newColumn = zeros.concat(nums);
      orderedColumns.push(newColumn);
    }
    animationData.popUps = [];
    animationData.newNumbers = [];

    let animationColumns = [[], [], [], []];
    let mergedColumns = [];
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedColumns[i].every((num) => num !== 0) &&
        orderedColumns[i][0] === orderedColumns[i][1] &&
        orderedColumns[i][2] === orderedColumns[i][3]
      ) {
        animationColumns[i] = [0, 0, 1, 1];
        moveScore += ((orderedColumns[i][0] + orderedColumns[i][2])* 2);
        orderedColumns[i][3] *= 2;
        orderedColumns[i][2] = orderedColumns[i][1] * 2;
        orderedColumns[i][1] = 0;
        orderedColumns[i][0] = 0;
      } else {
        for (let j = 3; j > 0; j--) {
          let firstNum = orderedColumns[i][j];
          let secondNum = orderedColumns[i][j - 1];
          if (firstNum !== 0) {
            if (secondNum === firstNum) {
              moveScore += (firstNum * 2);
              orderedColumns[i][j] = firstNum + secondNum;
              orderedColumns[i][j - 1] = 0;
              animationColumns[i].unshift(1);
            } else if (secondNum === 0) {
              animationColumns[i].unshift(0);
            } else if (secondNum !== 0 && secondNum !== firstNum) {
              animationColumns[i].unshift(0);
            }
          } else {
            if (secondNum !== 0) {
              orderedColumns[i][j] = secondNum;
              orderedColumns[i][j - 1] = 0;
              animationColumns[i].unshift(0);
            } else {
              animationColumns[i].unshift(0);
            }
          }
        }
      }
      if (animationColumns[i].length < 4) {
        animationColumns[i].unshift(0);
      }
    }
    mergedColumns = orderedColumns;
    for (let i = 0; i < 4; i++) {
      animationColumns.forEach((column) => {
        animationData.popUps.push(column[i]);
      });
    }
    let mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][0]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][1]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][2]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][3]);
    }
    if (!noMoveCheck(mergedSquares, squares)) {
      squares = mergedSquares;
      gameScore += moveScore;

      columnsMoveCheck('down');
      animateMove('down');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
        animatePopUp();
        animateNew();
      }, waitTime);
    }
  }
  function moveRight() {
    let orderedRows = [];
    for (let i = 0; i < 4; i++) {
      let nums = [];
      let zeros = [];
      for (let j = 0; j < 4; j++) {
        rows[i][j] ? nums.push(rows[i][j]) : zeros.push(rows[i][j]);
      }
      let newRow = zeros.concat(nums);
      orderedRows.push(newRow);
    }
    animationData.popUps = [];
    animationData.newNumbers = [];

    let animationRows = [[], [], [], []];
    let mergedRows = [];
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedRows[i].every((num) => num !== 0) &&
        orderedRows[i][0] === orderedRows[i][1] &&
        orderedRows[i][2] === orderedRows[i][3]
      ) {
        animationRows[i] = [0, 0, 1, 1];
        moveScore += (orderedRows[i][0] + orderedRows[i][2]) * 2;
        orderedRows[i][3] *= 2;
        orderedRows[i][2] = orderedRows[i][1] * 2;
        orderedRows[i][1] = 0;
        orderedRows[i][0] = 0;
      } else {
        for (let j = 3; j > 0; j--) {
          let firstNum = orderedRows[i][j];
          let secondNum = orderedRows[i][j - 1];
          if (firstNum !== 0) {
            if (secondNum === firstNum) {
              moveScore += firstNum * 2;
              orderedRows[i][j] = firstNum + secondNum;
              orderedRows[i][j - 1] = 0;
              animationRows[i].unshift(1);
            } else if (secondNum === 0) {
              animationRows[i].unshift(0);
            } else if (secondNum !== 0 && secondNum !== firstNum) {
              animationRows[i].unshift(0);
            }
          } else {
            if (secondNum !== 0) {
              orderedRows[i][j] = secondNum;
              orderedRows[i][j - 1] = 0;
              animationRows[i].unshift(0);
            } else {
              animationRows[i].unshift(0);
            }
          }
        }
      }
      if (animationRows[i].length < 4) {
        animationRows[i].unshift(0);
      }
    }
    mergedRows = orderedRows;
    animationRows.forEach((row) => {
      for (let i = 0; i < 4; i++) {
        animationData.popUps.push(row[i]);
      }
    });

    let mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[0][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[1][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[2][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[3][i]);
    }
    if (!noMoveCheck(mergedSquares, squares)) {
      squares = mergedSquares;
      gameScore += moveScore;

      rowsMoveCheck('right');
      animateMove('right');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
        animatePopUp();
        animateNew();
      }, waitTime);
    }
  }
  function moveLeft() {
    let orderedRows = [];
    for (let i = 0; i < 4; i++) {
      let nums = [];
      let zeros = [];
      for (let j = 0; j < 4; j++) {
        rows[i][j] ? nums.push(rows[i][j]) : zeros.push(rows[i][j]);
      }
      let newRow = nums.concat(zeros);
      orderedRows.push(newRow);
    }
    animationData.popUps = [];
    animationData.newNumbers = [];

    let animationRows = [[], [], [], []];
    let mergedRows = [];
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedRows[i].every((num) => num !== 0) &&
        orderedRows[i][0] === orderedRows[i][1] &&
        orderedRows[i][2] === orderedRows[i][3]
      ) {
        animationRows[i] = [1, 1, 0, 0];
        moveScore += (orderedRows[i][0] + orderedRows[i][2]) * 2;
        orderedRows[i][0] *= 2;
        orderedRows[i][1] = orderedRows[i][2] * 2;
        orderedRows[i][2] = 0;
        orderedRows[i][3] = 0;
      } else {
        for (let j = 0; j < 3; j++) {
          let firstNum = orderedRows[i][j];
          let secondNum = orderedRows[i][j + 1];
          if (firstNum !== 0) {
            if (secondNum === firstNum) {
              moveScore += firstNum * 2;
              orderedRows[i][j] = firstNum + secondNum;
              orderedRows[i][j + 1] = 0;
              animationRows[i].push(1);
            } else if (secondNum === 0) {
              animationRows[i].push(0);
            } else if (secondNum !== 0 && secondNum !== firstNum) {
              animationRows[i].push(0);
            }
          } else {
            if (secondNum !== 0) {
              orderedRows[i][j] = secondNum;
              orderedRows[i][j + 1] = 0;
              animationRows[i].push(0);
            } else {
              animationRows[i].push(0);
            }
          }
        }
      }
      if (animationRows[i].length < 4) {
        animationRows[i].push(0);
      }
    }
    mergedRows = orderedRows;
    animationRows.forEach((row) => {
      for (let i = 0; i < 4; i++) {
        animationData.popUps.push(row[i]);
      }
    });

    let mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[0][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[1][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[2][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[3][i]);
    }
    if (!noMoveCheck(mergedSquares, squares)) {
      squares = mergedSquares;
      gameScore += moveScore;

      rowsMoveCheck('left');
      animateMove('left');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
        animatePopUp();
        animateNew();
      }, waitTime);
    }
  }
  function animateMove(direction) {
    for (let i = 0; i < 16; i++) {
      let square = document.getElementById('sq-' + i);
      square.classList.remove('new-number', 'pop-up');
      if (animationData.moves[i] && direction === 'up') {
        square.classList.add('move-index');
        square.classList.add(`move-up-${animationData.moves[i]}`);
      } else if (animationData.moves[i] && direction === 'down') {
        square.classList.add('move-index');
        square.classList.add(`move-down-${animationData.moves[i]}`);
      } else if (animationData.moves[i] && direction === 'right') {
        square.classList.remove('new-number');
        square.classList.add('move-index');
        square.classList.add(`move-right-${animationData.moves[i]}`);
      } else if (animationData.moves[i] && direction === 'left') {
        square.classList.remove('new-number');
        square.classList.add('move-index');
        square.classList.add(`move-left-${animationData.moves[i]}`);
      }
    }
  }
  function animatePopUp() {
    for (let i = 0; i < 16; i++) {
      if (animationData.popUps[i]) {
        let square = document.getElementById('sq-' + i);
        square.classList.add('pop-up');
      }
    }
  }
  function animateNew() {
    animationData.newNumbers.forEach((num) =>
      document.getElementById('sq-' + num).classList.add('new-number')
    );
  }
});
