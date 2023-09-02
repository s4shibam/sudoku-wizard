// Algorithm to solve Sudoku Game

// Check validity of board for each result
async function isValid(board, row, col, char) {
  for (let i = 0; i < 9; i++) {
    // row
    if (board[row][i] == char) return false;

    // column
    if (board[i][col] == char) return false;

    if (
      board[3 * Math.floor(row / 3) + Math.floor(i / 3)][
        3 * Math.floor(col / 3) + (i % 3)
      ] == char
    )
      return false;
  }
  return true;
}

// Algorithm to solve the board
async function solveSudoku(board, delay) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Cell is blank
      if (board[row][col] == '.') {
        // Explore all possibilities
        for (let char = '1'; char <= '9'; char++) {
          // Check validity of the board for each possibility
          if (await isValid(board, row, col, char)) {
            // Sleep or delay
            await new Promise((r) => setTimeout(r, delay));

            // Put value on board
            const cellId = row + '/' + col;
            const cell = document.getElementById(cellId);
            cell.innerText = char;
            board[row][col] = char;

            // Check validity further
            if (await solveSudoku(board, delay)) return true;
            else {
              // Sleep or delay if visualization is true
              await new Promise((r) => setTimeout(r, delay));
              // Remove value from board
              cell.innerText = '';
              board[row][col] = '.';
            }
          }
        }

        return false;
      }
    }
  }
  return true;
}

export { solveSudoku };
