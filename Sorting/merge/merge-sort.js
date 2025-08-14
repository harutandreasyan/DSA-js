function mergeSort(arr) {
    if (arr.length < 2) return arr

    const mid = Math.floor(arr.length / 2)
    let left = mergeSort(arr.slice(0, mid))
    let right = mergeSort(arr.slice(mid))

    return merge(left, right)

    function merge(left, right) {
        const result = []
        let i = 0
        let j = 0
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result.push(left[i++])
            } else result.push(right[j++])
        }

        while (i < left.length) result.push(left[i++])
        while (j < right.length) result.push(right[j++])

        return result
    }
}

console.log(mergeSort([1, 5, 8, 6, 2, 2, 4, 9]))
// [ 1, 2, 2, 4, 5, 6, 8, 9]
