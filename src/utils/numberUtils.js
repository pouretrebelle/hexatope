export const wrap6 = (num) => (
  // -1 => 5
  // 0 => 0
  // 5 => 5
  // 6 => 0
  // 7 => 1
  (num + 6) % 6
);
