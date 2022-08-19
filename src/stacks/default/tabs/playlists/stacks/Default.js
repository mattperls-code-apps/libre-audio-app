import React, { useState, useRef, useEffect } from "react"

import { TouchableWithoutFeedback, TouchableOpacity, View, Text, TextInput, FlatList, StyleSheet, Alert } from "react-native"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

import PlaylistItem from "../../../../../components/PlaylistItem"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../../../../../scripts/storage"
import { queryFilterPlaylists } from "../../../../../scripts/applyQueryFilter"

import { screen, colors } from "../../../../../constants"

const DefaultStack = ({ navigation }) => {
    const [playlists, setPlaylists] = useState([])

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

    const handleCreateNewPress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        Alert.prompt("Create New Playlist", "", (playlistName) => {
            const storage = new Storage()
            storage.initialize(() => {
                if(!storage.data.playlists.some(playlist => playlist.name == playlistName)){
                    storage.createPlaylist(Date.now(), playlistName, () => {
                        setPlaylists(storage.data.playlists)
                    })
                }
            })
        })
    }

    useEffect(() => {
        const handleTabNavigate = () => {
            if(navigation.getParent().getState().index == 1){
                const storage = new Storage()
                storage.initialize(() => {
                    setPlaylists(storage.data.playlists)
                })
            }
        }

        const handleRootStackNavigate = () => {
            if(navigation.getParent().getParent().getState().index == 0){
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

    const filteredPlaylists = queryFilterPlaylists(playlists, query)

    return (
        <View style={styles.page}>
            <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 58 }} data={filteredPlaylists} ListHeaderComponent={() => {
                return (
                    <View style={styles.playlistItemsHeader}>
                        <View style={styles.playlistItemsCountContainer}>
                            <Text style={styles.playlistItemsCountText}>{ playlists.length } { playlists.length == 1 ? "Playlist" : "Playlists" }</Text>
                        </View>
                        <TouchableOpacity onPress={handleCreateNewPress} activeOpacity={0.8}>
                            <View style={styles.createNewButtonContainer}>
                                <Text style={styles.createNewButtonText}>Create New Playlist</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableWithoutFeedback onPress={handleInputPress}>
                            <View style={styles.inputContainer}>
                                <FontAwesomeIcon style={{ marginHorizontal: 20 }} icon={faMagnifyingGlass} color={colors.flair} size={24} />
                                <TextInput ref={input} defaultValue={query} onChangeText={handleChangeText} onEndEditing={handleEndEditing} style={styles.input} selectionColor={colors.flair} placeholder={"Search Playlists"} placeholderTextColor={colors.dark} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                )
            }} renderItem={({ item, index }) => {
                return (
                    <PlaylistItem key={index} navigation={navigation} id={item.id} name={item.name} songs={item.songs} />
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
    playlistItemsHeader: {
        width: screen.width,
        height: 70,
        marginBottom: 70
    },
    playlistItemsCountContainer: {
        width: "100%",
        height: 40,
        transform: [
            {
                translateY: -40
            }
        ],
        alignItems: "center",
        justifyContent: "center"
    },
    playlistItemsCountText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        color: colors.extraLight
    },
    createNewButtonContainer: {
        width: screen.width - 20,
        height: 60,
        transform: [
            {
                translateY: -40
            }
        ],
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: colors.flair
    },
    createNewButtonText: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 20,
        color: colors.extraLight
    },
    inputContainer: {
        width: screen.width - 20,
        height: 50,
        transform: [
            {
                translateY: -40
            }
        ],
        alignItems: "center",
        flexDirection: "row",
        margin: 10,
        marginTop: 0,
        borderRadius: 10,
        backgroundColor: colors.extraLight
    },
    input: {
        flex: 1,
        height: 30,
        marginRight: 20,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        color: colors.extraDark
    }
})

export default DefaultStack