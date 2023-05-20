import AsyncStorage from "@react-native-async-storage/async-storage"

import RNFetchBlob from "rn-fetch-blob"

import getAudioUrl from "./getAudioUrl"

class Storage {
    constructor(){
        this.data = {
            songs: [],
            playlists: []
        }
    }
    static getPath(id){
        return RNFetchBlob.fs.dirs.DocumentDir + "/libre-audio/" + id + ".mp4"
    }
    download(id, audioUrl){
        const path = Storage.getPath(id)
        RNFetchBlob.config({
            path,
            IOSBackgroundTask: true
        }).fetch("GET", audioUrl).then(() => {
            this.initialize(() => {
                for(let i = 0;i<this.data.songs.length;i++){
                    if(this.data.songs[i].id == id){
                        this.data.songs[i].downloaded = true
                        i = this.data.songs.length
                    }
                }
                console.log("downloaded " + this.getSong(id).title)
                AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
                    if(err){
                        console.warn(err)
                    }
                })
            })
        })
    }
    initialize(callback){
        AsyncStorage.getItem("libre-storage", (err, res) => {
            if(err){
                console.warn(err)
                callback()
            } else if(res == null){
                AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
                    if(err){
                        console.warn(err)
                        callback()
                    } else {
                        callback()
                    }
                })
            } else {
                this.data = JSON.parse(res)
                callback()
            }
        })
    }
    getSong(id){
        for(let i = 0;i<this.data.songs.length;i++){
            if(this.data.songs[i].id == id){
                return this.data.songs[i]
            }
        }
        return null
    }
    addSong(id, title, artist, thumbnail, duration, callback){
        if(!this.data.songs.some(song => song.id == id)){
            this.data.songs.unshift({ id, title, artist, thumbnail, duration, plays: [], downloaded: false })
        }
        AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
            if(err){
                console.warn(err)
                getAudioUrl(id, () => {})
                callback()
            } else {
                getAudioUrl(id, () => {})
                callback()
            }
        })
    }
    incrementSongPlay(id){
        for(let i = 0;i<this.data.songs.length;i++){
            if(this.data.songs[i].id == id){
                this.data.songs[i].plays.unshift(Date.now())
                i = this.data.songs.length
            }
        }
        console.log("played " + this.getSong(id).title)
        AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
            if(err){
                console.warn(err)
            }
        })
    }
    editSong(id, title, artist, callback){
        for(let i = 0;i<this.data.songs.length;i++){
            if(this.data.songs[i].id == id){
                this.data.songs[i].title = title
                this.data.songs[i].artist = artist
                i = this.data.songs.length
            }
        }
        AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
            if(err){
                console.warn(err)
                callback()
            } else {
                callback()
            }
        })
    }
    removeSong(id, callback){
        this.data.songs = this.data.songs.filter(song => song.id != id)
        for(let i = 0;i<this.data.playlists.length;i++){
            if(this.data.playlists[i].songs.includes(id)){
                this.data.playlists[i].songs.splice(this.data.playlists[i].songs.indexOf(id), 1)
            }
        }
        RNFetchBlob.fs.unlink(Storage.getPath(id))
        AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
            if(err){
                console.warn(err)
                callback()
            } else {
                callback()
            }
        })
    }
    mergeSong(mergingId, mergeBaseId, callback){
        // merging to be deleted, merge base to assume stat data
        const mergingSong = this.getSong(mergingId)
        const mergeBaseSong = this.getSong(mergeBaseId)

        console.log([ ...mergingSong.plays, ...mergeBaseSong.plays ].sort().reverse())

        this.data.songs.find(song => song.id == mergeBaseId).plays = [ ...mergingSong.plays, ...mergeBaseSong.plays ].sort().reverse()

        this.removeSong(mergingId, callback)
    }
    getPlaylist(id){
        for(let i = 0;i<this.data.playlists.length;i++){
            if(this.data.playlists[i].id == id){
                return this.data.playlists[i]
            }
        }
        return null
    }
    createPlaylist(id, name, callback){
        this.data.playlists.unshift({ id, name, songs: [] })
        AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
            if(err){
                console.warn(err)
                callback()
            } else {
                callback()
            }
        })
    }
    addSongToPlaylists(playlistIds, songId, callback){
        for(let i = 0;i<this.data.playlists.length;i++){
            if(playlistIds.includes(this.data.playlists[i].id)){
                if(!this.data.playlists[i].songs.includes(songId)){
                    this.data.playlists[i].songs.unshift(songId)
                }
            } else if(this.data.playlists[i].songs.includes(songId)) {
                this.data.playlists[i].songs.splice(this.data.playlists[i].songs.indexOf(songId), 1)
            }
        }
        AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
            if(err){
                console.warn(err)
                callback()
            } else {
                callback()
            }
        })
    }
    setSongsInPlaylist(playlistId, songIds, callback){
        for(let i = 0;i<this.data.playlists.length;i++){
            if(this.data.playlists[i].id == playlistId){
                this.data.playlists[i].songs = songIds
                i = this.data.playlists.length
            }
        }
        AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
            if(err){
                console.warn(err)
                callback()
            } else {
                callback()
            }
        })
    }
    renamePlaylist(id, name, callback){
        for(let i = 0;i<this.data.playlists.length;i++){
            if(this.data.playlists[i].id == id){
                this.data.playlists[i].name = name
                i = this.data.playlists.length
            }
        }
        AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
            if(err){
                console.warn(err)
                callback()
            } else {
                callback()
            }
        })
    }
    removePlaylist(id, callback){
        this.data.playlists = this.data.playlists.filter(playlist => playlist.id != id)
        AsyncStorage.setItem("libre-storage", JSON.stringify(this.data), (err) => {
            if(err){
                console.warn(err)
                callback()
            } else {
                callback()
            }
        })
    }
}

export default Storage