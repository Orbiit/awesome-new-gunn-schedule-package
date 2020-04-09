const { PASSING_PERIOD_LENGTH, defaultSelf, newLineRegex } = require('./Constants.js')
const NormalSchedule = require('./NormalSchedule.js')
const Periods = require('./Periods.js')

const HTMLnewlineRegex = /<\/?(p|div|br).*?>|\),? *(?=[A-Z0-9])/g
const noHTMLRegex = /<.*?>/g
const noNbspRegex = /&nbsp;/g

const EARLIEST_AM_HOUR = 6
const timeGetterRegex = /\(?(1?[0-9]):([0-9]{2}) *(?:-|–) *(1?[0-9]):([0-9]{2}) *(pm)?\)?/

// Detect PeriodE etc (2020-03-31)
const getPeriodLetterRegex = /(?:\b|PERIOD)([A-G]|ZERO)\b/

const selfGradeRegex = /(1?[9012](?:\s*-\s*1?[9012])?)(?:th)?|(freshmen|sophomore|junior|senior|all)/gi
const periodSelfGradeRegex = /self for (.+?) grade|self for (freshmen|sophomore|junior|senior|all)/gi
const gradeToInt = { 9: 1, 10: 2, 11: 4, 12: 8, freshmen: 1, sophomore: 2, junior: 4, senior: 8, all: 15 }

function getSELFGradesFrom (text) {
  let grades = 0
  text.replace(selfGradeRegex, (match, grade) => {
    if (grade && grade.includes('-')) {
      const [start, finish] = grade.split('-').map(Number)
      for (let i = start; i <= finish; i++) {
        grades += gradeToInt[i]
      }
    } else {
      grades += gradeToInt[grade || match] || 0
    }
  })
  return grades
}

function parseFromEvent (summary, description) {
  if (/schedule|extended|lunch/i.test(summary)) {
    // The schedule is usually in the description, so with no description,
    // there is no schedule. Usually this happens when there's a false positive.
    if (!description) return null

    // Convert weird HTML in description to plain text
    description = '\n' + description
      .replace(HTMLnewlineRegex, '\n')
      .replace(noHTMLRegex, '')
      .replace(noNbspRegex, ' ')

    const periods = []
    periods._specifiesSELF = false
    for (const line of description.split(newLineRegex)) {
      // Each line contains the period name and a time range; this removes the
      // time range from the line, leaving the raw period name behind.
      let times
      let name = line.replace(timeGetterRegex, (...matches) => {
        times = matches
        return ''
      }).trim()

      if (!times) continue

      // Key: (s|e)(H|M) = (start|end)(Hour|Minute)
      let [sH, sM, eH, eM] = times.slice(1, 5).map(Number)
      const pm = times[5]

      if (sH < EARLIEST_AM_HOUR || pm) sH += 12
      if (eH < EARLIEST_AM_HOUR || pm) eH += 12
      let startTime = sH * 60 + sM
      let endTime = eH * 60 + eM

      // Handle duplicate periods
      const isRedundant = periods.find(pd => {
        // "Retired" periods will be removed later.
        if (pd._retire) return false
        if (pd.start === startTime && pd.end === endTime) {
          // A duplicate period: probably means they're the two periods for
          // different grades happening at once. Since they're the same period,
          // they're merged here.
          pd._raw += '\n' + name
          return true
        } else if (pd.start <= startTime && pd.end >= endTime) {
          // This period takes place during a longer period.
          name += '\n' + pd._raw
          // Assumes there's passing period
          const beforeEnd = startTime - PASSING_PERIOD_LENGTH
          const afterStart = endTime + PASSING_PERIOD_LENGTH
          // "TEMP": Assumes that there can't be both a beforePart and an afterPart;
          // this splits the longer period into two: this period and the modified
          // once-longer period.
          if (beforeEnd - pd.start > 0) {
            pd.end = beforeEnd
          } else if (pd.end - afterStart > 0) {
            pd.start = afterStart
          } else {
            // Mark the longer period for removal because this shorter period
            // is long enough to override the longer one.
            pd._retire = true
          }
        } else if (pd.start >= startTime && pd.end <= endTime) {
          // A shorter period takes place during this period
          pd._raw += '\n' + name
          // Same problems here as for the abovecase
          const beforeEnd = pd.start - PASSING_PERIOD_LENGTH
          const afterStart = pd.end + PASSING_PERIOD_LENGTH
          if (beforeEnd - startTime > 0) {
            endTime = beforeEnd
          } else if (endTime - afterStart > 0) {
            startTime = afterStart
          } else {
            return true
          }
        }
        // Hopefully there won't be a case where a period starts before current
        // one finishes.
      })
      if (!isRedundant) {
        periods.push({
          _raw: name,
          start: startTime,
          end: endTime
        })
      }
    }
    const schedule = periods.filter(pd => {
      if (pd._retire) return false

      const period = identifyPeriod(pd._raw)
      pd.period = period
      if (period === Periods.SELF) {
        periods._specifiesSELF = true
        periodSelfGradeRegex.lastIndex = 0
        const selfSlice = periodSelfGradeRegex.exec(pd._raw)
        if (selfSlice) {
          pd.selfGrades = getSELFGradesFrom(selfSlice[1] || selfSlice[2]) || defaultSelf
        } else {
          pd.selfGrades = defaultSelf
        }
      }

      // If no period was identified, this period will not be kept.
      return period
    }).sort((a, b) => a.start - b.start)
    if (schedule.length) {
      return schedule
    } else {
      // If no periods were found, that probably means it was a false positive
      return null
    }
  } else if (/holiday|no\sstudents|break|development/i.test(summary)) {
    // If there's a description, this might just be some staff meeting rather
    // than a holiday.
    if (description) return null

    return []
  }
}

