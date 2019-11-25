const Time = require('./Time.js')

const grades = [9, 10, 11, 12]

class Period {
  constructor ({ period, start, end, selfGrades = 0 }) {
    this.period = period
    this.start = new Time(start)
    this.end = new Time(end)
    if (selfGrades) {
      // `selfGrades` is a number that in binary has each digit represent each
      // grade: 0 if they don't have SELF, and 1 if they do. Numbers are right-
      // to-left so I reverse the digits.
      this.selfGrades = selfGrades.toString(2).split('').reverse()
        .map((grade, i) => grade === '1' ? grades[i] : null)
        // Remove the grades that aren't attending (their values at this point
        // are `null`)
        .filter(grade => grade)
    }
  }

  toJSON () {
    return {
      period: this.period,
      start: this.start.totalMinutes,
      end: this.end.totalMinutes
    }
  }
}

module.exports = Period
