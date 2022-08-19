import Storage from "./storage"

import RNFetchBlob from "rn-fetch-blob"
import ytdl from "react-native-ytdl"

const getAudioUrl = (id, callback) => {
    const storage = new Storage()
    storage.initialize(() => {
        const song = storage.getSong(id)
        if(song == null){
            ytdl("https://www.youtube.com/watch?v=" + id, { filter: format => format.container == "mp4" && format.hasAudio && format.hasVideo }).then(res => {
                callback(res[0].url)
            })
        } else if(!song.downloaded){
            ytdl("https://www.youtube.com/watch?v=" + id, { filter: format => format.container == "mp4" && format.hasAudio && format.hasVideo }).then(res => {
                callback(res[0].url)
                storage.initialize(() => {
                    storage.download(id, res[0].url)
                })
            })
        } else {
            const path = Storage.getPath(id)
            RNFetchBlob.fs.exists(path).then(exists => {
                if(exists){
                    callback(path)
                } else {
                    ytdl("https://www.youtube.com/watch?v=" + id, { filter: format => format.container == "mp4" && format.hasAudio && format.hasVideo }).then(res => {
                        callback(res[0].url)
                        storage.initialize(() => {
                            storage.download(id, res[0].url)
                        })
                    })
                }
            })
        }
    })
}

const fetchPlaylistAudio = (playlistSongs, playlistName, callback) => {
    Promise.all(playlistSongs.map(song => {
        return new Promise((resolve) => {
            getAudioUrl(song.id, (url) => {
                resolve({
                    ...song,
                    artwork: song.thumbnail,
                    description: playlistName,
                    url
                })
            })
        })
    })).then(callback)
}

export default getAudioUrl
export { fetchPlaylistAudio }