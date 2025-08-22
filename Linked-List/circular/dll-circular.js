class CDListNode {
    constructor(value) {
        this.value = value
        this.next = null
        this.prev = null
    }
}

class CircularDoublyLinkedList {
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

    _tail() {
        return this.head ? this.head.prev : null
    }

    insertAtHead(value) {
        const node = new CDListNode(value)
        if (!this.head) {
            node.next = node
            node.prev = node
            this.head = node
        } else {
            const tail = this._tail()
            node.next = this.head
            node.prev = tail
            tail.next = node
            this.head.prev = node
            this.head = node
        }
        this.length++
    }

    insertAtTail(value) {
        if (!this.head) return this.insertAtHead(value)
        const node = new CDListNode(value)
        const tail = this._tail()
        node.next = this.head
        node.prev = tail
        tail.next = node
        this.head.prev = node
        this.length++
    }

    insertAt(index, value) {
        if (index < 0 || index > this.length)
            throw new RangeError('Index out of bounds')
        if (index === 0) return this.insertAtHead(value)
        if (index === this.length) return this.insertAtTail(value)

        let prev = this.head
        for (let i = 0; i < index - 1; i++) prev = prev.next

        const node = new CDListNode(value)
        const after = prev.next

        prev.next = node
        node.prev = prev
        node.next = after
        after.prev = node

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
        if (this.length === 1) {
            const v = this.head.value
            this.head = null
            this.length = 0
            return v
        }

        if (index === 0) {
            const removed = this.head
            const tail = this._tail()
            this.head = removed.next
            this.head.prev = tail
            tail.next = this.head
            this.length--
            return removed.value
        }

        let curr = this.head
        for (let i = 0; i < index; i++) curr = curr.next
        const prev = curr.prev
        const next = curr.next
        prev.next = next
        next.prev = prev
        this.length--
        return curr.value
    }

    delete(value) {
        if (!this.head) return false
        if (this.length === 1) {
            if (this.head.value === value) {
                this.head = null
                this.length = 0
                return true
            }
            return false
        }

        if (this.head.value === value) {
            const tail = this._tail()
            this.head = this.head.next
            this.head.prev = tail
            tail.next = this.head
            this.length--
            return true
        }

        let curr = this.head.next
        while (curr !== this.head) {
            if (curr.value === value) {
                curr.prev.next = curr.next
                curr.next.prev = curr.prev
                this.length--
                return true
            }
            curr = curr.next
        }
        return false
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

        let curr = this.head
        do {
            const tmp = curr.next
            curr.next = curr.prev
            curr.prev = tmp
            curr = tmp
        } while (curr !== this.head)

        this.head = this.head.next
    }

    clear() {
        this.head = null
        this.length = 0
    }

    toString(separator = ' <-> ') {
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

const list = new CircularDoublyLinkedList()
list.insertAtHead(1)
list.insertAtTail(2)
list.insertAtTail(3)
list.insertAtTail(4)
console.log(list.toString()) // 1 <-> 2 <-> 3 <-> 4

list.reverse()
console.log(list.toString()) // 4 <-> 3 <-> 2 <-> 1

list.deleteAt(0)
console.log(list.toString()) // 3 <-> 2 <-> 1
