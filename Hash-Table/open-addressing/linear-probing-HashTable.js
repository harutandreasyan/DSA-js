const DELETED = Symbol('DELETED')

class LinerProbingHashTable {
    /**
     * capacity - initial capacity
     * loadFactor - threshold to trigger resize (recommended <= 0.5 for linear probing)
     */
    constructor(capacity = 11) {
        this._initialCapacity = Math.max(3, Math.floor(capacity))
        this.capacity = this._initialCapacity
        this.size = 0
        this.buffer = Array.from({ length: capacity }, () => null)
        this.loadFactor = 0.5
    }

    _hashString(str) {
        let hash = 5381
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) + hash + str.charCodeAt(i) // hash * 33 + c
        }
        return (hash >>> 0) % this.capacity
    }

    _hash(key) {
        return this._hashString(String(key))
    }

    _probeSequence(start, i) {
        // linear probing
        return (start + i) % this.capacity
    }

    set(key, val) {
        // resize early if needed
        if ((this.size + 1) / this.capacity > this.loadFactor) {
            this._resize()
        }

        const start = this._hash(key)
        let firstDeleted = -1

        for (let i = 0; i < this.capacity; i++) {
            const pos = this._probeSequence(start, i)
            const slot = this.buffer[pos]

            // empty slot -> insert (or reuse first deleted)
            if (slot === null) {
                const insertPos = firstDeleted !== -1 ? firstDeleted : pos
                this.buffer[insertPos] = { key, val }
                this.size++
                return
            }

            // tombstone -> remember first one and keep probing (in case key exists later)
            if (slot === DELETED) {
                if (firstDeleted === -1) firstDeleted = pos
                continue
            }

            // occupied slot -> update if same key
            if (slot.key === key) {
                this.buffer[pos].val = val
                return
            }
        }

        // table was full (shouldn't happen due to resize above) -> resize and retry
        this._resize()
        this.set(key, val)
    }

    get(key) {
        const start = this._hash(key)
        for (let i = 0; i < this.capacity; i++) {
            const pos = this._probeSequence(start, i)
            const slot = this.buffer[pos]
            if (slot === null) return null // empty => key not present
            if (slot === DELETED) continue // tombstone => skip
            if (slot.key === key) return slot.val
        }
        return null
    }

    has(key) {
        return this.get(key) !== null
    }

    delete(key) {
        const start = this._hash(key)
        for (let i = 0; i < this.capacity; i++) {
            const pos = this._probeSequence(start, i)
            const slot = this.buffer[pos]
            if (slot === null) return false // empty => not found
            if (slot === DELETED) continue
            if (slot.key === key) {
                this.buffer[pos] = DELETED // mark tombstone
                this.size--
                return true
            }
        }
        return false
    }

    clear() {
        this.capacity = this._initialCapacity
        this.buffer = Array.from({ length: this.capacity }, () => null)
        this.size = 0
    }

    // ---------------------
    // Resize and rehash
    // ---------------------
    _resize() {
        const old = this.buffer
        this.capacity = this.capacity * 2 + 1
        this.buffer = Array.from({ length: this.capacity }, () => null)
        this.size = 0

        // re-insert only real entries (skip null and DELETED)
        for (const slot of old) {
            if (slot !== null && slot !== DELETED) {
                this.set(slot.key, slot.val)
            }
        }
    }

    *entries() {
        for (const slot of this.buffer) {
            if (slot !== null && slot !== DELETED) yield [slot.key, slot.val]
        }
    }

    *keys() {
        for (const slot of this.buffer) {
            if (slot !== null && slot !== DELETED) yield slot.key
        }
    }

    *values() {
        for (const slot of this.buffer) {
            if (slot !== null && slot !== DELETED) yield slot.val
        }
    }

    print() {
        console.log('capacity:', this.capacity, 'size:', this.size)
        for (let i = 0; i < this.buffer.length; i++) {
            const s = this.buffer[i]
            if (s === null) console.log(`[${i}] -> empty`)
            else if (s === DELETED) console.log(`[${i}] -> tombstone`)
            else console.log(`[${i}] -> ${String(s.key)}:${JSON.stringify(s.val)}`)
        }
    }
}

const map = new LinerProbingHashTable(7)

map.set('David', 99)
map.set('Anna', 42)
map.set('Harut', 99)
map.set('Tiko', 57)
map.set('A', 32)
map.set('B', 46)
map.set('c', 78)
map.set('d', 65)
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

map.clear()
map.print()