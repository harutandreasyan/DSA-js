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
            while (curr.next) curr = curr.next
            curr.next = node
        }
        this.size++
    }

    insertAfter(node, value) {
        if (!node) return this.insertAtHead(value)
        const n = new Node(value)
        n.next = node.next
        node.next = n
        this.size++
    }

    findNode(predicate) {
        let curr = this.head
        while (curr) {
            if (predicate(curr.value)) return curr
            curr = curr.next
        }
        return null
    }

    deleteIf(predicate) {
        if (!this.head) return false
        if (predicate(this.head.value)) {
            this.head = this.head.next
            this.size--
            return true
        }
        let curr = this.head
        while (curr.next) {
            if (predicate(curr.next.value)) {
                curr.next = curr.next.next
                this.size--
                return true
            }
            curr = curr.next
        }
        return false
    }

    deleteAtIndex(index) {
        if (index < 0 || index >= this.size || !this.head) return false

        if (index === 0) {
            this.head = this.head.next
            this.size--
            return true
        }
        let curr = this.head
        for (let i = 0; i < index - 1; i++) curr = curr.next
        curr.next = curr.next.next
        this.size--
        return true
    }

    get(index) {
        if (index < 0 || index >= this.size) return null
        let curr = this.head
        for (let i = 0; i < index; i++) curr = curr.next
        return curr.value
    }

    *[Symbol.iterator]() {
        let current = this.head
        while (current) {
            yield current.value
            current = current.next
        }
    }

    toArray() {
        const res = []
        for (let v of this) res.push(v)
        return res
    }

    toString() {
        return this.toArray()
            .map((v) => {
                if (v && typeof v === 'object' && 'key' in v && 'val' in v) {
                    return `${v.key}:${JSON.stringify(v.val)}`
                }
                return String(v)
            })
            .join(' -> ')
    }
}

module.exports = LinkedList