function countingSort(arr) {
	const bias = Math.abs(Math.min(...arr))
	const result = []

	for (let i = 0; i < arr.length; ++i) {
		arr[i] += bias
	}

	const max = Math.max(...arr)
	const counts = new Array(max + 1).fill(0)

	for (let num of arr) {
		counts[num]++
	}

	// using Prefix Sum for stability
	for (let i = 1; i < counts.length; ++i) {
		counts[i] += counts[i - 1]
	}

	for (let i = arr.length - 1; i >= 0; --i) {
		let idx = counts[arr[i]]
		result[idx - 1] = arr[i] - bias
		counts[arr[i]]--
	}

	return result
}

console.log(countingSort([1, 3, -1, 0, 4, -2])) // [ -2, -1, 0, 1, 3, 4 ]
console.log(countingSort([173, -209, 625, -264, 499])) // [ -264, -209, 173, 499, 625 ]
