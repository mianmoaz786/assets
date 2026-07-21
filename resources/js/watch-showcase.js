/**
 * watch-showcase.js � Cinematic scroll-driven 3D showcase
 *
 * Phase 1 (scroll 0-55%): Smooth model showcase w/ camera orbit
 * Phase 2 (scroll 55-60%): Model fade out
 * Phase 3 (scroll 60-100%): Content reveal
 * Scrolling back up reverses all smoothly.
 */
import { CatmullRomCurve3, Color, Vector3 } from 'three';
import gsap from 'gsap';
import { createScene } from './watch/scene.js';
import { buildWatchModel, updateHands } from './watch/watch-model.js';
import { loadFirstModel, getCachedModel, disposeModel, lazyLoadModel } from './watch/loader.js';
import { setupScrollTimeline } from './watch/scroll-timeline.js';
import { isWebGLSupported, detectPerformanceTier, prefersReducedMotion, createVisibilityController, logRendererInfo, createFPSMonitor } from './watch/performance.js';

const F = document.getElementById.bind(document);
const loaderFill = F('loader-fill'), loaderPct = F('loader-pct'), preloader = F('preloader');
const loaderRing = F('loader-ring'), loaderBrand = F('loader-brand');
const CIRCUMFERENCE = 553;

if (loaderBrand) setTimeout(() => { loaderBrand.style.opacity = '1'; loaderBrand.style.transform = 'translateY(0)'; }, 200);

function setProgress(p) {
    const pc = Math.round(p);
    if (loaderFill) loaderFill.style.width = p + '%';
    if (loaderPct) loaderPct.textContent = pc + '%';
    if (loaderRing) loaderRing.style.strokeDashoffset = CIRCUMFERENCE * (1 - p / 100);
}
function hideLoader() {
    // Fade canvas poster so 3D model is visible
    const poster = document.getElementById('canvas-poster');
    if (poster) { poster.style.opacity = '0'; }
    if (preloader) {
        preloader.style.transition = 'transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity 1.2s ease';
        preloader.style.transform = 'translateY(-100%)';
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; preloader.style.transform = ''; }, 1400);
    }
}
setTimeout(() => { if (preloader?.style?.display !== 'none') hideLoader(); }, 12000);

function toast(m, e = false) {
    let t = document.querySelector('.toast');
    if (!t) {
        t = document.createElement('div');
        t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(10px);z-index:10001;padding:0.75rem 1.5rem;border-radius:12px;font-size:0.85rem;background:rgba(14,14,14,0.9);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.06);color:#f0ece4;opacity:0;pointer-events:none;transition:all 0.5s cubic-bezier(0.16,1,0.3,1);';
        document.body.appendChild(t);
    }
    t.textContent = m;
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    t.style.borderColor = e ? '#c94040' : 'rgba(255,255,255,0.06)';
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(10px)'; }, 3500);
}

function initForm() {
    const f = F('enquiry-form'); if (!f) return;
    const setSelected = () => {
        const active = sel => document.querySelector(`[data-swatch="${sel}"].border-gold`);
        const cs = active('case'); const ss = active('strap');
        const c = f.querySelector('input[name="selected_case"]');
        const s = f.querySelector('input[name="selected_strap"]');
        if (c) c.value = cs ? cs.dataset.key : '';
        if (s) s.value = ss ? ss.dataset.key : '';
    };
    f.addEventListener('submit', async e => {
        e.preventDefault();
        setSelected();
        const btn = f.querySelector('button[type="submit"]');
        const orig = btn.textContent; btn.textContent = 'Sending...'; btn.disabled = true;
        try {
            const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { 'X-Requested-With': 'XMLHttpRequest' } });
            const d = await r.json();
            if (d.success) {
                toast(d.message || 'Enquiry sent.');
                f.reset();
                // Analytics: track enquiry submission
                if (window.Analytics) {
                    window.Analytics.track('enquiry_submitted', {
                        selected_case: f.querySelector('input[name="selected_case"]')?.value,
                        selected_strap: f.querySelector('input[name="selected_strap"]')?.value,
                    });
                }
            } else {
                toast(d.message || 'Error', true);
            }
        } catch { toast('Network error.', true); }
        finally { btn.textContent = orig; btn.disabled = false; }
    });
    // Reset config summary on form reset
    f.addEventListener('reset', () => {
        ['case', 'strap'].forEach(type => {
            const el = F(`summary-${type}`);
            if (el) {
                el.textContent = 'Select in Materials';
                el.classList.add('text-gold');
                el.classList.remove('text-[#f0ece4]');
                el.style.background = '';
                el.style.borderColor = '';
            }
        });
    });
}

