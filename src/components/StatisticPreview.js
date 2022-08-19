import React from "react"

import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

import FastImage from "react-native-fast-image"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { screen, colors } from "../constants"

const StatisticPreview = ({ navigation, contentName, thumbnails, songs }) => {
    const left = { translateX: -0.25 * screen.width + 30 }
    const right = { translateX: 0.25 * screen.width - 30 }
    const top = { translateY: -0.175 * screen.width + 27 }
    const semiTop = { translateY: -20 }
    const bottom = { translateY: 0.175 * screen.width - 27 }

    let thumbnailTransform1
    let thumbnailTransform2
    let thumbnailTransform3

    if(contentName == "Song"){
        thumbnailTransform1 = [ bottom ]
        thumbnailTransform2 = [ right, semiTop ]
        thumbnailTransform3 = [ left, top ]
    } else if(contentName == "Artist"){
        thumbnailTransform1 = [ top, right ]
        thumbnailTransform2 = [ bottom ]
        thumbnailTransform3 = [ left, semiTop ]
    }

    return (
        <React.Fragment>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText} numberOfLines={1}>See Your Favorite { contentName }s</Text>
            </View>
            <View style={styles.thumbnailsContainer}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <View style={[styles.thumbnailContainer, { transform: thumbnailTransform3 }]}>
                        {
                            thumbnails.length > 2 ? (
                                <FastImage style={styles.thumbnailImage} source={{ uri: thumbnails[2] }} resizeMode={"cover"} />
                            ) : (
                                <View style={styles.thumbnailImage} />
                            )
                        }
                    </View>
                    <View style={[styles.thumbnailContainer, { transform: thumbnailTransform2 }]}>
                        {
                            thumbnails.length > 1 ? (
                                <FastImage style={styles.thumbnailImage} source={{ uri: thumbnails[1] }} resizeMode={"cover"} />
                            ) : (
                                <View style={styles.thumbnailImage} />
                            )
                        }
                    </View>
                    <View style={[styles.thumbnailContainer, { transform: thumbnailTransform1 }]}>
                        {
                            thumbnails.length > 0 ? (
                                <FastImage style={styles.thumbnailImage} source={{ uri: thumbnails[0] }} resizeMode={"cover"} />
                            ) : (
                                <View style={styles.thumbnailImage} />
                            )
                        }
                    </View>
                </View>
                <TouchableOpacity onPress={() => {
                    ReactNativeHapticFeedback.trigger("impactLight", {
                        enableVibrateFallback: false
                    })

                    navigation.push(contentName + "Statistics", { songs })
                }} activeOpacity={0.8}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Learn More</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
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
    thumbnailsContainer: {
        width: screen.width - 40,
        height: 0.7 * screen.width - 28 + 90,
        marginBottom: 10,
        borderRadius: 20,
        backgroundColor: colors.extraDark,
        alignSelf: "center"
    },
    thumbnailContainer: {
        position: "absolute",
        width: 0.5 * screen.width - 20,
        height: 0.35 * screen.width - 14,
        borderRadius: 10,
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowColor: colors.extraLight,
        shadowOffset: { width: 0, height: 0 }
    },
    thumbnailImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        backgroundColor: colors.extraDark
    },
    buttonContainer: {
        width: screen.width - 80,
        height: 60,
        marginTop: 10,
        marginBottom: 20,
        alignSelf: "center",
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

export default StatisticPreview