function identifyPeriod (rawName) {
  const name = rawName.toUpperCase()
  if (name.includes('PERIOD')) {
    const letter = getPeriodLetterRegex.exec(name)
    if (letter && Periods[letter[1]]) {
      return Periods[letter[1]]
    }
  }
  if (name.includes('SELF')) {
    return Periods.SELF
  } else if (name.includes('MEETING')) {
    // Ignore staff classes (for now); should be before flex so that
    // "Staff Meeting, CAASPP training for all" (2020-03-11) isn't interpreted
    // as flex; not looking for "STAFF" because "Staff Holiday Lunch in Bow Gym"
    // (2017-12-07)
    return null
  } else if (name.includes('FLEX') ||
    name.includes('ASSEMBL') || // To match both 'assembly' and 'assemblies'
    name.includes('ATTEND') || // Detect PSAT day (2018-10-10)
    name.includes('TUTORIAL') ||
    name.includes('CAASPP')) {
    return Periods.FLEX
  } else if (name.includes('BRUNCH') || name.includes('BREAK')) {
    return Periods.BRUNCH
  } else if (name.includes('UNCH') || name.includes('TURKEY')) {
    // 'UNCH' to match 'unch' (2019-03-26)
    return Periods.LUNCH
  } else {
    return null
  }
}

function parseFromEvents (events, day) {
  // There probably won't be an alternate schedule on the weekends.
  // (Winter break on the weekends should not be considered alternate)
  if (day === 0 || day === 6) {
    return null
  }

  let selfGrades = 0
  let alternateSchedule = null
  let assumeFlexIsSELF = true
  for (const { summary = '', description } of events) {
    if (summary.includes('SELF') && summary.includes('grade')) {
      const grades = getSELFGradesFrom(summary)
      if (grades > 0) {
        selfGrades = grades
        continue
      }
    }

    // HACK: Prevent back-to-school schedule from overriding school schedule (2018-08-30)
    if (summary.includes('Back-to-School')) continue

    // Do not parse another alternate schedule if it has already been done
    if (alternateSchedule) continue

    const schedule = parseFromEvent(summary, description)
    if (!schedule) continue
    if (schedule.specifiesSELF) {
      assumeFlexIsSELF = false
    }
    for (let i = 0; i < schedule.length; i++) {
      const period = schedule[i]
      if (period.period === Periods.BRUNCH || period.period === Periods.LUNCH) {
        if (i === 0 || i === schedule.length - 1) {
          // It is redundant for school to start/end with a break; usually
          // we consider those times not part of school.
          schedule.splice(i--, 1)
        } else {
          // Passing period is not part of breaks.
          period.end = schedule[i + 1].start - PASSING_PERIOD_LENGTH
        }
      }
    }
    alternateSchedule = schedule
  }

  if (alternateSchedule) {
    if (selfGrades && assumeFlexIsSELF) {
      for (const period of alternateSchedule) {
        if (period.period === Periods.FLEX) {
          period.period = Periods.SELF
          period.selfGrades = selfGrades
        }
      }
    }
    return alternateSchedule
  } else if (day === 4 ? selfGrades !== defaultSelf : selfGrades) {
    // If it's Thursday and the SELF grades are not normal, or if it's
    // not Thursday and there for some reason is SELF
    const clonedSchedule = JSON.parse(JSON.stringify(NormalSchedule[day]))
    for (const period of clonedSchedule) {
      if (period.period === Periods.FLEX || period.period === Periods.SELF) {
        if (selfGrades) {
          period.period = Periods.SELF
          period.selfGrades = selfGrades
        } else {
          period.period = Periods.FLEX
        }
      }
    }
    return clonedSchedule
  } else {
    return null
  }
}

module.exports = parseFromEvents
