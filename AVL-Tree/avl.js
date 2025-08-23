class TreeNode {
	left = null
	right = null
	height = 1
	balance = 0

	constructor(value) {
		this.value = value
	}
}

class AVL {
	root = null

	rotateRight(y) {
		const x = y.left
		const T2 = x.right

		// Perform rotation
		x.right = y
		y.left = T2

		// Update heights and balances
		this.update(y)
		this.update(x)

		return x
	}

	rotateLeft(x) {
		const y = x.right
		const T2 = y.left

		// Perform rotation
		y.left = x
		x.right = T2

		// Update heights and balances
		this.update(x)
		this.update(y)

		return y
	}

	update(node) {
		const leftHeight = node.left ? node.left.height : 0
		const rightHeight = node.right ? node.right.height : 0
		node.height = 1 + Math.max(leftHeight, rightHeight)
		node.balance = leftHeight - rightHeight
	}

	balance(node) {
		/* Left heavy, left-left */
		if (node.balance > 1) {
			// left-right
			if (node.left.balance < 0) {
				node.left = this.rotateLeft(node.left)
			}
			return this.rotateRight(node)

			/* Right heavy, right-right */
		} else if (node.balance < -1) {
			// right-left
			if (node.right.balance > 0) {
				node.right = this.rotateRight(node.right)
			}
			return this.rotateLeft(node)
		}

		return node
	}

	insert(value) {
		this.root = this._insertNode(this.root, value)
	}

	_insertNode(node, value) {
		if (!node) return new TreeNode(value)
		if (value > node.value) {
			node.right = this._insertNode(node.right, value)
		} else if (value < node.value) {
			node.left = this._insertNode(node.left, value)
		}

		this.update(node)
		return this.balance(node)
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
			// Replace with inorder successor
			const successor = this._findMinNode(node.right)
			node.value = successor.value
			node.right = this._deleteNode(node.right, successor.value)
		}

		this.update(node)
		return this.balance(node)
	}

	_findMinNode(node) {
		while (node.left !== null) {
			node = node.left
		}
		return node
	}

	contains(value) {
		let cur = this.root
		while (cur) {
			if (value === cur.value) return true
			cur = value < cur.value ? cur.left : cur.right
		}
		return false
	}

	clear() {
		this.root = null
	}

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
}

// Examples demonstrating RR, RL, LL, LR rotations.
// Use after your AVL class definition (make sure clear() is present).

const tree = new AVL()

// ---------- RR (Right-Right) ----------
console.log('\n')
console.log('=== RR (Right-Right) ===')
tree.insert(10)
tree.insert(20)
tree.insert(30)
console.log('inOrder:', tree.inOrder()) // [ 10, 20, 30 ]
console.log('levelOrder:', tree.levelOrder()) // [ 20, 10, 30 ]
tree.clear()

// ---------- RL (Right-Left) ----------
console.log('\n')
console.log('=== RL (Right-Left) ===')
tree.insert(10)
tree.insert(30)
tree.insert(20)
console.log('inOrder:', tree.inOrder()) // [ 10, 20, 30 ]
console.log('levelOrder:', tree.levelOrder()) // [ 20, 10, 30 ]
tree.clear()

// ---------- LL (Left-Left) ----------
console.log('\n')
console.log('=== LL (Left-Left) ===')
tree.insert(30)
tree.insert(20)
tree.insert(10)
console.log('inOrder:', tree.inOrder()) // [ 10, 20, 30 ]
console.log('levelOrder:', tree.levelOrder()) // [ 20, 10, 30 ]
tree.clear()

// ---------- LR (Left-Right) ----------
console.log('\n')
console.log('=== LR (Left-Right) ===')
tree.insert(30)
tree.insert(10)
tree.insert(20)
console.log('inOrder:', tree.inOrder()) // [ 10, 20, 30 ]
console.log('levelOrder:', tree.levelOrder()) // [ 20, 10, 30 ]

console.log('\n')
console.log('=== New inserts ===')
tree.insert(40)
tree.insert(50)
console.log('levelOrder:', tree.levelOrder()) // [ 20, 10, 40, 30, 50 ]

console.log('=== Delete node then balancing ===')
tree.delete(10)
console.log('After delete(10):', tree.levelOrder()) // [ 40, 20, 50, 30 ]
