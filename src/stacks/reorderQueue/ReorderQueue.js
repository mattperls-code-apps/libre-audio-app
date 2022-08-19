import React, { useState, useEffect } from "react"

import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

import DraggableFlatlist from "react-native-draggable-flatlist"
import SwipeableItem from "react-native-swipeable-item"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

import { StaticSongItem, QueueSongItem } from "../../components/SongItem"

import TrackPlayer, { Event, useTrackPlayerEvents } from "react-native-track-player"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { screen, colors } from "../../constants"

const ReorderQueueStack = ({ navigation }) => {
    const [queue, setQueue] = useState([])

    useEffect(() => {
        TrackPlayer.getQueue().then(currentQueue => {
            TrackPlayer.getCurrentTrack().then(index => {
                setQueue(currentQueue.slice(index))
            })
        })
    }, [])

    useTrackPlayerEvents([ Event.PlaybackTrackChanged ], (event) => {
        if(event.type == Event.PlaybackTrackChanged){
            TrackPlayer.getQueue().then(currentQueue => {
                TrackPlayer.getCurrentTrack().then(index => {
                    setQueue(currentQueue.slice(index))
                })
            })
        }
    })

    const handleDrag = ({ from, to, data }) => {
        if(from == to) return
        
        setQueue([ queue[0], ...data ])

        TrackPlayer.removeUpcomingTracks().then(() => {
            TrackPlayer.add(data)
        })
    }

    const removeFromQueue = (index) => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })

        const tempQueue = [...queue]
        tempQueue.splice(index + 1, 1)
        setQueue(tempQueue)

        TrackPlayer.getCurrentTrack().then(offset => {
            TrackPlayer.remove(index + offset + 1)
        })
    }

    const handleDonePress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            {
                queue.length > 0 && (
                    <React.Fragment>
                        <Text style={styles.sectionTitle}>Now Playing</Text>
                        <StaticSongItem title={queue[0].title} artist={queue[0].artist} thumbnail={queue[0].artwork} />
                    </React.Fragment>
                )
            }
            {
                queue.length > 1 ? (
                    <React.Fragment>
                        <Text style={styles.sectionTitle}>Upcoming Songs</Text>
                        <View style={{ flex: 1 }}>
                            <DraggableFlatlist style={{ height: "100%", backgroundColor: colors.dark }} contentContainerStyle={{ borderTopWidth: 2, borderTopColor: colors.dark }} data={queue.slice(1)} keyExtractor={(_, index) => index} renderItem={({ item, drag, isActive, index }) => {
                                return (
                                    <SwipeableItem overSwipe={0} activationThreshold={10} snapPointsRight={[ 70 ]} renderUnderlayRight={() => {
                                        return (
                                            <View style={{ width: 70, height: 65, alignItems: "center", justifyContent: "center", backgroundColor: colors.extraDark }}>
                                                <FontAwesomeIcon icon={faTrash} color={colors.red} size={24} />
                                            </View>
                                        )
                                    }} onChange={({ open }) => {
                                        isActive = false
                                        if(open != "none"){
                                            removeFromQueue(index)
                                        }
                                    }}>
                                        <QueueSongItem drag={drag} active={isActive} title={item.title} artist={item.artist} thumbnail={item.artwork} />
                                    </SwipeableItem>
                                )
                            }} onDragEnd={handleDrag} />
                        </View>
                    </React.Fragment>
                ) : (
                    <View style={{ flex: 1, backgroundColor: colors.dark }} />
                )
            }
            <TouchableOpacity onPress={handleDonePress} activeOpacity={0.8}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Done</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.extraDark
    },
    sectionTitle: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 24,
        color: colors.light,
        textAlign: "center",
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: colors.dark
    },
    buttonContainer: {
        width: screen.width - 20,
        height: 60,
        margin: 10,
        marginBottom: screen.bottom + 20,
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

export default ReorderQueueStack