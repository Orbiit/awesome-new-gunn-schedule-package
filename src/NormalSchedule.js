const Periods = require('./Periods.js')
const { defaultSelf } = require('./Constants.js')

const schedule1920 = [
  [],
  [
    { period: Periods.A, start: 505, end: 585 },
    { period: Periods.BRUNCH, start: 585, end: 590 },
    { period: Periods.B, start: 600, end: 675 },
    { period: Periods.C, start: 685, end: 760 },
    { period: Periods.LUNCH, start: 760, end: 790 },
    { period: Periods.F, start: 800, end: 875 }
  ], [
    { period: Periods.D, start: 505, end: 585 },
    { period: Periods.BRUNCH, start: 585, end: 590 },
    { period: Periods.FLEX, start: 600, end: 650 },
    { period: Periods.E, start: 660, end: 735 },
    { period: Periods.LUNCH, start: 735, end: 765 },
    { period: Periods.A, start: 775, end: 855 },
    { period: Periods.G, start: 865, end: 940 }
  ], [
    { period: Periods.B, start: 505, end: 590 },
    { period: Periods.BRUNCH, start: 590, end: 595 },
    { period: Periods.C, start: 605, end: 685 },
    { period: Periods.D, start: 695, end: 775 },
    { period: Periods.LUNCH, start: 775, end: 805 },
    { period: Periods.F, start: 815, end: 895 }
  ], [
    { period: Periods.E, start: 505, end: 590 },
    { period: Periods.BRUNCH, start: 590, end: 595 },
    { period: Periods.SELF, start: 605, end: 655, selfGrades: defaultSelf },
    { period: Periods.B, start: 665, end: 735 },
    { period: Periods.LUNCH, start: 735, end: 765 },
    { period: Periods.A, start: 775, end: 845 },
    { period: Periods.G, start: 855, end: 935 }
  ], [
    { period: Periods.C, start: 505, end: 580 },
    { period: Periods.BRUNCH, start: 580, end: 585 },
    { period: Periods.D, start: 595, end: 665 },
    { period: Periods.E, start: 675, end: 745 },
    { period: Periods.LUNCH, start: 745, end: 775 },
    { period: Periods.F, start: 785, end: 855 },
    { period: Periods.G, start: 865, end: 935 }
  ],
  []
]

const schedule2021 = [
  [],
  [
    { period: 'A', start: 10 * 60 + 0, end: 10 * 60 + 30 },
    { period: 'B', start: 10 * 60 + 40, end: 11 * 60 + 10 },
    { period: 'C', start: 11 * 60 + 20, end: 11 * 60 + 50 },
    { period: 'D', start: 12 * 60 + 0, end: 12 * 60 + 35 },
    { period: 'LUNCH', start: 12 * 60 + 35, end: 13 * 60 + 5 },
    { period: 'E', start: 13 * 60 + 15, end: 13 * 60 + 45 },
    { period: 'F', start: 13 * 60 + 55, end: 14 * 60 + 25 },
    { period: 'G', start: 14 * 60 + 35, end: 15 * 60 + 5 }
  ],
  [
    { period: 'A', start: 9 * 60 + 0, end: 10 * 60 + 15 },
    { period: 'B', start: 10 * 60 + 25, end: 11 * 60 + 40 },
    { period: 'LUNCH', start: 11 * 60 + 40, end: 12 * 60 + 10 },
    { period: 'C', start: 12 * 60 + 20, end: 13 * 60 + 40 },
    { period: 'D', start: 13 * 60 + 50, end: 15 * 60 + 5 },
    { period: 'FLEX', start: 15 * 60 + 10, end: 15 * 60 + 40 }
  ],
  [
    { period: 'E', start: 9 * 60 + 40, end: 10 * 60 + 55 },
    { period: 'GT', start: 11 * 60 + 5, end: 11 * 60 + 40 },
    { period: 'LUNCH', start: 11 * 60 + 40, end: 12 * 60 + 10 },
    { period: 'F', start: 12 * 60 + 20, end: 13 * 60 + 40 },
    { period: 'G', start: 13 * 60 + 50, end: 15 * 60 + 5 },
    { period: 'FLEX', start: 15 * 60 + 10, end: 15 * 60 + 40 }
  ],
  [
    { period: 'A', start: 9 * 60 + 0, end: 10 * 60 + 15 },
    { period: 'B', start: 10 * 60 + 25, end: 11 * 60 + 40 },
    { period: 'LUNCH', start: 11 * 60 + 40, end: 12 * 60 + 10 },
    { period: 'C', start: 12 * 60 + 20, end: 13 * 60 + 40 },
    { period: 'D', start: 13 * 60 + 50, end: 15 * 60 + 5 },
    { period: 'FLEX', start: 15 * 60 + 10, end: 15 * 60 + 40 }
  ],
  [
    { period: 'E', start: 9 * 60 + 40, end: 10 * 60 + 55 },
    { period: 'SELF', start: 11 * 60 + 5, end: 11 * 60 + 40, selfGrades: 0b1111 },
    { period: 'LUNCH', start: 11 * 60 + 40, end: 12 * 60 + 10 },
    { period: 'F', start: 12 * 60 + 20, end: 13 * 60 + 40 },
    { period: 'G', start: 13 * 60 + 50, end: 15 * 60 + 5 }
  ],
  []
]

module.exports = { schedule1920, schedule2021 }
