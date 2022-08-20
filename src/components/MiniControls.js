import React, { useState, useEffect } from "react"

import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronUp, faPlayCircle, faPauseCircle } from "@fortawesome/free-solid-svg-icons"

import TrackPlayer, { Event, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import getAudioUrl from "../scripts/getAudioUrl"

import { screen, colors } from "../constants"

const MiniControls = ({ navigation }) => {
    const [open, setOpen] = useState(false)

    const playerState = usePlaybackState()
    const togglePlaying = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })

        if(playerState == State.Playing){
            TrackPlayer.pause()
        } else {
            TrackPlayer.play()
        }
    }

    const [currentSong, setCurrentSong] = useState({
        id: "",
        title: "",
        artist: "",
        description: "",
        artwork: "",
        duration: 1
    })
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
    
    const progress = useProgress(200)

    useTrackPlayerEvents([
        Event.PlaybackError,
        Event.PlaybackTrackChanged,
        Event.PlaybackQueueEnded
    ], (event) => {
        if(event.type == Event.PlaybackError){
            TrackPlayer.getCurrentTrack().then((currentIndex) => {
                TrackPlayer.getQueue().then((queue) => {
                    if(currentIndex == queue.length - 1){
                        Alert.alert("Please Try Again", "An error occurred playing the last song.\n\nIf this keeps happening, try removing the song from your library and adding it again.")
                        setOpen(false)
                        navigation.navigate("App")
                    } else {
                        Alert.alert("Error Playing Song", "An error occurred playing the last song. It was automatically added back to the end of the current queue.\n\nIf this keeps happening, try removing the song from your library and adding it again.")
                    }
                })
            })
        } else if(event.type == Event.PlaybackTrackChanged){
            if(event.hasOwnProperty("nextTrack")){
                if(event.position == 0){
                    setOpen(true)
                }
                setCurrentPlayerIndex(event.nextTrack)
            }
            TrackPlayer.getCurrentTrack().then((currentIndex) => {
                if(currentIndex != null){
                    TrackPlayer.getTrack(currentIndex).then((track) => {
                        setCurrentSong({
                            id: track.id,
                            title: track.title,
                            artist: track.artist,
                            description: track.description,
                            artwork: track.artwork,
                            duration: track.duration
                        })
                    })
                    TrackPlayer.play()
                }
            })
        } else if(event.type == Event.PlaybackQueueEnded){
            if(event.track == currentPlayerIndex){
                setOpen(false)
                navigation.navigate("App")
            }
        }
    })

    const openPlayer = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        
        navigation.push("Player", {
            id: currentSong.id,
            title: currentSong.title,
            artist: currentSong.artist,
            description: currentSong.description,
            artwork: currentSong.artwork,
            duration: currentSong.duration
        })
    }

    return open && (
            <View style={{ position: "absolute", top: -60, width: screen.width }}>
                <TouchableOpacity onPress={openPlayer} activeOpacity={0.8}>
                    <View style={styles.container}>
                        <View style={{ position: "absolute", top: 0, width: "100%", height: 2, backgroundColor: colors.dark }}>
                            <View style={{ position: "absolute", top: 0, width: screen.width * progress.buffered / currentSong.duration, height: 2, backgroundColor: colors.light }}>
                                <View style={{ width: screen.width * progress.position / currentSong.duration, height: 2, backgroundColor: colors.flair }} />
                            </View>
                        </View>
                        <View style={styles.button}>
                            <FontAwesomeIcon icon={faChevronUp} color={colors.light} size={24} />
                        </View>
                        <Text style={styles.title} numberOfLines={1}>
                            {
                                currentSong.title
                            }
                        </Text>
                        <TouchableOpacity onPress={togglePlaying} activeOpacity={0.8}>
                            <View style={styles.button}>
                                <FontAwesomeIcon icon={playerState == State.Playing ? faPauseCircle : faPlayCircle} color={colors.flair} size={24} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 60,
        backgroundColor: colors.extraDark,
        paddingTop: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        height: "100%",
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        flex: 1,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 20,
        color: colors.extraLight
    }
})

export default MiniControls