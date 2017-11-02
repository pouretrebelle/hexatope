import exampleDesigns from 'constants/exampleDesigns';
import { randomInteger } from 'utils/numberUtils';

export const getRandomExampleDesign = () => (
  exampleDesigns[randomInteger(exampleDesigns.length - 1)]
);

export const importDesignData = ({ hexagons, columns, rows, ...system }, json) => {
  if (!json) return;

  // clear grid
  system.clearHexagons();

  // find position inside grid
  const importColumns = json.length;
  const importRows = json[0].length;

  // column offset is easy
  const columnOffset = (columns > importColumns) ? Math.floor((columns - importColumns) / 2) : 0;

  // row offset has to be divisble by 0 because they come in pairs
  const rowOffset = (rows > importRows) ? Math.floor((rows - importRows) / 4) * 2 : 0;

  // set data with offset
  for (let x = 0; x < importColumns; x++) {
    for (let y = 0; y < importRows; y++) {
      const hexagonData = json[x][y];
      // ignore if data is false (empty hexagon)
      // or if off the grid
      if (hexagonData && hexagons[x + columnOffset] && hexagons[x + columnOffset][y + rowOffset]) {
        const hexagonTarget = hexagons[x + columnOffset][y + rowOffset];
        // set the active and next active so it doesn't reset the layout seed
        hexagonTarget.active = hexagonData[0];
        hexagonTarget.nextActive = hexagonData[0];
        // set the initial seed as well so it doesn't show it ghosted like in edit mode
        hexagonTarget.layoutSeed = hexagonData[1];
        hexagonTarget.initialLayoutSeed = hexagonData[1];
      }
    }
  }

  // force canvas draw
  system.curvesHaveChanged();
  system.updateHexagons();
  system.canvas.draw();
};
