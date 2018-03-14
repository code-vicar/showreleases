const moment = require('moment')

/*
* Calculates number of business days, taking into account:
*  - weekends (Saturdays and Sundays)
*  - bank holidays in the middle of the week
*
* firstDay: First day in the time interval (momentjs date instance)
* lastDay: Last day in the time interval (momentjs date instance)
* holidays: List of holidays excluding weekends
*
* returns number of business days during the 'span'
*/
const getBusinessDays = (firstDay, lastDay) => {
  if (!firstDay.isBefore(lastDay)) {
    throw new Error('First day must be before last day')
  }
  const duration = moment.duration(lastDay - firstDay)
  let businessDays = Math.ceil(duration.asDays())
  const fullWeekCount = Math.floor(businessDays / 7)
  // find out if there are weekends during the time exceeding the full weeks
  if (businessDays > (fullWeekCount * 7)) {
    // we are here to find out if there is a 1-day or 2-day weekend
    // in the time interval remaining after subtracting the complete weeks
    const firstDayOfWeek = firstDay.weekday()
    let lastDayOfWeek = lastDay.weekday()
    if (lastDayOfWeek < firstDayOfWeek) {
      lastDayOfWeek += 7
    }
    if (firstDayOfWeek <= 6) {
      if (lastDayOfWeek >= 7) { // Both Saturday and Sunday are in the remaining time interval
        businessDays -= 2;
      } else if (lastDayOfWeek >= 6) { // Only Saturday is in the remaining time interval
        businessDays -= 1;
      }
    } else if (firstDayOfWeek <= 7 && lastDayOfWeek >= 7) { // Only Sunday is in the remaining time interval
        businessDays -= 1;
    }
  }

  // each full week contains 2 weekend days
  businessDays -= (fullWeekCount * 2);

  return businessDays;
}

module.exports = getBusinessDays
