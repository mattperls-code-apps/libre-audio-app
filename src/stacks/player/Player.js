import React, { useState, useEffect } from "react"

import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faBackward, faForward, faPlayCircle, faPauseCircle } from "@fortawesome/free-solid-svg-icons"

import FastImage from "react-native-fast-image"
import Slider from "@react-native-community/slider"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import TrackPlayer, { Event, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player"

import { lengthToTimeString } from "../../scripts/timeUtils"

import { screen, colors } from "../../constants"

const PlayerStack = ({ navigation, route }) => {
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
        id: route.params.id,
        title: route.params.title,
        artist: route.params.artist,
        description: route.params.description,
        thumbnail: route.params.artwork,
        duration: route.params.duration
    })
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)

    useEffect(() => {
        navigation.setOptions({
            headerTitle: currentSong.description
        })
    }, [currentSong.description])

    const progress = useProgress(400)

    useTrackPlayerEvents([
        Event.PlaybackError,
        Event.PlaybackTrackChanged,
        Event.PlaybackQueueEnded
    ], (event) => {
        if(event.type == Event.PlaybackError){
            TrackPlayer.getCurrentTrack().then((currentIndex) => {
                TrackPlayer.getQueue().then((queue) => {
                    if(currentIndex == queue.length - 1){
                        navigation.navigate("App")
                    }
                })
            })
        } else if(event.type == Event.PlaybackTrackChanged){
            if(event.hasOwnProperty("nextTrack")){
                setCurrentPlayerIndex(event.nextTrack)
            }
            TrackPlayer.getCurrentTrack().then((currentIndex) => {
                if(currentIndex == null){
                    navigation.navigate("App")
                } else {
                    TrackPlayer.getQueue().then((queue) => {
                        const track = queue[currentIndex]
                        setCurrentSong({
                            id: track.id,
                            title: track.title,
                            artist: track.artist,
                            description: track.description,
                            thumbnail: track.artwork,
                            duration: track.duration
                        })
                    })
                }
            })
        } else if(Event.PlaybackQueueEnded) {
            TrackPlayer.getQueue().then((queue) => {
                if(currentPlayerIndex == queue.length - 1){
                    navigation.navigate("App")
                }
            })
        }
    })

    const [overridePosition, setOverridePosition] = useState(-1)

    const handleSeek = (position) => {
        setOverridePosition(position)
        TrackPlayer.seekTo(position).then(() => {
            setOverridePosition(-1)
        })
    }

    const attemptToSkipToPrevious = () => {
        setOverridePosition(0)
        TrackPlayer.pause().then(() => {
            TrackPlayer.getCurrentTrack().then((currentIndex) => {
                if(currentIndex != 0){
                    TrackPlayer.skipToPrevious().then(() => {
                        TrackPlayer.play().then(() => {
                            setOverridePosition(-1)
                        })
                    })
                } else {
                    TrackPlayer.seekTo(0).then(() => {
                        TrackPlayer.play().then(() => {
                            setOverridePosition(-1)
                        })
                    })
                }
            })
        })
    }

    const attemptToSkipToNext = () => {
        setOverridePosition(0)
        TrackPlayer.pause().then(() => {
            TrackPlayer.getCurrentTrack().then((currentIndex) => {
                TrackPlayer.getQueue().then((queue) => {
                    if(currentIndex != queue.length - 1){
                        TrackPlayer.skipToNext().then(() => {
                            TrackPlayer.play().then(() => {
                                setOverridePosition(-1)
                            })
                        })
                    } else {
                        TrackPlayer.destroy()
                        TrackPlayer.setupPlayer({
                            waitForBuffer: true,
                            minBuffer: 30,
                            playBuffer: 15,
                            backBuffer: 15
                        })
                        navigation.navigate("App")
                    }
                })
            })
        })
    }

    const openAddToPlaylist = () => {
        navigation.push("SongInfo", currentSong)
    }

    return (
        <View style={styles.container}>
            <View style={styles.thumbnailContainer}>
                <FastImage style={styles.thumbnailImage} source={{ uri: currentSong.thumbnail }} resizeMode={"cover"} />
            </View>
            <View style={styles.seekSliderContainer}>
                <View style={styles.seekSliderDuration} />
                <View style={[styles.seekSliderBuffered, { width: 15 + (progress.buffered / currentSong.duration) * (screen.width - 35) }]} />
                <View style={[styles.seekSliderPosition, { width: 15 + ((overridePosition == -1 ? progress.position : overridePosition) / currentSong.duration) * (screen.width - 35) }]} />
                <Slider style={styles.seekSlider} minimumValue={0} maximumValue={currentSong.duration} minimumTrackTintColor={"transparent"} maximumTrackTintColor={"transparent"} thumbTintColor={colors.flair} step={0.5} value={overridePosition == -1 ? progress.position : overridePosition} onValueChange={setOverridePosition} onSlidingComplete={handleSeek} />
            </View>
            <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>
                    {
                        lengthToTimeString((overridePosition == -1 ? progress.position : overridePosition))
                    }
                </Text>
                <Text style={styles.progressLabel}>
                    {
                        lengthToTimeString(currentSong.duration - (overridePosition == -1 ? progress.position : overridePosition))
                    }
                </Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {
                        currentSong.title
                    }
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                    {
                        currentSong.artist
                    }
                </Text>
            </View>
            <View style={{ flex: 1, marginBottom: screen.bottom }}>
                <View style={styles.controlsContainer}>
                    <TouchableOpacity onPress={attemptToSkipToPrevious} activeOpacity={0.8}>
                        <View style={styles.control}>
                            <FontAwesomeIcon icon={faBackward} color={colors.flair} size={36} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlaying} activeOpacity={0.8}>
                        <View style={[styles.control, { marginHorizontal: 24 }]}>
                            <FontAwesomeIcon icon={playerState == State.Playing ? faPauseCircle : faPlayCircle} color={colors.flair} size={64} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={attemptToSkipToNext} activeOpacity={0.8}>
                        <View style={styles.control}>
                            <FontAwesomeIcon icon={faForward} color={colors.flair} size={36} />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={openAddToPlaylist} activeOpacity={0.8}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Add Song</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.extraDark
    },
    thumbnailContainer: {
        width: screen.width,
        height: screen.width * 9/16
    },
    thumbnailImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10
    },
    seekSliderContainer: {
        width: screen.width - 20,
        height: 40,
        alignSelf: "center",
        justifyContent: "center"
    },
    seekSliderDuration: {
        position: "absolute",
        left: 0,
        width: "100%",
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.light
    },
    seekSliderBuffered: {
        position: "absolute",
        left: 0,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.extraLight
    },
    seekSliderPosition: {
        position: "absolute",
        left: 0,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.flair
    },
    seekSlider: {
        width: "100%"
    },
    progressLabels: {
        width: screen.width - 20,
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between"
    },
    progressLabel: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 14,
        color: colors.extraLight
    },
    infoContainer: {
        width: "100%",
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 2,
        borderTopColor: colors.dark,
        borderBottomWidth: 2,
        borderBottomColor: colors.dark,
        backgroundColor: colors.black,
        alignItems: "center"
    },
    title: {
        width: screen.width - 20,
        fontFamily: "Roboto",
        fontWeight: "900",
        fontSize: 24,
        color: colors.extraLight,
        textAlign: "center"
    },
    artist: {
        width: screen.width - 20,
        marginTop: 6,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        color: colors.light,
        textAlign: "center"
    },
    controlsContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    control: {
        padding: 24,
        borderRadius: 60
    },
    buttonContainer: {
        width: screen.width - 20,
        height: 60,
        margin: 10,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: colors.flair
    },
    buttonText: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 20,
        color: colors.extraLight
    }
})

export default PlayerStack