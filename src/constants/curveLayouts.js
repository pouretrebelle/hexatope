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
        pushUp: [1, 2],
      },
      { // cross over curves
        pairs: [
          [0, 2],
          [1, 3],
        ],
        forceUp: [0, 2],
        pushDown: [1, 3],
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
        pushUp: [0],
        pushDown: [2],
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
        pushUp: [0, 4],
        pushDown: [2],
      },
      { // batman logo
        pairs: [
          [0, 4],
          [1, 2],
          [2, 3],
        ],
        pushUp: [1],
        pushDown: [3],
      },
      { // evil M
        pairs: [
          [0, 2],
          [0, 1],
          [2, 4],
          [3, 4],
        ],
        pushUp: [0, 4],
        pushDown: [1, 3],
      },
      { // fountain
        pairs: [
          [0, 2],
          [1, 2],
          [3, 2],
          [4, 2],
        ],
        pushUp: [0, 4],
        pushDown: [2],
      },
      { // V with strike
        pairs: [
          [0, 2],
          [2, 4],
          [1, 3],
        ],
        pushUp: [0, 4],
        forceUp: [2],
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
        pushUp: [0, 1],
        pushDown: [4, 5],
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
        forceUp: [2, 4],
      },
      { // david's cross
        pairs: [
          [1, 3],
          [3, 5],
          [5, 1],
          [0, 2],
          [2, 4],
          [4, 0],
        ],
        forceUp: [1, 3, 5],
      },
    ],
  },
};
