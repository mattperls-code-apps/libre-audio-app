import "react-native-gesture-handler"

import { name as AppName } from "./app.json"
import { AppRegistry } from "react-native"
import App from "./src/App"

import TrackPlayer from "react-native-track-player"
import audioPlaybackService from "./src/scripts/audioPlaybackService"

AppRegistry.registerComponent(AppName, () => App)

TrackPlayer.registerPlaybackService(() => audioPlaybackService)

// TODO: max text scaling