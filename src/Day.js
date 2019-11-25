const Period = require('./Period.js')

class Day {
  constructor ({date, periods = [], alternate = false, summer = false}) {
    this.date = new Date(date)
    this.day = this.date.getUTCDay()
    this.periods = periods.map(pd => new Period(pd))
    this.school = !!this.periods.length
    this.alternate = alternate
    this.summer = summer
  }
}

module.exports = Day
