export const matchCurves = (curves) => {

  curves.forEach((primary) => {

    // cap positions don't include hexagon position so we need to add it
    const primaryStartPos = primary.start.pos.plusNew(primary.hexagonPosition);
    const primaryEndPos = primary.end.pos.plusNew(primary.hexagonPosition);

    curves.forEach((compare) => {
      // move on if it's the same curve
      if (primary == compare) return;

      const compareStartPos = compare.start.pos.plusNew(compare.hexagonPosition);
      const compareEndPos = compare.end.pos.plusNew(compare.hexagonPosition);

      // if inernal it's an aligner and not an extender
      const internal = (primary.hexagonPosition == compare.hexagonPosition);

      if (primaryStartPos.dist(compareStartPos) < 0.001) {
        addCurveToCurve(primary, compare, 1, 1, internal);
      }
      else if (primaryStartPos.dist(compareEndPos) < 0.001) {
        addCurveToCurve(primary, compare, 1, 2, internal);
      }
      else if (primaryEndPos.dist(compareStartPos) < 0.001) {
        addCurveToCurve(primary, compare, 2, 1, internal);
      }
      else if (primaryEndPos.dist(compareEndPos) < 0.001) {
        addCurveToCurve(primary, compare, 2, 2, internal);
      }
    });
  });

  return curves;
};

