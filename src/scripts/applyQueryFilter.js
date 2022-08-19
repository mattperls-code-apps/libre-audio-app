const queryFilter = (arr, query, scorer) => {
    const formattedQuery = query.trim().replace(/\s\s+/g, " ").toLowerCase()
    
    if(formattedQuery.length == 0){
        return arr
    } else {
        const queryParts = formattedQuery.split(" ")

        const queried = []
        arr.forEach((item, index) => {
            let score = 0
            queryParts.forEach(queryPart => {
                score += scorer(item, queryPart)
            })
            if(score != 0){
                queried.push({ score, index })
            }
        })

        queried.sort((a, b) => {
            if(a.score < b.score){
                return 1
            } else if(a.score > b.score){
                return -1
            } else {
                return 0
            }
        })

        const results = []
        queried.forEach(queriedItem => {
            results.push(arr[queriedItem.index])
        })

        return results
    }
}

const queryFilterSongs = (songs, query) => {
    return queryFilter(songs, query, (song, queryPart) => {
        let score = 0
        song.title.trim().replace(/\s\s+/g, " ").toLowerCase().split(" ").forEach(titlePart => {
            if(queryPart == titlePart){
                score += 4
            } else if(titlePart.includes(queryPart)){
                score += 2
            }
        })
        song.artist.trim().replace(/\s\s+/g, " ").toLowerCase().split(" ").forEach(artistPart => {
            if(queryPart == artistPart){
                score += 3
            } else if(artistPart.includes(queryPart)){
                score++
            }
        })
        return score
    })
}

const queryFilterPlaylists = (playlists, query) => {
    return queryFilter(playlists, query, (playlist, queryPart) => {
        let score = 0
        playlist.name.trim().replace(/\s\s+/g, " ").toLowerCase().split(" ").forEach(namePart => {
            if(queryPart == namePart){
                score += 3
            } else if(namePart.includes(queryPart)){
                score++
            }
        })
        return score
    })
}

export {
    queryFilterSongs,
    queryFilterPlaylists
}