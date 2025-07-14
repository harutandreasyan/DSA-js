// Lomuto partition scheme with pivot = last element (same for first element)

function quickSort(arr, left = 0, right = arr.length - 1) {
	if (left >= right) return
	const pivotIdx = lomutoPartiton(arr, left, right)
	quickSort(arr, left, pivotIdx - 1)
	quickSort(arr, pivotIdx + 1, right)
	return arr
}

function lomutoPartiton(arr, low, high) {
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

console.log(quickSort([10, 7, 8, 9, 1, 5])) // [ 1, 5, 7, 8, 9, 10 ]
console.log(quickSort([5, 5, -3, 12, 0, -8])) // [ -8, -3, 0, 5, 5, 12 ]
