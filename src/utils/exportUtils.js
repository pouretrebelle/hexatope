export const exportDesignData = ({ hexagons, columns, rows }) => {
  let grid = [];

  for (let x = 0; x < columns; x++) {
    grid.push([]);
    for (let y = 0; y < rows; y++) {
      let hexagon = hexagons[x][y];
      hexagon = {
        active: hexagon.active,
        layoutSeed: hexagon.layoutSeed,
      };
      grid[x][y] = hexagon;
    }
  }

  grid = removeUnusedColumns(grid);
  grid = removeUnusedRows(grid);

  return grid;
};

const removeUnusedColumns = (grid) => (
  // add up the active values of each column
  // filter out if they add up to 0
  grid.filter(column => (
    column.reduce((sum, value) => sum + value.active, 0) > 0
  ))
);

const removeUnusedRows = (grid) => {
  // rows need to be removed in pairs
  // because the odd ones are offset

  // loop through rows from the top and remove them
  let activeTotal = 0;
  while (activeTotal == 0) {
    grid.forEach(column => {
      activeTotal += column[0].active;
      activeTotal += column[1].active;
    });

    if (!activeTotal) grid = grid.map(column => column.slice(2));
  }

  // loop through rows from the bottom and remove them
  activeTotal = 0;
  while (activeTotal == 0) {
    const rows = grid[0].length;
    grid.forEach(column => {
      activeTotal += column[rows-1].active;
      activeTotal += column[rows-2].active;
    });

    if (!activeTotal) grid = grid.map(column => column.slice(0, rows-2));
  }

  return grid;
};
