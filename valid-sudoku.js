// Algorithm to check if the given sudoku board is valid or not
function isValidSudoku(board) {
    const row = new Set();
    const col = new Set();
    const block = new Set();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == ".") continue;

            let r = i * 10 + board[i][j];
            let c = j * 10 + board[i][j];
            let b =
                (3 * Math.floor(i / 3) + Math.floor(j / 3)) * 10 + board[i][j];

            if (row.has(r) || col.has(c) || block.has(b)) return false;

            row.add(r);
            col.add(c);
            block.add(b);
        }
    }

    return true;
}

export { isValidSudoku };
