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
		}

		this.root = this._insertNode(this.root, newNode)
	}

	_insertNode(node, newNode) {
		if (newNode.value < node.value) {
			if (node.left === null) {
				node.left = newNode
			} else {
				this._insertNode(node.left, newNode)
			}
		} else if (newNode.value > node.value) {
			if (node.right === null) {
				node.right = newNode
			} else {
				this._insertNode(node.right, newNode)
			}
		}

		return node
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

	delete(value) {
		this.root = this._deleteNode(this.root, value)
	}

	_deleteNode(node, value) {
		if (node === null) return null

		if (value < node.value) {
			node.left = this._deleteNode(node.left, value)
		} else if (value > node.value) {
			node.right = this._deleteNode(node.right, value)
		} else {
			// Node to delete found

			// Case 1: Node without children (leaf)
			if (node.left === null && node.right === null) {
				return null
			}

			// Case 2: A node with one child
			if (node.left === null) {
				return node.right
			}
			if (node.right === null) {
				return node.left
			}

			// Case 3: Node with two children
			// Find the minimum value in the right subtree
			const successor = this._findMinNode(node.right)
			node.value = successor.value
			node.right = this._deleteNode(node.right, successor.value)
		}

		return node
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
	inOrder() {
		const result = []
		this._inOrderTraversal(this.root, result)
		return result
	}

	_inOrderTraversal(node, result) {
		if (node !== null) {
			this._inOrderTraversal(node.left, result)
			result.push(node.value)
			this._inOrderTraversal(node.right, result)
		}
	}

	// Root -> Left -> Right
	preOrder() {
		const result = []
		this._preOrderTraversal(this.root, result)
		return result
	}

	_preOrderTraversal(node, result) {
		if (node !== null) {
			result.push(node.value)
			this._preOrderTraversal(node.left, result)
			this._preOrderTraversal(node.right, result)
		}
	}

	// Left -> Right -> Root
	postOrder() {
		const result = []
		this._postOrderTraversal(this.root, result)
		return result
	}

	_postOrderTraversal(node, result) {
		if (node !== null) {
			this._postOrderTraversal(node.left, result)
			this._postOrderTraversal(node.right, result)
			result.push(node.value)
		}
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
