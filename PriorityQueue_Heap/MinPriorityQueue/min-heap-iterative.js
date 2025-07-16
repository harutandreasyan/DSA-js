/* Priority Queue, Heap Sort */

// left child -> 2 * i + 1
// right child -> 2 * i + 2
// parent -> (i - 1) / 2

// parent is less than children

class MinHeap {
	constructor() {
		this.heap = []
		this.size = 0
	}

	getParentIdx(idx) {
		return Math.floor((idx - 1) / 2)
	}

	getLeftChildIdx(idx) {
		return 2 * idx + 1
	}

	getRightChildIdx(idx) {
		return 2 * idx + 2
	}

	hasParent(idx) {
		return this.getParentIdx(idx) >= 0
	}

	hasLeftChild(idx) {
		return this.getLeftChildIdx(idx) < this.size
	}

	hasRightChild(idx) {
		return this.getRightChildIdx(idx) < this.size
	}

	parent(idx) {
		return this.heap[this.getParentIdx(idx)]
	}

	leftChild(idx) {
		return this.heap[this.getLeftChildIdx(idx)]
	}

	rightChild(idx) {
		return this.heap[this.getRightChildIdx(idx)]
	}

	swap(i, j) {
		;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
	}

	peek() {
		if (this.size === 0) return null
		return this.heap[0]
	}

	insert(data) {
		this.heap[this.size] = data
		this.size++
		this.heapifyUp()
	}

	heapifyUp() {
		let idx = this.size - 1
		while (this.hasParent(idx) && this.parent(idx) > this.heap[idx]) {
			this.swap(this.getParentIdx(idx), idx)
			idx = this.getParentIdx(idx)
		}
	}

	extractMin() {
		if (this.size === 0) {
			throw new Error('Empty Heap')
		}
		if (this.size === 1) {
			return this.heap.pop()
		}
		this.swap(0, this.size - 1)
		const min = this.heap.pop()
		this.size--
		this.heapifyDown()
		return min
	}

	heapifyDown() {
		let idx = 0
		while (this.hasLeftChild(idx)) {
			let smallerChildIdx = this.getLeftChildIdx(idx)
			if (
				this.hasRightChild(idx) &&
				this.rightChild(idx) < this.leftChild(idx)
			) {
				smallerChildIdx = this.getRightChildIdx(idx)
			}

			if (this.heap[idx] < this.heap[smallerChildIdx]) break
			else this.swap(idx, smallerChildIdx)
			idx = smallerChildIdx
		}
	}

	printHeap() {
		console.log(this.heap)
	}
}

let heap = new MinHeap()
heap.insert(42)
heap.insert(144)
heap.insert(61)
heap.insert(17)
heap.insert(4)
heap.insert(16)
heap.insert(19)

console.log(heap.printHeap()) // [ 4, 17, 16, 144, 42, 61, 19 ]
/*
					(4)
				/	   	  \
			(17)		   (16)
			/  \		   /  \
       (144)   	(42)   (61)    (19)
*/

console.log(heap.extractMin()) // 4

console.log(heap.printHeap()) // [ 16, 17, 19, 144, 42, 61 ]
/*
					(16)
				/	   	  \
			(17)		   (19)
			/  \		   /  
       (144)   	(42)   (61)    
*/

console.log(heap.peek()) // 16
