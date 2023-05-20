import React, { useState, useRef, useEffect } from "react"

import { TouchableWithoutFeedback, TouchableOpacity, View, Text, TextInput, FlatList, StyleSheet, Animated, Alert } from "react-native"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faMagnifyingGlass, faShuffle } from "@fortawesome/free-solid-svg-icons"

import FastImage from "react-native-fast-image"

import SongItem from "../../../../../components/SongItem"

import TrackPlayer, { Capability } from "react-native-track-player"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"
import shuffleArray from "array-shuffle"

import Storage from "../../../../../scripts/storage"
import { queryFilterSongs } from "../../../../../scripts/applyQueryFilter"
import { fetchPlaylistAudio } from "../../../../../scripts/getAudioUrl"

import { screen, colors } from "../../../../../constants"

const PlaylistStack = ({ navigation, route }) => {
    const input = useRef()

    const [query, setQuery] = useState("")

    const handleChangeText = (text) => {
        if(text.length == 0){
            setQuery("")
        }
    }

    const handleEndEditing = (e) => {
        setQuery(e.nativeEvent.text)
    }

    const handleInputPress = () => {
        input.current.focus()
    }

    const [initialized, setInitialized] = useState(false)

    const [songs, setSongs] = useState([])

    useEffect(() => {
        const handleTabNavigate = () => {
            if(navigation.getParent().getState().index == 1){
                const storage = new Storage()
                storage.initialize(() => {
                    const temp = []
                    if(storage.data.playlists.some(playlist => playlist.id == route.params.id)){
                        storage.getPlaylist(route.params.id).songs.forEach(song => {
                           temp.push(storage.getSong(song))
                        })
                    }
                    setSongs(temp)
                    setInitialized(true)
                })
            }
        }

        const handleRootStackNavigate = () => {
            if(navigation.getParent().getParent().getState().index == 0 && navigation.getParent().getState().index == 1){
                handleTabNavigate()
            }
        }

        const tabSubscriber = navigation.getParent().addListener("state", handleTabNavigate)
        const rootStackSubscriber = navigation.getParent().getParent().addListener("state", handleRootStackNavigate)

        return () => {
            tabSubscriber()
            rootStackSubscriber()
        }
    }, [])

    const handleShufflePress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })

        const capabilities = [
            Capability.Play,
            Capability.Pause,
            Capability.SeekTo,
            Capability.SkipToPrevious,
            Capability.SkipToNext
        ]
        TrackPlayer.updateOptions({ capabilities })

        fetchPlaylistAudio(shuffleArray(filteredSongs), route.params.name, (songs) => {
            TrackPlayer.reset().then(() => {
                TrackPlayer.add(songs)
            })
        })
    }

    const [showEditOptions, setShowEditOptions] = useState(false)
    const editOptionsOffset = useRef(new Animated.Value(0)).current

    const handleEditPlaylistPress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        setShowEditOptions(true)
        Animated.timing(editOptionsOffset, {
            toValue: 220,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const handleOverlayDismiss = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        Animated.timing(editOptionsOffset, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
        }).start(() => {
            setShowEditOptions(false)
        })
    }

    const handleAddSongsPress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        navigation.push("AddSongs", route.params)
        Animated.timing(editOptionsOffset, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
        }).start(() => {
            setShowEditOptions(false)
        })
    }

    const handleRenamePlaylistPress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        Alert.prompt("New Playlist Name", "", (playlistName) => {
            if(playlistName != ""){
                const storage = new Storage()
                storage.initialize(() => {
                    if(!storage.data.playlists.some(playlist => playlist.name == playlistName)){
                        storage.renamePlaylist(route.params.id, playlistName, () => {
                            navigation.setParams({ name: playlistName })
                            handleOverlayDismiss()
                        })
                    } else {
                        handleOverlayDismiss()
                    }
                })
            } else {
                handleOverlayDismiss()
            }
        })
    }

    const handleDeletePlaylistPress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        Alert.alert("Delete Playlist?", "Are you sure you want to delete your playlist \"" + route.params.name + "\"", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Confirm",
                style: "destructive",
                onPress: () => {
                    const storage = new Storage()
                    storage.initialize(() => {
                        storage.removePlaylist(route.params.id, navigation.goBack)
                    })
                }
            }
        ])
    }

    const filteredSongs = queryFilterSongs(songs, query)

    const playlistThumbnails = []
    if(initialized){
        songs.slice(0, 4).forEach((song, index) => {
            playlistThumbnails.push(
                <View key={index} style={{ width: 0.5 * screen.width - 15, height: 9/16 * (0.5 * screen.width - 15), marginTop: 10, borderRadius: 10, overflow: "hidden" }}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{ uri: song.thumbnail }} resizeMode={"cover"} />
                </View>
            )
        })
    } else {
        route.params.thumbnails.slice(0, 4).forEach((thumbnail, index) => {
            playlistThumbnails.push(
                <View key={index} style={{ width: 0.5 * screen.width - 15, height: 9/16 * (0.5 * screen.width - 15), marginTop: 10, borderRadius: 10, overflow: "hidden" }}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{ uri: thumbnail }} resizeMode={"cover"} />
                </View>
            )
        })
    }
    
    return (
        <View style={styles.page}>
            <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 58 }} data={filteredSongs} ListHeaderComponent={() => {
                return (
                    <View style={styles.songItemsHeader}>
                        <View style={styles.songItemsCountContainer}>
                            <Text style={styles.songItemsCountText}>{ filteredSongs.length } { filteredSongs.length == 1 ? "Song" : "Songs" }</Text>
                        </View>
                        <View style={{ width: "100%", marginVertical: 5, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-evenly" }}>
                            {
                                playlistThumbnails
                            }
                        </View>
                        <TouchableOpacity onPress={handleEditPlaylistPress} activeOpacity={0.8}>
                            <View style={styles.editButtonContainer}>
                                <Text style={styles.editButtonText}>Edit Playlist</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableWithoutFeedback onPress={handleInputPress}>
                            <View style={styles.searchBar}>
                                <FontAwesomeIcon style={{ marginHorizontal: 20 }} icon={faMagnifyingGlass} color={colors.flair} size={24} />
                                <TextInput ref={input} defaultValue={query} onChangeText={handleChangeText} onEndEditing={handleEndEditing} style={styles.searchBarInput} selectionColor={colors.flair} placeholder={"Search Playlist"} placeholderTextColor={colors.dark} clearButtonMode={"always"} />
                            </View>
                        </TouchableWithoutFeedback>
                        {
                            songs.length != 0 && (
                                <View style={styles.shuffleContainer}>
                                    <TouchableOpacity onPress={handleShufflePress} activeOpacity={0.8}>
                                        <View style={{ paddingHorizontal: 30, paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                                            <FontAwesomeIcon icon={faShuffle} color={colors.flair} size={18} />
                                            <Text style={styles.shuffleLabel}>Shuffle Playlist</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>
                )
            }} renderItem={({ item, index }) => {
                return (
                    <SongItem key={index} navigation={navigation} id={item.id} title={item.title} artist={item.artist} description={route.params.name} thumbnail={item.thumbnail} duration={item.duration} />
                )
            }} />
            {
                showEditOptions && (
                    <React.Fragment>
                        <TouchableWithoutFeedback onPress={handleOverlayDismiss}>
                            <View style={styles.overlayBackground}></View>
                        </TouchableWithoutFeedback>
                        <Animated.View style={[styles.editOptionsContainer, {
                            transform: [{
                                translateY: editOptionsOffset
                            }]
                        }]}>
                            <TouchableOpacity onPress={handleAddSongsPress} activeOpacity={0.8}>
                                <View style={styles.editOptionsButtonContainer}>
                                    <Text style={styles.editOptionsButtonText}>Add Songs</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleRenamePlaylistPress} activeOpacity={0.8}>
                                <View style={styles.editOptionsButtonContainer}>
                                    <Text style={styles.editButtonText}>Rename Playlist</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeletePlaylistPress} activeOpacity={0.8}>
                                <View style={styles.editOptionsButtonContainer}>
                                    <Text style={styles.editButtonText}>Delete Playlist</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </React.Fragment>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.dark
    },
    songItemsHeader: {
        width: "100%",
        transform: [
            {
                translateY: -40
            }
        ],
        marginBottom: -40
    },
    songItemsCountContainer: {
        width: "100%",
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    songItemsCountText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        color: colors.extraLight
    },
    editButtonContainer: {
        width: screen.width - 20,
        height: 60,
        margin: 10,
        marginTop: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: colors.flair
    },
    editButtonText: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 20,
        color: colors.extraLight
    },
    searchBar: {
        width: screen.width - 20,
        height: 50,
        alignItems: "center",
        flexDirection: "row",
        margin: 10,
        marginTop: 0,
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
    },
    overlayBackground: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: screen.height,
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    },
    editOptionsContainer: {
        position: "absolute",
        top: -220,
        width: "100%",
        height: 220,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: colors.extraDark
    },
    editOptionsButtonContainer: {
        width: screen.width - 20,
        height: 60,
        margin: 10,
        marginBottom: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: colors.flair
    },
    editOptionsButtonText: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 20,
        color: colors.extraLight
    }
})

export default PlaylistStack