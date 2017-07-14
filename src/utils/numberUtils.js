export const wrap6 = (num) => (
  // -1 => 5
  // 0 => 0
  // 5 => 5
  // 6 => 0
  // 7 => 1
  (num + 6) % 6
);

export const randomInteger = (min, max) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

export const random = (min, max) => {
  if (min === undefined) {
    min = 0;
    max = 1;
  } else if (max === undefined) {
    max = min;
    min = 0;
  }

  return (Math.random() * (max - min)) + min;
};

export const map = (value, min1, max1, min2, max2, clampResult) => {
  var returnvalue = ((value - min1) / (max1 - min1) * (max2 - min2)) + min2;
  if (clampResult) return clamp(returnvalue, min2, max2);
  else return returnvalue;
};

export const clamp = (value, min, max) => {
  if (max < min) {
    var temp = min;
    min = max;
    max = temp;
  }

  return Math.max(min, Math.min(value, max));
};
