import React, { useState, useRef, useEffect } from "react"

import { TouchableOpacity, ScrollView, View, Text, StyleSheet } from "react-native"

import FastImage from "react-native-fast-image"
import { captureRef } from "react-native-view-shot"

import StatisticPreview from "../../../../../components/StatisticPreview"

import Share from "react-native-share"

import Storage from "../../../../../scripts/storage"
import getPlaysInTimeRange from "../../../../../scripts/getPlaysInTimeRange"

import { screen, colors } from "../../../../../constants"

const DefaultStack = ({ navigation }) => {
    const [songs, setSongs] = useState([])

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

    let totalPlays = 0
    let totalMinutes = 0
    getPlaysInTimeRange(songs, 1).forEach(song => {
        totalPlays += song.plays
        totalMinutes += song.plays * song.duration
    })
    totalMinutes = Math.floor(totalMinutes / 60)

    let sortedSongs = [...songs].sort((a, b) => {
        if(a.plays.length < b.plays.length){
            return 1
        } else if(a.plays.length > b.plays.length){
            return -1
        } else {
            return 0
        }
    })

    let artists = {}
    songs.forEach(song => {
        if(artists.hasOwnProperty(song.artist)){
            artists[song.artist] += song.plays.length * song.duration
        } else {
            artists[song.artist] = song.plays.length * song.duration
        }
    })

    let sortedArtists = Object.entries(artists).sort((a, b) => {
        if(a[1] < b[1]){
            return 1
        } else if(a[1] > b[1]){
            return -1
        } else {
            return 0
        }
    }).slice(0, 5)

    let artistThumbnails = []
    sortedArtists.forEach(artist => {
        for(let i = 0;i<songs.length;i++){
            if(songs[i].artist == artist[0]){
                artistThumbnails.push(songs[i].thumbnail)
                return
            }
        }
    })

    const summary = useRef()

    const shareSummary = () => {
        captureRef(summary, {
            format: "jpg",
            width: 400,
            height: 500,
            quality: 1
        }).then(url => {
            try {
                Share.open({
                    title: "Libre Audio - Yearly Recap",
                    url,
                    failOnCancel: false
                })
            } catch(e){
                console.warn(e)
            }
        })
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container} contentContainerStyle={{ marginTop: 20, paddingBottom: 90 }}>
            <View ref={summary} style={styles.summaryContainer}>
                <View style={styles.summaryTopContainer}>
                    <FastImage style={[styles.summaryTopLogoImage, { left: 0.05 * (screen.width - 40) }]} source={require("../../../../../assets/images/logo180.png")} />
                    <FastImage style={[styles.summaryTopLogoImage, { right: 0.05 * (screen.width - 40) }]} source={require("../../../../../assets/images/logo180.png")} />
                    <Text style={styles.summaryTopHeader}>LIBRE AUDIO</Text>
                    <Text style={styles.summaryTopSubheader}>- Yearly Recap -</Text>
                </View>
                <View style={styles.summaryMainContainer}>
                    <View style={styles.summaryMainSide}>
                        <View style={styles.summaryStatContainer}>
                            <Text style={styles.summaryStatHeader}>Songs{"\n"}Played</Text>
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Text style={styles.summaryStatNumber}>
                                    {
                                        totalPlays
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.summaryStatContainer}>
                            <Text style={styles.summaryStatHeader}>Minutes{"\n"}Listened</Text>
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Text style={styles.summaryStatNumber}>
                                    {
                                        totalMinutes
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.summaryMainSide}>
                        <View style={styles.summaryStatContainer}>
                            <Text style={styles.summaryStatHeader}>Top Artists</Text>
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                {
                                    sortedArtists.map((artist, index) => {
                                        return (
                                            <Text key={artist[0]} style={styles.summaryStatName} numberOfLines={1}>
                                                {
                                                    (index + 1) + ") " + artist[0]
                                                }
                                            </Text>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View style={styles.summaryStatContainer}>
                            <Text style={styles.summaryStatHeader}>Top Songs</Text>
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                {
                                    sortedSongs.slice(0, 5).map((song, index) => {
                                        return (
                                            <Text key={song.id} style={styles.summaryStatName} numberOfLines={1}>
                                                {
                                                    (index + 1) + ") " + song.title
                                                }
                                            </Text>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={shareSummary} activeOpacity={0.8}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Share Yearly Recap</Text>
                </View>
            </TouchableOpacity>
            <StatisticPreview navigation={navigation} contentName={"Song"} thumbnails={sortedSongs.slice(0, 3).map(song => song.thumbnail)} songs={songs} />
            <StatisticPreview navigation={navigation} contentName={"Artist"} thumbnails={artistThumbnails.slice(0, 3)} songs={songs} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark
    },
    headerContainer: {
        width: "100%",
        height: 60,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    },
    headerText: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 24,
        color: colors.extraLight
    },
    summaryContainer: {
        width: screen.width - 40,
        height: 1.25 * (screen.width - 40),
        alignSelf: "center",
        backgroundColor: colors.extraDark
    },
    summaryTopContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    summaryTopLogoImage: {
        position: "absolute",
        top: 0.02 * (screen.width - 40),
        width: 1/10 * 1.25 * (screen.width - 40),
        height: 1/10 * 1.25 * (screen.width - 40)
    },
    summaryTopHeader: {
        fontFamily: "Roboto",
        fontWeight: "300",
        fontSize: 1/16 * 1.25 * (screen.width - 40),
        color: colors.flair,
        marginBottom: 1/100 * 1.25 * (screen.width - 40)
    },
    summaryTopSubheader: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 1/32 * 1.25 * (screen.width - 40),
        color: colors.extraLight
    },
    summaryMainContainer: {
        flex: 5,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    summaryMainSide: {
        width: 0.4 * (screen.width - 40),
        height: "100%"
    },
    summaryStatContainer: {
        flex: 1,
        marginBottom: 1/6 * 0.4 * (screen.width - 40),
        borderRadius: 1/12 * 0.4 * (screen.width - 40),
        borderWidth: 1/50 * 0.4 * (screen.width - 40),
        borderColor: colors.dark
    },
    summaryStatHeader: {
        fontFamily: "Roboto",
        fontWeight: "900",
        fontSize: 1/8 * 0.4 * (screen.width - 40),
        textAlign: "center",
        color: colors.extraLight,
        marginTop: 1/8 * 0.4 * (screen.width - 40)
    },
    summaryStatNumber: {
        fontFamily: "Roboto",
        fontWeight: "900",
        fontSize: 1/5 * 0.4 * (screen.width - 40),
        color: colors.flair
    },
    summaryStatName: {
        width: "100%",
        paddingHorizontal: 1/16 * 0.4 * (screen.width - 40),
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 1/10 * 0.4 * (screen.width - 40),
        lineHeight: 1/8 * 0.4 * (screen.width - 40),
        color: colors.flair,
        textAlign: "left"
    },
    buttonContainer: {
        width: screen.width - 40,
        height: 60,
        margin: 20,
        marginBottom: 10,
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

export default DefaultStack