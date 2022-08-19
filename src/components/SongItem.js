import React, { useState, useRef } from "react"

import { TouchableWithoutFeedback, TouchableOpacity, View, Text, StyleSheet, Animated } from "react-native"

import FastImage from "react-native-fast-image"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faEllipsisVertical, faCheck, faBars } from "@fortawesome/free-solid-svg-icons"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import TrackPlayer from "react-native-track-player"

import getAudioUrl from "../scripts/getAudioUrl"

import { screen, colors } from "../constants"

const SongItem = ({ navigation, id, title, artist, description, thumbnail, duration }) => {
    const [active, setActive] = useState(false)
    const scale = useRef(new Animated.Value(1)).current

    const handlePress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })

        getAudioUrl(id, (audio) => {
            TrackPlayer.reset().then(() => {
                TrackPlayer.add({
                    id,
                    url: audio,
                    title,
                    artist,
                    description,
                    artwork: thumbnail,
                    duration
                }).then(TrackPlayer.play)
            })
        })
    }

    const handleLongPress = () => {
        ReactNativeHapticFeedback.trigger("longPress", {
            enableVibrateFallback: false
        })

        setActive(true)
        Animated.timing(scale, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true
        }).start(() => {
            Animated.timing(scale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true
            }).start(() => {
                setActive(false)
                getAudioUrl(id, (audio) => {
                    TrackPlayer.add({
                        id,
                        url: audio,
                        title,
                        artist,
                        description,
                        artwork: thumbnail,
                        duration
                    }).then(TrackPlayer.play)
                })
            })
        })
    }

    const handleMoreInfoPress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })

        navigation.push("SongInfo", { id, title, artist, thumbnail, duration })
    }

    return (
        <TouchableOpacity onPress={handlePress} delayLongPress={500} onLongPress={handleLongPress} activeOpacity={0.8}>
            <Animated.View style={[styles.songItem, {
                backgroundColor: active ? colors.black : colors.extraDark,
                transform: [{
                    scale
                }]
            }]}>
                <View style={styles.thumbnailContainer}>
                    <FastImage style={styles.thumbnail} source={{ uri: thumbnail }} resizeMode={"cover"} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {
                            title
                        }
                    </Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {
                            artist
                        }
                    </Text>
                </View>
                <TouchableOpacity onPress={handleMoreInfoPress} activeOpacity={0.8}>
                    <View style={{ paddingLeft: 10, paddingRight: 20, height: "100%", justifyContent: "center" }}>
                        <FontAwesomeIcon icon={faEllipsisVertical} color={colors.flair} size={20} />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </TouchableOpacity>
    )
}

const AddableSongItem = ({ title, artist, thumbnail, willHaveInPlaylist, toggleWillHaveInPlaylist }) => {
    const handlePress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })

        toggleWillHaveInPlaylist()
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <View style={[styles.songItem, { backgroundColor: colors.extraDark }]}>
                <View style={styles.thumbnailContainer}>
                    <FastImage style={styles.thumbnail} source={{ uri: thumbnail }} resizeMode={"cover"} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {
                            title
                        }
                    </Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {
                            artist
                        }
                    </Text>
                </View>
                {
                    willHaveInPlaylist && (
                        <View style={{ paddingLeft: 10, paddingRight: 20, height: "100%", justifyContent: "center" }}>
                            <FontAwesomeIcon icon={faCheck} color={colors.flair} size={20} />
                        </View>
                    )
                }
            </View>
        </TouchableOpacity>
    )
}

const StaticSongItem = ({ title, artist, thumbnail }) => {
    return (
        <View style={styles.songItem}>
            <View style={styles.thumbnailContainer}>
                <FastImage style={styles.thumbnail} source={{ uri: thumbnail }} resizeMode={"cover"} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {
                        title
                    }
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                    {
                        artist
                    }
                </Text>
            </View>
        </View>
    )
}

