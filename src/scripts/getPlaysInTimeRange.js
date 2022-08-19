const getPlaysInTimeRange = (songs, timeRange) => {
    let deltaTime
    switch(timeRange){
        case 0:
            deltaTime = Infinity
            break
        case 1:
            deltaTime = 1000 * 60 * 60 * 24 * 365
            break
        case 2:
            deltaTime = 1000 * 60 * 60 * 24 * 30
            break
        case 3:
            deltaTime = 1000 * 60 * 60 * 24 * 7
            break
    }

    const minDateToInclude = Date.now() - deltaTime

    const songsWithFilteredPlays = []
    songs.forEach(song => {
        let plays = 0
        if(minDateToInclude == -Infinity){
            plays = song.plays.length
        } else {
            for(let i = 0;i<song.plays.length;i++){
                if(song.plays[i] > minDateToInclude){
                    plays++
                } else {
                    i = song.plays.length
                }
            }
        }
        songsWithFilteredPlays.push({
            ...song,
            plays
        })
    })

    return songsWithFilteredPlays
}

export default getPlaysInTimeRange