function initSwatches(model) {
    document.querySelectorAll('[data-swatch]').forEach(sw => {
        if (sw.dataset.bound === 'true') return;
        sw.dataset.bound = 'true';
        sw.addEventListener('click', () => {
            const type = sw.dataset.swatch, key = sw.dataset.key, color = sw.dataset.color, m = parseFloat(sw.dataset.metalness) ?? 0.5, r = parseFloat(sw.dataset.roughness) ?? 0.5;
            document.querySelectorAll(`[data-swatch="${type}"]`).forEach(s => s.classList.remove('border-gold', 'shadow-[0_0_0_3px_rgba(201,169,110,0.18)]'));
            sw.classList.add('border-gold', 'shadow-[0_0_0_3px_rgba(201,169,110,0.18)]');
            const meshes = type === 'case' ? ['case','bezel','caseBevel','caseSide'].map(n => model.getObjectByName(n)).filter(Boolean) : ['strapUpper','strapLower'].map(n => model.getObjectByName(n)).filter(Boolean);
            if (!meshes.length) model.traverse(c => { if (c.isMesh && c.material?.metalness > 0.7 && type === 'case') meshes.push(c); });
            const tc = new Color(color);
            meshes.forEach(ms => { if (!ms?.material) return; gsap.to(ms.material.color, { r: tc.r, g: tc.g, b: tc.b, duration: 0.7, ease: 'power2.inOut' }); gsap.to(ms.material, { metalness: m, roughness: r, duration: 0.7, ease: 'power2.inOut' }); });

            // Update price display + CTA price (total: case + strap add-on)
            const pe = F('price-display');
            const ctaP = document.getElementById('cta-price');
            const updatePrice = (el) => {
                if (!el) return;
                const activeCase = document.querySelector('[data-swatch="case"].border-gold');
                const activeStrap = document.querySelector('[data-swatch="strap"].border-gold');
                const parsePrice = (s) => { if (!s) return 0; const n = parseFloat(s.replace(/[^0-9.]/g,'')); return isNaN(n)?0:n; };
                const casePrice = activeCase ? parsePrice(activeCase.dataset.price) : parsePrice(el.dataset?.base || pe?.dataset.base);
                const strapPrice = activeStrap ? parsePrice(activeStrap.dataset.price) : 0;
                const total = casePrice + strapPrice;
                el.textContent = '$' + total.toLocaleString('en-US', {minimumFractionDigits:0,maximumFractionDigits:0});
            };
            updatePrice(pe);
            updatePrice(ctaP);
            if (pe) gsap.fromTo(pe, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });

            // Update config summary
            const label = sw.title || key;
            const summaryEl = F(`summary-${type}`);
            if (summaryEl) {
                summaryEl.textContent = label;
                summaryEl.classList.remove('text-gold');
                summaryEl.classList.add('text-[#f0ece4]');
                summaryEl.style.background = color;
                summaryEl.style.borderColor = color;
                summaryEl.style.color = readableText(color);
            }

            // Analytics: track material selection
            if (window.Analytics) {
                window.Analytics.track('material_selected', { type, key, color });
            }
        });
    });
}

function readableText(hex) {
    if (!hex) return '';
    const c = hex.replace('#', '');
    if (c.length < 6) return '#f0ece4';
    const sr = parseInt(c.substring(0, 2), 16) / 255;
    const sg = parseInt(c.substring(2, 4), 16) / 255;
    const sb = parseInt(c.substring(4, 6), 16) / 255;
    // sRGB → linear
    const toLinear = (v) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    const L = 0.2126 * toLinear(sr) + 0.7152 * toLinear(sg) + 0.0722 * toLinear(sb);
    // WCAG contrast against black (#0a0a0a, L≈0.003) vs white (#f0ece4, L≈0.839)
    const contrastDark = (L + 0.05) / (0.003 + 0.05);
    const contrastLight = (0.839 + 0.05) / (L + 0.05);
    return contrastDark >= contrastLight ? '#0a0a0a' : '#f0ece4';
}

