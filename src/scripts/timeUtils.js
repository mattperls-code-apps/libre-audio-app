const timeStringToLength = (timeStr) => {
    let length = 0

    const parts = timeStr.split(":").reverse()
    length += parts.length > 0 ? parseInt(parts[0]) : 0
    length += parts.length > 1 ? 60 * parseInt(parts[1]) : 0
    length += parts.length > 2 ? 60 * 60 * parseInt(parts[2]) : 0

    return length
}

const lengthToTimeString = (length) => {
    if(length > 24 * 60 * 60){
        return "24:00:00"
    }
    let hours = Math.floor(length / 3600)
    let minutes = Math.floor((length - hours * 3600) / 60)
    let seconds = Math.round(length - minutes * 60 - hours * 3600)
    if(seconds == 60){
        seconds = 0
        minutes++
    }
    if(minutes == 60){
        minutes = 0
        hours++
    }
    if(seconds < 10){
        seconds = "0" + seconds
    }
    if(hours != 0 && minutes < 10){
        minutes = "0" + minutes
    }
    let timeString = minutes + ":" + seconds
    if(hours != 0){
        timeString = hours + ":" + timeString
    }
    return timeString
}

export {
    timeStringToLength,
    lengthToTimeString
}