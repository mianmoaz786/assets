/**
 * scroll-timeline.js � Scroll-driven camera choreography + interactions
 */
import { CatmullRomCurve3, Vector3 } from 'three';
import gsap from 'gsap';
import { getExplodedParts } from './watch-model.js';

const ScrollTrigger = window.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);

// Camera keyframes � cinematic path
const CAM = [
    { pos: [0, 0.8, 5.5],    lookAt: [0, 0, 0] },     // hero
    { pos: [2.8, 0.5, 4.2],  lookAt: [0, 0.1, 0] },   // case
    { pos: [-2.2, 0.9, 3.5], lookAt: [0, 0.15, 0] },  // dial
    { pos: [0.3, 0.3, 3.2],  lookAt: [0, 0, 0] },     // movement
    { pos: [3, 0.15, 2.8],   lookAt: [0, 0.05, 0] },  // crown
    { pos: [0, 0.5, 6.5],    lookAt: [0, 0, 0] },     // configurator
    { pos: [0.2, 0.25, 1.6], lookAt: [0, 0.1, 0] },   // macro
    { pos: [0, 0.8, 5.5],    lookAt: [0, 0, 0] },     // cta
];

const posPts = CAM.map(k => new Vector3(...k.pos));
const lookPts = CAM.map(k => new Vector3(...k.lookAt));
const posCurve = new CatmullRomCurve3(posPts, false, 'catmullrom', 0.5);
const lookCurve = new CatmullRomCurve3(lookPts, false, 'catmullrom', 0.5);

let scrollProgress = 0;
export function getScrollProgress() { return scrollProgress; }

export function setupScrollTimeline(camera, model) {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const parts = getExplodedParts();
    const ids = ['label-crystal', 'label-dial', 'label-hands', 'label-case', 'label-movement', 'label-strap'];

    // -- Scroll tracking --
    let tgt = 0, cur = 0;
    (function track() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const dh = document.documentElement.scrollHeight - window.innerHeight;
        tgt = dh > 0 ? st / dh : 0;
        cur += (tgt - cur) * 0.07;
        scrollProgress = Math.max(0, Math.min(1, cur));
        requestAnimationFrame(track);
    })();

    // -- Exploded view --
    const expl = document.querySelector('[data-section="exploded"]');
    if (expl && !reduced) {
        const pm = {
            crystal: model.getObjectByName('crystal'),
            dial: model.getObjectByName('dial'),
            hands: [model.getObjectByName('hourHandPivot'), model.getObjectByName('minuteHandPivot'), model.getObjectByName('secondHandPivot')],
            bezel: model.getObjectByName('bezel'),
            case: model.getObjectByName('case'),
            movement: model.getObjectByName('rotor'),
            strap: model.getObjectByName('strap'),
        };
        const oy = {};
        Object.entries(pm).forEach(([k, o]) => {
            if (!o) return;
            oy[k] = Array.isArray(o) ? o.map(p => p?.position.y || 0) : o.position.y;
        });

        ScrollTrigger.create({
            trigger: expl, start: 'top 60%', end: 'bottom 40%', scrub: 1,
            onUpdate: self => {
                const p = self.progress;
                Object.entries(pm).forEach(([k, o]) => {
                    if (!o) return;
                    const off = (parts[k]?.y || 0) * p;
                    if (Array.isArray(o)) o.forEach((m, i) => { if (m) m.position.y = (Array.isArray(oy[k]) ? oy[k][i] : oy[k]) + off; });
                    else o.position.y = oy[k] + off;
                });
                ids.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.toggle('visible', p > 0.08 && p < 0.92);
                });
            },
        });
    }

    // -- Label projection (batch read before write to avoid forced reflow) --
    function updateLabels(ren) {
        const w = ren.domElement.clientWidth, h = ren.domElement.clientHeight;
        const tgts = {
            'label-crystal': model.getObjectByName('crystal'),
            'label-dial': model.getObjectByName('dial'),
            'label-hands': model.getObjectByName('secondHandPivot'),
            'label-case': model.getObjectByName('case'),
            'label-movement': model.getObjectByName('rotor'),
            'label-strap': model.getObjectByName('strapUpper'),
        };
        const reads = [];
        Object.entries(tgts).forEach(([id, obj]) => {
            const el = document.getElementById(id);
            if (!el || !obj) return;
            const wp = new Vector3();
            obj.getWorldPosition(wp);
            wp.y += 0.5;
            const sp = wp.clone().project(camera);
            reads.push({ el, x: (sp.x * 0.5 + 0.5) * w, y: (-sp.y * 0.5 + 0.5) * h });
        });
        reads.forEach(({ el, x, y }) => {
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        });
    }

    // -- Camera update --
    function updateCamera() {
        if (reduced) return;
        const t = Math.max(0, Math.min(1, scrollProgress));
        camera.position.copy(posCurve.getPointAt(t));
        camera.lookAt(lookCurve.getPointAt(t));
    }

    return { updateCamera, updateLabels: r => updateLabels(r) };
}

