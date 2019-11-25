// I am merely *testing* this out

const assert = require('assert')

const GunnSchedule = require('../src/index.js')
const {apiKey} = require('./api-key.json')

const firstDay = new Date('2019-08-13').getTime()
const lastDay = new Date('2020-06-04').getTime()
const summer = new Date('2019-07-04').getTime()

const boringThursday = new Date('2019-11-07').getTime()
const turkeyFeast = new Date('2019-11-21').getTime()
const thanksgiving = new Date('2019-11-28').getTime()

describe('SchoolYear', () => {
  const schedule = new GunnSchedule(apiKey)

  let year

  describe('firstDay, lastDay', () => {
    before(() => {
      year = schedule.year(firstDay, lastDay)
    })
    it('should let me access firstDay', () => {
      assert.strictEqual(year.firstDay, firstDay)
    })
    it('should let me access lastDay too', () => {
      assert.strictEqual(year.lastDay, lastDay)
    })
    it('should know when summer is', () => {
      assert.ok(year.get(summer).summer)
    })
  })

  describe('update(date)', () => {
    before(() => {
      year = schedule.year(firstDay, lastDay)
      return year.update(turkeyFeast)
    })
    it('should at least know that Turkey Feast is an alternate schedule', () => {
      assert.ok(year.get(turkeyFeast).alternate)
    })
    it('should not yet know that Thanksgiving is during a break', () => {
      assert.ok(!year.get(thanksgiving).alternate)
      assert.ok(year.get(thanksgiving).school)
    })
  })

  describe('update()', async () => {
    before(() => {
      year = schedule.year(firstDay, lastDay)
      return year.update()
    })
    it('should know that a normal Thursday is not alternate', () => {
      assert.ok(!year.get(boringThursday).alternate)
    })
    it('should know that a normal Thursday is has school', () => {
      assert.ok(year.get(boringThursday).school)
      assert.ok(year.get(boringThursday).periods.length > 0)
    })
    it('should know that there was Turkey Feast that day', () => {
      assert.ok(year.get(turkeyFeast).alternate)
    })
    it('should know that Thanksgiving is during a break', () => {
      assert.ok(year.get(thanksgiving).alternate)
      assert.ok(!year.get(thanksgiving).school)
    })
    it('should know that a normal Thursday has third period (including brunch) SELF for grades 9 to 11', () => {
      const self = year.get(turkeyFeast).periods[2]
      assert.strictEqual(self.period, GunnSchedule.Periods.SELF)
      assert.deepStrictEqual(self.selfGrades, [9, 10, 11])
    })
  })

  describe('Time', async () => {
    let normalThursday
    before(() => {
      year = schedule.year(firstDay, lastDay)
      return year.update()
        .then(() => {
          normalThursday = year.get(boringThursday)
        })
    })
    it('should properly format the start of a normal Thursday in 12-hour', () => {
      const firstPd = normalThursday.periods[0]
      assert.strictEqual(firstPd.start.toTime(false), '8:25 am')
    })
    it('should properly format the end of a normal Thursday in 24-hour', () => {
      const lastPd = normalThursday.periods[normalThursday.periods.length - 1]
      assert.strictEqual(lastPd.end.toTime(true), '15:35')
    })
  })
})
