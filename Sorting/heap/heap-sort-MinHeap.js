function heapSort(arr) {
	const length = arr.length
	const parentsCount = Math.floor(length / 2) - 1

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
	let smallest = idx
	const left = 2 * idx + 1
	const right = 2 * idx + 2

	if (left < length && arr[left] < arr[smallest]) {
		smallest = left
	}
	if (right < length && arr[right] < arr[smallest]) {
		smallest = right
	}

	if (smallest !== idx) {
		swap(arr, smallest, idx)
		heapifyDown(arr, length, smallest)
	}
}

function swap(arr, i, j) {
	;[arr[i], arr[j]] = [arr[j], arr[i]]
}

console.log(heapSort([42, 144, 61, 17, 4, 16, 19]))
