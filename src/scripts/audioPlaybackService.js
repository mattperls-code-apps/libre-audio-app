import TrackPlayer, { Capability, Event } from "react-native-track-player"

import getAudioUrl from "./getAudioUrl"
import Storage from "./storage"

const audioPlaybackService = async () => {
    await TrackPlayer.setupPlayer({
        waitForBuffer: true,
        minBuffer: 30,
        playBuffer: 15,
        backBuffer: 15
    })

    const capabilities = [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.SkipToPrevious,
        Capability.SkipToNext
    ]
    TrackPlayer.updateOptions({ capabilities })

    const playSubscriber = TrackPlayer.addEventListener(Event.RemotePlay, TrackPlayer.play)
    const pauseSubscriber = TrackPlayer.addEventListener(Event.RemotePause, TrackPlayer.pause)
    const seekSubscriber = TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position))

    const previousSubscriber = TrackPlayer.addEventListener(Event.RemotePrevious, () => {
        TrackPlayer.getCurrentTrack().then((currentIndex) => {
            if(currentIndex != 0){
                TrackPlayer.skipToPrevious()
            } else {
                TrackPlayer.seekTo(0)
            }
        })
    })
    const nextSubscriber = TrackPlayer.addEventListener(Event.RemoteNext, () => {
        TrackPlayer.getCurrentTrack().then((currentIndex) => {
            TrackPlayer.getQueue().then((queue) => {
                if(currentIndex != queue.length - 1){
                    TrackPlayer.skipToNext()
                } else {
                    TrackPlayer.destroy()
                    TrackPlayer.setupPlayer({
                        waitForBuffer: true,
                        minBuffer: 30,
                        playBuffer: 15,
                        backBuffer: 15
                    })
                }
            })
        })
    })

    const errorSubscriber = TrackPlayer.addEventListener(Event.PlaybackError, () => {
        TrackPlayer.getCurrentTrack().then((currentIndex) => {
            TrackPlayer.getQueue().then((queue) => {
                if(currentIndex == queue.length - 1){
                    TrackPlayer.destroy()
                    TrackPlayer.setupPlayer({
                        waitForBuffer: true,
                        minBuffer: 30,
                        playBuffer: 15,
                        backBuffer: 15
                    })
                } else {
                    const track = queue[currentIndex]
                    getAudioUrl(track.id, (url) => {
                        TrackPlayer.add({
                            ...track,
                            url
                        }).then(() => {
                            TrackPlayer.skipToNext().then(() => {
                                TrackPlayer.remove(currentIndex)
                            })
                        })
                    })
                }
            })
        })
    })

    let currentPlayerIndex = 0

    const changeSubscriber = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (e) => {
        if(e.hasOwnProperty("nextTrack")){
            currentPlayerIndex = e.nextTrack
        }
    })
    const endedSubscriber = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
        TrackPlayer.getTrack(currentPlayerIndex).then(track => {
            const storage = new Storage()
            storage.initialize(() => {
                storage.incrementSongPlay(track.id)
            })
            TrackPlayer.getTrack(currentPlayerIndex + 1).then(nextTrack => {
                if(nextTrack == null){
                    TrackPlayer.destroy()
                    TrackPlayer.setupPlayer({
                        waitForBuffer: true,
                        minBuffer: 30,
                        playBuffer: 15,
                        backBuffer: 15
                    })
                }
            })
        })
    })

    return () => {
        playSubscriber.remove()
        pauseSubscriber.remove()
        seekSubscriber.remove()
        
        previousSubscriber.remove()
        nextSubscriber.remove()

        errorSubscriber.remove()

        changeSubscriber.remove()
        endedSubscriber.remove()
    }
}

export default audioPlaybackService