class ListNode {
    constructor(value) {
        this.value = value
        this.next = null
    }
}

class SinglyLinkedList {
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
        const node = new ListNode(value)
        node.next = this.head
        this.head = node
        this.length++
    }

    insertAtTail(value) {
        const node = new ListNode(value)
        if (!this.head) {
            this.head = node
        } else {
            let current = this.head
            while (current.next) {
                current = current.next
            }
            current.next = node
        }
        this.length++
    }

    insertAt(index, value) {
        if (index < 0 || index > this.length) {
            throw new RangeError('Index out of bounds')
        }
        if (index === 0) {
            return this.insertAtHead(value)
        }
        const node = new ListNode(value)
        let prev = this.head
        for (let i = 0; i < index - 1; i++) {
            prev = prev.next
        }
        node.next = prev.next
        prev.next = node
        this.length++
    }

    get(index) {
        if (index < 0 || index >= this.length) return undefined
        let current = this.head
        for (let i = 0; i < index; i++) {
            current = current.next
        }
        return current.value
    }

    deleteAt(index) {
        if (index < 0 || index >= this.length) {
            throw new RangeError('Index out of bounds')
        }
        if (index === 0) {
            const removed = this.head
            this.head = this.head.next
            this.length--
            return removed.value
        }
        let prev = this.head
        for (let i = 0; i < index - 1; i++) {
            prev = prev.next
        }
        const removed = prev.next
        prev.next = removed.next
        this.length--
        return removed.value
    }

    delete(value) {
        if (!this.head) return false
        if (this.head.value === value) {
            this.head = this.head.next
            this.length--
            return true
        }
        let prev = this.head
        while (prev.next && prev.next.value !== value) {
            prev = prev.next
        }
        if (!prev.next) return false
        prev.next = prev.next.next
        return true
        this.length--
    }

    find(predicate) {
        let current = this.head
        let index = 0
        while (current) {
            if (predicate(current.value, index)) {
                return { node: current, index }
            }
            current = current.next
            index++
        }
        return null
    }

    contains(value) {
        return this.find((v) => v === value) !== null
    }

    toArray() {
        const result = []
        let current = this.head
        while (current) {
            result.push(current.value)
            current = current.next
        }
        return result
    }

    reverse() {
        let prev = null
        let current = this.head
        while (current) {
            const next = current.next
            current.next = prev
            prev = current
            current = next
        }
        this.head = prev
        return this
    }

    clear() {
        this.head = null
        this.length = 0
    }

    toString(separator = ' -> ') {
        return this.toArray().join(separator)
    }

    *[Symbol.iterator]() {
        let current = this.head
        while (current) {
            yield current.value
            current = current.next
        }
    }
}

const list = new SinglyLinkedList()

console.log('\n')
console.log('initial isEmpty:', list.isEmpty()) // true
console.log('initial size:', list.size() + '\n') // 0

// inserts
list.insertAtHead(3)
list.insertAtHead(2)
list.insertAtTail(4)
list.insertAt(1, 9)
console.log('After inserts:', list.toArray()) // [ 2, 9, 3, 4 ]
console.log('Showing list:', list.toString()) // 2 -> 9 -> 3 -> 4
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
    'find 3 (node value & index):',
    found ? { value: found.node.value, index: found.index } : null
)
console.log('\n')

// delete by value
console.log('delete(9):', list.delete(9)) // true
console.log('after delete(9):', list.toString()) // 2 -> 3 -> 4

// deleteAt - middle
const removed = list.deleteAt(1)
console.log('deleteAt(1) removed:', removed) // 3
console.log('after deleteAt:', list.toArray()) //  [ 2, 4 ]

// delete non-existing value
console.log('delete(999):', list.delete(999)) // false
console.log('list remains:', list.toArray()) // [ 2, 4 ]

// append at end and insert at 0
list.insertAtTail(5)
list.insertAt(0, 1)
console.log('after append and insertAt(0):', list.toArray())
// [ 1, 2, 4, 5 ]

// get out-of-bounds should return undefined
console.log('get(100):', list.get(100)) // undefined

// reverse (multi)
list.reverse()
console.log('after reverse:', list.toString()) // 5 -> 4 -> 2 -> 1

// clear
list.clear()
console.log('isEmpty:', list.isEmpty()) // true
