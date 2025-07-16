/* Counting Sort - not stable (default version) */

function countingSort(arr) {
	if (arr.length === 0) return []

	let min = Math.min(...arr)
	let max = Math.max(...arr)
	const offset = -min

	const counts = new Array(max - min + 1).fill(0)

	for (const num of arr) {
		counts[num + offset]++
	}

	const result = []
	for (let i = 0; i < counts.length; ++i) {
		while (counts[i]-- > 0) {
			result.push(i - offset)
		}
	}

	return result
}

console.log(countingSort([1, 3, -3, 7, 0, -4])) // [ -4, -3, 0, 1, 3, 7 ]
