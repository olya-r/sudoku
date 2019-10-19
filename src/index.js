module.exports = function solveSudoku(matrix) {

  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const rows = [];
  const columns = [];
  const blocks = [];
  const candidates = [[], [], [], [], [], [], [], [], []];

  if (!init()) {
    return result(false);
  }

  return result(solve());

  function init() {
    for (let i = 0; i < 9; i++) {
      rows[i] = new Set(DIGITS);
      columns[i] = new Set(DIGITS);
      blocks[i] = new Set(DIGITS);
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const k = blockIndex(i, j);
        const value = matrix[i][j];
        if (value) {
          rows[i].delete(value);
          columns[j].delete(value);
          blocks[k].delete(value);
        }
      }
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const k = blockIndex(i, j);
        const value = matrix[i][j];
        if (!value) {
          const values = new Set;
          for (let value of rows[i]) {
            if (columns[j].has(value) && blocks[k].has(value)) {
              values.add(value);
            }
          }
          if (values.size == 0) {
            return false;
          }
          candidates[i][j] = values;
        }
      }
    }
    return true;
  }

  function blockIndex(i, j) {
    return Math.floor(i / 3) * 3 + Math.floor(j / 3);
  }

  function result(solved) {
    if (solved) {
      return matrix;
    }
    else {
      throw new Error('Нет решений!');
    }
  }

  function solve() {
    const candidate = getCandidate();
    if (!candidate) {
      return true;
    }

    for (let value of candidate.values) {
      update(candidate.i, candidate.j, value);
      if (solve()) {
        return true;
      }
    }

    update(candidate.i, candidate.j, 0);
    return false;
  }

  function getCandidate() {
    let found = false;
    let min_i;
    let min_j;
    let min_values;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (matrix[i][j]) {
          continue;
        }
        const values = candidates[i][j];
        if (!found || values.size < min_values.size) {
          found = true;
          min_i = i;
          min_j = j;
          min_values = values;
        }
      }
    }
    return found ? {i: min_i, j: min_j, values: min_values} : null;
  }

  function update(i, j, value) {
    const k = blockIndex(i, j);
    const oldValue = matrix[i][j];
    matrix[i][j] = value;
    if (oldValue) {
      rows[i].add(oldValue);
      columns[j].add(oldValue);
      blocks[k].add(oldValue);
    }
    if (value) {
      rows[i].delete(value);
      columns[j].delete(value);
      blocks[k].delete(value);
    }
    for (let ii = 0; ii < 9; ii++) {
      for (let jj = 0; jj < 9; jj++) {
        const kk = blockIndex(ii, jj);
        if (ii != i && jj != j && kk != k) {
          continue;
        }
        const val = matrix[ii][jj];
        if (!val) {
          const values = candidates[ii][jj];
          values.delete(value);
          for (let value of rows[ii]) {
            if (columns[jj].has(value) && blocks[kk].has(value)) {
              values.add(value);
            }
          }
        }
      }
    }
  }

  // your solution
}
