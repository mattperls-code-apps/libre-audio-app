import React, { useState, useRef, useEffect } from "react"

import { TouchableOpacity, TouchableWithoutFeedback, View, Text, TextInput, FlatList, StyleSheet, Animated, Alert } from "react-native"

import FastImage from "react-native-fast-image"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faBookOpen, faCheck } from "@fortawesome/free-solid-svg-icons"

import { PlaylistMoreInfoItem } from "../../components/PlaylistItem"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../../scripts/storage"

import { screen, colors } from "../../constants"

const SongInfoStack = ({ navigation, route }) => {
    const { id, thumbnail, duration } = route.params
    const [title, setTitle] = useState(route.params.title)
    const [artist, setArtist] = useState(route.params.artist)

    const [playlists, setPlaylists] = useState([])

    const [willHaveInLibrary, setWillHaveInLibrary] = useState(true)

    const [editedTitle, setEditedTitle] = useState(route.params.title)
    const [editedArtist, setEditedArtist] = useState(route.params.artist)

    const [showEditOptions, setShowEditOptions] = useState(false)
    const editOptionsOffset = useRef(new Animated.Value(0)).current

    const handleEditSongPress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        setShowEditOptions(true)
        Animated.timing(editOptionsOffset, {
            toValue: 290,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const handleOverlayDismiss = (callback) => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        Animated.timing(editOptionsOffset, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
        }).start(() => {
            setShowEditOptions(false)
            if (typeof callback == "function") callback()
        })
    }

    const updateSongInfo = () => {
        const storage = new Storage()
        storage.initialize(() => {
            const trimmedTitle = editedTitle.trim()
            const trimmedArtist = editedArtist.trim()
            storage.editSong(id, trimmedTitle.length == 0 ? title : trimmedTitle, trimmedArtist.length == 0 ? artist : trimmedArtist, () => {
                setTitle(trimmedTitle.length == 0 ? title : trimmedTitle)
                setArtist(trimmedArtist.length == 0 ? artist : trimmedArtist)
                handleOverlayDismiss()
            })
        })
    }

    const handleMerge = () => {
        const storage = new Storage()
        storage.initialize(() => {
            if(storage.data.songs.some(song => song.id == id)){
                handleOverlayDismiss(() => {
                    navigation.goBack()
                    navigation.push("Merge",{ id, title })
                })
            } else {
                Alert.alert("Action Unavailable", "You can only merge songs already in your library.")
            }
        })
    }

    const [resolving, setResolving] = useState(false)

    useEffect(() => {
        const storage = new Storage()
        storage.initialize(() => {
            setPlaylists(storage.data.playlists.map(playlist => {
                playlist.willHaveInPlaylist = playlist.songs.includes(id)
                return playlist
            }))
        })
    }, [])

    const handleLibraryToggle = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        setWillHaveInLibrary(!willHaveInLibrary)
        setPlaylists(playlists.map(playlist => {
            playlist.willHaveInPlaylist = !willHaveInLibrary && playlist.songs.includes(id)
            return playlist
        }))
    }

    const handleDoneButtonPress = () => {
        if(!resolving){
            setResolving(true)
            ReactNativeHapticFeedback.trigger("impactLight", {
                enableVibrateFallback: false
            })
            const storage = new Storage()
            storage.initialize(() => {
                if(willHaveInLibrary){
                    const playlistIds = []
                    playlists.forEach(playlist => {
                        if(playlist.willHaveInPlaylist){
                            playlistIds.push(playlist.id)
                        }
                    })
                    if(!storage.data.songs.some(song => song.id == id)){
                        storage.addSong(id, title, artist, thumbnail, duration, () => {
                            storage.addSongToPlaylists(playlistIds, id, navigation.goBack)
                        })
                    } else {
                        storage.addSongToPlaylists(playlistIds, id, navigation.goBack)
                    }
                } else {
                    storage.removeSong(id, navigation.goBack)
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.thumbnailContainer}>
                <FastImage style={styles.thumbnailImage} source={{ uri: thumbnail }} resizeMode={"cover"} />
                <View style={styles.thumbnailTextOverlayContainer}>
                    <Text style={styles.thumbnailText} numberOfLines={1}>
                        {
                            title
                        }
                    </Text>
                </View>
            </View>
            <FlatList showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.dark }} contentContainerStyle={{ borderTopColor: colors.dark, borderTopWidth: 2 }} data={playlists} ListHeaderComponent={() => {
                return (
                    <TouchableOpacity onPress={handleLibraryToggle} activeOpacity={0.8}>
                        <View style={styles.libraryOptionContainer}>
                            <View style={styles.libraryLabel}>
                                <FontAwesomeIcon icon={faBookOpen} color={colors.flair} size={36} />
                                <Text style={styles.libraryText}>Library</Text>
                            </View>
                            {
                                willHaveInLibrary && (
                                    <FontAwesomeIcon style={{ marginRight: 30 }} icon={faCheck} color={colors.flair} size={24} />
                                )
                            }
                        </View>
                    </TouchableOpacity>
                )
            }} renderItem={({ item, index }) => {
                return <PlaylistMoreInfoItem key={index} navigation={navigation} name={item.name} songs={item.songs} willHaveInPlaylist={item.willHaveInPlaylist} toggleWillHaveInPlaylist={() => {
                    const temp = [...playlists]
                    temp[index].willHaveInPlaylist = !temp[index].willHaveInPlaylist
                    setPlaylists(temp)
                }} />
            }} />
            <TouchableOpacity onPress={handleEditSongPress} activeOpacity={0.8}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Edit Song Info</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDoneButtonPress} activeOpacity={0.8}>
                <View style={[styles.buttonContainer, { marginBottom: screen.bottom + 20 }]}>
                    <Text style={styles.buttonText}>Done</Text>
                </View>
            </TouchableOpacity>
            {
                showEditOptions && (
                    <React.Fragment>
                        <TouchableWithoutFeedback onPress={handleOverlayDismiss}>
                            <View style={styles.overlayBackground} />
                        </TouchableWithoutFeedback>
                        <Animated.View style={[styles.editOptionsContainer, {
                            transform: [{
                                translateY: editOptionsOffset
                            }]
                        }]}>
                            <View style={styles.editInputContainer}>
                                <TextInput style={styles.editInput} value={editedTitle} onChangeText={setEditedTitle} numberOfLines={1}  selectionColor={colors.flair} placeholder={"Song Title"} placeholderTextColor={colors.dark} clearButtonMode={"always"} />
                            </View>
                            <View style={styles.editInputContainer}>
                                <TextInput style={styles.editInput} value={editedArtist} onChangeText={setEditedArtist} numberOfLines={1}  selectionColor={colors.flair} placeholder={"Song Artist"} placeholderTextColor={colors.dark} clearButtonMode={"always"} />
                            </View>
                            <TouchableOpacity onPress={updateSongInfo} activeOpacity={0.8}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleMerge} activeOpacity={0.8}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Merge and Delete</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleOverlayDismiss} activeOpacity={0.8}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Cancel</Text>
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
        borderRadius: 10,
    },
    thumbnailTextOverlayContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 50,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.75)"
    },
    thumbnailText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 24,
        color: colors.extraLight,
        textAlign: "center",
        paddingHorizontal: 20
    },
    libraryOptionContainer: {
        width: screen.width,
        height: 100,
        backgroundColor: colors.extraDark,
        borderBottomColor: colors.dark,
        borderBottomWidth: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    libraryLabel: {
        paddingHorizontal: 30,
        alignItems: "center",
        flexDirection: "row"
    },
    libraryText: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 24,
        color: colors.flair,
        marginLeft: 20
    },
    buttonContainer: {
        width: screen.width - 20,
        height: 60,
        margin: 10,
        marginBottom: 0,
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
    },
    overlayBackground: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: screen.height,
        backgroundColor: "rgba(0, 0, 0, 0.6)"
    },
    editOptionsContainer: {
        position: "absolute",
        top: -290,
        width: "100%",
        height: 290,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: colors.extraDark
    },
    editInputContainer: {
        width: screen.width - 20,
        height: 60,
        paddingHorizontal: 10,
        margin: 10,
        marginBottom: 0,
        borderRadius: 10,
        backgroundColor: colors.extraLight
    },
    editInput: {
        flex: 1,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        color: colors.extraDark
    }
})

export default SongInfoStack