const exampleSchedules = require('./example-schedules.json')

const Periods = require('../../src/Periods.js')

const periodMapping = {
  0: Periods.ZERO,
  A: Periods.A,
  B: Periods.B,
  C: Periods.C,
  D: Periods.D,
  E: Periods.E,
  F: Periods.F,
  G: Periods.G,
  flex: Periods.FLEX,
  brunch: Periods.BRUNCH,
  lunch: Periods.LUNCH,
  meetings: Periods.MEETINGS,
  collaboration: Periods.COLLABORATION,

  // Ignore unsupported periods
  H: null,
  unknown: null
}

function toTotalMinutes (time) {
  const [hours, minutes] = time.split(':')
  return +hours * 60 + +minutes
}

module.exports = exampleSchedules
  .map(({ date, summary, description, expect, ignore = false }) => {
    if (!date || ignore) return

    return {
      date,
      summary,
      description,
      expect: expect && expect
        .map(({ period, start, end }) => {
          // Some periods
          if (Array.isArray(period)) {
            period = period.map(pd => periodMapping[pd]).filter(pd => pd)

            if (period.length === 0) {
              return
            } else if (period.length === 1) {
              period = period[0]
            }
          } else {
            period = periodMapping[period]
            if (period === undefined) {
              throw new Error(`What is this fake period "${period}"? (${date}/${summary})`)
            }
            if (period === null) {
              return
            }
          }

          return {
            period,
            start: toTotalMinutes(start),
            end: toTotalMinutes(end)
          }
        })
        .filter(period => period)
    }
  })
  .filter(schedule => schedule)
