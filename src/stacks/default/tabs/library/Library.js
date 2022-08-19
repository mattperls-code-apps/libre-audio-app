import React, { useState, useRef, useEffect } from "react"

import { TouchableWithoutFeedback, TouchableOpacity, View, Text, TextInput, FlatList, StyleSheet } from "react-native"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faMagnifyingGlass, faShuffle } from "@fortawesome/free-solid-svg-icons"

import SongItem from "../../../../components/SongItem"

import TrackPlayer from "react-native-track-player"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import shuffleArray from "array-shuffle"

import Storage from "../../../../scripts/storage"
import { fetchPlaylistAudio } from "../../../../scripts/getAudioUrl"
import { queryFilterSongs } from "../../../../scripts/applyQueryFilter"

import { screen, colors } from "../../../../constants"

const LibraryTab = ({ navigation }) => {
    const [songs, setSongs] = useState([])

    const input = useRef()

    const [query, setQuery] = useState("")

    const handleInputPress = () => {
        input.current.focus()
    }

    const handleChangeText = (text) => {
        if(text.length == 0){
            setQuery("")
        }
    }

    const handleEndEditing = (e) => {
        setQuery(e.nativeEvent.text)
    }

    useEffect(() => {
        const handleTabNavigate = (e) => {
            if(e.data.state.index == 0){
                const storage = new Storage()
                storage.initialize(() => {
                    setSongs(storage.data.songs)
                })
            }
        }
        const handleRootStackNavigate = (e) => {
            if(e.data.state.index == 0){
                const storage = new Storage()
                storage.initialize(() => {
                    setSongs(storage.data.songs)
                })
            }
        }

        const tabSubscriber = navigation.addListener("state", handleTabNavigate)
        const rootStackSubscriber = navigation.getParent().addListener("state", handleRootStackNavigate)

        return () => {
            tabSubscriber()
            rootStackSubscriber()
        }
    }, [])

    const filteredSongs = queryFilterSongs(songs, query)

    const handleShufflePress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })

        fetchPlaylistAudio(shuffleArray(filteredSongs), "Library", (songs) => {
            TrackPlayer.reset().then(() => {
                TrackPlayer.add(songs)
            })
        })
    }

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Library</Text>
            </View>
            <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 58 }} data={filteredSongs} ListHeaderComponent={() => {
                return (
                    <View style={styles.songsItemsHeader}>
                        <View style={styles.songsItemsCountContainer}>
                            <Text style={styles.songsItemsCountText}>{ songs.length } { songs.length == 1 ? "Song" : "Songs" }</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={handleInputPress}>
                            <View style={styles.searchBar}>
                                <FontAwesomeIcon style={{ marginHorizontal: 20 }} icon={faMagnifyingGlass} color={colors.flair} size={24} />
                                <TextInput ref={input} defaultValue={query} onChangeText={handleChangeText} onEndEditing={handleEndEditing} style={styles.searchBarInput} selectionColor={colors.flair} placeholder={"Search Library"} placeholderTextColor={colors.dark} clearButtonMode={"always"} />
                            </View>
                        </TouchableWithoutFeedback>
                        {
                            songs.length != 0 && (
                                <View style={styles.shuffleContainer}>
                                    <TouchableOpacity onPress={handleShufflePress} activeOpacity={0.8}>
                                        <View style={{ paddingHorizontal: 30, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                                            <FontAwesomeIcon icon={faShuffle} color={colors.flair} size={18} />
                                            <Text style={styles.shuffleLabel}>Shuffle Library</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>
                )
            }} renderItem={({ item, index }) => {
                return (
                    <SongItem key={index} navigation={navigation} id={item.id} title={item.title} artist={item.artist} description={"Library"} thumbnail={item.thumbnail} audio={item.audio} duration={item.duration} />
                )
            }} />
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.dark
    },
    header: {
        height: screen.top + 70,
        paddingTop: screen.top,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.extraDark
    },
    headerTitle: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 24,
        color: colors.flair
    },
    songsItemsHeader: {
        width: screen.width,
        transform: [
            {
                translateY: -40
            }
        ],
        marginBottom: -40
    },
    songsItemsCountContainer: {
        width: "100%",
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    songsItemsCountText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        color: colors.extraLight
    },
    searchBar: {
        width: screen.width - 20,
        height: 50,
        alignItems: "center",
        flexDirection: "row",
        margin: 10,
        borderRadius: 10,
        backgroundColor: colors.extraLight
    },
    searchBarInput: {
        flex: 1,
        height: 30,
        marginRight: 20,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        color: colors.extraDark
    },
    shuffleContainer: {
        marginBottom: 6,
        alignSelf: "center"
    },
    shuffleLabel: {
        marginLeft: 10,
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 18,
        color: colors.flair
    }
})

export default LibraryTab