export default {
  1: { // two neighbours
    layouts: [
      { // attach all
        pairs: [
          [0, 1],
        ],
      },
    ],
  },
  2: { // three neighbours
    layouts: [
      { // attach all
        pairs: [
          [0, 1],
          [0, 2],
          [1, 2],
        ],
      },
      { // attach two
        pairs: [
          [0, 1],
          [0, 2],
        ],
      },
      { // attach two
        pairs: [
          [0, 2],
          [1, 2],
        ],
      },
      { // attach two
        pairs: [
          [0, 1],
          [1, 2],
        ],
      },
    ],
  },
  3: { // 4 neighbours, all adjacent
    layouts: [
      { // connect adjacent edges, ignore straight line
        pairs: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
      },
      { // cross over curves
        pairs: [
          [0, 2],
          [1, 3],
        ],
      },
      { // pair edges with adjacent edges
        pairs: [
          [0, 1],
          [2, 3],
        ],
      },
    ],
  },
  4: { // 4 neighbours, 1 and 3 or in pairs
    layouts: [
      { // connect adjacent edges
        pairs: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0],
        ],
      },
      { // pair adjacent edges
        pairs: [
          [0, 1],
          [2, 3],
        ],
      },
      { // pair opposite adjacent edges
        pairs: [
          [1, 2],
          [3, 0],
        ],
      },
    ],
  },
  5: { // 5 neighbours
    layouts: [
      { // connect adjacent edges
        pairs: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 0],
        ],
      },
      { // batman logo
        pairs: [
          [0, 4],
          [1, 2],
          [2, 3],
        ],
      },
      { // evil M
        pairs: [
          [0, 2],
          [0, 1],
          [2, 4],
          [3, 4],
        ],
      },
      { // fountain
        pairs: [
          [0, 2],
          [1, 2],
          [3, 2],
          [4, 2],
        ],
      },
    ],
  },
  6: { // 6 neighbours
    layouts: [
      { // connect adjacent edges
        pairs: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 0],
        ],
      },
      { // pair adjacent edges
        pairs: [
          [0, 1],
          [2, 3],
          [4, 5],
        ],
      },
      { // cross over with cap
        pairs: [
          [0, 1],
          [2, 4],
          [3, 5],
        ],
      },
    ],
  },
};
