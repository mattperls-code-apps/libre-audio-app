import React, { useState, useRef, useEffect } from "react"

import { TouchableOpacity, View, Text, StyleSheet, Animated } from "react-native"

import FastImage from "react-native-fast-image"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronRight, faCheck } from "@fortawesome/free-solid-svg-icons"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../scripts/storage"

import { screen, colors } from "../constants"

const PlaylistItem = ({ navigation, id, name, songs }) => {
    const [thumbnails, setThumbnails] = useState([])

    const handlePress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        navigation.push("Playlist", { id, name, thumbnails })
    }

    useEffect(() => {
        const storage = new Storage()
        storage.initialize(() => {
            const temp = []
            songs.forEach(song => {
                temp.push(storage.getSong(song).thumbnail)
            })
            setThumbnails(temp)
        })
    }, [songs])

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <View style={[styles.playlistItem, { marginBottom: 2 }]}>
                <View style={styles.thumbnailsContainer}>
                    {
                        thumbnails.length > 0 ? (
                            <FastImage style={styles.thumbnail} source={{ uri: thumbnails[0] }} resizeMode={"cover"} />
                        ) : (
                            <View style={styles.thumbnail} />
                        )
                    }
                    {
                        thumbnails.length > 1 ? (
                            <FastImage style={styles.thumbnail} source={{ uri: thumbnails[1] }} resizeMode={"cover"} />
                        ) : (
                            <View style={styles.thumbnail} />
                        )
                    }
                    {
                        thumbnails.length > 2 ? (
                            <FastImage style={styles.thumbnail} source={{ uri: thumbnails[2] }} resizeMode={"cover"} />
                        ) : (
                            <View style={styles.thumbnail} />
                        )
                    }
                    {
                        thumbnails.length > 3 ? (
                            <FastImage style={styles.thumbnail} source={{ uri: thumbnails[3] }} resizeMode={"cover"} />
                        ) : (
                            <View style={styles.thumbnail} />
                        )
                    }
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.artist} numberOfLines={1}>
                        {
                            name
                        }
                    </Text>
                    <Text style={styles.songsCount} numberOfLines={1}>
                        {
                            songs.length + " " + (songs.length == 1 ? "song" : "songs")
                        }
                    </Text>
                </View>
                <FontAwesomeIcon style={{ marginHorizontal: 20 }} icon={faChevronRight} color={colors.flair} size={20} />
            </View>
        </TouchableOpacity>
    )
}

const PlaylistMoreInfoItem = ({ name, songs, willHaveInPlaylist, toggleWillHaveInPlaylist }) => {
    const [thumbnails, setThumbnails] = useState([])

    useEffect(() => {
        const storage = new Storage()
        storage.initialize(() => {
            const temp = []
            songs.forEach(song => {
                temp.push(storage.getSong(song).thumbnail)
            })
            setThumbnails(temp)
        })
    }, [songs])

    const handlePress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        toggleWillHaveInPlaylist()
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <View style={[styles.playlistItem, { borderBottomWidth: 2, borderBottomColor: colors.dark }]}>
                <View style={styles.thumbnailsContainer}>
                    {
                        thumbnails.length > 0 ? (
                            <FastImage style={styles.thumbnail} source={{ uri: thumbnails[0] }} resizeMode={"cover"} />
                        ) : (
                            <View style={styles.thumbnail} />
                        )
                    }
                    {
                        thumbnails.length > 1 ? (
                            <FastImage style={styles.thumbnail} source={{ uri: thumbnails[1] }} resizeMode={"cover"} />
                        ) : (
                            <View style={styles.thumbnail} />
                        )
                    }
                    {
                        thumbnails.length > 2 ? (
                            <FastImage style={styles.thumbnail} source={{ uri: thumbnails[2] }} resizeMode={"cover"} />
                        ) : (
                            <View style={styles.thumbnail} />
                        )
                    }
                    {
                        thumbnails.length > 3 ? (
                            <FastImage style={styles.thumbnail} source={{ uri: thumbnails[3] }} resizeMode={"cover"} />
                        ) : (
                            <View style={styles.thumbnail} />
                        )
                    }
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.artist} numberOfLines={1}>
                        {
                            name
                        }
                    </Text>
                    <Text style={styles.songsCount} numberOfLines={1}>
                        {
                            songs.length + " " + (songs.length == 1 ? "song" : "songs")
                        }
                    </Text>
                </View>
                {
                    willHaveInPlaylist && (
                        <FontAwesomeIcon style={{ marginHorizontal: 32 }} icon={faCheck} color={colors.flair} size={20} />
                    )
                }
            </View>
        </TouchableOpacity>
    )
}

