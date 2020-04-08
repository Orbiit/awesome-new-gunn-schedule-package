could perhaps accept a lot of settings, like

```js
new GunnSchedule({
  doubleFlex: false,
  defaultSelf: 0b111,
  breaksHavePassing: false,
  firstDay: Date.UTC(...),
  lastDay: Date.UTC(...)
})
```

but have predefined settings, like

```js
GunnSchedule.YEAR_2019_20 = {
  doubleFlex: false,
  defaultSelf: 0b111,
  breaksHavePassing: false,
  firstDay: Date.UTC(...),
  lastDay: Date.UTC(...)
}

new GunnSchedule(GunnSchedule.YEAR_2019_20)
```

also could perhaps recognize common schedules, like

```js
switch (schedule.matchTemplate(periods)) {
  case GunnSchedule.FOUR_DAY_WEEK_ODD:
    //
  case GunnSchedule.FOUR_DAY_WEEK_EVEN:
    //
  case GunnSchedule.FOUR_DAY_WEEK_EVEN_NO_SELF:
    //
  case GunnSchedule.THREE_DAY_WEEK_DAY_1:
    //
  case GunnSchedule.THREE_DAY_WEEK_DAY_2:
    //
  case GunnSchedule.THREE_DAY_WEEK_DAY_3:
    //
  case GunnSchedule.FINALS_REVIEW:
    //
  case GunnSchedule.FINAL_DAY_1:
    //
  case GunnSchedule.FINAL_DAY_2:
    //
  case GunnSchedule.FINAL_DAY_3:
    //
  default:
    //
}
```
