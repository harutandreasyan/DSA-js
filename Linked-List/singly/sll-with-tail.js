class ListNode {
    constructor(value) {
        this.value = value
        this.next = null
    }
}

class SinglyLinkedListWithTail {
    constructor() {
        this.head = null
        this.tail = null
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

        if (this.length === 0) {
            this.tail = node
        }

        this.length++
    }

    // Fast O(1) tail insertion using stored tail pointer
    insertAtTail(value) {
        const node = new ListNode(value)
        if (!this.head) {
            this.head = node
            this.tail = node
            this.length++
            return
        }

        // tail is maintained, so append in O(1)
        this.tail.next = node
        this.tail = node
        this.length++
    }

    insertAt(index, value) {
        if (index < 0 || index > this.length) {
            throw new RangeError('Index out of bounds')
        }
        if (index === 0) return this.insertAtHead(value)
        if (index === this.length) return this.insertAtTail(value)

        const node = new ListNode(value)
        let prev = this.head
        for (let i = 0; i < index - 1; i++) prev = prev.next
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
        if (index < 0 || index >= this.length) {
            throw new RangeError('Index out of bounds')
        }
        if (index === 0) {
            const removed = this.head
            this.head = this.head.next
            this.length--
            if (this.length === 0) this.tail = null
            return removed.value
        }

        let prev = this.head
        for (let i = 0; i < index - 1; i++) prev = prev.next
        const removed = prev.next
        prev.next = removed.next
        this.length--

        if (removed === this.tail) this.tail = prev

        if (this.length === 0) {
            this.head = null
            this.tail = null
        }

        return removed.value
    }

    delete(value) {
        if (!this.head) return false
        if (this.head.value === value) {
            this.head = this.head.next
            this.length--
            if (this.length === 0) this.tail = null
            return true
        }

        let prev = this.head
        while (prev.next && prev.next.value !== value) prev = prev.next
        if (!prev.next) return false

        const toRemove = prev.next
        prev.next = toRemove.next
        this.length--

        if (toRemove === this.tail) this.tail = prev

        if (this.length === 0) {
            this.head = null
            this.tail = null
        }
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

        let prev = null
        let curr = this.head
        const oldHead = this.head

        while (curr) {
            const next = curr.next
            curr.next = prev
            prev = curr
            curr = next
        }

        this.head = prev
        this.tail = oldHead
        this.tail.next = null
    }

    clear() {
        this.head = null
        this.tail = null
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

const list = new SinglyLinkedListWithTail()

console.log('\n')
console.log('initial isEmpty:', list.isEmpty()) // true
console.log('initial size:', list.size()) // 0
console.log('initial head:', list.head) // null
console.log('initial tail:', list.tail) // null
console.log('\n')

// inserts using tail-fast path
list.insertAtHead(10)
list.insertAtTail(20)
list.insertAtTail(30)
list.insertAt(1, 15)
console.log('after inserts:', list.toArray()) // [ 10, 15, 20, 30 ]
console.log('showing list:', list.toString()) // 10 -> 15 -> 20 -> 30
console.log('head value:', list.head && list.head.value) // 10
console.log('tail value:', list.tail && list.tail.value) // 30
console.log('size:', list.size()) // 4
console.log('\n')

// get and contains
console.log('get index 2:', list.get(2)) // 20
console.log('contains 15:', list.contains(15)) // true
console.log('contains 999:', list.contains(999)) // false
console.log('\n')

// iterate
console.log('iterate values (for..of):')
for (const v of list) console.log('  value:', v)
console.log('\n')

// find
console.log(
    'find value 20:',
    list.find((v) => v === 20)
)
console.log('\n')

// delete by value (middle) and check tail invariants
console.log('delete(30):', list.delete(30)) // true
console.log('after delete(30):', list.toArray()) // [ 10, 15, 20 ]
console.log('tail value:', list.tail && list.tail.value) // 20
console.log('\n')

// insert at tail again to ensure tail append works
list.insertAtTail(25)
console.log('after insertAtTail(25):', list.toString()) // 10 -> 15 -> 20 -> 25
console.log('tail value:', list.tail && list.tail.value) // 25

// insertAt(0) and insertAt(size) behaviors
list.insertAt(0, 5)
list.insertAt(list.size(), 30)
console.log('after insertAt(0) and insertAt(size):', list.toArray())
// [ 5, 10, 15, 20, 25, 30 ]

console.log(
    'head:',
    list.head && list.head.value,
    'tail:',
    list.tail && list.tail.value
) // head: 5 tail: 30
console.log('\n')

// reverse and check head/tail swap
list.reverse()
console.log('after reverse:', list.toString()) // 30 -> 25 -> 20 -> 15 -> 10 -> 5
console.log('after reverse head (was tail):', list.head && list.head.value) // 30
console.log('after reverse tail (was head):', list.tail && list.tail.value) // 5
console.log('\n')

// clear
list.clear()
console.log('after clear head:', list.head) // null
console.log('after clear tail:', list.tail) // null
console.log('after clear size:', list.size()) // 0
