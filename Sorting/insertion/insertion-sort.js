function insertionSort(arr) {
	for (let i = 1; i < arr.length; ++i) {
		const current = arr[i]
		let j = i - 1

		while (j >= 0 && current < arr[j]) {
			arr[j + 1] = arr[j]
			j--
		}

		arr[j + 1] = current
	}

	return arr
}

console.log(insertionSort([1, 7, 4, 3, -2, 8])) // [-2, 1, 3, 4, 7, 8]
console.log(insertionSort([5, -3, 12, 0, -8])) // [-8, -3, 0, 5, 12]
console.log(insertionSort([10, -7, 4, -2, 0, 3, 8])) // [-7, -2, 0, 3, 4, 8, 10]
