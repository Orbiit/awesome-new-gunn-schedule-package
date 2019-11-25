class Time {
  constructor (totalMinutes) {
    this.totalMinutes = totalMinutes
    this.hour = Math.floor(totalMinutes / 60)
    this.minute = totalMinutes % 60
  }

  toTime (militaryTime = false) {
    const minutes = this.minute.toString().padStart(2, '0')
    if (militaryTime) {
      return `${this.hour}:${minutes}`
    } else {
      return `${(this.hour + 11) % 12 + 1}:${minutes} ${this.hour < 12 ? 'am' : 'pm'}`
    }
  }
}

module.exports = Time
