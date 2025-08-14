function heapSort(arr) {
    const length = arr.length
    const parentsCount = Math.floor(arr.length / 2) - 1

    for (let i = parentsCount; i >= 0; --i) {
        heapifyDown(arr, length, i)
    }

    for (let i = length - 1; i > 0; --i) {
        swap(arr, i, 0)
        heapifyDown(arr, i, 0)
    }

    return arr
}

function heapifyDown(arr, length, idx) {
    const left = 2 * idx + 1
    const right = 2 * idx + 2
    let largest = idx

    if (left < length && arr[left] > arr[largest]) {
        largest = left
    }
    if (right < length && arr[right] > arr[largest]) {
        largest = right
    }

    if (largest !== idx) {
        swap(arr, idx, largest)
        heapifyDown(arr, length, largest)
    }
}

function swap(arr, i, j) {
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

console.log(heapSort([42, 144, 61, 17, 4, 16, 19])) // [ 4, 16, 17, 19, 42, 61, 144 ]
