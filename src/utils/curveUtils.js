export const matchCurves = (curves) => {
  curves.forEach((primary) => {

    const primaryPos1 = primary.pos1.plusNew(primary.hexagonPosition);
    const primaryPos2 = primary.pos2.plusNew(primary.hexagonPosition);

    curves.forEach((compare) => {
      // move on if it's the same curve
      if (primary == compare) return;

      const comparePos1 = compare.pos1.plusNew(compare.hexagonPosition);
      const comparePos2 = compare.pos2.plusNew(compare.hexagonPosition);

      // if matching is it an extension or aligner
      const internal = (primary.hexagonPosition == compare.hexagonPosition);

      if (primaryPos1.dist(comparePos1) < 0.001) {
        addCurveToCurve(primary, compare, 1, 1, internal);
      }
      else if (primaryPos1.dist(comparePos2) < 0.001) {
        addCurveToCurve(primary, compare, 1, 2, internal);
      }
      else if (primaryPos2.dist(comparePos1) < 0.001) {
        addCurveToCurve(primary, compare, 2, 1, internal);
      }
      else if (primaryPos2.dist(comparePos2) < 0.001) {
        addCurveToCurve(primary, compare, 2, 2, internal);
      }
    });
  });

  return curves;
};

const addCurveToCurve = (primary, compare, primaryEnd, compareEnd, internal) => {
  // add new curve and end to appropriate property
  primary[`pos${primaryEnd}${internal ? 'Aligners' : 'Extensions'}`].push({
    curve: compare,
    end: compareEnd,
  });
};

export const getPushDepth = (layout, i) => {
  let depth = 0;
  if (layout.pushUp && layout.pushUp.indexOf(i) >= 0) {
    depth = 1;
  }
  if (layout.pushDown && layout.pushDown.indexOf(i) >= 0) {
    depth = -1;
  }

  return depth;
};

export const getForceDepth = (layout, i) => {
  let depth = 0;
  if (layout.forceUp && layout.forceUp.indexOf(i) >= 0) {
    depth = 1;
  }
  if (layout.forceDown && layout.forceDown.indexOf(i) >= 0) {
    depth = -1;
  }

  return depth;
};
