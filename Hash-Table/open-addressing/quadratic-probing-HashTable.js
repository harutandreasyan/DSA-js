const DELETED = Symbol('DELETED')

class QuadraticProbingHashTable {
    /**
     * capacity - initial capacity (will be bumped to next prime)
     * c1, c2 - quadratic probing coefficients: pos = (h + c1*i + c2*i*i) % m
     * loadFactor - threshold to trigger resize
     */
    constructor(capacity = 11, c1 = 1, c2 = 1, loadFactor = 0.5) {
        this.capacity = this._nextPrime(capacity)
        this.c1 = c1
        this.c2 = c2
        this.loadFactor = loadFactor

        this.size = 0 
        this.buffer = Array.from({ length: this.capacity }, () => null) // null = never used
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

    // ---------------------
    // Hashing (djb2) - safe unsigned
    // ---------------------
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

    // ---------------------
    // Probe sequence (quadratic)
    // pos = (start + c1*i + c2*i*i) % capacity
    // ---------------------
    _probeSequence(start, i) {
        return (start + this.c1 * i + this.c2 * i * i) % this.capacity
    }

    set(key, val) {
        if ((this.size + 1) / this.capacity > this.loadFactor) {
            this._resize()
        }

        const start = this._hash(key)
        let firstDeleted = -1

        for (let i = 0; i < this.capacity; i++) {
            const pos = this._probeSequence(start, i)
            const slot = this.buffer[pos]

            // empty (never used) -> we can insert here (or reuse firstDeleted)
            if (slot === null) {
                const insertPos = firstDeleted !== -1 ? firstDeleted : pos
                this.buffer[insertPos] = { key, val }
                this.size++
                return
            }

            // tombstone -> remember first one and continue probing (there might be existing key later)
            if (slot === DELETED) {
                if (firstDeleted === -1) firstDeleted = pos
                continue
            }

            // occupied -> update if keys equal
            if (slot.key === key) {
                this.buffer[pos].val = val
                return
            }

            // else collision -> continue probing
        }

        // Shouldn't normally reach here if we resized early, but just in case:
        this._resize()
        this.set(key, val)
    }

    get(key) {
        const start = this._hash(key)

        for (let i = 0; i < this.capacity; i++) {
            const pos = this._probeSequence(start, i)
            const slot = this.buffer[pos]

            // never-used slot -> key not present (we can stop)
            if (slot === null) return null

            // tombstone -> skip, keep probing
            if (slot === DELETED) continue

            // occupied -> check key
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

            // never-used -> not found
            if (slot === null) return false

            if (slot === DELETED) continue

            if (slot.key === key) {
                // mark tombstone
                this.buffer[pos] = DELETED
                this.size--
                return true
            }
        }

        return false
    }

    clear() {
        this.capacity = this._nextPrime(11)
        this.buffer = Array.from({ length: this.capacity }, () => null)
        this.size = 0
    }

    // ---------------------
    // Resize and rehash
    // ---------------------
    _resize() {
        const old = this.buffer
        const newCap = this._nextPrime(this.capacity * 2 + 1)
        this.capacity = newCap
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
            else console.log(`[${i}] -> ${String(s.key)} : ${JSON.stringify(s.val)}`)
        }
    }
}

const map = new QuadraticProbingHashTable(7) 

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
