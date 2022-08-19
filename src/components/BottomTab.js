import React from "react"

import { TouchableWithoutFeedback, View, Text, StyleSheet } from "react-native"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faBookOpen, faMusic, faMagnifyingGlass, faChartSimple, faGear } from "@fortawesome/free-solid-svg-icons"

import MiniControls from "./MiniControls"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { screen, colors } from "../constants"

const BottomTab = ({ state, navigation }) => {
    const navigateToLibrary = () => {
        ReactNativeHapticFeedback.trigger("impactMedium", {
            enableVibrateFallback: false
        })
        navigation.navigate("Library")
    }

    const navigateToPlaylists = () => {
        ReactNativeHapticFeedback.trigger("impactMedium", {
            enableVibrateFallback: false
        })
        navigation.navigate("Playlists")
    }

    const navigateToSearch = () => {
        ReactNativeHapticFeedback.trigger("impactMedium", {
            enableVibrateFallback: false
        })
        navigation.navigate("Search")
    }

    const navigateToStatistics = () => {
        ReactNativeHapticFeedback.trigger("impactMedium", {
            enableVibrateFallback: false
        })
        navigation.navigate("Statistics")
    }

    const navigateToSettings = () => {
        ReactNativeHapticFeedback.trigger("impactMedium", {
            enableVibrateFallback: false
        })
        navigation.navigate("Settings")
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={navigateToLibrary}>
                <View style={styles.optionContainer}>
                    <FontAwesomeIcon icon={faBookOpen} color={state.index == 0 ? colors.flair : colors.light} size={24} />
                    <Text style={[styles.optionLabel, { color: state.index == 0 ? colors.flair : colors.light }]}>Library</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={navigateToPlaylists}>
                <View style={styles.optionContainer}>
                    <FontAwesomeIcon icon={faMusic} color={state.index == 1 ? colors.flair : colors.light} size={24} />
                    <Text style={[styles.optionLabel, { color: state.index == 1 ? colors.flair : colors.light }]}>Playlists</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={navigateToSearch}>
                <View style={styles.optionContainer}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} color={state.index == 2 ? colors.flair : colors.light} size={24} />
                    <Text style={[styles.optionLabel, { color: state.index == 2 ? colors.flair : colors.light }]}>Search</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={navigateToStatistics}>
                <View style={styles.optionContainer}>
                    <FontAwesomeIcon icon={faChartSimple} color={state.index == 3 ? colors.flair : colors.light} size={24} />
                    <Text style={[styles.optionLabel, { color: state.index == 3 ? colors.flair : colors.light }]}>Statistics</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={navigateToSettings}>
                <View style={styles.optionContainer}>
                    <FontAwesomeIcon icon={faGear} color={state.index == 4 ? colors.flair : colors.light} size={24} />
                    <Text style={[styles.optionLabel, { color: state.index == 4 ? colors.flair : colors.light }]}>Settings</Text>
                </View>
            </TouchableWithoutFeedback>
            <MiniControls navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: screen.width,
        height: screen.bottom + 80,
        backgroundColor: colors.extraDark,
        paddingBottom: screen.bottom,
        flexDirection: "row",
        borderTopWidth: 2,
        borderTopColor: colors.dark
    },
    optionContainer: {
        width: 0.25 * screen.width,
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    optionLabel: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 14,
        marginTop: 6
    }
})

export default BottomTab