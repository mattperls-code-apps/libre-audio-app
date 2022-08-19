import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import LibraryTab from "./tabs/library/Library"
import PlaylistsTab from "./tabs/playlists/Playlists"
import SearchTab from "./tabs/search/Search"
import StatisticsTab from "./tabs/statistics/Statistics"

import BottomTab from "../../components/BottomTab"

const DefaultStack = () => {
    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator initialRouteName={"Library"} screenOptions={{
            headerShown: false
        }} tabBar={BottomTab}>
            <Tab.Screen name={"Library"} component={LibraryTab} />
            <Tab.Screen name={"Playlists"} component={PlaylistsTab} />
            <Tab.Screen name={"Search"} component={SearchTab} />
            <Tab.Screen name={"Statistics"} component={StatisticsTab} />
        </Tab.Navigator>
    )
}

export default DefaultStack