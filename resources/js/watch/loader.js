/**
 * loader.js � Load first model fast, preload rest in background
 * Supports lazy loading and proper disposal for memory management.
 */
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Box3, Group, Vector3 } from 'three';

const CDN = 'https://cdn.jsdelivr.net/gh/mianmoaz786/models@main';
const RAW = 'https://raw.githubusercontent.com/mianmoaz786/models/main';
const MODELS = {
    invicta: { path: `${CDN}/invicta_watch.glb`, file: 'invicta_watch.glb' },
    golden:  { path: `${CDN}/golden_watch.glb`, file: 'golden_watch.glb' },
    roman:   { path: `${CDN}/luxury_roman_watch.glb`, file: 'luxury_roman_watch.glb' },
    'golden-pure': { path: `${CDN}/golden-pure.glb`, file: 'golden-pure.glb' },
    'apple-ultra': { path: `${CDN}/apple-ultra.glb`, file: 'apple-ultra.glb' },
    hilfiger: { path: `${CDN}/hilfiger.glb`, file: 'hilfiger.glb' },
    'roger-dubuis': { path: `${CDN}/roger-dubuis.glb`, file: 'roger-dubuis.glb' },
    'smart-kw19': { path: `${CDN}/smart-kw19.glb`, file: 'smart-kw19.glb' },
    'blue-watch': { path: `${RAW}/blue-watch.glb`, file: 'blue-watch.glb' },
};
const ALL_KEYS = ['invicta', 'golden', 'roman', 'golden-pure', 'apple-ultra', 'hilfiger', 'roger-dubuis', 'smart-kw19', 'blue-watch'];
const cache = new Map();

function loadOne(path) {
    return new Promise((resolve, reject) => {
        const file = path.split('/').pop();
        if (cache.has(file)) return resolve(cache.get(file));

        const draco = new DRACOLoader();
        draco.setDecoderPath('https://cdn.jsdelivr.net/gh/mianmoaz786/assets@main/draco/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);

        loader.load(path, (gltf) => {
            const model = gltf.scene;
            const box = new Box3().setFromObject(model);
            const size = box.getSize(new Vector3());
            const center = box.getCenter(new Vector3());
            const scale = 2.0 / Math.max(size.x, size.y, size.z);
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));
            model.position.y += size.y * scale * 0.05;
            model.visible = true;

            const names = [];
            model.traverse(c => { if (c.name) names.push(c.name); });
            console.log(`[loader] ${file} nodes:`, names.join(', '));

            cache.set(file, model);
            draco.dispose();
            resolve(model);
        }, null, (err) => {
            draco.dispose();
            reject(err);
        });
    });
}

/**
 * Load ONLY the first model (invicta) immediately.
 * On desktop, preload remaining models in background for smooth switching.
 * On mobile, skip preload — models load on-demand (saves 38MB on slow 4G).
 * Returns { first: Group, preload: Promise }
 */
export async function loadFirstModel(onProgress) {
    onProgress?.(50);
    const firstModel = await loadOne(MODELS.invicta.path);
    onProgress?.(80);

    // Only preload remaining on non-mobile (screen > 768px)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    let preload;

    if (isMobile) {
        preload = Promise.resolve();
        console.log('[loader] Mobile detected — skipping model preload');
    } else {
        // Preload remaining in background (desktop only)
        preload = Promise.all(
            ALL_KEYS.filter(k => k !== 'invicta').map(k =>
                loadOne(MODELS[k].path).catch(() => null)
            )
        ).then(() => console.log('[loader] All models cached'));
    }

    return { first: firstModel, preload };
}

/**
 * Get a cached model by key (invicta, golden, roman).
 */
export function getCachedModel(key) {
    const entry = MODELS[key];
    if (!entry) return null;
    return cache.get(entry.file) || null;
}

/**
 * Lazy load a model on demand (for model switching).
 * Returns the loaded model or null on failure.
 */
export async function lazyLoadModel(key) {
    const entry = MODELS[key];
    if (!entry) return null;

    // Return cached version if available
    const cached = cache.get(entry.file);
    if (cached) return cached;

    try {
        return await loadOne(entry.path);
    } catch (err) {
        console.error(`[loader] Failed to lazy-load ${key}:`, err);
        return null;
    }
}

/**
 * Dispose a js model and free GPU memory.
 */
export function disposeModel(model) {
    if (!model) return;

    model.traverse(child => {
        if (child.geometry) {
            child.geometry.dispose();
        }
        if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach(m => {
                // Dispose textures
                if (m.map) m.map.dispose();
                if (m.normalMap) m.normalMap.dispose();
                if (m.roughnessMap) m.roughnessMap.dispose();
                if (m.metalnessMap) m.metalnessMap.dispose();
                if (m.emissiveMap) m.emissiveMap.dispose();
                if (m.envMap) m.envMap.dispose();
                m.dispose();
            });
        }
    });

    // Remove from parent
    if (model.parent) {
        model.parent.remove(model);
    }
}

/**
 * Check if a model is cached.
 */
export function isModelCached(key) {
    const entry = MODELS[key];
    if (!entry) return false;
    return cache.has(entry.file);
}

