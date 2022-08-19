import React from "react"

import { TouchableOpacity, View } from "react-native"

import { createStackNavigator } from "@react-navigation/stack"

import DefaultStack from "./stacks/Default"
import PlaylistStack from "./stacks/Playlist"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

import { screen, colors } from "../../../../constants"

const PlaylistsTab = () => {
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator initialRouteName={"Default"} screenOptions={{
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
        }}>
            <Stack.Screen name={"Default"} component={DefaultStack} options={{
                headerTitle: "Playlists"
            }} />
            <Stack.Screen name={"Playlist"} component={PlaylistStack} options={({ navigation, route }) => {
                return {
                    headerTitle: route.params.name,
                    headerLeft: () => {
                        return (
                            <TouchableOpacity onPress={navigation.goBack} activeOpacity={0.8}>
                                <View style={{ paddingHorizontal: 20, height: "100%", alignItems: "center", justifyContent: "center" }}>
                                    <FontAwesomeIcon icon={faChevronLeft} color={colors.flair} size={24} />
                                </View>
                            </TouchableOpacity>
                        )
                    }
                }
            }} />
        </Stack.Navigator>
    )
}

export default PlaylistsTab