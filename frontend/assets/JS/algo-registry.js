/* ============================================================
   DSA Visualizer — Algorithm Registry
   Single source of truth for all categories and their algorithms.
   Used by both the landing page sub-menus and the visualizer dropdown.
   ============================================================ */

const ALGO_REGISTRY = {

  /* ── Sorting ──────────────────────────────────────────────── */
  sorting: {
    name: 'Sorting Algorithms',
    icon: '⇅',
    color: '#06b6d4',
    algorithms: [
      {
        slug: 'bubble-sort',
        name: 'Bubble Sort',
        complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
        description: 'Repeatedly swaps adjacent elements if they are in the wrong order.',
        implemented: true,
      },
      {
        slug: 'selection-sort',
        name: 'Selection Sort',
        complexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
        description: 'Finds the minimum element and places it at the beginning.',
        implemented: true,
      },
      {
        slug: 'insertion-sort',
        name: 'Insertion Sort',
        complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
        description: 'Builds the sorted array one element at a time by inserting into the correct position.',
        implemented: true,
      },
      {
        slug: 'merge-sort',
        name: 'Merge Sort',
        complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
        description: 'Divides the array in halves, recursively sorts, then merges.',
        implemented: true,
      },
      {
        slug: 'quick-sort',
        name: 'Quick Sort',
        complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
        description: 'Picks a pivot and partitions elements around it.',
        implemented: true,
      },
      {
        slug: 'heap-sort',
        name: 'Heap Sort',
        complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
        description: 'Converts array to a max-heap, then repeatedly extracts the maximum.',
        implemented: false,
      },
    ],
  },

  /* ── Searching ────────────────────────────────────────────── */
  searching: {
    name: 'Searching Algorithms',
    icon: '⊕',
    color: '#22d3ee',
    algorithms: [
      {
        slug: 'linear-search',
        name: 'Linear Search',
        complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
        description: 'Sequentially checks each element until the target is found.',
        implemented: true,
      },
      {
        slug: 'binary-search',
        name: 'Binary Search',
        complexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
        description: 'Halves the search space each step on a sorted array.',
        implemented: true,
      },
      {
        slug: 'jump-search',
        name: 'Jump Search',
        complexity: { best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', space: 'O(1)' },
        description: 'Jumps ahead by fixed steps, then does a linear search in the block.',
        implemented: false,
      },
      {
        slug: 'interpolation-search',
        name: 'Interpolation Search',
        complexity: { best: 'O(1)', avg: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
        description: 'Estimates position based on value distribution in a sorted array.',
        implemented: false,
      },
    ],
  },

  /* ── Arrays ───────────────────────────────────────────────── */
  arrays: {
    name: 'Arrays',
    icon: '⊞',
    color: '#06b6d4',
    algorithms: [
      { slug: 'traversal', name: 'Traversal', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Visit every element in the array.', implemented: false },
      { slug: 'insertion', name: 'Insertion', complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Insert an element at a given position.', implemented: false },
      { slug: 'deletion', name: 'Deletion', complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Remove an element from a given position.', implemented: false },
      { slug: 'reversal', name: 'Reversal', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Reverse the array in-place.', implemented: false },
      { slug: 'rotation', name: 'Rotation', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Rotate elements left or right by k positions.', implemented: false },
    ],
  },

  /* ── Linked Lists ─────────────────────────────────────────── */
  'linked-lists': {
    name: 'Linked Lists',
    icon: '⟶',
    color: '#818cf8',
    algorithms: [
      { slug: 'singly-traversal', name: 'Singly — Traversal', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Walk through each node in a singly linked list.', implemented: false },
      { slug: 'singly-insertion', name: 'Singly — Insertion', complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Insert a node at head, tail, or specific position.', implemented: false },
      { slug: 'singly-deletion', name: 'Singly — Deletion', complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Delete a node by value or position.', implemented: false },
      { slug: 'singly-reversal', name: 'Singly — Reversal', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Reverse a singly linked list in-place.', implemented: false },
      { slug: 'doubly-traversal', name: 'Doubly — Traversal', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Walk forward and backward in a doubly linked list.', implemented: false },
      { slug: 'doubly-insertion', name: 'Doubly — Insertion', complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' }, description: 'Insert a node in a doubly linked list.', implemented: false },
    ],
  },

  /* ── Stacks ───────────────────────────────────────────────── */
  stacks: {
    name: 'Stacks',
    icon: '⊡',
    color: '#34d399',
    algorithms: [
      { slug: 'push', name: 'Push', complexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)' }, description: 'Add an element to the top of the stack.', implemented: false },
      { slug: 'pop', name: 'Pop', complexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)' }, description: 'Remove the top element from the stack.', implemented: false },
      { slug: 'peek', name: 'Peek', complexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)' }, description: 'View the top element without removing it.', implemented: false },
      { slug: 'stack-reversal', name: 'Stack Reversal', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)' }, description: 'Reverse a stack using recursion.', implemented: false },
    ],
  },

  /* ── Queues ───────────────────────────────────────────────── */
  queues: {
    name: 'Queues',
    icon: '⊟',
    color: '#fbbf24',
    algorithms: [
      { slug: 'enqueue', name: 'Enqueue', complexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)' }, description: 'Add an element to the rear of the queue.', implemented: false },
      { slug: 'dequeue', name: 'Dequeue', complexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)' }, description: 'Remove the front element from the queue.', implemented: false },
      { slug: 'circular-queue', name: 'Circular Queue', complexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(n)' }, description: 'Queue implemented in a circular buffer.', implemented: false },
      { slug: 'priority-queue', name: 'Priority Queue', complexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(n)' }, description: 'Elements dequeued by priority, not insertion order.', implemented: false },
    ],
  },

  /* ── Trees ────────────────────────────────────────────────── */
  trees: {
    name: 'Trees',
    icon: '⊻',
    color: '#f87171',
    algorithms: [
      { slug: 'bst-insertion', name: 'BST — Insertion', complexity: { best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', space: 'O(1)' }, description: 'Insert a node into a binary search tree.', implemented: false },
      { slug: 'bst-search', name: 'BST — Search', complexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(n)', space: 'O(1)' }, description: 'Search for a value in a BST.', implemented: false },
      { slug: 'inorder', name: 'Inorder Traversal', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(h)' }, description: 'Left → Root → Right traversal.', implemented: false },
      { slug: 'preorder', name: 'Preorder Traversal', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(h)' }, description: 'Root → Left → Right traversal.', implemented: false },
      { slug: 'postorder', name: 'Postorder Traversal', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(h)' }, description: 'Left → Right → Root traversal.', implemented: false },
      { slug: 'level-order', name: 'Level Order (BFS)', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)' }, description: 'Breadth-first traversal level by level.', implemented: false },
    ],
  },

  /* ── Graphs ───────────────────────────────────────────────── */
  graphs: {
    name: 'Graphs',
    icon: '◈',
    color: '#a78bfa',
    algorithms: [
      { slug: 'bfs', name: 'BFS', complexity: { best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' }, description: 'Breadth-first search explores neighbors first.', implemented: false },
      { slug: 'dfs', name: 'DFS', complexity: { best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' }, description: 'Depth-first search explores as deep as possible.', implemented: false },
      { slug: 'dijkstra', name: "Dijkstra's", complexity: { best: 'O(V+E log V)', avg: 'O(V+E log V)', worst: 'O(V²)', space: 'O(V)' }, description: 'Shortest path from a single source vertex.', implemented: false },
      { slug: 'kruskal', name: "Kruskal's MST", complexity: { best: 'O(E log E)', avg: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)' }, description: 'Minimum spanning tree using edge sorting.', implemented: false },
    ],
  },

  /* ── Recursion ────────────────────────────────────────────── */
  recursion: {
    name: 'Recursion',
    icon: '∞',
    color: '#818cf8',
    algorithms: [
      { slug: 'factorial', name: 'Factorial', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)' }, description: 'Compute n! recursively.', implemented: false },
      { slug: 'fibonacci', name: 'Fibonacci', complexity: { best: 'O(2^n)', avg: 'O(2^n)', worst: 'O(2^n)', space: 'O(n)' }, description: 'Compute nth Fibonacci number recursively.', implemented: false },
      { slug: 'tower-of-hanoi', name: 'Tower of Hanoi', complexity: { best: 'O(2^n)', avg: 'O(2^n)', worst: 'O(2^n)', space: 'O(n)' }, description: 'Move disks between three pegs.', implemented: false },
    ],
  },

  /* ── Dynamic Programming ──────────────────────────────────── */
  'dynamic-programming': {
    name: 'Dynamic Programming',
    icon: '⊞',
    color: '#34d399',
    algorithms: [
      { slug: 'fibonacci-dp', name: 'Fibonacci (DP)', complexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)' }, description: 'Fibonacci using memoization / tabulation.', implemented: false },
      { slug: 'knapsack', name: '0/1 Knapsack', complexity: { best: 'O(nW)', avg: 'O(nW)', worst: 'O(nW)', space: 'O(nW)' }, description: 'Maximize value without exceeding weight.', implemented: false },
      { slug: 'lcs', name: 'Longest Common Subsequence', complexity: { best: 'O(mn)', avg: 'O(mn)', worst: 'O(mn)', space: 'O(mn)' }, description: 'Find the longest subsequence common to two sequences.', implemented: false },
      { slug: 'lis', name: 'Longest Increasing Subsequence', complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(n)' }, description: 'Find the longest strictly increasing subsequence.', implemented: false },
    ],
  },

  /* ── Greedy ───────────────────────────────────────────────── */
  greedy: {
    name: 'Greedy Algorithms',
    icon: '✦',
    color: '#fbbf24',
    algorithms: [
      { slug: 'activity-selection', name: 'Activity Selection', complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }, description: 'Select maximum non-overlapping activities.', implemented: false },
      { slug: 'fractional-knapsack', name: 'Fractional Knapsack', complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }, description: 'Maximize value by taking fractions of items.', implemented: false },
      { slug: 'huffman-coding', name: 'Huffman Coding', complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' }, description: 'Optimal prefix-free binary encoding.', implemented: false },
    ],
  },
};

/* Helper: look up a category's slug from various input formats */
function getRegistryCategory(catParam) {
  if (!catParam) return null;
  const normalized = catParam.toLowerCase().replace(/\s+/g, '-');
  if (ALGO_REGISTRY[normalized]) return normalized;

  // Try matching by name
  for (const [slug, cat] of Object.entries(ALGO_REGISTRY)) {
    if (cat.name.toLowerCase().replace(/\s+/g, '-') === normalized) return slug;
  }
  return null;
}
