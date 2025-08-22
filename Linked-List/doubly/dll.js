class DListNode {
    constructor(value) {
        this.value = value
        this.next = null
        this.prev = null
    }
}

class DoublyLinkedList {
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
        const node = new DListNode(value)
        node.next = this.head
        if (this.head) this.head.prev = node
        this.head = node
        this.length++
    }

    insertAtTail(value) {
        const node = new DListNode(value)
        if (!this.head) {
            this.head = node
            this.length++
            return this
        }
        let curr = this.head
        while (curr.next) curr = curr.next
        curr.next = node
        node.prev = curr
        this.length++
    }

    insertAt(index, value) {
        if (index < 0 || index > this.length) {
            throw new RangeError('Index out of bounds')
        }
        if (index === 0) return this.insertAtHead(value)
        if (index === this.length) return this.insertAtTail(value)

        let curr = this.head
        for (let i = 0; i < index - 1; i++) curr = curr.next

        const node = new DListNode(value)
        const after = curr.next

        curr.next = node
        node.prev = curr

        node.next = after
        if (after) after.prev = node

        this.length++
    }

    get(index) {
        if (index < 0 || index >= this.length) return undefined
        let curr = this.head
        for (let i = 0; i < index; i++) curr = curr.next
        return curr.value
    }

    deleteAt(index) {
        if (index < 0 || index >= this.length) {
            throw new RangeError('Index out of bounds')
        }
        if (index === 0) {
            const removed = this.head
            this.head = removed.next
            if (this.head) this.head.prev = null
            this.length--
            return removed.value
        }

        let curr = this.head
        for (let i = 0; i < index; i++) curr = curr.next

        const prev = curr.prev
        const next = curr.next

        prev.next = next
        if (next) next.prev = prev
        this.length--
        return curr.value
    }

    delete(value) {
        if (!this.head) return false

        let curr = this.head
        while (curr && curr.value !== value) curr = curr.next
        if (!curr) return false

        if (curr === this.head) {
            this.head = curr.next
            if (this.head) this.head.prev = null
            this.length--
            return true
        }

        const prev = curr.prev
        const next = curr.next

        prev.next = next
        if (next) next.prev = prev
        this.length--
        return true
    }

    find(predicate) {
        let curr = this.head
        let idx = 0
        while (curr) {
            if (predicate(curr.value, idx)) return { node: curr, index: idx }
            curr = curr.next
            idx++
        }
        return null
    }

    contains(value) {
        return this.find((v) => v === value) !== null
    }

    toArray() {
        const out = []
        let curr = this.head
        while (curr) {
            out.push(curr.value)
            curr = curr.next
        }
        return out
    }

    reverse() {
        if (!this.head || !this.head.next) return this

        let tail = this.head
        while (tail.next) tail = tail.next

        let curr = this.head
        while (curr) {
            const next = curr.next
            const oldPrev = curr.prev
            curr.prev = curr.next
            curr.next = oldPrev
            curr = next
        }

        this.head = tail
        return this
    }

    clear() {
        this.head = null
        this.length = 0
        return this
    }

    toString(separator = ' <-> ') {
        return this.toArray().join(separator)
    }

    *[Symbol.iterator]() {
        let curr = this.head
        while (curr) {
            yield curr.value
            curr = curr.next
        }
    }
}

const list = new DoublyLinkedList()
console.log('\n')
console.log('initial isEmpty:', list.isEmpty()) // true
console.log('initial size:', list.size() + '\n') // 0

// inserts
list.insertAtHead(3)
list.insertAtHead(2)
list.insertAtTail(4)
list.insertAt(1, 9)
console.log('After inserts:', list.toArray()) // [ 2, 9, 3, 4 ]
console.log('Showing list:', list.toString()) // 2 <-> 9 <-> 3 <-> 4
console.log('size:', list.size() + '\n') // 4

// get and contains
console.log('get index 2:', list.get(2)) // 3
console.log('contains 2:', list.contains(2)) // true
console.log('contains 20:', list.contains(20) + '\n') // false

// iterate with for..of
console.log('iterate values:')
for (const v of list) {
    console.log('  value:', v)
}
console.log('\n')

// find
const found = list.find((v, i) => v === 3)
console.log(
    'find 3 (node value & index):\n',
    found ? { value: found.node.value, index: found.index } : null
)
console.log('\n')

// delete by value
console.log('delete(9):', list.delete(9)) // true
console.log('after delete(9):', list.toArray()) // [ 2, 3, 4 ]

// deleteAt - middle
const removed = list.deleteAt(1)
console.log('deleteAt(1) removed:', removed) // 3
console.log('after deleteAt:', list.toString()) //  2 <-> 4

// delete non-existing value
console.log('delete(999):', list.delete(999)) // false
console.log('list remains:', list.toArray()) // [ 2, 4 ]
console.log('\n')
// append at end and insert at 0
list.insertAtTail(5)
list.insertAt(0, 1)
console.log('after append and insertAt(0):', list.toArray())
// [ 1, 2, 4, 5 ]

// get out-of-bounds should return undefined
console.log('get(100):', list.get(100)) // undefined

// reverse (multi)
list.reverse()
console.log('after reverse:', list.toString()) // 5 <-> 4 <-> 2 <-> 1

// clear
list.clear()
console.log('isEmpty:', list.isEmpty()) // true
