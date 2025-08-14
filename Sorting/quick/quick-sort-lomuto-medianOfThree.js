// Lomuto partition scheme with pivot = median-of-three

function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return arr
    const pivotIdx = lomutoPartition(arr, left, right)
    quickSort(arr, left, pivotIdx - 1)
    quickSort(arr, pivotIdx + 1, right)
    return arr
}

function lomutoPartition(arr, low, high) {
    const mid = Math.floor((low + high) / 2)
    const m = medianOfThree(arr, low, mid, high)
    swap(arr, m, high)

    const pivot = arr[high]
    let insertPos = low

    for (let i = low; i < high; i++) {
        if (arr[i] < pivot) {
            swap(arr, i, insertPos)
            insertPos++
        }
    }

    swap(arr, insertPos, high)
    return insertPos
}

function medianOfThree(arr, i, j, k) {
    const a = arr[i]
    const b = arr[j]
    const c = arr[k]

    if ((a <= b && b <= c) || (c <= b && b <= a)) return j
    if ((b <= a && a <= c) || (c <= a && a <= b)) return i
    return k
}

function swap(arr, i, j) {
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

console.log(quickSort([10, 7, 8, 9, 1, 5])) // [ 1, 5, 7, 8, 9, 10 ]
console.log(quickSort([5, 5, -3, 12, 0, -8])) // [ -8, -3, 0, 5, 5, 12 ]
