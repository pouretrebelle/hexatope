import Vector2 from 'utils/Vector2';
import settings from 'system/settings';

export const drawHexagon = (c, pixelPos, pixelRatio) => {
  // draws hexagon with the center pixelPos
  const hexRadius = settings.hexRadius * pixelRatio;
  const hexMargin = settings.hexMargin * pixelRatio;
  c.save();
  c.translate(pixelPos.x * pixelRatio, pixelPos.y * pixelRatio);
  c.beginPath();
  for (let i = 0; i < 6; i++) {
    c.lineTo((hexRadius - hexMargin / 2) * Math.cos(i * Math.PI / 3), (hexRadius - hexMargin / 2) * Math.sin(i * Math.PI / 3));
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
  let pos = new Vector2(offset * settings.hexDoubleLineOffset * settings.hexRadius / 2, -halfHexHeight);
  pos.rotate(i * Math.PI / 3);
  return pos;
};

// following functions use a cheeky formula for estimating a circle arc with cubic beziers
// magnitude of control point as perpendicular to radius =
// (4 / 3) * Math.tan(Math.PI / 2n)
// where n is the amount of segments of the circle

export const getControlMagnitudeAdjacent = (offset) => (
  // the magnitude of the control point for 1/3rd of a circle, give or take offset
  4 / 9 * Math.sqrt(3) * ((settings.hexRadius * (1 - offset * settings.hexDoubleLineOffset)) / 2)
);

export const getControlMagnitudeWide = (offset) => (
  // the magnitude of the control point for 1/6th of a circle, give or take offset
  (8 - 4 * Math.sqrt(3)) / 3 * ((settings.hexRadius * (3 - offset * settings.hexDoubleLineOffset)) / 2)
);
