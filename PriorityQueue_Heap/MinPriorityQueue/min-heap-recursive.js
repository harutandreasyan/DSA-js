class MinHeap {
    constructor() {
        this.heap = []
        this.size = 0
    }

    getLeftChildIdx(idx) {
        return 2 * idx + 1
    }

    getRightChildIdx(idx) {
        return 2 * idx + 2
    }

    getParentIdx(idx) {
        return Math.floor((idx - 1) / 2)
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
        if (this.heap.size === 0) return null
        return this.heap[0]
    }

    insert(data) {
        this.heap[this.size] = data
        this.size++
        this.heapifyUp(this.size - 1)
    }

    heapifyUp(idx) {
        if (this.hasParent(idx) && this.parent(idx) > this.heap[idx]) {
            this.swap(this.getParentIdx(idx), idx)
            this.heapifyUp(this.getParentIdx(idx))
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
        this.heapifyDown(0)
        return min
    }

    heapifyDown(idx) {
        let smallest = idx
        if (this.hasLeftChild(idx) && this.heap[smallest] > this.leftChild(idx)) {
            smallest = this.getLeftChildIdx(idx)
        }
        if (this.hasRightChild(idx) && this.heap[smallest] > this.rightChild(idx)) {
            smallest = this.getRightChildIdx(idx)
        }

        if (smallest !== idx) {
            this.swap(idx, smallest)
            this.heapifyDown(smallest)
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
                    /	      \
                    (17)	       (16)
                    /  \	       /  \
                           (144)    (42)   (61)    (19)
*/

console.log(heap.extractMin()) // 4

console.log(heap.printHeap()) // [ 16, 17, 19, 144, 42, 61 ]
/*
                    (16)
                    /	       \
                    (17)		(19)
                    /  \		/  
                           (144)    (42)    (61)    
*/

console.log(heap.peek()) // 16
