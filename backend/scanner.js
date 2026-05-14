/* ============================================================
   DSA Visualizer — Algorithm Scanner
   Scans the algorithms/ directory to build a category manifest.
   ============================================================ */

const fs = require('fs');
const path = require('path');

const ALGO_DIR = path.join(__dirname, '..', 'algorithms');

/**
 * Scans the algorithms/ directory and returns a manifest of categories and algorithms.
 * Structure:
 * [
 *   {
 *     slug: "sorting",
 *     name: "Sorting Algorithms",
 *     description: "...",
 *     icon: "sort",
 *     color: "#06b6d4",
 *     algorithms: [
 *       { slug: "bubble_sort", name: "Bubble Sort", file: "bubble_sort.cpp", hasMeta: true }
 *     ]
 *   }
 * ]
 */
function scanAlgorithms() {
  const categories = [];

  if (!fs.existsSync(ALGO_DIR)) {
    console.warn('[Scanner] algorithms/ directory not found. Creating it...');
    fs.mkdirSync(ALGO_DIR, { recursive: true });
    return categories;
  }

  const entries = fs.readdirSync(ALGO_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const catPath = path.join(ALGO_DIR, entry.name);
    const catSlug = entry.name;

    // Read _meta.json if it exists
    let meta = {
      name: formatName(catSlug),
      description: '',
      icon: 'default',
      color: '#06b6d4',
    };

    const metaPath = path.join(catPath, '_meta.json');
    if (fs.existsSync(metaPath)) {
      try {
        const raw = fs.readFileSync(metaPath, 'utf-8');
        meta = { ...meta, ...JSON.parse(raw) };
      } catch (err) {
        console.warn(`[Scanner] Failed to parse ${metaPath}:`, err.message);
      }
    }

    // Find .cpp files
    const files = fs.readdirSync(catPath);
    const algorithms = [];

    for (const file of files) {
      if (!file.endsWith('.cpp')) continue;

      const algoSlug = file.replace('.cpp', '');
      const algoName = formatName(algoSlug);

      // Check for companion .json metadata
      const algoMetaPath = path.join(catPath, algoSlug + '.json');
      let algoMeta = { name: algoName };

      if (fs.existsSync(algoMetaPath)) {
        try {
          const raw = fs.readFileSync(algoMetaPath, 'utf-8');
          algoMeta = { ...algoMeta, ...JSON.parse(raw) };
        } catch (err) {
          console.warn(`[Scanner] Failed to parse ${algoMetaPath}:`, err.message);
        }
      }

      // Check for trace file
      const tracePath = path.join(catPath, algoSlug + '_trace.json');
      const hasTrace = fs.existsSync(tracePath);

      algorithms.push({
        slug: algoSlug,
        name: algoMeta.name || algoName,
        file: file,
        hasTrace: hasTrace,
        complexity: algoMeta.complexity || null,
        description: algoMeta.description || '',
        visualizer: algoMeta.visualizer || 'array',
      });
    }

    categories.push({
      slug: catSlug,
      name: meta.name,
      description: meta.description,
      icon: meta.icon,
      color: meta.color,
      algorithms: algorithms,
    });
  }

  return categories;
}

/**
 * Converts a slug like "bubble_sort" to "Bubble Sort"
 */
function formatName(slug) {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

module.exports = { scanAlgorithms };
