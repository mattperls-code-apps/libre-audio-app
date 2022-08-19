const formatArtist = (str) => {
    if(str.slice(0, 6).toLowerCase() == "atvevo"){
        str = str.slice(6)
    }
    if(str.slice(str.length - 6).toLowerCase() == "atvevo"){
        str = str.slice(0, str.length - 6)
    }

    let transformed = str.replace(/\s/g, " ").split("-")[0].trim()

    let words = [ transformed[0] ]
    for(let i = 1;i<transformed.length;i++){
        const char = transformed[i]
        const last = transformed[i - 1]

        if(char == " "){
            words.push("")
        } else if(char == char.toLowerCase()){
            words[words.length - 1] += char
        } else if(last == last.toLowerCase() && last != " "){
            words.push(char)
        } else {
            words[words.length - 1] += char
        }
    }

    for(let i = 0;i<words.length;i++){
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)

        if(words[i].slice(0, 4).toLowerCase() == "vevo"){
            words[i] = words[i].slice(4)
        }
        if(words[i].slice(words[i].length - 4).toLowerCase() == "vevo"){
            words[i] = words[i].slice(0, words[i].length - 4)
        }
        if(words[i].length == 0){
            words.splice(i, 1)
            i--
        }
    }

    return words.join(" ").replaceAll("Mc ", "Mc")
}

export default formatArtist