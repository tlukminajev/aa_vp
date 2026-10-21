const monthNamesET = ['jaanuar','veebruar','märts','aprill','mai','juuni','juuli','august','september','oktoober','november','detsember']
// rahvakalendri kuunimed
const monthNamesFolkET = ['näärikuu','küünlakuu','urbekuu','jürikuu','lehekuu','jaanikuu','heinakuu','lõikuskuu','mihklikuu','viinakuu','hingekuu','jõulukuu']
const dayNamesET = ['esmaspäev','teisipäev','kolmapäev','neljapäev','reede','laupäev','pühapäev']

const weekDayET = function() {
    let timeNow = new Date()
    let dayNow = timeNow.getDay()
    // getDay(): 0 = pühapäev ... 6 = laupäev; meie massiiv algab esmaspäevast
    let dayIndex = (dayNow === 0) ? 6 : dayNow - 1
    return dayNamesET[dayIndex]
}

// monthType: 0 = tavalised kuunimed, 1 = rahvakalendri kuunimed
const dateFormattedET = function(monthType) {
    let timeNow = new Date()
    let dateNow = timeNow.getDate()
    let monthNow = timeNow.getMonth()
    let yearNow = timeNow.getFullYear()
    let monthName
    if (monthType === 1) {
        monthName = monthNamesFolkET[monthNow]
    } else {
        monthName = monthNamesET[monthNow]
    }
    return dateNow + '. ' + monthName + ' ' + yearNow
}

const timeFormattedET = function() {
    let timeNow = new Date()
    let hourNow = ('0' + timeNow.getHours()).slice(-2)
    let minuteNow = ('0' + timeNow.getMinutes()).slice(-2)
    let secondNow = ('0' + timeNow.getSeconds()).slice(-2)
    return hourNow + ':' + minuteNow + ':' + secondNow
}

module.exports = {dateET: dateFormattedET, timeET: timeFormattedET, weekDayET: weekDayET}
