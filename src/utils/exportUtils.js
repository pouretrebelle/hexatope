import { roundToDecimalPlace } from 'utils/numberUtils';
import SettingsStore from 'stores/SettingsStore';

export const exportDesignData = (system) => {
  return {
    settings: SettingsStore.exportSettings,
    canvas: exportCanvasData(system),
  };
};

export const exportCanvasData = ({ hexagons, columns, rows }) => {
  let grid = [];

  for (let x = 0; x < columns; x++) {
    grid.push([]);
    for (let y = 0; y < rows; y++) {
      const hexagon = hexagons[x][y];
      let newHexagonData = hexagon.active ? [
        hexagon.active,
        roundToDecimalPlace(hexagon.layoutSeed, 3),
      ] : false;
      grid[x][y] = newHexagonData;
    }
  }

  grid = removeUnusedColumns(grid);
  grid = removeUnusedRows(grid);

  return grid;
};

const removeUnusedColumns = (grid) => (
  // filter out columns that are all false
  grid.filter(column => (
    column.filter(value => !!value).length
  ))
);

const removeUnusedRows = (grid) => {
  // rows need to be removed in pairs
  // because the odd ones are offset

  // loop through rows from the top and remove them
  let triggerTripped = false;
  while (!triggerTripped) {
    grid.forEach(column => {
      if (column[0] || column[1]) triggerTripped = true;
    });

    if (!triggerTripped) grid = grid.map(column => column.slice(2));
  }

  // loop through rows from the bottom and remove them
  triggerTripped = false;
  while (!triggerTripped) {
    const rows = grid[0].length;
    grid.forEach(column => {
      if (column[rows-1] || column[rows-2]) triggerTripped = true;
    });

    if (!triggerTripped) grid = grid.map(column => column.slice(0, rows-2));
  }

  return grid;
};
