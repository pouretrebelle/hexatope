export const matchCurves = (curves) => {

  curves.forEach((primary) => {

    // cap positions don't include hexagon position so we need to add it
    const primaryStartPos = primary.start.capPos.plusNew(primary.hexagonPosition);
    const primaryEndPos = primary.end.capPos.plusNew(primary.hexagonPosition);

    curves.forEach((compare) => {
      // move on if it's the same curve
      if (primary == compare) return;

      const compareStartPos = compare.start.capPos.plusNew(compare.hexagonPosition);
      const compareEndPos = compare.end.capPos.plusNew(compare.hexagonPosition);

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
    // sum up the depth of all of the caps in the group
    const totalDepth = caps.reduce((sum, cap) => (
      sum + cap.capPos.z
    ), 0);
    // make the depth an average of them all
    const depth = totalDepth / caps.length;

    // set the depth for each cap
    caps.forEach(cap => cap.setDepth(depth));
  });
};

const smoothCurves = (caps, smoothDegree) => {

  caps.forEach(cap => {
    // get depth of other end of the curve
    const alignEndDepth = cap.getOppositeCap().capPos.z;

    // get average depth of other end of all extenders
    const hasExtenders = !!cap.extenders.length;
    const extenderEndDepths = cap.extenders.map(ext => ext.getOppositeCap().capPos.z);
    const extenderEndDepthTotal = extenderEndDepths.reduce((a, b) => (a + b), 0);
    let extenderEndDepthAverage = hasExtenders ? extenderEndDepthTotal / extenderEndDepths.length : 0;

    // tweak depth using the smooth degree
    // if there aren't extenders use more of the original
    cap.nextDepth = hasExtenders ?
      (0.5 * smoothDegree) * (alignEndDepth + extenderEndDepthAverage) + (1 - smoothDegree) * cap.capPos.z
      :
      (0.5 * smoothDegree * alignEndDepth) + (1 - smoothDegree * 0.5) * cap.capPos.z;
  });

  // update real depth after all have been morphed
  caps.forEach(cap => {
    cap.setDepth(cap.nextDepth);
    delete cap.nextDepth;
  });
};

const cofigureControlPointDepth = (caps) => {
  // group caps by groups of aligners
  let capGroups = groupCaps(caps);
  capGroups = capGroups.map(splitCapGroup);

  capGroups.forEach(group => {
    const pointDepth = group[0][0].capPos.z;
    const firstGroup = group[0];
    const secondGroup = group[1];
    let groupDepthAverages = [0, 0];

    // increment the groupDepth by the position of the other end of the curve
    const addDepthToGroup = (groupIndex, cap) => {
      const depth = cap.getOppositeCap().capPos.z;
      groupDepthAverages[groupIndex] += depth;
    };
    firstGroup.forEach(cap => addDepthToGroup(0, cap));
    secondGroup.forEach(cap => addDepthToGroup(1, cap));

    // divide each depth by the amount of caps that have incremented it
    // if there are no caps in that group or the result is NaN
    // return the current depth
    groupDepthAverages.forEach((depth, i) => (
      (!depth) ? pointDepth : depth / group[i].length
    ));

    // use math to put each sides depth half way between the point and its average endings
    const a = groupDepthAverages[0];
    const b = groupDepthAverages[1];
    const firstDepth = pointDepth + (a - b) / 4;
    const secondDepth = pointDepth + (b - a) / 4;
    firstGroup.forEach(cap => {
      cap.controlPos.z = firstDepth;
    });
    secondGroup.forEach(cap => {
      cap.controlPos.z = secondDepth;
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
