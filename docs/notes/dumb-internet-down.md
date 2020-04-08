0:01
```js
dupes = new Set()
exist = new Set()
descs = new Set()
descToOldDate = {}
val = $('textarea').value
thing = JSON.parse(val)
thing.forEach(({ date, description }) => {
if (!description) return
if (exist.has(date)) {
dupes.add(date)
} else {
exist.add(date)
}
if (descs.has(description)) throw 'dumb'
descs.add(description)
descToOldDate[description] = date
})

unique = {}
events.forEach(({ name, desc }, i) => {
if (!/schedule|extended|holiday|no\sstudents|break/i.test(name)) return
if (!desc) {
const datedate = numberToDate(days.findIndex(arr => arr.includes(i)))
datedate.setHours(0)
const date = datedate.toISOString().slice(0, 10)
console.log(`not gonna deal with ${JSON.stringify(name)} (${date}) for now`)
return
}
if (!unique[desc]) {
const datedate = numberToDate(days.findIndex(arr => arr.includes(i)))
datedate.setHours(0)
const date = datedate.toISOString().slice(0, 10)
unique[desc] = date
const oldDate = descToOldDate[desc]
if (!new RegExp(`"date": "${oldDate}(#\?#[^"])?"`).test(val)) throw '???'
if (dupes.has(oldDate)) {
/*console.log(`change ${oldDate}'s ${JSON.stringify(name)} to ${date}
${JSON.stringify(desc)}
`)*/
val = val.replace(new RegExp(`"date": "${oldDate}(#\?#[^"])?"`, 'g'), `"date": "${oldDate}#?#${date}"`)
console.log(`${oldDate}#?#... should be ${date} for ${JSON.stringify(name)}
${JSON.stringify(desc)}
`)
} else {
val = val.replace(`"date": "${oldDate}"`, `"date": "##${date}"`)
}
}
})
val.replace(/##/g, '')
```

0:03
```js
35c35
< if (!new RegExp(`"date": "${oldDate}(#\?#[^"])?"`).test(val)) throw '???'
---
> if (!new RegExp(`"date": "(##)?${oldDate}(#\?#[^"])?"`).test(val)) throw '???'
```

0:04 (works)
```js
35c35
< if (!new RegExp(`"date": "(##)?${oldDate}(#\?#[^"])?"`).test(val)) throw '???'
---
> if (!new RegExp(`"date": "(##)?${oldDate}(#\?#[^"]+)?"`).test(val)) throw '???'
40c40
< val = val.replace(new RegExp(`"date": "${oldDate}(#\?#[^"])?"`, 'g'), `"date": "${oldDate}#?#${date}"`)
---
> val = val.replace(new RegExp(`"date": "${oldDate}(#\?#[^"]+)?"`, 'g'), `"date": "${oldDate}#?#${date}"`)
```

0:05 (also works)
```js
40c40
< val = val.replace(new RegExp(`"date": "${oldDate}(#\?#[^"]+)?"`, 'g'), `"date": "${oldDate}#?#${date}"`)
---
> val = val.replace(new RegExp(`"date": "(${oldDate}(#\?#[^"]+)?)"`, 'g'), `"date": "$1#?#${date}"`)
```
```js
dupes = new Set()
exist = new Set()
descs = new Set()
descToOldDate = {}
val = $('textarea').value
thing = JSON.parse(val)
thing.forEach(({ date, description }) => {
if (!description) return
if (exist.has(date)) {
dupes.add(date)
} else {
exist.add(date)
}
if (descs.has(description)) throw 'dumb'
descs.add(description)
descToOldDate[description] = date
})

unique = {}
events.forEach(({ name, desc }, i) => {
if (!/schedule|extended|holiday|no\sstudents|break/i.test(name)) return
if (!desc) {
const datedate = numberToDate(days.findIndex(arr => arr.includes(i)))
datedate.setHours(0)
const date = datedate.toISOString().slice(0, 10)
console.log(`not gonna deal with ${JSON.stringify(name)} (${date}) for now`)
return
}
if (!unique[desc]) {
const datedate = numberToDate(days.findIndex(arr => arr.includes(i)))
datedate.setHours(0)
const date = datedate.toISOString().slice(0, 10)
unique[desc] = date
const oldDate = descToOldDate[desc]
if (!new RegExp(`"date": "(##)?${oldDate}(#\?#[^"]+)?"`).test(val)) throw '???'
if (dupes.has(oldDate)) {
/*console.log(`change ${oldDate}'s ${JSON.stringify(name)} to ${date}
${JSON.stringify(desc)}
`)*/
val = val.replace(new RegExp(`"date": "(${oldDate}(#\?#[^"]+)?)"`, 'g'), `"date": "$1#?#${date}"`)
console.log(`${oldDate}#?#... should be ${date} for ${JSON.stringify(name)}
${JSON.stringify(desc)}
`)
} else {
val = val.replace(`"date": "${oldDate}"`, `"date": "##${date}"`)
}
}
})
val.replace(/##/g, '')
```

logs:
```
2017-09-27#?#... should be 2017-09-01 for "Minimum Day (see schedule below)"
"Period C (8:25-9:15)\nPeriod D (9:25-10:10)\nBrunch (10:10-10:25)\nPeriod E (10:25-11:10)\nPeriod F (11:20-12:05)\nPeriod G (12:15-1:00)\n\n"

VM3006:41 2017-09-08#?#... should be 2017-09-04 for "LABOR DAY HOLIDAY"
"\n"

VM3006:41 2017-09-01#?#... should be 2017-09-07 for "Alternate Schedule (see below)"
"Period A (8:25-9:50)\nBrunch (9:40-10:05)\nPeriod B (10:05-11:25)\nPeriod C (11:35-12:55)\nLunch (12:55-1:35)\nPeriod F (1:35-2:55)\nStaff/Dept. Meeting (3:05-3:40)\n\n"

VM3006:26 not gonna deal with "Semester 2 schedules online at 6pm" (2017-12-18) for now
VM3006:41 2017-12-07#?#... should be 2017-12-07 for "Staff Holiday Luncheon (see alt. schedule below)"
"Period E (8:25-9:45)\nBrunch (9:45-10:00)\nFlexTime (10:00-10:45)\nPeriod B (10:55-12:00)\nStaff Holiday Lunch in Bow Gym (12:00-12:55)\nPeriod A (1:05-2:10)\nPeriod G (2:20-3:35)\n"

VM3006:41 2017-12-18#?#... should be 2017-12-21 for "Final Exams (see alternate schedule below)"
"Period E Final (8:30-10:10)\nBrunch (10:10-10:25)\nPeriod F Final (10:30-12:10)\n"

VM3006:26 not gonna deal with "Winter Break Holiday" (2017-12-22) for now
VM3006:41 2017-12-19#?#... should be 2018-03-29 for "Alternate Schedule (see below)"
"Period E (8:25-9:25)\nBrunch (9:25-9:40)     \nPeriod B (9:40-10:55)\nPeriod C (11:05-12:20)\nLunch (12:20-1:00)\nPeriod A (1:00-2:15)\nPeriod G (2:25-3:40)                                         "

VM3006:41 2017-12-20#?#... should be 2018-03-27 for "Alternate Schedule (see below)"
"Period C (8:25-9:25)\n\nBrunch (9:25-9:45)     \nTesting for juniors, FlexTime for others (9:45-11:45)\nPeriod D (11:55-12:50)\nLunch (12:50-1:30)\nPeriod G (1:30-2:25)\nStaff Collaboration (2:35-3:35)                                              "

VM3006:41 2017-12-21#?#... should be 2018-03-26 for "Alternate Schedule (see below)"
"Period A (8:25-9:25)\nBrunch (9:25-9:45)     \nTesting for juniors, FlexTime for others (9:45-11:45)\nPeriod B (11:55-12:50)\nLunch (12:50-1:30)\nPeriod F (1:30-2:25)\nStaff Collaboration (2:35-3:35)                                              "

VM3006:41 2017-12-18#?#... should be 2018-02-28 for "ALTERNATE SCHEDULE (see below)"
"<p>Period B (8:25-9:50)</p><p>Brunch (9:50-10:05)</p><p>Period C (10:05-11:25)</p><p>Period E (11:35-12:55)</p><p>Lunch (12:55-1:35)</p><p>Period F (1:35-2:55)</p><p>Staff Meeting (3:05-3:45)</p>"

VM3006:41 2017-12-22#?#... should be 2018-03-01 for "ALTERNATE SCHEDULE (see below)"
"<p>Period D (8:25-9:50)</p><p>Brunch (9:50-10:05)</p><p>Double FlexTime (10:05-11:25)</p><p>Period E (11:35-12:55)</p><p>Lunch (12:55-1:35)</p><p>Period G (1:35-2:55)</p><p><br></p>"

VM3006:41 2017-08-22#?#... should be 2018-03-02 for "ALTERNATE SCHEDULE (see below)"
"<p>Period A (8:25-9:50)</p><p>Brunch (9:50-10:05)</p><p>Period B (10:05-11:25)</p><p>Period C (11:35-12:55)</p><p>Lunch (12:55-1:35)</p><p>Period F (1:35-2:55)</p>"

VM3006:26 not gonna deal with "Local Holiday" (2018-03-12) for now
VM3006:41 2017-12-02#?#... should be 2018-03-13 for "Alternate schedule (see below)"
"Period A (8:25-9:50)\nBrunch (9:50-10:05)\nPeriod B (10:05-11:25)\nPeriod C (11:35-12:55)\nLunch (12:55-1:35)\nPeriod F (1:35-2:55)\nStaff Collaboration (3:05-3:40)\n"

VM3006:41 2017-09-01#?#... should be 2018-03-14 for "Alternate schedule (see below)"
"Period D (8:25-9:50)\nBrunch (9:50-10:05)\nFlexTime (10:05-11:00)\nPeriod E (11:10-12:30)\nClash of the Titans extended lunch (12:30-1:35)\nPeriod G (1:35-2:55)\n\nStaff Meeting (3:05-3:45)"

VM3006:41 2017-09-08#?#... should be 2018-03-15 for "Alternate schedule (see below)"
"Period A (8:25-9:50)\nBrunch (9:50-10:05)\nPeriod B (10:05-11:25)\nPeriod C (11:35-12:55)\nLunch (12:55-1:35)\nPeriod F (1:35-2:55)"

VM3006:41 2017-12-06#?#... should be 2018-03-16 for "Alternate schedule (see below)"
"Period D (8:25-9:50)\nBrunch (9:50-10:05)\nFlexTime (10:05-11:25)\nPeriod E (11:35-12:55)\nLunch (12:55-1:35)\nPeriod G (1:35-2:55)\n"

VM3006:41 2017-09-27#?#... should be 2018-03-28 for "Alternate Schedule (see below)"
"Testing for juniors, FlexTime for others  (8:25-10:00)\nBrunch (10:00-10:15)     \nTesting for juniors, FlexTime for others (10:15-12:15)\n\nStaff Collaboration (12:55-3:30)"

VM3006:41 2017-12-07#?#... should be 2018-02-14 for "Alternate schedule (see below)"
"Period A (8:25-9:50)\nBrunch (9:50-10:05)\nPeriod B (10:05-11:25)\nPeriod C (11:35-12:55)\nLunch (12:55-1:35)\nPeriod F (1:35-2:55)\nStaff/Dept. meeting (3:05-3:40)\n"

VM3006:26 not gonna deal with "Staff Development Day (no students)" (2018-02-16) for now
VM3006:26 not gonna deal with "President's Day Holiday" (2018-02-19) for now
VM3006:41 2017-12-07#?#... should be 2018-02-21 for "Alternate schedule (see below)"
"Period D (8:25-9:50)\nBrunch (9:50-10:05)\nFlexTime (10:05-11:25)\nPeriod E (11:35-12:55)\nLunch (12:55-1:35)\nPeriod G (1:35-2:55)\n\nDepartment meetings (3:05-3:45)"

VM3006:41 2017-12-15#?#... should be 2018-02-27 for "ALTERNATE SCHEDULE (see below)"
"<p>Period E (sophomores at RISE assembly, others in class) (8:25-9:10)</p><p>FlexTime (sophomores at RISE assembly, freshmen at SELF, others in FlexTime) (9:20-10:00)</p><p>Brunch (10:00-10:15)</p><p>Period D (10:15-11:35)</p><p>Lunch (11:35-12:15)</p><p>Period A (12:15-1:35)</p><p>Period G (1:45-3:05)</p>"

VM3006:26 not gonna deal with "Staff Development Day (no students)" (2018-01-08) for now
VM3006:26 not gonna deal with "Last day to submit schedule change requests" (2018-01-12) for now
VM3006:26 not gonna deal with "MLK Holiday" (2018-01-15) for now
VM3006:41 2017-09-27#?#... should be 2018-01-18 for "Alternate schedule (see below)"
"Period A (8:25-9:50)\nBrunch (9:50-10:05)\nPeriod B (10:05-11:25)\nPeriod C (11:35-12:55)\nLunch (12:55-1:35)\nPeriod F (1:35-2:55)\nDept. meetings (3:05-3:40)\n\n"

VM3006:26 not gonna deal with "MEMORIAL DAY HOLIDAY" (2018-05-28) for now
VM3006:41 2017-08-22#?#... should be 2018-05-29 for "7-Period Day alternate schedule Review Day (no new content)"
"Period A (8:25-9:17)\nPeriod B (9:27-10:14)\nBrunch (10:14-10:29)\nPeriod C (10:29-11:16)\nPeriod D (11:26-12:13)\nLunch (12:13-12:57)\nPeriod E (12:57-1:44)\nPeriod F (1:54-2:41)\nPeriod G (2:51-3:38)\n"

VM3006:26 not gonna deal with "Veterans' Day Holiday" (2017-11-10) for now
VM3006:41 2017-12-18#?#... should be 2017-11-16 for "Turkey Feast  (see alternate schedule below)"
"Period E (8:25-9:45)\nBrunch (9:45-10:00)\nFlexTime (10:00-10:45)\nPeriod B (10:55-12:00)\nExtended Lunch (12:00-12:55)\nPeriod A (1:05-2:10)\nPeriod G (2:20-3:35)\n\n"

VM3006:41 2017-12-02#?#... should be 2017-08-15 for "Alternate Schedule (see below)"
"Period D (8:25-9:57)\nBrunch (9:57-10:12)\nFlexTime (10:12-10:50)\nPeriod E (11:00-12:15)\nLunch (12:15-12:55)\nPeriod A (12:55-2:15)\nPeriod G (2:25-3:40)\n"

VM3006:41 2017-12-06#?#... should be 2017-08-28 for "Alternate schedule (see below)"
"Period A (8:25-9:50)\nBrunch (9:50-10:05)\nPeriod B (10:05-11:25)\nPeriod C (11:35-12:55)\nLunch (12:55-1:35)\nPeriod F (1:35-2:55)\nStaff Collaboration (no students) (3:05-3:40)"

VM3006:41 2017-12-07#?#... should be 2017-10-04 for "Alternate Schedule (see below)"
"Period A (8:25-9:50)\nBrunch (9:50-10:05)\nPeriod B (10:05-11:25)\nPeriod C (11:35-12:55)\nLunch (12:55-1:35)\nPeriod F (1:35-2:55)\nStaff/Dept. meeting (3:05-3:40)\n\n"

VM3006:41 2017-12-15#?#... should be 2017-10-12 for "Alternate Schedule (see below)"
"Period A (8:25-9:50)\nBrunch (9:50-10:05)\nPeriod B (10:05-11:25)\nPeriod C (11:35-12:55)\nLunch (12:55-1:35)\nPeriod F (1:35-2:55)\n\n"

VM3006:41 2017-12-19#?#... should be 2017-10-11 for "PSAT/Grade level assemblies Alternate Schedule (see below)"
"ALL STUDENTS ATTEND, 8:30-12:00\nNo afternoon classes\nStaff Collaboration (1:00-3:45)\n\n"

VM3006:41 2017-12-20#?#... should be 2017-10-13 for "Alternate Schedule (see below)"
"Period D (8:25-9:50)\nBrunch (9:50-10:05)\nFlexTime (10:05-11:25)\nE period (11:35-12:55)\nLunch (12:55-1:35)\nPeriod G (1:35-2:55)\n"

VM3006:26 not gonna deal with "Spring Break" (2018-04-02) for now
VM3006:41 2017-12-21#?#... should be 2018-04-19 for "International Potluck (extended lunch schedule, see below)"
"<div style=\"color: rgb(0, 0, 0); font-family: 'Courier New', monospace, 'Courier New', EmojiFont, 'Apple Color Emoji', 'Segoe UI Emoji', NotoColorEmoji, 'Segoe UI Symbol', 'Android Emoji', EmojiSymbols; font-size: 16px; margin-top: 0px; margin-bottom: 0px;\">Period E (8:25-9:50)<div style=\"color: rgb(0, 0, 0); font-family: 'Courier New', monospace, 'Courier New', EmojiFont, 'Apple Color Emoji', 'Segoe UI Emoji', NotoColorEmoji, 'Segoe UI Symbol', 'Android Emoji', EmojiSymbols; font-size: 16px; margin-top: 0px; margin-bottom: 0px;\">Brunch (9:50-10:05)<div style=\"color: rgb(0, 0, 0); font-family: 'Courier New', monospace, 'Courier New', EmojiFont, 'Apple Color Emoji', 'Segoe UI Emoji', NotoColorEmoji, 'Segoe UI Symbol', 'Android Emoji', EmojiSymbols; font-size: 16px; margin-top: 0px; margin-bottom: 0px;\">FlexTime (10:05-10:35)<div style=\"color: rgb(0, 0, 0); font-family: 'Courier New', monospace, 'Courier New', EmojiFont, 'Apple Color Emoji', 'Segoe UI Emoji', NotoColorEmoji, 'Segoe UI Symbol', 'Android Emoji', EmojiSymbols; font-size: 16px; margin-top: 0px; margin-bottom: 0px;\">Period B (10:45-11:55)<div style=\"color: rgb(0, 0, 0); font-family: 'Courier New', monospace, 'Courier New', EmojiFont, 'Apple Color Emoji', 'Segoe UI Emoji', NotoColorEmoji, 'Segoe UI Symbol', 'Android Emoji', EmojiSymbols; font-size: 16px; margin-top: 0px; margin-bottom: 0px;\">EXTENDED LUNCH for Int'l. Potluck (11:55-12:55)<div style=\"color: rgb(0, 0, 0); font-family: 'Courier New', monospace, 'Courier New', EmojiFont, 'Apple Color Emoji', 'Segoe UI Emoji', NotoColorEmoji, 'Segoe UI Symbol', 'Android Emoji', EmojiSymbols; font-size: 16px; margin-top: 0px; margin-bottom: 0px;\">Period A (12:55-2:05)<div style=\"color: rgb(0, 0, 0); font-family: 'Courier New', monospace, 'Courier New', EmojiFont, 'Apple Color Emoji', 'Segoe UI Emoji', NotoColorEmoji, 'Segoe UI Symbol', 'Android Emoji', EmojiSymbols; font-size: 16px; margin-top: 0px; margin-bottom: 0px;\">Period G (2:15-3:35)"

VM3006:41 2017-12-22#?#... should be 2018-04-10 for "Alternate Schedule (see below)"
"<p><i>&nbsp; &nbsp;Tuesday,April 10</i><br></p><p><span>Period D (8:25-9:45)</span></p><p><span>Brunch (9:45-10:00)</span></p><p><span>Period E (10:00-11:15)</span></p><p><span>Period B (11:25-12:25)</span></p><p><span>Lunch (12:25-1:05)</span></p><p><span>Period A (1:05-2:05)</span></p><p><span>Period G (2:15-3:30)</span></p><p><span>&nbsp;</span></p>"
```
