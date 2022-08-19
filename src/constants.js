import { initialWindowMetrics } from "react-native-safe-area-context"

const screen = {
    width: initialWindowMetrics.frame.width - initialWindowMetrics.insets.left - initialWindowMetrics.insets.right,
    height: initialWindowMetrics.frame.height - initialWindowMetrics.insets.top - initialWindowMetrics.insets.bottom,
    top: initialWindowMetrics.insets.top,
    bottom: initialWindowMetrics.insets.bottom
}

const colors = {
    black: "rgb(0, 0, 0)",
    extraDark: "rgb(10, 10, 10)",
    dark: "rgb(40, 40, 40)",
    light: "rgb(180, 180, 180)",
    extraLight: "rgb(240, 240, 240)",
    flair: "rgb(40, 160, 250)",
    red: "rgb(250, 80, 80)"
}

export {
    screen,
    colors
}