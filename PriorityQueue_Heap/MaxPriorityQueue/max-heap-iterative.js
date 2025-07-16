class MaxHeap {
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
		return this.size !== 0 ? this.heap[0] : null
	}

	insert(data) {
		this.heap.push(data)
		this.size++
		this.heapifyUp()
	}

	heapifyUp() {
		let idx = this.size - 1
		while (this.hasParent(idx) && this.heap[idx] > this.parent(idx)) {
			this.swap(this.getParentIdx(idx), idx)
			idx = this.getParentIdx(idx)
		}
	}

	extractMax() {
		if (this.size === 0) throw new Error('Empty Heap')
		if (this.size === 1) return this.heap.pop()
		this.swap(0, this.size - 1)
		const max = this.heap.pop()
        this.size--
		this.heapifyDown()
		return max
	}

	heapifyDown() {
		let idx = 0
		while (this.hasLeftChild(idx)) {
			let largestChildIdx = this.getLeftChildIdx(idx)
			if (
				this.hasRightChild(idx) &&
				this.leftChild(idx) < this.rightChild(idx)
			) {
				largestChildIdx = this.getRightChildIdx(idx)
			}

			if (this.heap[idx] > this.heap[largestChildIdx]) break
			else this.swap(idx, largestChildIdx)
			idx = largestChildIdx
		}
	}

	printHeap() {
		console.log(this.heap)
	}
}

let heap = new MaxHeap()
heap.insert(42)
heap.insert(144)
heap.insert(61)
heap.insert(17)
heap.insert(4)
heap.insert(16)
heap.insert(19)

console.log(heap.printHeap()) // [ 144, 42, 61, 17, 4, 16, 19 ]
/*
				   (144)
				/	   	  \
			(42)		   (61)
			/  \		   /  \
        (17)   	(4)    (16)    (19)
*/

console.log(heap.extractMax()) // 144

console.log(heap.printHeap()) // [ 61, 42, 19, 17, 4, 16 ]
/*
				    (61)
				/	   	  \
			(42)		   (19)
			/  \		   /  
        (17)   	(4)    (16)    
*/

console.log(heap.peek()) // 61
