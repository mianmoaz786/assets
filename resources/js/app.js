import './bootstrap';

import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swal from 'sweetalert2';

window.Alpine = Alpine;
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
Alpine.plugin(collapse);
window.Swal = Swal;
Alpine.start();

gsap.registerPlugin(ScrollTrigger);

gsap.ticker.lagSmoothing(0);

/* -- Custom cursor (transform-based, composited) -- */
const cursorDot = document.createElement('div');
const cursorRing = document.createElement('div');
Object.assign(cursorDot.style, {
    position: 'fixed', top: 0, left: 0, width: '6px', height: '6px',
    background: '#c9a96e', borderRadius: '50%', pointerEvents: 'none',
    zIndex: 10000, transform: 'translate3d(-100px, -100px, 0)', transition: 'opacity .3s',
    willChange: 'transform',
});
Object.assign(cursorRing.style, {
    position: 'fixed', top: 0, left: 0, width: '34px', height: '34px',
    border: '1px solid rgba(201,169,110,0.5)', borderRadius: '50%', pointerEvents: 'none',
    zIndex: 9999, transform: 'translate3d(-100px, -100px, 0)', transition: 'width .25s, height .25s, border-color .25s, opacity .3s',
    willChange: 'transform',
});

if (!window.matchMedia('(pointer: coarse)').matches) {
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
    });
    const ring = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        cursorDot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        cursorRing.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        requestAnimationFrame(ring);
    };
    ring();
    const grow = () => { cursorRing.style.width = '56px'; cursorRing.style.height = '56px'; cursorRing.style.borderColor = 'rgba(201,169,110,0.9)'; };
    const shrink = () => { cursorRing.style.width = '34px'; cursorRing.style.height = '34px'; cursorRing.style.borderColor = 'rgba(201,169,110,0.5)'; };
    document.querySelectorAll('a, button, [data-magnetic], .model-switcher, input, textarea, [role="button"]')
        .forEach(el => { el.addEventListener('mouseenter', grow); el.addEventListener('mouseleave', shrink); });
    document.addEventListener('mouseleave', () => { cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0'; });
}

/* -- Magnetic buttons -- */
if (!window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        const strength = 0.35;
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
    });
}

/* -- Marquee -- */
document.querySelectorAll('[data-marquee]').forEach(el => {
    const speed = parseFloat(el.dataset.marquee) || 25;
    if (!el.dataset.cloned) {
        el.innerHTML += el.innerHTML;
        el.dataset.cloned = '1';
    }
    gsap.to(el, {
        xPercent: -50,
        repeat: -1,
        duration: speed,
        ease: 'none',
    });
});

/* -- Reveal + stagger sections -- */
document.querySelectorAll('[data-reveal]').forEach(sec => {
    const targets = sec.querySelectorAll('.card, .features-grid, .specs-strip, [data-stagger] > *, [data-marquee]');
    const els = targets.length ? targets : [sec];
    gsap.fromTo(els, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: sec, start: 'top 80%', end: 'top 30%', toggleActions: 'play none none reverse' },
    });
});

document.querySelectorAll('[data-stagger]').forEach(sec => {
    gsap.fromTo(sec.children, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: sec, start: 'top 85%', toggleActions: 'play none none reverse' },
    });
});



/* -- Horizontal gallery -- */
const gallery = document.querySelector('[data-horizontal-gallery]');
if (gallery) {
    const track = gallery.querySelector('[data-horizontal-track]') || gallery;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: gallery, start: 'top top', end: () => '+=' + distance(), scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
    });
}

/* -- Flash message ? toast -- */
Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 4000, timerProgressBar: true, background: '#11100d', color: '#f0ece4', iconColor: '#c9a96e', didOpen: t => t.addEventListener('mouseenter', () => Swal.stopTimer()) }).bindClickHandler('data-swal-toast');

document.addEventListener('DOMContentLoaded', () => {
    const flash = window.__flashToast;
    if (flash) {
        Swal.fire({ icon: 'success', title: flash, toast: true, position: 'top-end', showConfirmButton: false, timer: 4000, timerProgressBar: true, background: '#11100d', color: '#f0ece4', iconColor: '#c9a96e' });
        delete window.__flashToast;
    }
});
document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count) || 0;
    const formatted = num => num >= 1000 ? (num/1000).toFixed(1) + 'k' : num.toString();
    const proxy = { val: 0 };
    gsap.to(proxy, {
        val: target,
        duration: 1.4,
        ease: 'power2.out',
        snap: { val: 1 },
        onUpdate: () => { el.textContent = formatted(Math.round(proxy.val)); },
        scrollTrigger: { trigger: '[data-section="specs"]', start: 'top 70%', toggleActions: 'play none none none' }
    });
});

