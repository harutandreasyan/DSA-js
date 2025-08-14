const DELETED = Symbol('DELETED')

class DoubleHashingHashTable {
    /**
     * initialCapacity - initial capacity (will be bumped to next prime)
     * loadFactor - threshold to trigger resize (double hashing tolerates higher LF, but conservative default 0.7)
     */
    constructor(initialCapacity = 11, loadFactor = 0.7) {
        this._initialCapacity = this._nextPrime(
            Math.max(3, Math.floor(initialCapacity))
        )
        this.capacity = this._initialCapacity
        this.loadFactor = loadFactor

        this.size = 0
        this.buffer = Array.from({ length: this.capacity }, () => null)
    }

    _isPrime(n) {
        if (n <= 1) return false
        if (n <= 3) return true
        if (n % 2 === 0 || n % 3 === 0) return false
        for (let i = 5; i * i <= n; i += 6) {
            if (n % i === 0 || n % (i + 2) === 0) return false
        }
        return true
    }

    _nextPrime(n) {
        let candidate = Math.max(3, Math.floor(n))
        if (candidate % 2 === 0) candidate++
        while (!this._isPrime(candidate)) candidate += 2
        return candidate
    }

    _hash1String(str) {
        let hash = 5381
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) + hash + str.charCodeAt(i) // hash * 33 + c
        }
        return (hash >>> 0) % this.capacity
    }

    _hash1(key) {
        return this._hash1String(String(key))
    }

    // ---------------------
    // Secondary hash (sdbm-style) - produces step in [1, capacity-1]
    // We return 1 + (sdbm % (capacity - 1)) to ensure step != 0 and < capacity.
    // When capacity is prime, any step in [1, capacity-1] is coprime with capacity.
    // ---------------------
    _hash2String(str) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i)
            hash = c + (hash << 6) + (hash << 16) - hash // sdbm
        }
        return hash >>> 0
    }

    _hash2(key) {
        const raw = this._hash2String(String(key))
        const step = 1 + (raw % (this.capacity - 1))
        return step
    }

    // probe sequence using double hashing: (h1 + i * h2) % capacity
    _probe(start, i, step) {
        return (start + i * step) % this.capacity
    }

    set(key, val) {
        if ((this.size + 1) / this.capacity > this.loadFactor) {
            this._resize()
        }

        const start = this._hash1(key)
        const step = this._hash2(key)
        let firstDeleted = -1

        for (let i = 0; i < this.capacity; i++) {
            const pos = this._probe(start, i, step)
            const slot = this.buffer[pos]

            // empty (never used) -> insert here (or reuse firstDeleted)
            if (slot === null) {
                const insertPos = firstDeleted !== -1 ? firstDeleted : pos
                this.buffer[insertPos] = { key, val }
                this.size++
                return
            }

            // tombstone -> remember first and continue probing (a later slot might contain the key)
            if (slot === DELETED) {
                if (firstDeleted === -1) firstDeleted = pos
                continue
            }

            // occupied -> update if same key
            if (slot.key === key) {
                this.buffer[pos].val = val
                return
            }

            // else continue probing
        }

        // If we reach here table was full (shouldn't because we resized), try resize and retry
        this._resize()
        this.set(key, val)
    }

    get(key) {
        const start = this._hash1(key)
        const step = this._hash2(key)

        for (let i = 0; i < this.capacity; i++) {
            const pos = this._probe(start, i, step)
            const slot = this.buffer[pos]

            // never-used slot -> key absent
            if (slot === null) return null

            // tombstone -> skip
            if (slot === DELETED) continue

            if (slot.key === key) return slot.val
        }

        return null
    }

    has(key) {
        return this.get(key) !== null
    }

    delete(key) {
        const start = this._hash1(key)
        const step = this._hash2(key)

        for (let i = 0; i < this.capacity; i++) {
            const pos = this._probe(start, i, step)
            const slot = this.buffer[pos]

            if (slot === null) return false // not found
            if (slot === DELETED) continue
            if (slot.key === key) {
                this.buffer[pos] = DELETED // tombstone
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
    // Resize / rehash
    // ---------------------
    _resize() {
        const old = this.buffer
        const newCap = this._nextPrime(this.capacity * 2 + 1)
        this.capacity = newCap
        this.buffer = Array.from({ length: this.capacity }, () => null)
        this.size = 0

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
            else console.log(`[${i}] -> ${String(s.key)} : ${JSON.stringify(s.val)}`)
        }
    }
}

const map = new DoubleHashingHashTable(7)

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