function updateSwatches(key) {
    const mats = MODEL_SWATCHES[key];
    if (!mats) return;
    const caseContainer = document.querySelector('#case-options');
    const strapContainer = document.querySelector('#strap-options');
    const priceDisplay = document.getElementById('price-display');
    if (!caseContainer || !strapContainer) return;

    caseContainer.innerHTML = '';
    strapContainer.innerHTML = '';
    Object.entries(mats.case).forEach(([k, m], i) => {
        const btn = document.createElement('button');
        btn.dataset.swatch = 'case'; btn.dataset.key = k;
        btn.dataset.color = m.color; btn.dataset.metalness = m.metalness ?? 0;
        btn.dataset.roughness = m.roughness ?? 0.5; btn.dataset.price = m.price;
        btn.style.background = m.color;
        btn.className = 'w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ' + (i === 0 ? 'border-gold shadow-[0_0_0_3px_rgba(201,169,110,0.18)]' : 'border-transparent');
        btn.title = m.label; btn.ariaLabel = m.label + ' case';
        caseContainer.appendChild(btn);
    });
    Object.entries(mats.strap).forEach(([k, m], i) => {
        const btn = document.createElement('button');
        btn.dataset.swatch = 'strap'; btn.dataset.key = k;
        btn.dataset.color = m.color; btn.dataset.metalness = m.metalness ?? 0;
        btn.dataset.roughness = m.roughness ?? 0.5; btn.dataset.price = m.price;
        btn.style.background = m.color;
        btn.className = 'w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ' + (i === 0 ? 'border-gold shadow-[0_0_0_3px_rgba(201,169,110,0.18)]' : 'border-transparent');
        btn.title = m.label; btn.ariaLabel = m.label + ' strap';
        strapContainer.appendChild(btn);
    });

    // Update price display base
    if (priceDisplay) {
        const basePrice = Object.values(mats.case)[0]?.price || '';
        priceDisplay.dataset.base = basePrice;
        priceDisplay.textContent = basePrice;
    }

    // Reset summary labels
    const sc = document.getElementById('summary-case');
    const ss = document.getElementById('summary-strap');
    if (sc) { const c0 = Object.values(mats.case)[0]?.color || ''; sc.textContent = Object.values(mats.case)[0]?.label || 'Select'; sc.style.background = c0; sc.style.color = c0 ? readableText(c0) : ''; sc.classList.remove('text-gold'); }
    if (ss) { const c0 = Object.values(mats.strap)[0]?.color || ''; ss.textContent = Object.values(mats.strap)[0]?.label || 'Select'; ss.style.background = c0; ss.style.color = c0 ? readableText(c0) : ''; ss.classList.remove('text-gold'); }

    // Update CTA price base
    const ctaP = document.getElementById('cta-price');
    if (ctaP) {
        const basePrice = Object.values(mats.case)[0]?.price || '';
        ctaP.dataset.base = basePrice;
        ctaP.textContent = basePrice;
    }

    reinitSwatches();
}

function reinitSwatches() {
    document.querySelectorAll('[data-swatch]').forEach(sw => delete sw.dataset.bound);
    if (window._currentModel) initSwatches(window._currentModel);
}

function initHover(canvas) {
    const s = { hovering: false, rx: 0, ry: 0, targetRX: 0, targetRY: 0 };
    canvas.addEventListener('mouseenter', () => s.hovering = true);
    canvas.addEventListener('mousemove', e => {
        if (s.hovering) {
            s.targetRX = ((e.clientY / window.innerHeight) - 0.5) * 2;
            s.targetRY = ((e.clientX / window.innerWidth) - 0.5) * 2;
        }
    });
    canvas.addEventListener('mouseleave', () => { s.hovering = false; s.targetRX = 0; s.targetRY = 0; });
    canvas.addEventListener('touchstart', () => s.hovering = true, { passive: true });
    canvas.addEventListener('touchmove', e => {
        const t = e.touches[0];
        s.targetRX = ((t.clientY / window.innerHeight) - 0.5) * 2;
        s.targetRY = ((t.clientX / window.innerWidth) - 0.5) * 2;
    }, { passive: true });
    canvas.addEventListener('touchend', () => { s.hovering = false; s.targetRX = 0; s.targetRY = 0; });
    return s;
}

// -- Cinematic camera keyframes --
const CAM = [
    { p: [0, 0.8, 5.5], l: [0, 0, 0] },
    { p: [3.5, 0.3, 4.5], l: [0, 0.05, 0] },
    { p: [0.5, 0.2, 2.5], l: [0, 0, 0] },
    { p: [-3, 0.8, 3.8], l: [0, 0.15, 0] },
    { p: [0, 0.1, 1.8], l: [0, 0.05, 0] },
    { p: [3.5, 0.1, 2.8], l: [0, 0.05, 0] },
    { p: [0, 0.5, 6], l: [0, 0, 0] },
];
const posCurve = new CatmullRomCurve3(CAM.map(k => new Vector3(...k.p)), false, 'catmullrom', 0.5);
const lookCurve = new CatmullRomCurve3(CAM.map(k => new Vector3(...k.l)), false, 'catmullrom', 0.5);

