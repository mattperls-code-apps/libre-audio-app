import React, { useState, useEffect } from "react"

import { TouchableOpacity, ScrollView, View, Text, StyleSheet } from "react-native"

import { TopArtistItem } from "../../../../../components/PlaylistItem"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../../../../../scripts/storage"
import getPlaysInTimeRange from "../../../../../scripts/getPlaysInTimeRange"

import { colors } from "../../../../../constants"

const ArtistStatisticsStack = ({ navigation, route }) => {
    const [timeRange, setTimeRange] = useState(0)

    const handleSelectionPress = (index) => {
        return () => {
            ReactNativeHapticFeedback.trigger("impactLight", {
                enableVibrateFallback: false
            })

            setTimeRange(index)
        }
    }

    const [songs, setSongs] = useState(route.params.songs)

    useEffect(() => {
        const storage = new Storage()
        storage.initialize(() => {
            setSongs(storage.data.songs)
        })

        const handleTabNavigate = () => {
            if(navigation.getParent().getState().index == 3){
                const storage = new Storage()
                storage.initialize(() => {
                    setSongs(storage.data.songs)
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

    const filteredSongs = getPlaysInTimeRange(songs, timeRange)
    
    let artists = {}
    filteredSongs.forEach((song, index) => {
        const minutesListened = song.plays * song.duration

        song.artist.split(",").map(artist => artist.trim()).filter(artist => artist != "").forEach((artist) => {
            if(artists.hasOwnProperty(artist)){
                artists[artist].minutesListened += minutesListened
                artists[artist].songsCount++
            } else {
                artists[artist] = { name: artist, minutesListened, songsCount: 1, index }
            }
        })
    })

    let sortedArtists = Object.values(artists).sort((a, b) => {
        if(a.minutesListened < b.minutesListened){
            return 1
        } else if(a.minutesListened > b.minutesListened){
            return -1
        } else {
            return 0
        }
    })

    const topArtists = []
    sortedArtists.forEach(artist => {
        topArtists.push(
            <TopArtistItem key={artist.name} minutesListened={Math.floor(artist.minutesListened / 60)} name={artist.name} songsCount={artist.songsCount} thumbnail={songs[artist.index].thumbnail} />
        )
    })

    return (
        <View style={styles.container}>
            <View style={styles.timeSelectionBar}>
                <TouchableOpacity onPress={handleSelectionPress(0)} activeOpacity={0.8}>
                    <View style={[styles.selectionOptionContainer, { backgroundColor: timeRange == 0 ? colors.flair : colors.dark }]}>
                        <Text style={styles.selectionOptionText}>All Time</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSelectionPress(1)} activeOpacity={0.8}>
                    <View style={[styles.selectionOptionContainer, { backgroundColor: timeRange == 1 ? colors.flair : colors.dark }]}>
                        <Text style={styles.selectionOptionText}>Year</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSelectionPress(2)} activeOpacity={0.8}>
                    <View style={[styles.selectionOptionContainer, { backgroundColor: timeRange == 2 ? colors.flair : colors.dark }]}>
                        <Text style={styles.selectionOptionText}>Month</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSelectionPress(3)} activeOpacity={0.8}>
                    <View style={[styles.selectionOptionContainer, { backgroundColor: timeRange == 3 ? colors.flair : colors.dark }]}>
                        <Text style={styles.selectionOptionText}>Week</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.dark }} contentContainerStyle={{ paddingBottom: 60 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>TOP { Math.min(10, topArtists.length) } ARTISTS</Text>
                </View>
                <View style={styles.topArtistsContainer}>
                    {
                        topArtists.slice(0, 10)
                    }
                </View>
                {
                    topArtists.length > 10 && (
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>OTHER FAVORITES</Text>
                        </View>
                    )
                }
                <View style={styles.topArtistsContainer}>
                    {
                        topArtists.slice(10)
                    }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.extraDark
    },
    timeSelectionBar: {
        width: "100%",
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    selectionOptionContainer: {
        padding: 10,
        borderRadius: 7.5
    },
    selectionOptionText: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 18,
        color: colors.extraLight
    },
    headerContainer: {
        width: "100%",
        height: 80,
        alignItems: "center",
        justifyContent: "center"
    },
    headerText: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 32,
        color: colors.extraLight
    },
    topArtistsContainer: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly"
    }
})

export default ArtistStatisticsStack