const QueueSongItem = ({ drag, active, title, artist, thumbnail }) => {
    return (
        <View style={[styles.songItem, { backgroundColor: active ? colors.black : colors.extraDark }]}>
            <View style={styles.thumbnailContainer}>
                <FastImage style={styles.thumbnail} source={{ uri: thumbnail }} resizeMode={"cover"} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {
                        title
                    }
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                    {
                        artist
                    }
                </Text>
            </View>
            <TouchableWithoutFeedback onPressIn={drag}>
                <View style={{ paddingHorizontal: 30, height: "100%", justifyContent: "center" }}>
                    <FontAwesomeIcon icon={faBars} color={colors.light} size={24} />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const TopSongItem = ({ playCount, title, artist, thumbnail }) => {
    const [showingPlayCount, setShowingPlayCount] = useState(false)

    const thumbnailOffset = useRef(new Animated.Value(0)).current
    const [animating, setAnimating] = useState(false)

    const toggleShowingPlayCount = () => {
        if(!animating){
            setAnimating(true)

            ReactNativeHapticFeedback.trigger("impactLight", {
                enableVibrateFallback: false
            })

            Animated.timing(thumbnailOffset, {
                toValue: showingPlayCount ? 0 : -9/16 * (0.5 * screen.width - 15),
                duration: 200,
                useNativeDriver: true
            }).start(() => {
                setShowingPlayCount(!showingPlayCount)
                setAnimating(false)
            })
        }
    }

    return (
        <TouchableOpacity onPress={toggleShowingPlayCount} activeOpacity={0.8}>
            <View style={styles.topSongItem}>
                <View style={styles.topSongPlayCountContainer}>
                    <Text style={styles.topSongPlayCountLabel}>Times Played:</Text>
                    <Text style={styles.topSongPlayCountNumber}>
                        {
                            playCount
                        }
                    </Text>
                </View>
                <Animated.View style={[styles.topSongThumbnailContainer, { transform: [{ translateY: thumbnailOffset }] }]}>
                    <FastImage style={styles.topSongThumbnailImage} source={{ uri: thumbnail }} resizeMode={"cover"} />
                </Animated.View>
                <View style={styles.topSongInfoContainer}>
                    <Text style={styles.topSongTitle} numberOfLines={1}>
                        {
                            title
                        }
                    </Text>
                    <Text style={styles.topSongArtist} numberOfLines={1}>
                        {
                            artist
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    songItem: {
        width: "100%",
        height: 65,
        marginBottom: 2,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        backgroundColor: colors.extraDark
    },
    thumbnailContainer: {
        width: 16/9 * 50,
        height: 50,
        margin: 7.5
    },
    thumbnail: {
        width: "100%",
        height: "100%",
        borderRadius: 5
    },
    infoContainer: {
        flex: 1,
        height: "100%",
        marginHorizontal: 7.5,
        paddingVertical: 10,
        justifyContent: "space-between"
    },
    title: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 20,
        color: colors.extraLight
    },
    artist: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 14,
        color: colors.light
    },
    topSongItem: {
        width: 0.5 * screen.width - 15,
        height: 9/16 * (0.5 * screen.width - 15) + 50,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: colors.extraDark,
        overflow: "hidden"
    },
    topSongPlayCountContainer: {
        width: "100%",
        height: 9/16 * (0.5 * screen.width - 15),
        alignItems: "center",
        justifyContent: "center"
    },
    topSongPlayCountLabel: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 16,
        color: colors.light
    },
    topSongPlayCountNumber: {
        marginTop: 10,
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 36,
        color: colors.flair
    },
    topSongThumbnailContainer: {
        position: "absolute",
        width: "100%",
        height: 9/16 * (0.5 * screen.width - 15)
    },
    topSongThumbnailImage: {
        width: "100%",
        height: "100%"
    },
    topSongInfoContainer: {
        width: "100%",
        height: 50,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    topSongTitle: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 20,
        color: colors.extraLight
    },
    topSongArtist: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 16,
        color: colors.light
    }
})

export default SongItem
export {
    AddableSongItem,
    StaticSongItem,
    QueueSongItem,
    TopSongItem
}