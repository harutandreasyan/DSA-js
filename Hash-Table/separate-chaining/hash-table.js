const LinkedList = require('./linked-list.js')

class HashTable {
    constructor(capacity = 11) {
        this.capacity = capacity
        this.size = 0
        this.buffer = Array.from({ length: capacity }, () => new LinkedList())
        this.loadFactor = 0.7
    }

    // Using djb2 hash function
    _hashString(str) {
        let hash = 5381
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) + hash + str.charCodeAt(i) // hash * 33 + c
        }
        return (hash >>> 0) % this.capacity
    }

    hash(key) {
        const s = String(key)
        return this._hashString(s)
    }

    set(key, value) {
        const idx = this.hash(key)
        const slot = this.buffer[idx]

        const node = slot.findNode((entry) => entry.key === key)
        if (node) {
            node.value.val = value // entry = {key, value}
            return
        }

        slot.insertAtTail({ key, val: value })
        this.size++

        if (this.size / this.capacity >= this.loadFactor) this.resize()
    }

    get(key) {
        const idx = this.hash(key)
        const slot = this.buffer[idx]
        const node = slot.findNode((entry) => entry.key === key)
        return node ? node.value.val : null
    }

    has(key) {
        return this.get(key) !== null
    }

    delete(key) {
        const idx = this.hash(key)
        const slot = this.buffer[idx]
        const removed = slot.deleteIf((entry) => entry.key === key)
        if (removed) this.size--
        return removed
    }

    resize() {
        const oldBuffer = this.buffer
        this.capacity = this.capacity * 2 + 1
        this.size = 0
        this.buffer = Array.from({ length: this.capacity }, () => new LinkedList())

        for (let slot of oldBuffer) {
            for (let entry of slot) {
                // entry — { key, val }
                this.set(entry.key, entry.val)
            }
        }
    }

    *keys() {
        for (let slot of this.buffer) {
            for (let entry of slot) {
                yield entry.key
            }
        }
    }

    *values() {
        for (let slot of this.buffer) {
            for (let entry of slot) {
                yield entry.val
            }
        }
    }

    *entries() {
        for (let slot of this.buffer) {
            for (let entry of slot) {
                yield [entry.key, entry.val]
            }
        }
    }

    print() {
        for (let i = 0; i < this.buffer.length; ++i) {
            console.log(`[${i}] : ${this.buffer[i].toString()}`)
        }
    }
}

const map = new HashTable()

// simple inserts
map.set('David', 99)
map.set('Anna', 42)
map.set('Harut', 99)
map.set('Tiko', 57)
map.set('A', 32)
map.set('B', 46)
map.set('c', 78)
map.set('d', 65)
// add more to force resize if needed
map.set('e', 25)
map.set('f', 45)
map.set('g', 54)
map.set('h', 11)
map.set('i', 22)

// get — retrieve value by key
console.log(map.get('Harut')) // 99
console.log(map.get('Tiko')) // 57
console.log(map.get('NoSuch')) // null

// has — check existence
console.log(map.has('Anna')) // true
console.log(map.has('Unknown')) // false

// update existing key (set should overwrite)
map.set('Harut', 100)
console.log(map.get('Harut')) // 100

// delete — remove key
console.log(map.delete('Anna')) // true
console.log(map.has('Anna')) // false
console.log(map.delete('Anna')) // false

map.print()

// non-string keys behavior
map.set(123, 'number-key')
console.log(map.get(123)) // 'number-key'

// null / undefined keys
map.set(null, 'is-null')
map.set(undefined, 'is-undefined')
console.log(map.get(null)) // 'is-null'
console.log(map.get(undefined)) // 'is-undefined'

for (let entry of map.entries()) {
    console.log(entry)
}