const addCurveToCurve = (primary, compare, primaryEnd, compareEnd, internal) => {
  // add new curve cap to appropriate property
  primary[(primaryEnd === 1) ? 'start' : 'end'][internal ? 'aligners' : 'extenders'].push(
    compare[(compareEnd === 1) ? 'start' : 'end']
  );
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

export const configureDepth = (curves => {
  let caps = [];
  curves.forEach(curve => {
    caps.push(curve.start, curve.end);
  });

  averageCapDepth(caps);
  smoothCurves(caps, 0.5);
  smoothCurves(caps, 0.3);
  // re-average them
  averageCapDepth(caps);
  cofigureControlPointDepth(caps);

  return curves;
});

const averageCapDepth = (caps) => {
  let capGroups = groupCaps(caps);
  capGroups.forEach(caps => {
    // sum up the depth of all of the caps in the group and divide by quantity
    const depthOverlap = caps.reduce((sum, cap) => (
      sum + cap.depthOverlap
    ), 0) / caps.length;
    const depthCurvature = caps.reduce((sum, cap) => (
      sum + cap.depthCurvature
    ), 0) / caps.length;

    // set the depth for each cap
    caps.forEach(cap => cap.setDepthOverlap(depthOverlap));
    caps.forEach(cap => cap.setDepthCurvature(depthCurvature));
  });
};

const smoothCurves = (caps, smoothDegree) => {

  caps.forEach(cap => {
    // get depth of other end of the curve
    const alignEndDepthOverlap = cap.getOppositeCap().depthOverlap;
    const alignEndDepthCurvature = cap.getOppositeCap().depthCurvature;

    // get average depth of other end of all extenders
    const hasExtenders = !!cap.extenders.length;
    const extenderEndDepthOverlaps = cap.extenders.map(ext => ext.getOppositeCap().depthOverlap);
    const extenderEndDepthOverlapTotal = extenderEndDepthOverlaps.reduce((a, b) => (a + b), 0);
    let extenderEndDepthOverlapAverage = hasExtenders ? extenderEndDepthOverlapTotal / extenderEndDepthOverlaps.length : 0;

    const extenderEndDepthCurvatures = cap.extenders.map(ext => ext.getOppositeCap().depthCurvature);
    const extenderEndDepthCurvatureTotal = extenderEndDepthCurvatures.reduce((a, b) => (a + b), 0);
    let extenderEndDepthCurvatureAverage = hasExtenders ? extenderEndDepthCurvatureTotal / extenderEndDepthCurvatures.length : 0;

    // tweak depth using the smooth degree
    // if there aren't extenders use more of the original
    cap.nextDepthOverlap = hasExtenders ?
      (0.5 * smoothDegree) * (alignEndDepthOverlap + extenderEndDepthOverlapAverage) + (1 - smoothDegree) * cap.depthOverlap
      :
      (0.5 * smoothDegree * alignEndDepthOverlap) + (1 - smoothDegree * 0.5) * cap.depthOverlap;
    cap.nextDepthCurvature = hasExtenders ?
      (0.5 * smoothDegree) * (alignEndDepthCurvature + extenderEndDepthCurvatureAverage) + (1 - smoothDegree) * cap.depthCurvature
      :
      (0.5 * smoothDegree * alignEndDepthCurvature) + (1 - smoothDegree * 0.5) * cap.depthCurvature;
  });

  // update real depth after all have been morphed
  caps.forEach(cap => {
    cap.setDepthOverlap(cap.nextDepthOverlap);
    cap.setDepthCurvature(cap.nextDepthCurvature);
    delete cap.nextDepthOverlap;
    delete cap.nextDepthCurvature;
  });
};

const cofigureControlPointDepth = (caps) => {
  // group caps by groups of aligners
  let capGroups = groupCaps(caps);
  capGroups = capGroups.map(splitCapGroup);

  capGroups.forEach(group => {
    const firstGroup = group[0];
    const secondGroup = group[1];
    let groupOverlapAngleAverages = [0, 0];
    let groupCurvatureAngleAverages = [0, 0];

    // increment the groupDepth by the position of the other end of the curve
    const addDepthToGroup = (groupIndex, cap) => {
      groupOverlapAngleAverages[groupIndex] += cap.getOverlapAngleToOppositeCap();
      groupCurvatureAngleAverages[groupIndex] += cap.getCurvatureAngleToOppositeCap();
    };
    firstGroup.forEach(cap => addDepthToGroup(0, cap));
    secondGroup.forEach(cap => addDepthToGroup(1, cap));

    // divide each depth by the amount of caps that have incremented it
    // if there are no caps in that group or the result is NaN
    // return the current depth
    groupOverlapAngleAverages.forEach((depth, i) => (
      (!depth) ? 0 : depth / group[i].length
    ));
    groupOverlapAngleAverages.forEach((depth, i) => (
      (!depth) ? 0 : depth / group[i].length
    ));

    const firstOverlapAngle = (groupOverlapAngleAverages[0] - groupOverlapAngleAverages[1]) / 2;
    const secondOverlapAngle = (groupOverlapAngleAverages[1] - groupOverlapAngleAverages[0]) / 2;
    const firstCurvatureAngle = (groupCurvatureAngleAverages[0] - groupCurvatureAngleAverages[1]) / 2;
    const secondCurvatureAngle = (groupCurvatureAngleAverages[1] - groupCurvatureAngleAverages[0]) / 2;
    firstGroup.forEach(cap => {
      cap.angleControlPos(firstOverlapAngle, firstCurvatureAngle);
    });
    secondGroup.forEach(cap => {
      cap.angleControlPos(secondOverlapAngle, secondCurvatureAngle);
    });
  });
};


// takes an array of caps and returns them grouped by position
const groupCaps = (caps) => {
  let capGroups = [];

  // add bool to cap so they're not added more than once
  caps.map(cap => {
    cap.hasBeenGrouped = false;

    return cap;
  });

  caps.forEach(cap => {
    // return if it's already been added
    if (cap.hasBeenGrouped) return;

    // make array of this and all extenders and aligners
    let capGroup = [cap];
    cap.extenders.forEach(ext => {
      capGroup.push(ext);
      ext.hasBeenGrouped = true;
    });
    cap.aligners.forEach(align => {
      capGroup.push(align);
      align.hasBeenGrouped = true;
    });

    cap.hasBeenGrouped = true;
    capGroups.push(capGroup);
  });

  // remove bool from object so we aren't storeing it anymore
  caps.map(cap => {
    delete cap.hasBeenGrouped;

    return cap;
  });

  return capGroups;
};

// splits cap group by which hex they're in
const splitCapGroup = (caps) => {
  let groups = [[], []];

  // get the hexagon of the first cap
  // we compare the rest of the caps to it
  const firstHex = caps[0].curve.hexagon;

  caps.forEach(cap => {
    if (cap.curve.hexagon == firstHex) {
      groups[0].push(cap);
    }
    else {
      groups[1].push(cap);
    }
  });

  return groups;
};


// takes an array of curves that have already been matched
// and reduce it to the curves that are part of the largest contiguous shape
export const isolateLargestShape = (curves) => {
  let groups = [];
  let currentGroupIndex = 0;

  // recursive loop from starting curve
  const triggerCurve = (curve, currentGroup) => {
    // if it's already been touched recursivity will have happened already
    if (curve.touched) return;

    // set property so we know if it's been touched before
    curve.touched = true;

    // add curve to current group
    currentGroup.push(curve);

    // all of the curves that join onto this one
    const tryContinuingFrom = [
      curve.start.aligners,
      curve.start.extenders,
      curve.end.aligners,
      curve.end.extenders,
    ];

    // trigger each curve that is attached to aligner or extender caps on start and end
    tryContinuingFrom.forEach(attempt => {
      attempt.forEach(cap => triggerCurve(cap.curve, currentGroup));
    });
  };

  // start at zero, why not
  let startCurve = curves[0];
  while (startCurve) {
    // initialise group as empty array
    groups[currentGroupIndex] = [];

    // recursively trigger that whole group
    triggerCurve(startCurve, groups[currentGroupIndex]);
    currentGroupIndex++;

    // get untouched curves
    const filteredCurves = curves.filter(curve => !curve.touched);
    // setting startCurve to undefined will break the while loop
    startCurve = filteredCurves.length ? filteredCurves[0] : undefined;
  }

  // remove touched key to avoid object bloat
  curves.forEach(curve => delete curve.touched);

  // find the biggest group
  let biggestGroup = [];
  groups.forEach(group => {
    biggestGroup = (biggestGroup.length < group.length) ? group : biggestGroup;
  });

  return biggestGroup;
};


// takes array of curves and central point and returns the curve that's closest to the center
export const findMostCentralCurve = (curves, center) => {
  let closestDistance = Infinity;
  let centralCurve = undefined;

  curves.forEach(curve => {
    // math the distance between the center of the box and the start of each curve
    const dist = Math.sqrt(
      Math.pow((center.x - (curve.hexagonPosition.x + curve.start.pos.x + curve.end.pos.x)), 2)
      +
      Math.pow((center.y + (curve.hexagonPosition.y + curve.start.pos.y + curve.end.pos.y)), 2)
    );
    if (dist < closestDistance) {
      closestDistance = dist;
      centralCurve = curve;
    }
  });

  return centralCurve;
};


export const getTotalLength = (curves) => {
  return curves.map(curve => curve.estLength).reduce((sum, value) => (sum + value), 1);
};
