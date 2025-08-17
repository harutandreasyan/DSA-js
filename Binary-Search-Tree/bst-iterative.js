class TreeNode {
    constructor(value) {
        this.value = value
        this.left = null
        this.right = null
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null
    }

    insert(value) {
        const newNode = new TreeNode(value)

        if (this.root === null) {
            this.root = newNode
            return 
        }

        let current = this.root
        while (true) {
            if (value < current.value) {
                if (current.left === null) {
                    current.left = newNode
                    return 
                }
                current = current.left
            } else if (value > current.value) {
                if (current.right === null) {
                    current.right = newNode
                    return 
                }
                current = current.right
            }
        }
    }

    delete(value) {
        let parent = null
        let node = this.root

        while (node !== null && node.value !== value) {
            parent = node
            node = value < node.value ? node.left : node.right
        }

        if (node === null) return this

        // if node has two children, find inorder successor (min in right subtree),
        // copy its value into node, and then remove successor instead
        if (node.left !== null && node.right !== null) {
            let succParent = node
            let succ = node.right
            while (succ.left !== null) {
                succParent = succ
                succ = succ.left
            }
            node.value = succ.value
            parent = succParent
            node = succ
        }

        // node now has at most one child
        const replacement = node.left !== null ? node.left : node.right

        if (parent === null) {
            this.root = replacement
        } else if (parent.left === node) {
            parent.left = replacement
        } else {
            parent.right = replacement
        }

        return this
    }

    search(value) {
        return this._searchNode(this.root, value)
    }

    _searchNode(node, value) {
        if (node === null) {
            return false
        }

        if (value === node.value) {
            return true
        }

        if (value < node.value) {
            return this._searchNode(node.left, value)
        } else {
            return this._searchNode(node.right, value)
        }
    }

    _findMinNode(node) {
        while (node.left !== null) {
            node = node.left
        }
        return node
    }

    findMin() {
        if (this.root === null) return null
        let current = this.root
        while (current.left !== null) {
            current = current.left
        }
        return current.value
    }

    findMax() {
        if (this.root === null) return null
        let current = this.root
        while (current.right !== null) {
            current = current.right
        }
        return current.value
    }

    /* Depth-first traversals - inOrder, preOrder, postOrder */

    // In-order traversal (returns sorted array)
    // Left -> Root -> Right
    // Using Stack
    inOrder() {
        if (!this.root) return []
        const result = []
        const stack = []

        let current = this.root
        while (current || stack.length) {
            while (current) {
                stack.push(current)
                current = current.left
            }

            current = stack.pop()
            result.push(current.value)
            current = current.right
        }

        return result
    }

    // Root -> Left -> Right
    // Using Stack
    preOrder() {
        if (!this.root) return []
        const result = []
        const stack = [this.root]

        while (stack.length) {
            const node = stack.pop()
            result.push(node.value)
            if (node.right) stack.push(node.right)
            if (node.left) stack.push(node.left)
        }

        return result
    }

    // Left -> Right -> Root
    // Using Stack
    postOrder() {
        if (!this.root) return []
        const stack1 = [this.root]
        const stack2 = []
        const result = []

        while (stack1.length) {
            const node = stack1.pop()
            stack2.push(node)
            if (node.left) stack1.push(node.left)
            if (node.right) stack1.push(node.right)
        }

        while (stack2.length) {
            result.push(stack2.pop().value)
        }

        return result
    }

    /* Breadth-first traversal (by levels) */

    // Time: O(n^2) in worst cases due to repeated shifting on large arrays in some engines.
    // Space: O(n)
    // Using shift()
    levelOrder() {
        if (this.root === null) return []

        const result = []
        const queue = [this.root]

        while (queue.length > 0) {
            const node = queue.shift()
            result.push(node.value)

            if (node.left !== null) {
                queue.push(node.left)
            }
            if (node.right !== null) {
                queue.push(node.right)
            }
        }

        return result
    }

    // Index-based queue
    // Time: O(n), Space O(n)
    // This avoids repeated shifting by using a read index (i).
    levelOrderIndex() {
        if (this.root === null) return []
        const result = []
        const queue = [this.root]
        let i = 0
        while (i < queue.length) {
            const node = queue[i++]
            result.push(node.value)
            if (node.left) queue.push(node.left)
            if (node.right) queue.push(node.right)

            // Free reference to help garbage collector for very large trees
            queue[i - 1] = null
        }
        return result
    }

    // Level-by-level grouping
    levelOrderByLevels() {
        if (this.root === null) return []

        const result = []
        const queue = [this.root]

        while (queue.length) {
            let size = queue.length
            let level = []
            for (let i = 0; i < size; ++i) {
                const node = queue.shift()
                level.push(node.value)
                if (node.left) queue.push(node.left)
                if (node.right) queue.push(node.right)
            }
            result.push(level)
        }

        return result
    }

    getHeight() {
        return this._getNodeHeight(this.root)
    }

    _getNodeHeight(node) {
        if (node === null) return -1
        const leftHeight = this._getNodeHeight(node.left)
        const rightHeight = this._getNodeHeight(node.right)
        return Math.max(leftHeight, rightHeight) + 1
    }

    getSize() {
        return this._getNodeCount(this.root)
    }

    _getNodeCount(node) {
        if (node === null) {
            return 0
        }
        return 1 + this._getNodeCount(node.left) + this._getNodeCount(node.right)
    }

    isEmpty() {
        return this.root === null
    }

    isValidBST() {
        return this._validateBST(this.root, null, null)
    }

    _validateBST(node, min, max) {
        if (node === null) {
            return true
        }

        if (
            (min !== null && node.value <= min) ||
            (max !== null && node.value >= max)
        ) {
            return false
        }

        return (
            this._validateBST(node.left, min, node.value) &&
            this._validateBST(node.right, node.value, max)
        )
    }

    clear() {
        this.root = null
    }

    toArray() {
        return this.inOrder()
    }

    // Create a tree from an array
    static fromArray(arr) {
        const bst = new BinarySearchTree()
        arr.forEach((value) => bst.insert(value))
        return bst
    }
}

const bst = new BinarySearchTree()

;[50, 30, 70, 20, 40, 60, 80].map((a) => bst.insert(a))

console.log('Inorder:', bst.inOrder()) // [20, 30, 40, 50, 60, 70, 80]
console.log('Preorder:', bst.preOrder()) // [50, 30, 20, 40, 70, 60, 80]
console.log('Postorder:', bst.postOrder()) // [20, 40, 30, 60, 80, 70, 50]

console.log('Levelorder:', bst.levelOrder()) // [50, 30, 70, 20, 40, 60, 80]
console.log('Levelorder2:', bst.levelOrderIndex()) // [50, 30, 70, 20, 40, 60, 80]
console.log('Levelorder by grouping:', bst.levelOrderByLevels()) // [50, 30, 70, 20, 40, 60, 80]

console.log('Search 40:', bst.search(40)) // true
console.log('Search 25:', bst.search(25)) // false

console.log('Minimum value:', bst.findMin()) // 20
console.log('Maximum value:', bst.findMax()) // 80
console.log('Height:', bst.getHeight()) // 2
console.log('Count of nodes:', bst.getSize()) // 7

bst.delete(30)
console.log('After deleting 30:', bst.inOrder()) // [20, 40, 50, 60, 70, 80]

console.log('Is valid BST?', bst.isValidBST()) // true

bst.clear()
console.log('After clearing:', bst.toArray())
