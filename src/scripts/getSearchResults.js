import axios from "axios"

import formatArtist from "./formatArtist"
import { timeStringToLength } from "./timeUtils"

const getSearchResults = (query, callback) => {
  let _videos = []
  
  const url = `https://www.youtube.com/results?q=${encodeURI(query)}&hl=en`

  axios.get(url).then(res => {
    const data = JSON.parse(res.data.split("ytInitialData = '")[1].split("';</script>")[0].replace(/\\x([0-9A-F]{2})/ig, (...items) => {
      return String.fromCharCode(parseInt(items[1], 16));
    }).replaceAll("\\\\\"", ""))

    let searchResults = data?.contents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents

    if (searchResults == undefined) {
      searchResults = data?.contents?.sectionListRenderer?.contents?.[1]?.itemSectionRenderer?.contents
    }

    const rawVideoResults = searchResults.filter(item => item.hasOwnProperty("compactVideoRenderer")).map(item => item.compactVideoRenderer)

    const videos = []
    rawVideoResults.forEach(video => {
      try {
        const labelParts = video.accessibility.accessibilityData.label.split("Go to channel - ")
        const artist = formatArtist(labelParts[labelParts.length - 1].split(" - ")[0])
        videos.push({
          id: video.videoId,
          title: JSON.parse(`"` + video.title.runs[0].text + `"`),
          artist,
          thumbnail: video.thumbnail.thumbnails[video.thumbnail.thumbnails.length - 1].url,
          duration: timeStringToLength(video.lengthText.runs[0].text)
        })
      } catch (err) {
        console.warn(err)
      }
    })
    
    if (!callback) {
      _videos = videos
    } else {
      callback(videos)
    }
    
  }).catch((err) => {
    console.warn(err)
    if (!callback) {
      _videos = []
    } else {
      callback([])
    }
  })

  if (!callback) return _videos
}

export default getSearchResults