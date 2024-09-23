const parseCsv = (csv) => {
    csv=csv.replaceAll(' ', '').replaceAll('\n',',').split(',')
    const removeList = []

    // csv.forEach((el, i) => {
    //     if(el.startsWith('"')){
    //         for(let j=i+1; j<csv.length; j++){
    //             const word = csv[j]
    //             if(word.endsWith('"')){
    //                 csv[i]+=','+word
    //                 removeList.push(j)
    //                 break
    //             }
    //             else{
    //                 csv[i]+=','+word
    //                 removeList.push(j)
    //             }
    //         }
    //     }
    // })

    removeList.forEach((el, i) => csv.splice(el-i, 1))

    const res = []
    for(let i=0; i<csv.length/7; i++){
        res[i]={
            question:csv[i*7],
            difficulty:csv[i*7+1],
            answers:[csv[i*7+2],csv[i*7+3],csv[i*7+4],csv[i*7+5]],
            correct: csv[i*7+6],
        }
    }

    return res

}

module.exports = parseCsv