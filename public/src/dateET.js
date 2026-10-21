exports.dateFormattedET = function () {
   let timeNow = new Date()
    let dayNow = timeNow.getDay()
    let dateNow = timeNow.getDate()
    let monthNow = timeNow.getMonth()
    let yearNow = timeNow.getFullYear()
    const monthNamesET = ['jaanuar','veebruar','märts','aprill','mai','juuni','juuli','august','september','oktoober','november','detsember']
    const dayNamesET = ['esmaspäev','teisipäev','kolmapäev','neljapäev','reede','laupäev','pühapäev']
    return 'Täna on ' +  dayNamesET[dayNow-1] + '. ' + dateNow + '.' + monthNamesET[monthNow] + ' ' + yearNow
}