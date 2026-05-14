/* ============================================================
   DSA Visualizer — Express Server
   Serves frontend static files and provides API endpoints
   for algorithm discovery via the scanner.
   ============================================================ */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { scanAlgorithms } = require('./scanner');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ───────────────────────────────────────────────

/**
 * GET /api/categories
 * Returns all algorithm categories with their algorithms.
 */
app.get('/api/categories', (req, res) => {
  try {
    const categories = scanAlgorithms();
    res.json({ success: true, data: categories });
  } catch (err) {
    console.error('[API] Error scanning categories:', err);
    res.status(500).json({ success: false, error: 'Failed to scan algorithm categories' });
  }
});

/**
 * GET /api/algorithms/:category
 * Returns algorithms for a specific category.
 */
app.get('/api/algorithms/:category', (req, res) => {
  try {
    const categories = scanAlgorithms();
    const cat = categories.find(c => c.slug === req.params.category);

    if (!cat) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, data: cat });
  } catch (err) {
    console.error('[API] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * GET /api/code/:category/:algorithm
 * Returns the source code of an algorithm file.
 */
app.get('/api/code/:category/:algorithm', (req, res) => {
  try {
    const filePath = path.join(
      __dirname, '..', 'algorithms',
      req.params.category,
      req.params.algorithm + '.cpp'
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Algorithm file not found' });
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    res.json({ success: true, data: { code, filename: req.params.algorithm + '.cpp' } });
  } catch (err) {
    console.error('[API] Error reading code:', err);
    res.status(500).json({ success: false, error: 'Failed to read algorithm file' });
  }
});

/**
 * GET /api/trace/:category/:algorithm
 * Returns the trace data for visualization.
 * Phase 1: reads from a pre-built _trace.json file.
 * Phase 2: will compile + run C++ and capture live trace.
 */
app.get('/api/trace/:category/:algorithm', (req, res) => {
  try {
    const tracePath = path.join(
      __dirname, '..', 'algorithms',
      req.params.category,
      req.params.algorithm + '_trace.json'
    );

    if (!fs.existsSync(tracePath)) {
      return res.status(404).json({
        success: false,
        error: 'Trace data not found. Add a trace file or wait for Phase 2 C++ integration.'
      });
    }

    const trace = JSON.parse(fs.readFileSync(tracePath, 'utf-8'));
    res.json({ success: true, data: trace });
  } catch (err) {
    console.error('[API] Error reading trace:', err);
    res.status(500).json({ success: false, error: 'Failed to read trace data' });
  }
});

// ── Fallback to index.html for SPA routing ───────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║                                          ║');
  console.log(`  ║   🚀 AlgoViz Server running on port ${PORT}  ║`);
  console.log('  ║                                          ║');
  console.log(`  ║   🌐 http://localhost:${PORT}               ║`);
  console.log('  ║                                          ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');

  // Log discovered algorithms
  const categories = scanAlgorithms();
  const totalAlgos = categories.reduce((sum, c) => sum + c.algorithms.length, 0);
  console.log(`  📂 Found ${categories.length} categories, ${totalAlgos} algorithms`);
  categories.forEach(cat => {
    console.log(`     └─ ${cat.name}: ${cat.algorithms.length} algorithms`);
  });
  console.log('');
});
