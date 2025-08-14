class Node {
	constructor(value) {
		this.value = value
		this.next = null
	}
}

class LinkedList {
	constructor() {
		this.head = null
		this.size = 0
	}

	insertAtHead(value) {
		const node = new Node(value)
		node.next = this.head
		this.head = node
		this.size++
	}

	insertAtTail(value) {
		const node = new Node(value)
		if (!this.head) {
			this.head = node
		} else {
			let curr = this.head
			while (curr.next) {
				curr = curr.next
			}
			curr.next = node
		}
		this.size++
	}

	insertAtIndex(index, value) {
		if (index < 0 || index > this.size) return
		if (index === 0) return this.insertAtHead(value)

		const node = new Node(value)
		let curr = this.head
		for (let i = 0; i < index - 1; i++) {
			curr = curr.next
		}
		node.next = curr.next
		curr.next = node
		this.size++
	}

	deleteAtIndex(index) {
		if (index < 0 || !this.head) return

		if (index === 0) {
			this.head = this.head.next
		} else {
			let curr = this.head
			for (let i = 0; i < index - 1; i++) {
				curr = curr.next
			}
			curr.next = curr.next.next
		}
		this.size--
	}

	get(index) {
		if (index < 0 || index >= this.size) return null

		let curr = this.head
		for (let i = 0; i < index; i++) {
			curr = curr.next
		}
		return curr.value
	}

	*[Symbol.iterator]() {
		let current = this.head
		while (current) {
			yield current.value
			current = current.next
		}
	}

	toString() {
		const result = []
		let curr = this.head
		while (curr) {
			result.push(curr.value)
			curr = curr.next
		}
		return result.join(' -> ')
	}
}

class HashTable {
	constructor(capacity = 11) {
		this.capacity = capacity
		this.size = 0
		this.buffer = Array.from({ length: capacity }, () => new LinkedList())
	}

	// djb2
	hash(key) {
		let len = key.length
		let hash = 5381
		for (var idx = 0; idx < len; ++idx) {
			hash = 33 * hash + key.charCodeAt(idx)
		}
		return hash % this.capacity
	}

	set(key, value) {
		const idx = this.hash(key)
		this.buffer[idx].insertAtTail([key, value])
		this.size++

		if (this.size / this.capacity >= 0.7) this.resize()
	}

	get(key) {
		const idx = this.hash(key)
		const slot = this.buffer[idx]

		for (let [k, v] of slot) {
			if (k === key) return v
		}

		return null
	}

	resize() {
		const oldBuffer = this.buffer
		this.capacity *= 2
		this.size = 0
		this.buffer = Array.from({ length: this.capacity }, () => new LinkedList())

		for (let slot of oldBuffer) {
			for (let [k, v] of slot) {
				this.set(k, v)
			}
		}
	}

	*keys() {
		for (let slot of this.buffer) {
			for (let [k, v] of slot) {
				yield k
			}
		}
	}

	*values() {
		for (let slot of this.buffer) {
			for (let [k, v] of slot) {
				yield v
			}
		}
	}

	*entries() {
		for (let slot of this.buffer) {
			for (let [k, v] of slot) {
				yield [k, v]
			}
		}
	}

	print() {
		for (let i = 0; i < this.buffer.length; ++i) {
			console.log(`[${i}] : ${this.buffer[i]}`)
		}
	}
}

let map = new HashTable()
// map.set('Anna', 42)
// map.set('Harut', 99)
// map.set('Tiko', 57)
// map.set('A', 32)
// map.set('B', 46)
// map.set('c', 78)
// map.set('d', 65)
// map.set('e', 25)
// map.set('f', 45)
// map.set('g', 54)
// map.print()

// console.log(map.get('Harut'))
// console.log(map.get('Tiko'))
map.set('David', 99)

for (let entry of map.entries()) {
	console.log(entry)
}

map.set('David', 100)
// for (let entry of map.entries()) {
// 	console.log(entry)
// }