const TopArtistItem = ({ minutesListened, name, songsCount, thumbnail }) => {
    const [showingMinutesListened, setShowingMinutesListened] = useState(false)

    const thumbnailOffset = useRef(new Animated.Value(0)).current
    const [animating, setAnimating] = useState(false)

    const toggleShowingMinutesListened = () => {
        if(!animating){
            setAnimating(true)

            ReactNativeHapticFeedback.trigger("impactLight", {
                enableVibrateFallback: false
            })

            Animated.timing(thumbnailOffset, {
                toValue: showingMinutesListened ? 0 : -9/16 * (0.5 * screen.width - 15),
                duration: 200,
                useNativeDriver: true
            }).start(() => {
                setShowingMinutesListened(!showingMinutesListened)
                setAnimating(false)
            })
        }
    }

    return (
        <TouchableOpacity onPress={toggleShowingMinutesListened} activeOpacity={0.8}>
            <View style={styles.topArtistItem}>
                <View style={styles.topArtistMinutesListenedContainer}>
                    <Text style={styles.topArtistMinutesListenedLabel}>Minutes Listened:</Text>
                    <Text style={styles.topArtistMinutesListenedNumber}>
                        {
                            minutesListened
                        }
                    </Text>
                </View>
                <Animated.View style={[styles.topArtistThumbnailContainer, { transform: [{ translateY: thumbnailOffset }] }]}>
                    <FastImage style={styles.topArtistThumbnailImage} source={{ uri: thumbnail }} resizeMode={"cover"} />
                </Animated.View>
                <View style={styles.topArtistInfoContainer}>
                    <Text style={styles.topArtistName} numberOfLines={1}>
                        {
                            name
                        }
                    </Text>
                    <Text style={styles.topArtistSongsCount} numberOfLines={1}>
                        {
                            songsCount + " " + (songsCount == 1 ? "Song" : "Songs")
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    playlistItem: {
        width: "100%",
        height: 65,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        backgroundColor: colors.extraDark
    },
    thumbnailsContainer: {
        width: 70,
        height: 50,
        borderRadius: 5,
        overflow: "hidden",
        margin: 7.5,
        flexDirection: "row",
        flexWrap: "wrap"
    },
    thumbnail: {
        width: 35,
        height: 25
    },
    infoContainer: {
        flex: 1,
        height: "100%",
        marginHorizontal: 7.5,
        paddingVertical: 10,
        justifyContent: "space-between"
    },
    artist: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 20,
        color: colors.extraLight
    },
    songsCount: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 14,
        color: colors.light
    },
    topArtistItem: {
        width: 0.5 * screen.width - 15,
        height: 9/16 * (0.5 * screen.width - 15) + 50,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: colors.extraDark,
        overflow: "hidden"
    },
    topArtistMinutesListenedContainer: {
        width: "100%",
        height: 9/16 * (0.5 * screen.width - 15),
        alignItems: "center",
        justifyContent: "center"
    },
    topArtistMinutesListenedLabel: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 16,
        color: colors.light
    },
    topArtistMinutesListenedNumber: {
        marginTop: 10,
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 36,
        color: colors.flair
    },
    topArtistThumbnailContainer: {
        position: "absolute",
        width: "100%",
        height: 9/16 * (0.5 * screen.width - 15)
    },
    topArtistThumbnailImage: {
        width: "100%",
        height: "100%"
    },
    topArtistInfoContainer: {
        width: "100%",
        height: 50,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    topArtistName: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 20,
        color: colors.extraLight
    },
    topArtistSongsCount: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 16,
        color: colors.light
    }
})

export default PlaylistItem
export { PlaylistMoreInfoItem, TopArtistItem }