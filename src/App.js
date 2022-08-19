import React, { useEffect } from "react"

import { TouchableOpacity, View, LogBox } from "react-native"

import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import DefaultStack from "./stacks/default/Default"
import PlayerStack from "./stacks/player/Player"
import ReorderQueueStack from "./stacks/reorderQueue/ReorderQueue"
import SongInfoStack from "./stacks/songInfo/SongInfo"
import AddSongsStack from "./stacks/addSongs/AddSongs"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronDown, faLayerGroup } from "@fortawesome/free-solid-svg-icons"

import SplashScreen from "react-native-splash-screen"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { screen, colors } from "./constants"

const App = () => {
    const Stack = createStackNavigator()

    useEffect(() => {
        LogBox.ignoreAllLogs(true)
        SplashScreen.hide()
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"App"} screenOptions={({ navigation }) => {
                return {
                    headerShown: true,
                    presentation: "modal",
                    headerStyle: {
                        height: screen.top + 70,
                        backgroundColor: colors.extraDark,
                        shadowOpacity: 0
                    },
                    headerTitleStyle: {
                        fontFamily: "Roboto",
                        fontWeight: "700",
                        fontSize: 24,
                        color: colors.extraLight
                    },
                    headerLeft: () => {
                        return (
                            <TouchableOpacity onPress={() => {
                                ReactNativeHapticFeedback.trigger("impactLight", {
                                    enableVibrateFallback: false
                                })
                                navigation.goBack()
                            }} activeOpacity={0.8}>
                                <View style={{ paddingHorizontal: 20, height: "100%", alignItems: "center", justifyContent: "center" }}>
                                    <FontAwesomeIcon icon={faChevronDown} color={colors.light} size={24} />
                                </View>
                            </TouchableOpacity>
                        )
                    }
                }
            }}>
                <Stack.Screen name={"App"} component={DefaultStack} options={{
                    headerShown: false
                }} />
                <Stack.Screen name={"Player"} component={PlayerStack} options={({ navigation }) => {
                    return {
                        headerRight: () => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    ReactNativeHapticFeedback.trigger("impactLight", {
                                        enableVibrateFallback: false
                                    })
                                    navigation.push("Queue")
                                }} activeOpacity={0.8}>
                                    <View style={{ paddingHorizontal: 20, height: "100%", alignItems: "center", justifyContent: "center" }}>
                                        <FontAwesomeIcon icon={faLayerGroup} color={colors.flair} size={24} />
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    }
                }} />
                <Stack.Screen name={"Queue"} component={ReorderQueueStack} />
                <Stack.Screen name={"SongInfo"} component={SongInfoStack} options={{
                    headerTitle: "Add To Playlists"
                }} />
                <Stack.Screen name={"AddSongs"} component={AddSongsStack} options={({ route }) => {
                    return {
                        headerTitle: "Add To \"" + route.params.name + "\""
                    }
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App