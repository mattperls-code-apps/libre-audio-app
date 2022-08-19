import React, { useState, useEffect } from "react"

import { TouchableOpacity, View, FlatList, Text, TextInput, StyleSheet } from "react-native"

import { AddableSongItem } from "../../components/SongItem"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../../scripts/storage"

import { screen, colors } from "../../constants"

const AddSongsStack = ({ navigation, route }) => {
    const { id } = route.params

    const [songs, setSongs] = useState([])

    useEffect(() => {
        const storage = new Storage()
        storage.initialize(() => {
            const playlist = storage.getPlaylist(id)
            setSongs(storage.data.songs.map(song => {
                song.willHaveInPlaylist = playlist.songs.includes(song.id)
                return song
            }))
        })
    }, [])

    const handleDonePress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        const storage = new Storage()
        storage.initialize(() => {
            const songIds = []
            songs.forEach(song => {
                if(song.willHaveInPlaylist){
                    songIds.push(song.id)
                }
            })
            storage.setSongsInPlaylist(id, songIds, navigation.goBack)
        })
    }

    return (
        <View style={styles.container}>
            <FlatList showsVerticalScrollIndicator={false} data={songs} contentContainerStyle={{
                borderTopWidth: 2,
                borderTopColor: colors.dark
            }} renderItem={({ item, index }) => {
                return (
                    <AddableSongItem key={index} title={item.title} artist={item.artist} thumbnail={item.thumbnail} willHaveInPlaylist={item.willHaveInPlaylist} toggleWillHaveInPlaylist={() => {
                        const temp = [...songs]
                        songs[index].willHaveInPlaylist = !songs[index].willHaveInPlaylist
                        setSongs(temp)
                    }} />
                )
            }} />
            <View style={{ backgroundColor: colors.extraDark }}>
                <TouchableOpacity onPress={handleDonePress} activeOpacity={0.8}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Done</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

export default AddSongsStack