const MODEL_SWATCHES = {
    invicta: {
        case: { steel:{label:'Stainless Steel',color:'#8e9095',metalness:1,roughness:0.28,price:'$28,500'}, gold:{label:'18K Gold',color:'#d4a574',metalness:1,roughness:0.18,price:'$32,000'}, black:{label:'Black PVD',color:'#1a1a1a',metalness:0.8,roughness:0.4,price:'$29,500'} },
        strap: { leather:{label:'Brown Leather',color:'#5c3d2e',roughness:0.8,price:'incl.'}, rubber:{label:'Black Rubber',color:'#1a1a1a',roughness:0.6,price:'incl.'}, bracelet:{label:'Steel Bracelet',color:'#8e9095',metalness:1,roughness:0.3,price:'+$2,500'} }
    },
    golden: {
        case: { gold:{label:'18K Yellow Gold',color:'#d4a574',metalness:1,roughness:0.18,price:'$32,000'}, rose:{label:'18K Rose Gold',color:'#d4a574',metalness:1,roughness:0.18,price:'$34,000'} },
        strap: { bracelet:{label:'Gold Bracelet',color:'#d4a574',metalness:1,roughness:0.3,price:'incl.'}, leather:{label:'Brown Leather',color:'#5c3d2e',roughness:0.8,price:'incl.'} }
    },
    roman: {
        case: { gold:{label:'18K Gold',color:'#d4a574',metalness:1,roughness:0.18,price:'$24,800'}, steel:{label:'Stainless Steel',color:'#8e9095',metalness:1,roughness:0.28,price:'$22,000'} },
        strap: { leather:{label:'Brown Leather',color:'#5c3d2e',roughness:0.8,price:'incl.'}, 'leather-black':{label:'Black Leather',color:'#1a1a1a',roughness:0.8,price:'incl.'} }
    },
    'golden-pure': {
        case: { gold:{label:'18K Gold',color:'#d4a574',metalness:1,roughness:0.18,price:'$35,000'}, white:{label:'White Gold',color:'#c0c0c0',metalness:1,roughness:0.18,price:'$37,000'} },
        strap: { bracelet:{label:'Gold Bracelet',color:'#d4a574',metalness:1,roughness:0.3,price:'incl.'}, 'leather-white':{label:'White Leather',color:'#f0ece4',roughness:0.8,price:'incl.'} }
    },
    'apple-ultra': {
        case: { titanium:{label:'Titanium',color:'#a0a5aa',metalness:0.9,roughness:0.35,price:'$2,499'}, black:{label:'Black DLC',color:'#1a1a1a',metalness:0.8,roughness:0.4,price:'$2,699'} },
        strap: { 'rubber-orange':{label:'Orange Rubber',color:'#e8633a',roughness:0.6,price:'incl.'}, 'rubber-black':{label:'Black Rubber',color:'#1a1a1a',roughness:0.6,price:'incl.'}, 'rubber-white':{label:'White Rubber',color:'#f0ece4',roughness:0.6,price:'incl.'} }
    },
    hilfiger: {
        case: { steel:{label:'Stainless Steel',color:'#8e9095',metalness:1,roughness:0.28,price:'$1,899'}, blue:{label:'Blue Ceramic',color:'#1a3a5c',metalness:0.6,roughness:0.4,price:'$2,199'} },
        strap: { 'leather-blue':{label:'Blue Leather',color:'#1a3a5c',roughness:0.8,price:'incl.'}, leather:{label:'Brown Leather',color:'#5c3d2e',roughness:0.8,price:'incl.'}, 'rubber-black':{label:'Black Rubber',color:'#1a1a1a',roughness:0.6,price:'incl.'} }
    },
    'roger-dubuis': {
        case: { gold:{label:'18K Gold',color:'#d4a574',metalness:1,roughness:0.18,price:'$48,000'}, titanium:{label:'Titanium',color:'#a0a5aa',metalness:0.9,roughness:0.35,price:'$42,000'}, black:{label:'Black DLC',color:'#1a1a1a',metalness:0.8,roughness:0.4,price:'$44,000'} },
        strap: { 'rubber-black':{label:'Black Rubber',color:'#1a1a1a',roughness:0.6,price:'incl.'}, 'rubber-red':{label:'Red Rubber',color:'#8b1a1a',roughness:0.6,price:'incl.'}, 'leather-black':{label:'Black Leather',color:'#1a1a1a',roughness:0.8,price:'incl.'} }
    },
    'smart-kw19': {
        case: { steel:{label:'Stainless Steel',color:'#8e9095',metalness:1,roughness:0.28,price:'$699'}, black:{label:'Black',color:'#1a1a1a',metalness:0.6,roughness:0.4,price:'$749'}, gold:{label:'Gold',color:'#d4a574',metalness:1,roughness:0.18,price:'$899'} },
        strap: { 'rubber-black':{label:'Black Rubber',color:'#1a1a1a',roughness:0.6,price:'incl.'}, 'rubber-blue':{label:'Blue Rubber',color:'#2d5a8a',roughness:0.6,price:'incl.'}, bracelet:{label:'Steel Bracelet',color:'#8e9095',metalness:1,roughness:0.3,price:'+$100'} }
    },
    'blue-watch': {
        case: { steel:{label:'Stainless Steel',color:'#8e9095',metalness:1,roughness:0.28,price:'$3,200'}, blue:{label:'Ocean Blue',color:'#1a3a6e',metalness:0.6,roughness:0.4,price:'$3,500'}, gold:{label:'Gold Accent',color:'#d4a574',metalness:1,roughness:0.18,price:'$4,200'} },
        strap: { 'rubber-black':{label:'Black Rubber',color:'#1a1a1a',roughness:0.6,price:'incl.'}, 'rubber-blue':{label:'Blue Rubber',color:'#2d5a8a',roughness:0.6,price:'incl.'}, bracelet:{label:'Steel Bracelet',color:'#8e9095',metalness:1,roughness:0.3,price:'+$500'} }
    }
};

