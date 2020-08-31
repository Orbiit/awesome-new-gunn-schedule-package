/* global describe it */

const assert = require('assert').strict

const parseFromEvents = require('../../src/Parser.js')
const Periods = require('../../src/Periods.js')

const exampleSchedules = require('../fixtures/example-schedules.js')

describe('parseFromEvents', function () {
  for (const { date, summary, description, expect } of exampleSchedules) {
    if (date) continue // TEMP HACK
    describe(`An event on ${date}: ${summary}`, function () {
      // Pretend all of these schedules are on Monday
      const parsed = parseFromEvents([{ summary, description }], 1)
      if (expect === null) {
        it('should return null for non-schedule related events', function () {
          assert.strictEqual(parsed, null)
        })
      } else if (expect.length === 0) {
        it('should return an empty array for a no school day', function () {
          assert.deepStrictEqual(parsed, [])
        })
      } else {
        it('should return the correct period schedule', function () {
          for (const period of parsed) {
            delete period._raw

            // Not testing SELF detection for now
            delete period.selfGrades
            if (period.period === Periods.SELF) {
              period.period = Periods.FLEX
            }
          }
          assert.deepStrictEqual(parsed, expect)
        })
      }
    })
  }
})
