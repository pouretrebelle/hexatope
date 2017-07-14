import Vector2 from 'utils/Vector2';
import settings from 'system/settings';

export const drawHexagon = (c, pixelPos) => {
  // draws hexagon with the center pixelPos
  c.save();
  c.translate(pixelPos.x, pixelPos.y);
  c.beginPath();
  for (let i = 0; i < 6; i++) {
    c.lineTo((settings.hexRadius - settings.hexMargin / 2) * Math.cos(i * Math.PI / 3), (settings.hexRadius - settings.hexMargin / 2) * Math.sin(i * Math.PI / 3));
  }
  c.closePath();
  c.fill();
  c.restore();
};

export const getEdgePos = (i, offset) => {
  // return position of this edge of the hexagon
  // if (offset == 1) clockwise from middle edge
  // if (offset == 0) middle of edge
  // if (offset == -1) anti-clockwise from middle edge
  const halfHexHeight = (settings.hexRadius * Math.sqrt(3) / 2);
  let pos = new Vector2(offset * settings.hexDoubleLineOffset * 0.5, -halfHexHeight);
  pos.rotate(i * Math.PI / 3);
  return pos;
};
