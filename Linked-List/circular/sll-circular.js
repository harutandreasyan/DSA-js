class listNode {
    constructor(value) {
        this.value = value
        this.next = null
    }
}

class CircularLinkedList {
    constructor() {
        this.head = null
        this.length = 0
    }

    size() {
        return this.length
    }

    isEmpty() {
        return this.length === 0
    }

    insertAtHead(value) {
        const node = new listNode(value)
        if (!this.head) {
            node.next = node
            this.head = node
        } else {
            let tail = this.head
            while (tail.next !== this.head) tail = tail.next
            node.next = this.head
            tail.next = node
            this.head = node
        }
        this.length++
    }

    insertAtTail(value) {
        const node = new listNode(value)
        if (!this.head) {
            node.next = node
            this.head = node
        } else {
            let tail = this.head
            while (tail.next !== this.head) tail = tail.next
            tail.next = node
            node.next = this.head
        }
        this.length++
    }

    insertAt(index, value) {
        if (index < 0 || index > this.length)
            throw new RangeError('Index out of bounds')
        if (index === 0) return this.insertAtHead(value)
        if (index === this.length) return this.insertAtTail(value)

        let prev = this.head
        for (let i = 0; i < index - 1; i++) prev = prev.next
        const node = new listNode(value)
        node.next = prev.next
        prev.next = node
        this.length++
    }

    get(index) {
        if (index < 0 || index >= this.length) return undefined
        let curr = this.head
        for (let i = 0; i < index; i++) curr = curr.next
        return curr.value
    }

    deleteAt(index) {
        if (index < 0 || index >= this.length)
            throw new RangeError('Index out of bounds')
        if (index === 0) {
            const removed = this.head
            if (this.length === 1) {
                this.head = null
            } else {
                let tail = this.head
                while (tail.next !== this.head) tail = tail.next
                this.head = this.head.next
                tail.next = this.head
            }
            this.length--
            return removed.value
        }
        let prev = this.head
        for (let i = 0; i < index - 1; i++) prev = prev.next
        const removed = prev.next
        prev.next = removed.next
        this.length--
        return removed.value
    }

    delete(value) {
        if (!this.head) return false

        if (this.head.value === value) {
            if (this.length === 1) {
                this.head = null
                this.length--
                return true
            }
            let tail = this.head
            while (tail.next !== this.head) tail = tail.next
            this.head = this.head.next
            tail.next = this.head
            this.length--
            return true
        }

        let prev = this.head
        let curr = this.head.next
        while (curr !== this.head && curr.value !== value) {
            prev = curr
            curr = curr.next
        }
        if (curr === this.head) return false
        prev.next = curr.next
        this.length--
        return true
    }

    find(predicate) {
        if (!this.head) return null
        let curr = this.head
        let idx = 0
        do {
            if (predicate(curr.value, idx)) return { node: curr, index: idx }
            curr = curr.next
            idx++
        } while (curr !== this.head)
        return null
    }

    contains(value) {
        return this.find((v) => v === value) !== null
    }

    toArray() {
        const out = []
        if (!this.head) return out
        let curr = this.head
        do {
            out.push(curr.value)
            curr = curr.next
        } while (curr !== this.head)
        return out
    }

    reverse() {
        if (!this.head || this.length === 1) return this

        let prev = this.head
        let curr = this.head.next
        while (curr !== this.head) {
            const next = curr.next
            curr.next = prev
            prev = curr
            curr = next
        }
        this.head.next = prev
        this.head = prev
    }

    clear() {
        this.head = null
        this.length = 0
    }

    toString(separator = ' -> ') {
        return this.toArray().join(separator)
    }

    *[Symbol.iterator]() {
        if (!this.head) return
        let curr = this.head
        let count = 0
        while (count < this.length) {
            yield curr.value
            curr = curr.next
            count++
        }
    }
}

const list = new CircularLinkedList()

console.log('\n')
console.log('initial isEmpty:', list.isEmpty()) // true
console.log('initial size:', list.size() + '\n') // 0

// inserts
list.insertAtHead(3)
list.insertAtHead(2)
list.insertAtTail(4)
list.insertAt(1, 9)
console.log('After inserts:', list.toArray()) // [ 2, 9, 3, 4 ]
console.log('Showing list:', list.toString()) // 2 -> 9 -> 3 -> 4 -> (back to head)
console.log('size:', list.size() + '\n') // 4

// get and contains
console.log('get index 2:', list.get(2)) // 3
console.log('contains 2:', list.contains(2)) // true
console.log('contains 20:', list.contains(20) + '\n') // false

// iterate with for..of (should stop after one full cycle)
console.log('iterate values:')
for (const v of list) {
    console.log('  value:', v)
}
console.log('\n')

// find
const found = list.find((v, i) => v === 3)
console.log(
    'find 3 (node value & index):',
    found ? { value: found.node.value, index: found.index } : null
)
console.log('\n')

// delete by value
console.log('delete(9):', list.delete(9)) // true
console.log('after delete(9):', list.toString()) // 2 -> 3 -> 4 -> (back to head)

// deleteAt - middle
const removed = list.deleteAt(1)
console.log('deleteAt(1) removed:', removed) // 3
console.log('after deleteAt:', list.toArray()) //  [ 2, 4 ]

// delete head
list.deleteAt(0)
console.log('after deleteAt(0):', list.toArray()) // [ 4 ]

// delete non-existing value
console.log('delete(999):', list.delete(999)) // false
console.log('list remains:', list.toArray() + '\n') // [ 4 ]

list.insertAtTail(5)
list.insertAt(0, 1)
list.insertAtTail(7)
console.log('after append and insertAt(0):', list.toArray()) // [ 1, 4, 5 ]

// reverse
console.log('list:', list.toString()) // 1 -> 4 -> 5 -> 7 -> (back to head)
list.reverse()
console.log('after reverse:', list.toString()) // 7 -> 5 -> 4 -> 1 -> (back to head)

// get out-of-bounds should return undefined
console.log('get(100):', list.get(100)) // undefined

// clear
list.clear()
console.log('isEmpty:', list.isEmpty()) // true
