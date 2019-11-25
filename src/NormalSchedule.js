const Periods = require('./Periods.js')
const { defaultSelf } = require('./Constants.js')

const NormalSchedule = [
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

module.exports = NormalSchedule