async function init() {
    const shouldDelay = window.innerWidth < 1400 || navigator.connection?.effectiveType === '2g' || navigator.connection?.saveData;
    if (shouldDelay) {
        await new Promise(resolve => setTimeout(resolve, 700));
    }

    if (!isWebGLSupported()) { const fb = document.querySelector('.no-webgl-fallback'); if (fb) fb.style.display = 'flex'; hideLoader(); return; }
    setProgress(10);
    const canvas = F('watch-canvas'); if (!canvas) return;

    // Check battery status for tier detection
    let batteryLow = false;
    try { const b = await navigator.getBattery?.(); if (b) batteryLow = !b.charging && b.level < 0.2; } catch (e) {}
    // Check for stored downgrade hint from previous session
    let storedTier = null;
    try { const s = sessionStorage.getItem('chronos_tier'); if (['reduced','minimal'].includes(s)) storedTier = s; } catch (e) {}
    const tier = storedTier || detectPerformanceTier(batteryLow); setProgress(20);
    let { renderer, scene, camera, composer } = createScene(canvas, tier); setProgress(35);

    // -- WebGL context loss handler --
    let contextLost = false;
    canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        contextLost = true;
        console.warn('[watch] WebGL context lost');
        toast('3D rendering paused. Waiting for context restore...', true);
    });
    canvas.addEventListener('webglcontextrestored', () => {
        contextLost = false;
        console.log('[watch] WebGL context restored');
        toast('3D rendering restored.');
        // Re-create scene after context restore
        try {
            const newScene = createScene(canvas, tier);
            renderer = newScene.renderer;
            scene = newScene.scene;
            camera = newScene.camera;
            composer = newScene.composer;
        } catch (err) {
            console.error('[watch] Failed to restore context:', err);
        }
    });

    // -- Load first model fast, show immediately, preload rest --
    let currentModel = null;
    let currentKey = 'invicta';
    const allModels = {};

    try {
        const result = await loadFirstModel(p => setProgress(35 + p * 0.35));
        if (result?.first) {
            currentModel = result.first;
            scene.add(currentModel);
            currentModel.visible = true;
            allModels.invicta = currentModel;
            // Preload golden + roman in background
            result.preload.then(() => {
                for (const key of ['golden', 'roman']) {
                    const m = getCachedModel(key);
                    if (m && !allModels[key]) {
                        scene.add(m);
                        m.visible = false;
                        allModels[key] = m;
                    }
                }
            });
            setProgress(80);
        }
    } catch { currentModel = null; }

    if (!currentModel) {
        setProgress(50);
        currentModel = buildWatchModel(tier);
        scene.add(currentModel);
        allModels.golden = currentModel;
    }
    setProgress(75);

    const hover = initHover(canvas);
    window._currentModel = currentModel;
    initSwatches(currentModel);
    updateSwatches(currentKey);
    // Sync hero section price above Enquire Now on load
    const _hp = document.querySelector('[data-animate="hero-price"]');
    const _hpSrc = document.getElementById('model-hero-price');
    if (_hp && _hpSrc) _hp.textContent = _hpSrc.textContent;
    const reduced = prefersReducedMotion();
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    // -- Model switching with lazy load + disposal --
    let switching = false;
    document.querySelectorAll('.model-switcher')[2]?.style.setProperty('border-color', '#c9a96e');

    document.querySelectorAll('.model-switcher').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (switching) return;
            const key = btn.dataset.model;
            if (key === currentKey || switching) return;

            switching = true;

            try {
                // Lazy load if not cached
                let newModel = allModels[key] || getCachedModel(key);
                if (newModel && !allModels[key]) {
                    // From preload cache — add to scene now
                    scene.add(newModel);
                    newModel.visible = false;
                    allModels[key] = newModel;
                }
                if (!newModel) {
                    toast(`Loading ${key} model...`);
                    newModel = await lazyLoadModel(key);
                    if (newModel) {
                        scene.add(newModel);
                        newModel.visible = false;
                        allModels[key] = newModel;
                    }
                }

                if (!newModel) {
                    newModel = buildWatchModel(tier);
                    scene.add(newModel);
                    newModel.visible = false;
                    allModels[key] = newModel;
                }

                // Fade out old model
                const oldModel = currentModel;
                if (oldModel && !reduced) {
                    await new Promise(resolve => {
                        gsap.to({}, {
                            duration: 0.6,
                            onUpdate: function() {
                                const progress = this.progress();
                                oldModel.traverse(c => {
                                    if (c.isMesh) {
                                        c.material.transparent = true;
                                        c.material.opacity = 1 - progress;
                                    }
                                });
                            },
                            onComplete: resolve,
                        });
                    })
                    oldModel.visible = false;
                    // Reset opacity
                    oldModel.traverse(c => {
                        if (c.isMesh) { c.material.opacity = 1; c.material.transparent = false; }
                    });
                } else {
                    oldModel.visible = false;
                }

                // Show new model with fade in
                newModel.visible = true;
                if (!reduced) {
                    newModel.traverse(c => { if (c.isMesh) { c.material.transparent = true; c.material.opacity = 0; } });
                    gsap.to({}, {
                        duration: 0.8,
                        onUpdate: function() {
                            const progress = this.progress();
                            newModel.traverse(c => {
                                if (c.isMesh) c.material.opacity = progress;
                            });
                        },
                        onComplete: () => {
                            newModel.traverse(c => {
                                if (c.isMesh) { c.material.transparent = false; c.material.opacity = 1; }
                            });
                        },
                    });
                }

                currentModel = newModel;
                currentKey = key;
                window._currentModel = newModel;
                initSwatches(newModel);
                updateSwatches(key);

                // Limit GPU memory: keep current + previous + first only, dispose the rest
                const keep = new Set([currentModel, oldModel, allModels['golden'] || allModels['invicta']]);
                Object.entries(allModels).forEach(([k, m]) => {
                    if (m && !keep.has(m) && m !== currentModel) {
                        scene.remove(m);
                        disposeModel(m);
                        delete allModels[k];
                    }
                });

                // Update hero section
                const _heroImg = document.getElementById('model-hero-img');
                const _heroName = document.getElementById('model-hero-name');
                const _heroPrice = document.getElementById('model-hero-price');
                const _heroDesc = document.getElementById('model-hero-desc');
                if (_heroImg) {
                    const _base = window.WATCH_CONFIG?.assetBaseUrl || '';
                    const _next = `${_base}/images/models/${key}.webp`;
                    _heroImg.style.opacity = '0';
                    _heroImg.style.transform = 'scale(1.05)';
                    const _pre = new Image();
                    _pre.onload = () => {
                        _heroImg.src = _next;
                        _heroImg.style.opacity = '';
                        _heroImg.style.transform = '';
                    };
                    _pre.onerror = () => {
                        _heroImg.src = _next;
                        _heroImg.style.opacity = '';
                        _heroImg.style.transform = '';
                    };
                    _pre.src = _next;
                }
                if (_heroName) {
                    const _names = { invicta:'Invicta Sport', golden:'Golden Watch', roman:'Luxury Roman', 'golden-pure':'Golden Pure', 'apple-ultra':'Apple Ultra', hilfiger:'Hilfiger', 'roger-dubuis':'Roger Dubuis', 'smart-kw19':'Smart KW19', 'blue-watch':'Blue Watch' };
                    _heroName.textContent = _names[key] || key;
                }
                if (_heroPrice) {
                    const _prices = { invicta:'$28,500', golden:'$32,000', roman:'$24,800', 'golden-pure':'$35,000', 'apple-ultra':'$2,499', hilfiger:'$1,899', 'roger-dubuis':'$48,000', 'smart-kw19':'$699', 'blue-watch':'$3,200' };
                    _heroPrice.textContent = _prices[key] || '';
                }
                // Also update hero section price above Enquire Now button
                const _heroPriceTop = document.querySelector('[data-animate="hero-price"]');
                if (_heroPriceTop && _heroPrice) _heroPriceTop.textContent = _heroPrice.textContent;
                if (_heroDesc) {
                    const _descs = { invicta:'Precision engineering meets bold design in our signature sports collection.', golden:'A timeless statement in 18-karat gold, hand-finished for a lifetime of elegance.', roman:'Classical Roman numerals meet modern Swiss craftsmanship on a sunburst dial.', 'golden-pure':'Pure gold, pure refinement — minimalist luxury with a luminous champagne dial.', 'apple-ultra':'Where cutting-edge technology meets luxury aesthetics — built for the modern icon.', hilfiger:'American heritage infused with European precision — a bold take on classic design.', 'roger-dubuis':'Inspired by Lamborghini — skeletonised movement and avant-garde architecture.', 'smart-kw19':'The future of wearable luxury — smart features in a timeless mechanical form.', 'blue-watch':'Deep ocean blue meets premium materials — a diver-inspired icon reimagined.' };
                    _heroDesc.textContent = _descs[key] || '';
                }

                // Sync CTA price with model base
                const _ctaPrice = document.getElementById('cta-price');
                if (_ctaPrice && _heroPrice) _ctaPrice.textContent = _heroPrice.textContent;

                // Analytics: track model switch
                if (window.Analytics) {
                    window.Analytics.track('model_switch', { model: key });
                }
            } finally {
                switching = false;
            }

            document.querySelectorAll('.model-switcher').forEach(b => { b.style.borderColor = 'transparent'; b.style.color = ''; b.dataset.active = 'false'; });
            btn.style.borderColor = '#c9a96e'; btn.style.color = '#c9a96e'; btn.dataset.active = 'true';
            updateIndicator(key);
        });
    });

    // -- Model carousel auto-advance + prev/next + indicator --
    const MODEL_ORDER = ['golden', 'roman', 'invicta', 'golden-pure', 'apple-ultra', 'hilfiger', 'roger-dubuis', 'smart-kw19', 'blue-watch'];
    function getBtnByKey(k) { return document.querySelector(`.model-switcher[data-model="${k}"]`); }

    function advanceModel() {
        if (switching) return;
        const idx = MODEL_ORDER.indexOf(currentKey);
        getBtnByKey(MODEL_ORDER[(idx + 1) % MODEL_ORDER.length])?.click();
    }
    function prevModel() {
        if (switching) return;
        const idx = MODEL_ORDER.indexOf(currentKey);
        getBtnByKey(MODEL_ORDER[(idx - 1 + MODEL_ORDER.length) % MODEL_ORDER.length])?.click();
    }

    function updateIndicator(k) {
        const b = getBtnByKey(k), ind = document.getElementById('model-indicator'), tc = document.querySelector('.tab-container');
        if (!b || !ind || !tc) return;
        const br = b.getBoundingClientRect(), tr = tc.getBoundingClientRect();
        ind.style.width = br.width + 'px';
        ind.style.transform = 'translateX(' + (br.left - tr.left + tc.scrollLeft) + 'px)';
        b.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
    }

    document.querySelector('.carousel-prev')?.addEventListener('click', () => { prevModel(); });
    document.querySelector('.carousel-next')?.addEventListener('click', () => { advanceModel(); });

    let autoTimer = null;
    const isMobile = window.innerWidth < 768;
    function startAutoSwitch() {
        stopAutoSwitch();
        if (isMobile) {
            console.log('[watch] Mobile — auto-advance disabled');
            return;
        }
        autoTimer = setInterval(() => { if (window.__modelScrollProgress > 0.05 || switching) return; advanceModel(); }, 20000);
    }
    function stopAutoSwitch() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

    updateIndicator(currentKey);
    startAutoSwitch();

    // -- Exploded view + section reveals + hero entrance --
    const explodedSection = document.querySelector('[data-section="exploded"]');
    const timeline = setupScrollTimeline(camera, currentModel);

    // -- Content reveal via ScrollTrigger --
    const contentDiv = document.getElementById('content-reveal');
    if (contentDiv && !reduced) {
        ScrollTrigger.create({
            trigger: contentDiv,
            start: 'top 80%',
            onEnter: () => {
                if (contentDiv.dataset.revealed) return;
                contentDiv.dataset.revealed = 'true';
                contentDiv.style.pointerEvents = 'auto';
                gsap.to(contentDiv, {
                    opacity: 1, duration: 1.2, ease: 'power3.out',
                    onStart: () => {
                        const items = contentDiv.querySelectorAll(':scope > section');
                        gsap.fromTo(items,
                            { opacity: 0, y: 100, scale: 0.92 },
                            { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power3.out', stagger: 0.35, delay: 0.3 }
                        );
                    }
                });
            },
            onLeaveBack: () => {
                contentDiv.dataset.revealed = '';
                contentDiv.style.pointerEvents = 'none';
                gsap.to(contentDiv, { opacity: 0, duration: 0.6, ease: 'power2.out' });
            },
        });
    }

    await new Promise(r => setTimeout(r, 350)); setProgress(100); await new Promise(r => setTimeout(r, 450));
    hideLoader(); initForm(); logRendererInfo(renderer);

    // Track 3D scene loaded
    if (window.Analytics) window.Analytics.track('3d_scene_loaded', { tier });

    // -- Scroll progress --
    window.__modelScrollProgress = 0;
    if (explodedSection) {
        ScrollTrigger.create({
            trigger: explodedSection, start: 'top bottom', end: 'bottom top', scrub: true,
            onUpdate: self => { window.__modelScrollProgress = Math.max(0, Math.min(1, self.progress)); },
            onLeave: () => { window.__modelScrollProgress = 1; },
            onLeaveBack: () => { window.__modelScrollProgress = 0; },
        });
    }

    // -- FPS Monitor (auto-downgrade on poor performance) --
    const fpsMon = createFPSMonitor((nextTier) => {
        toast(`Performance mode: ${nextTier}`, false);
        console.warn(`[chronos] Downgraded to ${nextTier} due to low FPS`);
    });
    fpsMon.setTier(tier);

    // -- RENDER LOOP --
    const vis = createVisibilityController();
    const SHOWCASE_END = 0.65;
    const FADE_END = 0.72;

    let cameraLookAt = new Vector3(0, 0, 0);
    let smoothP = 0; // smoothed scroll progress
    let lastLabelUpdate = 0;

    function updateLabels() {
        const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
        const tgts = {
            'label-crystal': currentModel.getObjectByName('crystal'), 'label-dial': currentModel.getObjectByName('dial'),
            'label-hands': currentModel.getObjectByName('secondHandPivot'), 'label-case': currentModel.getObjectByName('case'),
            'label-movement': currentModel.getObjectByName('rotor'), 'label-strap': currentModel.getObjectByName('strapUpper'),
        };
        Object.entries(tgts).forEach(([id, obj]) => {
            const el = document.getElementById(id);
            if (!el || !obj) return;
            const wp = new Vector3(); obj.getWorldPosition(wp); wp.y += 0.5;
            const sp = wp.clone().project(camera);
            el.style.left = ((sp.x * 0.5 + 0.5) * w) + 'px';
            el.style.top = ((-sp.y * 0.5 + 0.5) * h) + 'px';
        });
    }

    function animate(dt) {
        // Skip rendering if WebGL context is lost
        if (contextLost) return;

        // Record frame time for FPS monitor
        if (typeof performance !== 'undefined') fpsMon.record(performance.now());

        const raw = window.__modelScrollProgress || 0;
        const spd = Math.min(dt * 60, 1);
        smoothP += (raw - smoothP) * Math.min(1, 0.07 * spd);
        const p = smoothP;

        const animModel = currentModel;

        // -- PHASE 1: Showcase --
        if (p < SHOWCASE_END) {
            const t = Math.min(1, p / SHOWCASE_END);
            const lerp = 1 - Math.pow(0.001, spd * 0.005);

            if (p < 0.1) {
                const swayY = Math.sin(Date.now() * 0.00015) * 0.6;
                const targetRY = hover.targetRY * 0.6 + swayY;
                const targetRX = hover.targetRX * 0.35;
                animModel.rotation.y += (targetRY - animModel.rotation.y) * 0.015;
                animModel.rotation.x += (targetRX - animModel.rotation.x) * 0.015;
            } else {
                if (!hover.hovering) animModel.rotation.y += 0.008 * spd;
                const scrollY = t * Math.PI * 2;
                const scrollX = Math.sin(t * Math.PI) * 0.12;
                animModel.rotation.y += (scrollY + hover.targetRY * 0.3 - animModel.rotation.y) * lerp;
                animModel.rotation.x += (scrollX + hover.targetRX * 0.3 - animModel.rotation.x) * lerp;
            }

            const curvePoint = posCurve.getPointAt(t);
            const lookPoint = lookCurve.getPointAt(t);
            const cameraLerp = t > 0.85 ? 0.04 : 1 - Math.pow(0.001, spd * 0.003);
            const lookLerp = t > 0.85 ? 0.04 : 1 - Math.pow(0.001, spd * 0.003);
            camera.position.lerp(curvePoint, cameraLerp);
            cameraLookAt.lerp(lookPoint, lookLerp);
            camera.lookAt(cameraLookAt);

            animModel.visible = true;
            animModel.traverse(c => { if (c.isMesh) { c.material.opacity = 1; c.material.transparent = false; } });
            const Y_OFFSETS = { golden: 0.8, hilfiger: -1.0, 'smart-kw19': -1.2, 'blue-watch': -0.15, 'roger-dubuis': -0.3, 'golden-pure': -0.4 };
            animModel.position.y = Y_OFFSETS[currentKey] || 0;

            updateHands(animModel);
            const rotor = animModel.getObjectByName('rotor');
            if (rotor) rotor.rotation.z += dt * 4;
            const now = performance.now();
            if (!lastLabelUpdate || now - lastLabelUpdate > (tier === 'minimal' ? 250 : 150)) {
                updateLabels();
                lastLabelUpdate = now;
            }
        }

        // -- PHASE 2: Fade out --
        else if (p < FADE_END) {
            const fade = 1 - (p - SHOWCASE_END) / (FADE_END - SHOWCASE_END);
            currentModel.visible = true;
            currentModel.traverse(c => { if (c.isMesh) { c.material.transparent = true; c.material.opacity = fade; } });
            // Continue all motion during fade-out, scaled by fade so it smoothly decelerates
            if (!hover.hovering) currentModel.rotation.y += 0.003 * spd * fade;
            updateHands(currentModel);
            const rotor = currentModel.getObjectByName('rotor');
            if (rotor) rotor.rotation.z += dt * 4 * fade;
            camera.position.lerp(posCurve.getPointAt(1), 0.04);
            cameraLookAt.lerp(lookCurve.getPointAt(1), 0.04);
            camera.lookAt(cameraLookAt);
            const now = performance.now();
            if (!lastLabelUpdate || now - lastLabelUpdate > (tier === 'minimal' ? 250 : 150)) {
                updateLabels();
                lastLabelUpdate = now;
            }
        }

        // -- PHASE 3: Content --
        else {
            currentModel.visible = false;
            camera.position.lerp(posCurve.getPointAt(1), 0.04);
            cameraLookAt.lerp(lookCurve.getPointAt(1), 0.04);
            camera.lookAt(cameraLookAt);
        }

        // -- Render --
        if (composer) composer.render();
        else renderer.render(scene, camera);
    }
    vis.bind(animate);

    // -- Resize --
    let rt;
    window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(tier === 'minimal' ? 1 : tier === 'reduced' ? 1 : Math.min(window.devicePixelRatio, 2));
            if (composer) composer.setSize(window.innerWidth, window.innerHeight);
        }, 200);
    });

    // -- Cleanup --
    window.addEventListener('beforeunload', () => {
        vis.destroy();
        // Dispose all models
        Object.values(allModels).forEach(m => { if (m) disposeModel(m); });
        renderer.dispose();
        if (composer) composer.dispose();
    });
}

init().catch(e => { console.error('[watch]', e); hideLoader(); });

