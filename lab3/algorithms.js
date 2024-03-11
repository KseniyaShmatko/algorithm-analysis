export function quickSort(array) {
    let n = array.length;
    if (n < 2) {
        return array;
    }
    let pivot = array[0];
    const left = [];
    const right= [];
    for (let i = 1; i < n; i++) {
        if (array[i] < pivot) {
            left.push(array[i]);
        }
        else {
            right.push(array[i]);
        }
    }

    return quickSort(left).concat(pivot, quickSort(right));
}

export function combSort(array) {
    let n = array.length;
    const factor = 1.247;
    let stepFactor = n / factor;
    while (stepFactor > 1) {
        const step = Math.floor(stepFactor);
        for(let i = 0, j = step; j < n; i++, j++) {
            if(array[i] > array[j]) {
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        stepFactor /= factor; 
    }

    return array;
}

class Node {
    constructor(key) {
      this.key = key;
      this.left = null;
      this.right = null;
    }
}
  
class BinaryTree {
    constructor() {
      this.root = null;
    }
  
    insert(key) {
      const newNode = new Node(key);
  
      if (!this.root) {
        this.root = newNode;
      } 
      else {
        this.insertNode(this.root, newNode);
      }
    }
  
    insertNode(node, newNode) {
      if (newNode.key < node.key) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          this.insertNode(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
        } else {
          this.insertNode(node.right, newNode);
        }
      }
    }

    visit(node, array) {
        if(node === null) return;
        if(node.left !== null) {
            this.visit(node.left, array);
        }
        array.push(node.key);
        if(node.right !== null) {
            this.visit(node.right, array);
        }
    }
}

export function binaryTreeSort(array) {
    let n = array.length;
    let tree = new BinaryTree();
    for (let i = 0; i < n; i++) {
        tree.insert(array[i]);
    }
    let res = [];
    tree.visit(tree.root, res);
    return res;
}