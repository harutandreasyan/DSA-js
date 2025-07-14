// Lomuto partition scheme with pivot = random element

function quickSort(arr, left = 0, right = arr.length - 1) {
	if (left >= right) return
	const pivotIdx = lomutoPartition(arr, left, right)
	quickSort(arr, left, pivotIdx - 1)
	quickSort(arr, pivotIdx + 1, right)
	return arr
}

function lomutoPartition(arr, low, high) {
	const randomIdx = Math.floor(Math.random() * (high - low + 1) + low)
	swap(arr, randomIdx, high)

	const pivot = arr[high]
	let insertPos = low
	for (let i = low; i < high; ++i) {
		if (arr[i] < pivot) {
			swap(arr, i, insertPos)
			insertPos++
		}
	}

	swap(arr, insertPos, high)
	return insertPos
}

function swap(arr, i, j) {
	;[arr[i], arr[j]] = [arr[j], arr[i]]
}

console.log(quickSort([1, 7, 4, 3, -2, 8])) // [ -2, 1, 3, 4, 7, 8 ]
console.log(quickSort([5, 5, -3, 12, 0, -8])) // [ -8, -3, 0, 5, 5, 12 ]
