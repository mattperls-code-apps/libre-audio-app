import React, { useState, useEffect } from "react"

import { TouchableOpacity, View, FlatList, Text, TextInput, StyleSheet, Alert } from "react-native"

import { AddableSongItem } from "../../components/SongItem"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../../scripts/storage"

import { screen, colors } from "../../constants"

const MergeStack = ({ navigation, route }) => {
    const { id, title } = route.params

    const [songs, setSongs] = useState([])

    const [mergeIndex, setMergeIndex] = useState(-1)

    useEffect(() => {
        const storage = new Storage()
        storage.initialize(() => {
            setSongs(storage.data.songs.filter(song => song.id != id))
        })
    }, [])

    const handleMergePress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        if(mergeIndex == -1){
            navigation.goBack()
        } else {
            Alert.alert("Merge And Delete?", "Are you sure you want to merge \"" + title + "\" and \"" + songs[mergeIndex].title + "\"?\n\n\"" + title + "\" will be deleted if you merge it.", [
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
                            storage.mergeSong(id, songs[mergeIndex].id, () => {
                                navigation.goBack()
                            })
                        })
                    }
                }
            ])
        }
    }

    const handleCancelPress = () => {
        ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: false
        })
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <FlatList showsVerticalScrollIndicator={false} data={songs} contentContainerStyle={{
                borderTopWidth: 2,
                borderTopColor: colors.dark
            }} renderItem={({ item, index }) => {
                return (
                    <AddableSongItem key={index} title={item.title} artist={item.artist} thumbnail={item.thumbnail} willHaveInPlaylist={index == mergeIndex} toggleWillHaveInPlaylist={() => {
                        if(index == mergeIndex){
                            setMergeIndex(-1)
                        } else {
                            setMergeIndex(index)
                        }
                    }} />
                )
            }} />
            <View style={{ backgroundColor: colors.extraDark, marginBottom: screen.bottom }}>
                <TouchableOpacity onPress={handleMergePress} activeOpacity={0.8}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Merge</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelPress} activeOpacity={0.8}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Cancel</Text>
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
    }
})

export default MergeStack