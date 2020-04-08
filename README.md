# `awesome-new-gunn-schedule-package`

A Node package that gets Gunn's alternate schedules for you. It uses the Google Calendar API to obtain the up-to-date alternate schedules for Gunn High School according to the events on their website.

## How do I use this for my own projects?

You'll need a [Google Calendar API key](https://support.google.com/googleapi/answer/6158862) so it can fetch from the school's Google Calendar to generate the events.

Using Node or Webpack:
```sh
npm install awesome-new-gunn-schedule-package --save
```
```js
const GunnSchedule = require('awesome-new-gunn-schedule-package')
const { apiKey } = require('./api-key.json')
```

For the web:
```html
<script src="https://unpkg.com/awesome-new-gunn-schedule-package@1/dist/awesome-new-gunn-schedule-package.min.js" charset="utf-8"></script>
```

Then in your magic JavaScript:
```js
const schedule = new GunnSchedule(apiKey)
const year = schedule.year('2019-08-13', '2020-06-04')
await year.update()
console.log(year.get('2019-11-21').periods)
```

# Documentation

## UTCDate

The package uses dates in UTC so time zones don't mess with things. Methods accepting "`UTCDates`" will accept milliseconds since the Unix Epoch at 00:00 UTC on the desired date or a string date in YYYY-MM-DD. Put simply, for any method that takes a "`UTCDate`," you can do one of the following:

```js
someMethod(Date.UTC(2019, 6, 4))
someMethod('2019-07-04')
```

## Summary

```ts
new GunnSchedule(apiKey: string)
  .apiKey: string
  .year(firstDay: UTCDate, lastDay: UTCDate): SchoolYear
GunnSchedule.Periods: Object
GunnSchedule.normalSchedule(day: number): Period[]

SchoolYear
  .firstDay: number
  .lastDay: number
  .update(): Promise<void>
  .update(date: UTCDate): Promise<void>
  .update(startDay: UTCDate, endDay: UTCDate): Promise<void>
  .get(date: UTCDate): Day

Day
  .date: Date
  .day: number
  .periods: Period[]
  .school: boolean
  .alternate: boolean
  .summer: boolean
  .toJSON(): Object[]

Period
  .period: string
  .start: Time
  .end: Time
  .selfGrades: number[]
  .toJSON(): Object

Time
  .hour: number
  .minute: number
  .totalMinutes: number
  .toTime(militaryTime: boolean = false): string
```

## `GunnSchedule`

Stores the API key and lets you create `SchoolYear` instances

### Constructor

```ts
new GunnSchedule(apiKey: string)
```
`apiKey`: The Google Calendar API with which the Google Calendar events should be fetched for the alternate schedules.

### Properties

```ts
.apiKey: string
```
The Google Calendar API key given in the constructor. You can change this if you want, and new requests made will use the new API key.

### Methods

```ts
.year(firstDay: UTCDate, lastDay: UTCDate): SchoolYear
```
Creates a `SchoolYear` with the specified dates as the first and last days of the school year.

### Static properties

```ts
.Periods: Object
```
An object of constants which are used to identify periods. For example, `GunnSchedule.Periods.A` is the name used to identify A periods.

### Static methods

```ts
.normalSchedule(day: number): Period[]
```
Returns an array of `Period`s for the normal schedule on the given day of the week (an integer between 0 and 6).

## `SchoolYear`

Represents a school year and fetches, parses, and stores the alternate schedules during that year.

### Properties

```ts
.firstDay: number
.lastDay: number
```
The first and last days as given in the constructor, converted to the number of milliseconds since the Unix Epoch.

### Methods

```ts
.update(): Promise<void>
```
Fetches, parses, and stores/updates the alternate schedules (and SELF classes) for the entire school year.

```ts
.update(date: UTCDate): Promise<void>
```
Like above, but it only fetches the alternate schedules for the specified day.

```ts
.update(startDay: UTCDate, endDay: UTCDate): Promise<void>
```
Like above, but it fetches the alternate schedules in the range between the given dates.

```ts
.get(date: UTCDate): Day
```
Returns a new instance of `Day` with the schedule data of the specified day.

## `Day`

Contains the schedule for the school day it represents.

### Properties

```ts
.date: Date
```
The JavaScript `Date` object representing the school day's date in UTC; you can use UTC methods on this such as `getUTCFullYear` or `getUTCDay`.

```ts
.day: number
```
The day of the week of the school day in UTC (equivalent to `dayInstance.date.getUTCDay()`).

```ts
.periods: Period[]
```
The periods during the school day. May be empty on no-school days.

```ts
.school: boolean
.alternate: boolean
.summer: boolean
```
Respectively, whether or not the school day has school, has an alternate schedule, and is outside the range of the school year that it came from (which is assumed to be during summer break, hence the name).

### Methods

```ts
.toJSON(): Object[]
```
Returns an array of plain object representations of each period; you can use `JSON.stringify` with this.

## `Period`

Represents a period in a school day.

### Properties

```ts
.period: string
```
The ID of the period. This should be compared with the constants in `GunnSchedule.Periods` for identification.

```ts
.start: Time
.end: Time
```
The start and end times of the period.

```ts
.selfGrades: number[]
```
Only for SELF periods: an array of grade level numbers possibly containing at least one of `[9, 10, 11, 12]`.

### Methods

```ts
.toJSON(): Object
```
Returns a plain object representation of the period. `period` has the period ID, and `start` and `end` are the `totalMinutes` of the start and end times, respectively.

## `Time`

Represents a time during the day in minutes in local Gunn time.

### Properties

```ts
.hour: number
```
The hour component of the time. An integer between 0 and 23.

```ts
.minute: number
```
The minute component of the time. An integer between 0 and 59.

```ts
.totalMinutes: number
```
The number of minutes since the beginning of the day; equivalent to `time.hour * 60 + time.minute`. Useful for comparing times or calculating the duration of a period.

### Methods

```ts
.toTime(militaryTime: boolean = false): string
```

Formats the time in 12-hour (`1:01 pm`), or 24-hour (`13:01`) if `militaryTime` is `true` (it is `false` by default).

# Development

```sh
# Run lint and tests
npm test

# Build web versions using Webpack
npm run build

# If you're on Windows, you need this to be able to run prepublishOnly (to set NODE_ENV=production):
npm install -g win-node-env

# Publish to NPM
npm publish
```
