// Hoare partition scheme with pivot = middle element

function quickSort(arr, left = 0, right = arr.length - 1) {
	if (left < right) {
		const pivotIdx = hoarePartition(arr, left, right)
		quickSort(arr, left, pivotIdx)
		quickSort(arr, pivotIdx + 1, right)
	}
	return arr
}

function hoarePartition(arr, low, high) {
	const mid = Math.floor((high + low) / 2)
	const pivot = arr[mid]

	let left = low - 1
	let right = high + 1

	while (true) {
		do {
			left++
		} while (arr[left] < pivot)
		do {
			right--
		} while (arr[right] > pivot)

		if (left >= right) return right
		swap(arr, left, right)
	}
}

function swap(arr, i, j) {
	;[arr[i], arr[j]] = [arr[j], arr[i]]
}

console.log(quickSort([10, 7, 8, 9, 1, 5])) // [ 1, 5, 7, 8, 9, 10 ]
console.log(quickSort([5, 5, -3, 12, 0, -8])) // [ -8, -3, 0, 5, 5, 12 ]
