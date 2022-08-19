import React, { useState, useRef } from "react"

import { TouchableWithoutFeedback, View, Text, TextInput, FlatList, StyleSheet } from "react-native"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

import SongItem from "../../../../components/SongItem"

import getSearchResults from "../../../../scripts/getSearchResults"

import { screen, colors } from "../../../../constants"

const SearchTab = ({ navigation }) => {
    const [songItems, setSongItems] = useState([])

    const input = useRef()
    
    const [query, setQuery] = useState("")

    const handleInputPress = () => {
        input.current.focus()
    }

    const handleChangeText = (text) => {
        if(text.length == 0){
            setQuery("")
            setSongItems([])
        }
    }

    const handleEndEditing = (e) => {
        let newQuery = e.nativeEvent.text
        
        setQuery(newQuery)
        getSearchResults(newQuery, setSongItems)
    }

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Search</Text>
            </View>
            <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 58 }} data={songItems} ListHeaderComponent={() => {
                return (
                    <View style={styles.mediaItemsHeader}>
                        <View style={styles.mediaItemsCountContainer}>
                            <Text style={styles.mediaItemsCountText}>{ songItems.length } { songItems.length == 1 ? "Song" : "Songs" } Found</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={handleInputPress}>
                            <View style={styles.searchBar}>
                                <FontAwesomeIcon style={{ marginHorizontal: 20 }} icon={faMagnifyingGlass} color={colors.flair} size={24} />
                                <TextInput ref={input} defaultValue={query} onChangeText={handleChangeText} onEndEditing={handleEndEditing} style={styles.searchBarInput} selectionColor={colors.flair} placeholder={"Search For Music"} placeholderTextColor={colors.dark} clearButtonMode={"always"} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                )
            }} renderItem={({ item, index }) => {
                return (
                    <SongItem key={index} navigation={navigation} id={item.id} title={item.title} artist={item.artist} description={"Search"} thumbnail={item.thumbnail} duration={item.duration} />
                )
            }} />
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.dark
    },
    header: {
        height: screen.top + 70,
        paddingTop: screen.top,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.extraDark
    },
    headerTitle: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 24,
        color: colors.flair
    },
    mediaItemsHeader: {
        width: screen.width,
        height: 70
    },
    mediaItemsCountContainer: {
        width: "100%",
        height: 40,
        transform: [
            {
                translateY: -40
            }
        ],
        alignItems: "center",
        justifyContent: "center"
    },
    mediaItemsCountText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        color: colors.extraLight
    },
    searchBar: {
        width: screen.width - 20,
        height: 50,
        transform: [
            {
                translateY: -40
            }
        ],
        alignItems: "center",
        flexDirection: "row",
        margin: 10,
        borderRadius: 10,
        backgroundColor: colors.extraLight
    },
    searchBarInput: {
        flex: 1,
        height: 30,
        marginRight: 20,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        color: colors.extraDark
    }
})

export default SearchTab