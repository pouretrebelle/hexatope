export default {
  0: { // two neighbours
    layouts: [
      { // attach all
        joins: [
          [0, 1],
        ],
      },
    ],
  },
  1: { // three neighbours
    layouts: [
      { // attach all
        joins: [
          [0, 1],
          [0, 2],
          [1, 2],
        ],
      },
      { // attach two
        joins: [
          [0, 1],
          [0, 2],
        ],
      },
      { // attach two
        joins: [
          [0, 2],
          [1, 2],
        ],
      },
      { // attach two
        joins: [
          [0, 1],
          [1, 2],
        ],
      },
    ],
  },
  2: { // 4 neighbours, all adjacent
    layouts: [
      { // connect adjacent edges, ignore straight line
        joins: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
      },
      { // cross over curves
        joins: [
          [0, 2],
          [1, 3],
        ],
      },
      { // pair edges with adjacent edges
        joins: [
          [0, 1],
          [2, 3],
        ],
      },
    ],
  },
  3: { // 4 neighbours, 1 and 3 or in pairs
    layouts: [
      { // connect adjacent edges
        joins: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0],
        ],
      },
      { // pair adjacent edges
        joins: [
          [0, 1],
          [2, 3],
        ],
      },
      { // pair opposite adjacent edges
        joins: [
          [1, 2],
          [3, 0],
        ],
      },
    ],
  },
  4: { // 5 neighbours
    layouts: [
      { // connect adjacent edges
        joins: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 0],
        ],
      },
      { // batman logo
        joins: [
          [0, 4],
          [1, 2],
          [2, 3],
        ],
      },
      { // evil M
        joins: [
          [0, 2],
          [0, 1],
          [2, 4],
          [3, 4],
        ],
      },
      { // fountain
        joins: [
          [0, 2],
          [1, 2],
          [3, 2],
          [4, 2],
        ],
      },
    ],
  },
  5: { // 6 neighbours
    layouts: [
      { // connect adjacent edges
        joins: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 0],
        ],
      },
      { // pair adjacent edges
        joins: [
          [0, 1],
          [2, 3],
          [4, 5],
        ],
      },
      { // pair opposite adjacent edges
        joins: [
          [1, 2],
          [3, 4],
          [5, 0],
        ],
      },
    ],
  },
};
