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
  smoothCurves(caps, 0.4);
  // re-average them
  averageCapDepth(caps);

  return curves;
});

const averageCapDepth = (caps) => {
  let capGroups = groupCaps(caps);
  capGroups.forEach(caps => {
    // sum up the depth of all of the caps in the group
    const totalDepth = caps.reduce((sum, cap) => (
      sum + cap.depth
    ), 0);
    // make the depth an average of them all
    const depth = totalDepth / caps.length;

    // set the depth for each cap
    caps.forEach(cap => {
      cap.depth = depth;
      return cap;
    });
  });
};

const smoothCurves = (caps, smoothDegree) => {

  caps.forEach(cap => {
    // get depth of other end of the curve
    const alignEndDepth = cap.getOppositeCap().depth;

    // get average depth of other end of all extenders
    const hasExtenders = !!cap.extenders.length;
    const extenderEndDepths = cap.extenders.map(ext => ext.getOppositeCap().depth);
    const extenderEndDepthTotal = extenderEndDepths.reduce((a, b) => (a + b), 0);
    let extenderEndDepthAverage = hasExtenders ? extenderEndDepthTotal / extenderEndDepths.length : 0;

    // tweak depth using the smooth degree
    // if there aren't extenders use more of the original
    cap.nextDepth = hasExtenders ?
      (0.5 * smoothDegree) * (alignEndDepth + extenderEndDepthAverage) + (1 - smoothDegree) * cap.depth
      :
      (0.5 * smoothDegree * alignEndDepth) + (1 - smoothDegree * 0.5) * cap.depth;
  });

  // update real depth after all have been morphed
  caps.forEach(cap => {
    cap.depth = cap.nextDepth;
    delete cap.nextDepth;
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
