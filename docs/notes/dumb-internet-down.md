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
VM3006:26 not gonna deal with "Semester 2 schedules online at 6pm" (2017-12-18) for now
VM3006:26 not gonna deal with "Winter Break Holiday" (2017-12-22) for now
VM3006:26 not gonna deal with "Local Holiday" (2018-03-12) for now
VM3006:26 not gonna deal with "Staff Development Day (no students)" (2018-02-16) for now
VM3006:26 not gonna deal with "President's Day Holiday" (2018-02-19) for now
VM3006:26 not gonna deal with "Staff Development Day (no students)" (2018-01-08) for now
VM3006:26 not gonna deal with "Last day to submit schedule change requests" (2018-01-12) for now
VM3006:26 not gonna deal with "MLK Holiday" (2018-01-15) for now
VM3006:26 not gonna deal with "MEMORIAL DAY HOLIDAY" (2018-05-28) for now
VM3006:26 not gonna deal with "Veterans' Day Holiday" (2017-11-10) for now
VM3006:26 not gonna deal with "Spring Break" (2018-04-02) for now
```
