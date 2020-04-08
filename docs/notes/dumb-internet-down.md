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
