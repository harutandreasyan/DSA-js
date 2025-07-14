function bubbleSort(arr) {
	for (let i = 0; i < arr.length - 1; ++i) {
		let swapped = false
		for (let j = 0; j < arr.length - 1 - i; ++j) {
			if (arr[j] > arr[j + 1]) {
				;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
				swapped = true
			}
		}
		if (!swapped) break
	}

	return arr
}

console.log(bubbleSort([5, 3, 8, 1, 2])) // [ 1, 2, 3, 5, 8 ]
console.log(bubbleSort([3, -5, 2, -1, 0])) // [ -5, -1, 0, 2, 3 ]
console.log(bubbleSort([1, 2, 3, 4])) // [ 1, 2, 3, 4 ]

