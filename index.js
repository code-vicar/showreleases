const moment = require('moment')
const getBusinessDays = require('./get_business_days')

const weeksInYear = Math.floor((365 / 7))
const weekOffset = 2       // # starting week to calculate releases from
const releaseIntervals = 2 // # of weeks per release
const releaseDayOfWeek = 2 // 2 === Tuesdays
const releaseIndices = weeksInYear / releaseIntervals

const releasenumbers = Array.from({length: releaseIndices}).map((_, index) => (
   `${((index * releaseIntervals) + weekOffset).toString().padStart(2, '0')}`
))

const getDate = num => (moment().week(num).weekday(releaseDayOfWeek))
const releases = releasenumbers.map(getDate).map((date, index) => ({
  releaseDate: date,
  releaseNumber: releasenumbers[index]
}))
const now = moment()
const currentMonth = moment().month()

const display = new Map()
Array.from({length: 12}).forEach((_, monthIndex) => {
  const month = moment().month(monthIndex)
  let monthKey = month.format('MMM')
  if (monthIndex < currentMonth) {
    display.set(monthKey, [])
    return
  }
  if (monthKey == now.format('MMM')) {
    monthKey = `${monthKey}(now)`
  }
  display.set(monthKey, releases.map((release) => {
    const timeDiff = release.releaseDate - now
    return {
      display: release.releaseDate.format('Do'),
      isInMonth: month.month() === release.releaseDate.month(),
      durationFromNow: (timeDiff >= 0) ? moment.duration(timeDiff) : null,
      releaseDate: release.releaseDate,
      releaseNumber: release.releaseNumber
    }
  }).filter((release) => {
    return (release.isInMonth && release.durationFromNow !== null)
  }).map((release) => {
    const months = release.durationFromNow.months()
    const days = release.durationFromNow.days()
    return `W${release.releaseNumber}: ${release.display} in${months ? ` ${months} month and` : ''} ${days} days (${getBusinessDays(now, release.releaseDate)} total business days)`
  }))
})

display.forEach((value, key) => {
  console.log(key)
  value.forEach((release) => {
    console.log(`    ${release}`)
  })
})
