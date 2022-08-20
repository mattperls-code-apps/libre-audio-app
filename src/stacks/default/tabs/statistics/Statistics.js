import React from "react"

import { TouchableOpacity, View } from "react-native"

import { createStackNavigator } from "@react-navigation/stack"

import DefaultStack from "./stacks/Default"
import SongStatisticsStack from "./stacks/SongStatistics"
import ArtistStatisticsStack from "./stacks/ArtistStatistics"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { screen, colors } from "../../../../constants"

const StatisticsTab = () => {
    const Tab = createStackNavigator()

    return (
        <Tab.Navigator initialRouteName={"Default"} screenOptions={({ navigation }) => {
            return {
                headerStyle: {
                    height: screen.top + 70,
                    backgroundColor: colors.extraDark,
                    shadowOpacity: 0
                },
                headerTitleStyle: {
                    fontFamily: "Roboto",
                    fontWeight: "700",
                    fontSize: 24,
                    color: colors.flair
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
                                <FontAwesomeIcon icon={faChevronLeft} color={colors.flair} size={24} />
                            </View>
                        </TouchableOpacity>
                    )
                }
            }
        }}>
            <Tab.Screen name={"Default"} component={DefaultStack} options={{
                headerTitle: "Statistics",
                headerLeft: null
            }} />
            <Tab.Screen name={"SongStatistics"} component={SongStatisticsStack} options={{
                headerTitle: "Favorite Songs"
            }} />
            <Tab.Screen name={"ArtistStatistics"} component={ArtistStatisticsStack} options={{
                headerTitle: "Favorite Artists"
            }} />
        </Tab.Navigator>
    )
}

export default StatisticsTab