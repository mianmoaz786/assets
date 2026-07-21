<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    @php
        $m = json_decode(file_get_contents(public_path('build/manifest.json')), true);
        $css = $m['resources/css/app.css']['file'] ?? null;
        $jsA = $m['resources/js/app.js']['file'] ?? null;
        $jsW = $m['resources/js/watch-showcase.js']['file'] ?? null;
        $jsM = $m['resources/js/landing-misc.js']['file'] ?? null;
        $a = 'https://cdn.jsdelivr.net/gh/mianmoaz786/assets@d587f8c';
    @endphp
    <title>{{ $config['brand'] }} {{ $config['model'] }} — {{ $config['tagline'] ?? 'Precision Redefined' }}</title>
    <meta name="description" content="{{ $config['description'] ?? $config['model'] . ' by ' . $config['brand'] . '. Precision redefined. Swiss-made luxury timepiece.' }}">
    <meta name="keywords" content="luxury watch, {{ $config['brand'] }}, {{ $config['model'] }}, Swiss made, 18K gold, sapphire crystal, horology, bespoke timepiece, hand-assembled watch">
    <meta name="author" content="{{ $config['brand'] }}">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#050505">
    <meta name="format-detection" content="telephone=no">

    <meta property="og:type" content="product">
    <meta property="og:title" content="{{ $config['brand'] }} {{ $config['model'] }} — {{ $config['tagline'] ?? 'Precision Redefined' }}">
    <meta property="og:description" content="{{ $config['description'] }}">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:site_name" content="{{ $config['brand'] }}">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="{{ $a }}/images/og-image.svg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/svg+xml">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $config['brand'] }} {{ $config['model'] }}">
    <meta name="twitter:description" content="{{ $config['description'] }}">
    <meta name="twitter:image" content="{{ $a }}/images/og-image.svg">

    <link rel="canonical" href="{{ url('/') }}">
    <link rel="icon" type="image/svg+xml" href="{{ $a }}/favicon.svg">
    <link rel="alternate icon" href="{{ $a }}/favicon.ico">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="{{ $a }}/favicon.svg">
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="preload" href="{{ $a }}/images/models/invicta.webp" as="image" fetchpriority="high" crossorigin>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "{{ url('/') }}#organization",
                "name": "{{ $config['brand'] }}",
                "url": "{{ url('/') }}",
                "logo": {
                    "@type": "ImageObject",
                    "url": "{{ $a }}/images/og-image.svg",
                    "width": 1200,
                    "height": 630
                },
                "description": "{{ $config['description'] }}"
            },
            {
                "@type": "WebSite",
                "@id": "{{ url('/') }}#website",
                "url": "{{ url('/') }}",
                "name": "{{ $config['brand'] }} {{ $config['model'] }}",
                "publisher": { "@id": "{{ url('/') }}#organization" }
            },
            {
                "@type": "Product",
                "@id": "{{ url('/') }}#product",
                "name": "{{ $config['brand'] }} {{ $config['model'] }}",
                "description": "{{ $config['description'] }}",
                "image": "{{ $a }}/images/og-image.svg",
                "brand": {
                    "@type": "Brand",
                    "name": "{{ $config['brand'] }}"
                },
                "offers": {
                    "@type": "Offer",
                    "price": "28500",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/PreOrder",
                    "seller": {
                        "@type": "Organization",
                        "@id": "{{ url('/') }}#organization"
                    }
                }
            },
            {
                "@type": "FAQPage",
                "@id": "{{ url('/') }}#faq",
                "mainEntity": [
                    {"@type":"Question","name":"What is the delivery time?","acceptedAnswer":{"@type":"Answer","text":"Each CHRONOS timepiece is assembled to order. Current lead time is 6–8 weeks from configuration confirmation. Express delivery is available upon request."}},
                    {"@type":"Question","name":"Can I customize the materials?","acceptedAnswer":{"@type":"Answer","text":"Yes — choose from 18K rose gold, forest green ceramic, or stainless steel cases, paired with green leather, vulcanized rubber, or gold bracelet straps."}},
                    {"@type":"Question","name":"What warranty do you offer?","acceptedAnswer":{"@type":"Answer","text":"Every CHRONOS watch comes with a comprehensive 5-year international warranty covering manufacturing defects, movement accuracy, and water resistance."}},
                    {"@type":"Question","name":"Is international shipping available?","acceptedAnswer":{"@type":"Answer","text":"We ship worldwide via insured express courier. Duties and taxes are included for most destinations."}},
                    {"@type":"Question","name":"Can I return or exchange?","acceptedAnswer":{"@type":"Answer","text":"We offer a 30-day return policy on unworn watches. Each return is inspected by our atelier before full refund."}},
                    {"@type":"Question","name":"How often should I service the movement?","acceptedAnswer":{"@type":"Answer","text":"We recommend a full service every 3–5 years. Our aftercare program includes complimentary inspections at CHRONOS boutiques globally."}}
                ]
            }
        ]
    }
    </script>

    <script>window.WATCH_CONFIG = @json($config); window.WATCH_CONFIG.assetBaseUrl = '{{ $a }}';</script>
    <link rel="preload" href="{{ $a }}/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high">
    <link rel="preload" href="{{ $a }}/fonts/playfair-variable.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high">
    @if($jsW)<link rel="modulepreload" href="{{ $a }}/build/{{ $jsW }}" crossorigin>@endif
    @if($css)<link rel="stylesheet" href="{{ $a }}/build/{{ $css }}">@endif
    @if($jsA)<script type="module" src="{{ $a }}/build/{{ $jsA }}" defer></script>@endif
    <script>window.addEventListener('load',function(){setTimeout(function(){import('{{ $a }}/build/{{ $jsW }}').catch(function(e){console.error('3D init failed:',e)})},300)})</script>

    @if(config('sentry.dsn'))
    <script src="https://browser.sentry-cdn.com/8.x/bundle.min.js" crossorigin="anonymous" defer></script>
    @endif

    <style>
        @font-face { font-family:'Inter'; font-style:normal; font-weight:300 600; font-display:optional; src:url('{{ $a }}/fonts/inter-variable.woff2') format('woff2-variations'); }
        @font-face { font-family:'Playfair Display'; font-style:normal; font-weight:400 700; font-display:optional; src:url('{{ $a }}/fonts/playfair-variable.woff2') format('woff2-variations'); }
        [x-cloak] { display: none !important; }
        .fixed { position: fixed !important; }
        .absolute { position: absolute !important; }
        html { overflow-x: hidden; }
        html, body { background-color: #050505; color: #f0ece4; margin: 0; padding: 0; font-family:'Inter',ui-sans-serif,system-ui,sans-serif; }
        /* Critical above-fold styles (renders before full CSS loads) */
        .font-serif { font-family: Georgia, ui-serif, serif; }
        .hero-section { position: relative; height: 100vh !important; overflow: hidden !important; display: flex; flex-direction: column; align-items: center; justify-content: center; contain: strict; }
        @media (min-width: 768px) { .hero-section { flex-direction: row; justify-content: space-between; } }
        /* Prevent layout shift: pre-set hero column widths/margins to match Tailwind values */
        .hero-left, .hero-right { width: 100%; margin-top: 0; margin-bottom: 0; padding-bottom: 0; }
        @media (min-width: 768px) {
            .hero-left, .hero-right { width: 33.3333%; }
        }
        #watch-canvas { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; cursor: grab; }
        #scroll-progress { will-change: transform; }
        [data-animate] { will-change: transform, opacity; }
        [data-animate="hero-brand"] { opacity: 1; transform: translateY(0) scale(1); }
        [data-animate="hero-tagline"] { opacity: 1; transform: translateY(0); }
        [data-animate="hero-price"] { opacity: 0; transform: translateY(15px); }
        [data-animate="scroll-cue"] { opacity: 0; }
        *:focus-visible { outline: 2px solid #c9a96e; outline-offset: 2px; border-radius: 2px; }
        @media (prefers-reduced-motion: reduce) { [data-animate] { opacity: 1 !important; transform: none !important; } }
        @media (prefers-reduced-motion: reduce) { #content-reveal { opacity: 1 !important; pointer-events: auto !important; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }
    </style>
</head>
<body>

<div class="fixed top-0 left-0 right-0 h-[2px] z-[10000] pointer-events-none bg-white/[0.03]">
    <div class="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-gold to-gold-hover" id="scroll-progress" style="transform:scaleX(0)"></div>
</div>

<div id="preloader" style="position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#050505;clip-path:inset(0 0 0 0)">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(201,169,110,0.05) 0%,transparent 70%);pointer-events:none"></div>
    <div style="position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10vh 10vw;">
        <svg style="width:100%;height:100%;max-width:60vmin;max-height:60vmin" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1.5"/>
            <circle cx="100" cy="100" r="88" fill="none" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="553" opacity="0.3"/>
            <circle cx="100" cy="12" r="3" fill="#c9a96e" opacity="0.3"/>
            <circle cx="188" cy="100" r="3" fill="#c9a96e" opacity="0.15"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none">
            <p id="loader-brand" style="opacity:0;transform:translateY(2rem);transition:opacity 1s ease,transform 1s ease;font-family:Georgia,Times New Roman,serif;font-size:clamp(2rem,5vw,4rem);letter-spacing:0.4em;color:#f0ece4">{{ $config['brand'] }}</p>
            <div style="margin-top:1.5rem;width:clamp(140px,30vw,220px);height:1px;background:rgba(255,255,255,0.04);overflow:hidden">
                <div id="loader-fill" style="height:100%;width:100%;transform-origin:left;transform:scaleX(0);transition:transform 0.15s linear;background:linear-gradient(to right,#c9a96e,#b89550)"></div>
            </div>
            <span id="loader-pct" style="margin-top:1rem;font-size:0.875rem;letter-spacing:0.2em;color:#7a756f;font-variant-numeric:tabular-nums;display:inline-block;min-width:5ch;text-align:center">0%</span>
        </div>
    </div>
</div>

<canvas id="watch-canvas" class="fixed inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" role="img" aria-label="Interactive 3D watch model — drag to rotate" aria-roledescription="3D object"></canvas>

<div class="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true" style="background: radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,0.65) 100%); mix-blend-mode: multiply;"></div>
<div class="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true" style="background: radial-gradient(ellipse at 50% 40%, rgba(201,169,110,0.03) 0%, transparent 60%);"></div>
<div id="canvas-poster" style="position:fixed;inset:0;z-index:2;pointer-events:none;background:#050505 url({{ $a }}/images/hero-bg.jpg) center/cover no-repeat;opacity:1;transition:opacity 0.8s ease"></div>

<div id="scroll-wrapper" class="relative z-[2] pointer-events-none *:pointer-events-auto">

    <div x-data="{ navOpen: false, scrolled: false }">

    <!-- Fixed Navbar -->
     <nav x-on:scroll.window="scrolled = window.scrollY > 80"
          class="fixed top-0 left-0 right-0 z-[10001] transition-all duration-500"
          :class="scrolled ? 'bg-[#0c0b0a]/70 backdrop-blur-2xl shadow-[0_1px_0_rgba(201,169,110,0.06)]' : 'bg-[#0c0b0a]/20 backdrop-blur-xl'"
          aria-label="Main navigation"
           style="position:fixed;top:0;left:0;width:100vw;z-index:10001">
        <div class="absolute inset-0 border-b border-white/[0.04] pointer-events-none" :class="scrolled ? 'opacity-100' : 'opacity-0'"></div>
        <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent pointer-events-none"></div>
        <div class="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent pointer-events-none"></div>
         <div class="relative w-full px-6 sm:px-8 md:px-[clamp(2rem,3vw,4rem)] py-4 md:py-5 flex items-center justify-between pointer-events-auto"
              style="display:flex;align-items:center;justify-content:space-between;width:100%">
            <div class="flex items-center gap-3">
                <a href="/" class="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] bg-gradient-to-br from-[#f0ece4] via-[#f0ece4] to-gold bg-clip-text text-transparent hover:to-gold-hover transition-all duration-300" aria-label="CHRONOS home">CHRONOS</a>
                <span class="hidden md:block w-px h-4 bg-gold/20"></span>
                <span class="hidden md:block text-[0.45rem] tracking-[0.5em] uppercase text-gold/30 font-light">Haute Horlogerie</span>
            </div>
            <div class="hidden md:flex items-center gap-1">
                <a href="#exploded-section" class="relative px-4 py-2 text-[0.6rem] tracking-[0.25em] uppercase text-[#8a857f] hover:text-[#f0ece4] transition-all duration-300 rounded-sm hover:bg-white/[0.03] group">Collection<span class="absolute bottom-1 left-4 right-4 h-px bg-gold/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span></a>
                <a href="#heritage-section" class="relative px-4 py-2 text-[0.6rem] tracking-[0.25em] uppercase text-[#8a857f] hover:text-[#f0ece4] transition-all duration-300 rounded-sm hover:bg-white/[0.03] group">Heritage<span class="absolute bottom-1 left-4 right-4 h-px bg-gold/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span></a>
                <a href="#craft-section" class="relative px-4 py-2 text-[0.6rem] tracking-[0.25em] uppercase text-[#8a857f] hover:text-[#f0ece4] transition-all duration-300 rounded-sm hover:bg-white/[0.03] group">Craft<span class="absolute bottom-1 left-4 right-4 h-px bg-gold/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span></a>
                <span class="mx-3 w-px h-5 bg-white/[0.06]"></span>
                @guest
                    <a href="{{ route('login') }}" class="px-4 py-2 text-[0.6rem] tracking-[0.25em] uppercase text-[#8a857f] hover:text-[#f0ece4] transition-all duration-300 rounded-sm hover:bg-white/[0.03]">Login</a>
                    <a href="{{ route('register') }}" class="ml-1 px-5 py-2.5 bg-gradient-to-r from-gold to-gold-hover text-[#050505] text-[0.55rem] font-semibold tracking-[0.25em] uppercase rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,169,110,0.2)] hover:scale-[1.02] active:scale-[0.98]">Sign Up</a>
                @else
                    @if(Auth::user()->is_admin)
                        <a href="{{ route('dashboard') }}" class="px-4 py-2 text-[0.6rem] tracking-[0.25em] uppercase text-gold hover:text-gold-hover transition-all duration-300 rounded-sm hover:bg-white/[0.03]">Dashboard</a>
                    @else
                        <a href="{{ route('profile.edit') }}" class="px-4 py-2 text-[0.6rem] tracking-[0.25em] uppercase text-[#8a857f] hover:text-[#f0ece4] transition-all duration-300 rounded-sm hover:bg-white/[0.03]">Profile</a>
                    @endif
                @endguest
            </div>
            <button @click="navOpen = !navOpen" class="md:hidden relative w-6 h-4 text-[#f0ece4] focus:outline-none" aria-label="Toggle navigation" :aria-expanded="navOpen">
                <span class="absolute inset-x-0 top-0 h-[1.5px] bg-current rounded-full transition-all duration-300" :class="navOpen ? 'rotate-45 top-[7px]' : ''"></span>
                <span class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-current rounded-full transition-all duration-300" :class="navOpen ? 'opacity-0' : ''"></span>
                <span class="absolute inset-x-0 bottom-0 h-[1.5px] bg-current rounded-full transition-all duration-300" :class="navOpen ? '-rotate-45 bottom-[7px]' : ''"></span>
            </button>
        </div>
    </nav>

    <div x-show="navOpen"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 bg-[#050505] md:hidden z-[55]"
         @click="navOpen = false"></div>

    <div x-show="navOpen"
         x-transition:enter="transition ease-out duration-400"
         x-transition:enter-start="opacity-0 translate-x-full"
         x-transition:enter-end="opacity-100 translate-x-0"
         x-transition:leave="transition ease-in duration-300"
         x-transition:leave-start="opacity-100 translate-x-0"
         x-transition:leave-end="opacity-0 translate-x-full"
         class="fixed top-0 right-0 bottom-0 w-72 bg-[#0a0a0a] border-l border-white/[0.04] md:hidden z-[60] shadow-2xl">
        <div class="relative flex flex-col h-full">
            <button @click="navOpen = false" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-[#8a857f] hover:text-[#f0ece4] transition-colors duration-200 focus:outline-none rounded-full hover:bg-white/[0.04]" aria-label="Close navigation">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div class="flex flex-col gap-5 px-8 pt-28 pb-8 overflow-y-auto">
                <a href="#exploded-section" class="block text-sm tracking-[0.15em] uppercase text-[#c8c2b8] hover:text-gold transition-colors duration-300 py-2 border-b border-white/[0.04]" @click="navOpen = false">Collection</a>
                <a href="#heritage-section" class="block text-sm tracking-[0.15em] uppercase text-[#c8c2b8] hover:text-gold transition-colors duration-300 py-2 border-b border-white/[0.04]" @click="navOpen = false">Heritage</a>
                <a href="#craft-section" class="block text-sm tracking-[0.15em] uppercase text-[#c8c2b8] hover:text-gold transition-colors duration-300 py-2 border-b border-white/[0.04]" @click="navOpen = false">Craft</a>
                <div class="pt-4 border-t border-white/[0.06]">
                    @guest
                        <a href="{{ route('register') }}" class="block w-full text-center px-5 py-3.5 bg-gradient-to-r from-gold to-gold-hover text-[#050505] text-sm font-semibold tracking-[0.2em] uppercase rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,169,110,0.25)] active:scale-[0.98]" @click="navOpen = false">Sign Up</a>
                        <a href="{{ route('login') }}" class="block w-full text-center mt-3 px-5 py-3 border border-white/[0.08] text-[#c8c2b8] text-xs tracking-[0.2em] uppercase rounded-lg hover:border-gold/30 hover:text-gold transition-all duration-300" @click="navOpen = false">Login</a>
                    @else
                        @if(Auth::user()->is_admin)
                            <a href="{{ route('dashboard') }}" class="block text-sm tracking-[0.15em] uppercase text-gold hover:text-gold-hover transition-colors duration-300 py-2" @click="navOpen = false">Dashboard</a>
                        @else
                            <a href="{{ route('profile.edit') }}" class="block text-sm tracking-[0.15em] uppercase text-[#c8c2b8] hover:text-gold transition-colors duration-300 py-2" @click="navOpen = false">Profile</a>
                        @endif
                        <a href="{{ route('logout') }}" class="block text-sm tracking-[0.15em] uppercase text-[#8a857f] hover:text-white transition-colors duration-300 py-2" @click="navOpen = false" onclick="event.preventDefault();document.getElementById('logout-form').submit();">Logout</a>
                        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none">@csrf</form>
                    @endguest
                </div>
            </div>
        </div>
    </div>

    </div>

    <section class="hero-section relative overflow-hidden flex flex-col md:flex-row items-center justify-center md:justify-between" aria-label="Hero showcase"
              style="position:relative;height:100vh !important;min-height:100vh !important;max-height:100vh !important;overflow:hidden !important;contain:strict">
        <div class="hero-left relative z-10 w-full md:w-1/3 px-6 sm:px-8 md:px-[clamp(2rem,3vw,4rem)] text-center md:text-left pointer-events-none mt-auto md:mt-0 pb-0 md:pb-0" style="margin-top:0;margin-bottom:0;padding-bottom:0">
            <span class="block text-[0.5rem] tracking-[0.45em] uppercase text-gold/50 mb-2 pointer-events-none" data-animate="hero-brand">CHRONOS</span>
            <h1 data-animate="hero-brand" class="font-serif text-[clamp(1.6rem,4vw,3rem)] font-semibold leading-none tracking-[0.02em] bg-gradient-to-br from-[#f0ece4] via-[#f0ece4] to-gold bg-clip-text text-transparent pointer-events-none whitespace-nowrap">{{ $config['model'] }}</h1>
            <p data-animate="hero-tagline" class="mt-2 text-[clamp(0.55rem,0.8vw,0.75rem)] font-light tracking-[0.35em] uppercase text-[#8a857f] pointer-events-none">{{ $config['tagline'] ?? 'Precision Redefined' }}</p>
        </div>
            <div class="hero-right relative z-10 w-full md:w-1/3 px-6 sm:px-8 md:px-[clamp(2rem,3vw,4rem)] text-center md:text-right pointer-events-none mt-4 md:mt-0 md:ml-auto mb-auto md:mb-0" style="margin-top:0;margin-bottom:0">
                <p data-animate="hero-price" class="font-serif text-[clamp(1rem,1.5vw,1.3rem)] text-gold pointer-events-none whitespace-nowrap">{{ $config['price'] }}</p>
                <div class="mt-4 pointer-events-auto" data-animate="hero-cta">
                    <a href="#cta" data-magnetic class="inline-block px-6 py-3 bg-gold text-[#050505] text-[0.65rem] font-semibold tracking-[0.2em] uppercase rounded-sm transition-transform duration-300 hover:bg-gold-hover hover:shadow-[0_8px_32px_rgba(201,169,110,0.3)]" aria-label="Enquire about {{ $config['model'] }}">Enquire Now</a>
                </div>
            </div>
            <div class="absolute bottom-16 sm:bottom-20 left-1/2 z-20 pointer-events-auto carousel-container w-full max-w-[98vw] sm:max-w-none px-1 sm:px-0" data-animate="hero-cta"
                 style="position:absolute;bottom:5rem;left:50%;z-index:20">
                <span class="block text-center text-[0.35rem] sm:text-[0.4rem] tracking-[0.35em] uppercase text-[#8a857f] mb-1 sm:mb-1.5">Select Variant</span>
                <div class="flex items-center gap-1 sm:gap-2 bg-[#0c0b0a]/60 backdrop-blur-xl border border-white/[0.04] rounded-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 transition-all duration-700 carousel-strip w-full sm:w-fit mx-auto max-w-full">
                    <button class="carousel-btn carousel-prev flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-white/[0.08] text-[#8a857f] hover:text-gold hover:border-gold/40 transition-all duration-200" aria-label="Previous model">
                        <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <div class="relative flex items-center gap-1.5 sm:gap-4 md:gap-6 lg:gap-8 px-1 sm:px-2 overflow-x-auto overflow-y-hidden tab-container scroll-smooth snap-x snap-mandatory no-scrollbar" x-ref="tabContainer">
                        <div id="model-indicator" class="absolute bottom-0 h-[2px] bg-gold rounded-full pointer-events-none" style="left:0;width:0"></div>
                        <button data-model="golden" class="model-switcher flex-shrink-0 snap-center text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] tracking-[0.2em] uppercase text-[#8a857f] whitespace-nowrap py-0.5 sm:py-1 hover:text-[#f0ece4]" aria-label="Golden Watch">Golden</button>
                        <button data-model="roman" class="model-switcher flex-shrink-0 snap-center text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] tracking-[0.2em] uppercase text-[#8a857f] whitespace-nowrap py-0.5 sm:py-1 hover:text-[#f0ece4]" aria-label="Roman Watch">Roman</button>
                        <button data-model="invicta" class="model-switcher flex-shrink-0 snap-center text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] tracking-[0.2em] uppercase text-[#8a857f] whitespace-nowrap py-0.5 sm:py-1 hover:text-[#f0ece4]" aria-label="Sport Watch">Sport</button>
                        <button data-model="golden-pure" class="model-switcher flex-shrink-0 snap-center text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] tracking-[0.2em] uppercase text-[#8a857f] whitespace-nowrap py-0.5 sm:py-1 hover:text-[#f0ece4]" aria-label="Golden Pure">Pure</button>
                        <button data-model="apple-ultra" class="model-switcher flex-shrink-0 snap-center text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] tracking-[0.2em] uppercase text-[#8a857f] whitespace-nowrap py-0.5 sm:py-1 hover:text-[#f0ece4]" aria-label="Apple Ultra">Ultra</button>
                        <button data-model="hilfiger" class="model-switcher flex-shrink-0 snap-center text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] tracking-[0.2em] uppercase text-[#8a857f] whitespace-nowrap py-0.5 sm:py-1 hover:text-[#f0ece4]" aria-label="Hilfiger">Hilfiger</button>
                        <button data-model="roger-dubuis" class="model-switcher flex-shrink-0 snap-center text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] tracking-[0.2em] uppercase text-[#8a857f] whitespace-nowrap py-0.5 sm:py-1 hover:text-[#f0ece4]" aria-label="Roger Dubuis">Dubuis</button>
                        <button data-model="smart-kw19" class="model-switcher flex-shrink-0 snap-center text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] tracking-[0.2em] uppercase text-[#8a857f] whitespace-nowrap py-0.5 sm:py-1 hover:text-[#f0ece4]" aria-label="Smart KW19">KW19</button>
                        <button data-model="blue-watch" class="model-switcher flex-shrink-0 snap-center text-[0.35rem] sm:text-[0.4rem] md:text-[0.45rem] tracking-[0.2em] uppercase text-[#8a857f] whitespace-nowrap py-0.5 sm:py-1 hover:text-[#f0ece4]" aria-label="Blue Watch">Blue</button>
                    </div>
                    <button class="carousel-btn carousel-next flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-white/[0.08] text-[#8a857f] hover:text-gold hover:border-gold/40 transition-all duration-200" aria-label="Next model">
                        <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-gold/30 to-transparent pointer-events-none z-10 hidden md:block"
             style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10"></div>
        <div data-animate="scroll-cue" class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10" aria-hidden="true"
             style="position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:10">
            <span class="text-[0.5rem] tracking-[0.4em] uppercase text-[#8a857f]">Scroll to explore</span>
            <svg class="w-3 h-3 text-[#8a857f] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
        </div>
    </section>

    <section data-section="exploded" id="exploded-section" class="min-h-[120vh] md:min-h-[200vh] flex items-center justify-center px-6 md:px-8" aria-label="Watch exploded view">
        <div data-ride="up" class="text-center max-w-lg">
            <span class="text-[0.6rem] tracking-[0.4em] uppercase text-gold">The Watch</span>
            <h2 class="mt-4 font-serif text-[clamp(1.6rem,4vw,3.2rem)] font-medium">Every Angle Considered</h2>
            <p class="mt-4 text-sm text-[#8a857f]">Scroll to explore the watch from every perspective.</p>
        </div>
    </section>

    <section class="min-h-[30vh] flex items-center justify-center px-6 md:px-8" aria-label="Transition section">
        <div data-ride="up" class="text-center">
            <span class="text-[0.5rem] tracking-[0.5em] uppercase text-gold">The Craft Behind It</span>
        </div>
    </section>

    <div id="content-reveal">

    <section class="relative h-[70vh] md:h-[85vh] overflow-hidden bg-[#050505]" id="model-hero-section" aria-label="Featured model">
        <img id="model-hero-img" class="absolute inset-0 w-full h-full object-cover opacity-60 md:opacity-70 transition-[opacity,transform] duration-700" src="{{ $a }}/images/models/invicta.webp" alt="" width="1920" height="1080" fetchpriority="high" decoding="async" sizes="(max-width: 768px) 100vw, 50vw">
        <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        <div class="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 text-center w-full px-6">
            <span class="text-[0.5rem] tracking-[0.4em] uppercase text-gold">Featured Timepiece</span>
            <h2 id="model-hero-name" class="mt-3 font-serif text-[clamp(1.6rem,4.5vw,3.2rem)] leading-tight">Invicta Sport</h2>
            <p id="model-hero-price" class="mt-1 text-lg font-semibold text-gold">$28,500</p>
            <p id="model-hero-desc" class="mt-2 text-sm text-[#8a857f] max-w-md mx-auto">Precision engineering meets bold design in our signature sports collection.</p>
        </div>
    </section>

    <section id="heritage-section" class="py-20 md:py-28 px-6 md:px-8 bg-gradient-to-b from-[#050505] via-[#080705] to-[#050505]" aria-label="Brand heritage">
        <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.04] bg-gradient-to-br from-[#1a140e] to-[#0a0a0a] shadow-2xl">
                <div class="absolute inset-0 opacity-[0.08]" aria-hidden="true">
                    <svg class="w-full h-full" viewBox="0 0 600 450" fill="none">
                        <circle cx="300" cy="225" r="180" stroke="#c9a96e" stroke-width="0.5"/>
                        <circle cx="300" cy="225" r="120" stroke="#c9a96e" stroke-width="0.3"/>
                        <circle cx="300" cy="225" r="60" stroke="#c9a96e" stroke-width="0.2"/>
                        <line x1="0" y1="225" x2="600" y2="225" stroke="#c9a96e" stroke-width="0.2" stroke-dasharray="4 4"/>
                        <line x1="300" y1="0" x2="300" y2="450" stroke="#c9a96e" stroke-width="0.2" stroke-dasharray="4 4"/>
                        <text x="300" y="230" text-anchor="middle" fill="#c9a96e" font-size="10" font-family="serif" opacity="0.3">EST. 1924</text>
                    </svg>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                <div class="absolute bottom-6 left-6 z-20">
                    <span class="block text-[0.5rem] tracking-[0.4em] uppercase text-gold/60">Since 1924</span>
                </div>
            </div>
            <div data-stagger class="space-y-6">
                <span class="text-[0.55rem] tracking-[0.4em] uppercase text-gold">Heritage</span>
                <h2 class="font-serif text-[clamp(1.6rem,4vw,3rem)] leading-tight">A Century of Precision</h2>
                <p class="text-sm text-[#8a857f] leading-relaxed">Founded in the Swiss Jura valley in 1924, CHRONOS has spent a century perfecting the art of mechanical watchmaking. Every timepiece is assembled by hand in our Vallée de Joux atelier, where master watchmakers pass techniques from one generation to the next.</p>
                <p class="text-sm text-[#8a857f] leading-relaxed">In an era of mass production, we remain committed to doing things the old way — one watch at a time.</p>
                <div class="flex gap-8 sm:gap-12 pt-4">
                    <div>
                        <span class="block font-serif text-[clamp(1.2rem,3vw,2rem)] text-gold">100+</span>
                        <span class="text-[0.5rem] tracking-[0.3em] uppercase text-[#8a857f]">Years of Heritage</span>
                    </div>
                    <div>
                        <span class="block font-serif text-[clamp(1.2rem,3vw,2rem)] text-gold">12k+</span>
                        <span class="text-[0.5rem] tracking-[0.3em] uppercase text-[#8a857f]">Timepieces Crafted</span>
                    </div>
                    <div>
                        <span class="block font-serif text-[clamp(1.2rem,3vw,2rem)] text-gold">28</span>
                        <span class="text-[0.5rem] tracking-[0.3em] uppercase text-[#8a857f]">Master Artisans</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="craft-section" class="py-16 md:py-20 px-6 md:px-8 bg-[#050505]" aria-label="Craftsmanship process">
        <div class="max-w-5xl mx-auto text-center">
            <span class="text-[0.55rem] tracking-[0.4em] uppercase text-gold mb-3">Craftsmanship</span>
            <h2 class="font-serif text-[clamp(1.3rem,3vw,2.2rem)] mb-12 md:mb-16">The Art of Watchmaking</h2>
            <div data-stagger class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left">
                @foreach([
                    ['step' => '01', 'title' => 'Design & Engineering', 'desc' => 'Every movement is conceived on paper, refined through CAD, and prototyped over months before a single part is machined.', 'color' => 'from-amber-900/40 to-transparent', 'icon' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.5 14.5M14.25 3.104c.251.023.501.05.75.082M19.5 14.5l-6.75 6.75M19.5 14.5l-4.785 4.785M5 14.5l6.75 6.75M5 14.5l4.785-4.785"/>'],
                    ['step' => '02', 'title' => 'Hand Assembly', 'desc' => 'Our master watchmakers assemble each calibre by hand, lubricating jewels, adjusting escapements, and regulating precision to chronometer standards.', 'color' => 'from-gold/10 to-transparent', 'icon' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.676 4.5 3.518 4.5 4.5v14.25c0 .983.807 1.825 1.907 1.928 1.835.212 3.701.322 5.593.322 1.892 0 3.758-.11 5.593-.322 1.1-.103 1.907-.945 1.907-1.928V4.5c0-.983-.807-1.825-1.907-1.928A24.328 24.328 0 0012 2.25z"/>'],
                    ['step' => '03', 'title' => 'Testing & Regulation', 'desc' => 'Each watch undergoes 16 days of precision testing across five positions, ensuring an accuracy of -2 to +4 seconds per day — COSC-certified.', 'color' => 'from-blue-900/30 to-transparent', 'icon' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>'],
                ] as $craft)
                    <div class="group p-6 sm:p-8 rounded-2xl border border-white/[0.04] bg-gradient-to-br {{ $craft['color'] }} transition-all duration-500 hover:border-gold/20 hover:bg-gold/[0.02]">
                        <span class="block text-[0.5rem] tracking-[0.4em] uppercase text-gold/40 mb-4">{{ $craft['step'] }}</span>
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gold/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">{!! $craft['icon'] !!}</svg>
                        <h3 class="font-serif text-sm sm:text-base mb-2">{{ $craft['title'] }}</h3>
                        <p class="text-xs text-[#8a857f] leading-relaxed">{{ $craft['desc'] }}</p>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section class="relative h-screen w-full overflow-hidden bg-[#050505]">
        <video class="absolute inset-0 w-full h-full object-cover" muted loop playsinline preload="none" poster="{{ $a }}/images/hero-bg.jpg" src="{{ $a }}/videos/craft.mp4" width="1920" height="1080" style="aspect-ratio:1920/1080" data-lazy-video>Your browser does not support video.</video>
    </section>

    <section class="py-16 md:py-20 px-6 md:px-8" aria-label="Features">
        <div class="max-w-5xl mx-auto">
            <span class="block text-center text-[0.55rem] tracking-[0.4em] uppercase text-gold mb-3">Details</span>
            <h2 class="text-center font-serif text-[clamp(1.3rem,3vw,2.2rem)] mb-10 md:mb-12">Built to Last, Inside Out</h2>
            <div data-stagger class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                @php
                    $features = [
                        ['icon'=>'⌚','title'=>'Sapphire Crystal','desc'=>'Domed anti-reflective sapphire','img'=>'sapphire.jpg'],
                        ['icon'=>'⚙️','title'=>'In-House Calibre','desc'=>'Self-winding, 38h reserve','img'=>'calibre.jpg'],
                        ['icon'=>'💧','title'=>'100m Water Resistance','desc'=>'Screw-down crown and caseback','img'=>'water-resist.jpg'],
                        ['icon'=>'✨','title'=>'Applied Indices','desc'=>'Hand-set gold-plated markers','img'=>'indices.jpg'],
                        ['icon'=>'🔧','title'=>'Swiss Made','desc'=>'Assembled in Swiss atelier','img'=>'swiss-made.jpg'],
                        ['icon'=>'🛡️','title'=>'5-Year Warranty','desc'=>'International service network','img'=>'warranty.jpg'],
                    ];
                @endphp
                @foreach($features as $f)
                    <div class="group p-5 md:p-6 text-center border border-white/[0.04] rounded-xl bg-white/[0.01] transition-transform duration-500 hover:border-gold/20 hover:bg-gold/[0.03] hover:-translate-y-1">
                        <div class="w-full h-24 sm:h-28 md:h-32 mb-4 rounded-lg overflow-hidden border border-white/[0.04] bg-coal">
                            <img src="{{ $a }}/images/{{ $f['img'] }}" alt="{{ $f['title'] }} illustration" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" decoding="async" width="400" height="300">
                        </div>
                        <h3 class="font-serif text-sm mb-1">{{ $f['title'] }}</h3>
                        <p class="text-xs text-[#8a857f] leading-relaxed">{{ $f['desc'] }}</p>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section class="py-8 md:py-12 px-6 md:px-8 border-y border-white/[0.03]" data-section="specs" aria-label="Technical specifications">
        <div class="flex justify-center gap-6 sm:gap-8 md:gap-16 flex-wrap">
            @foreach([['41','Diameter (mm)'],['100','Water (m)'],['38','Reserve (h)'],['28800','Frequency (vph)']] as $spec)
                <div class="text-center">
                    <div class="font-serif text-[clamp(1.3rem,3vw,2.5rem)] text-gold" data-count="{{ $spec[0] }}">{{ $spec[0] === '28800' ? '28.8k' : $spec[0] }}</div>
                    <div class="mt-1 text-[0.5rem] tracking-[0.3em] uppercase text-[#8a857f]">{{ $spec[1] }}</div>
                </div>
            @endforeach
        </div>
    </section>

    <section class="py-10 md:py-12 px-6 md:px-8" x-data="{ tab: 'case' }" aria-label="Material configuration">
        <div class="text-center max-w-2xl mx-auto">
            <span class="text-[0.55rem] tracking-[0.4em] uppercase text-gold">Materials</span>
            <h2 class="mt-3 font-serif text-[clamp(1.3rem,3vw,2.2rem)]">Crafted to Order</h2>
            <p class="mt-2 text-xs sm:text-sm text-[#8a857f]">Choose your case and strap configuration</p>
            <div class="flex justify-center gap-6 mt-8 mb-8" role="tablist" aria-label="Material type tabs">
                <button @click="tab = 'case'" :class="tab === 'case' ? 'text-gold border-gold' : 'text-[#8a857f] border-transparent'" class="text-xs tracking-[0.25em] uppercase pb-2 border-b transition-transform duration-300" role="tab" :aria-selected="tab === 'case'" aria-controls="case-options" id="case-tab">Case</button>
                <button @click="tab = 'strap'" :class="tab === 'strap' ? 'text-gold border-gold' : 'text-[#8a857f] border-transparent'" class="text-xs tracking-[0.25em] uppercase pb-2 border-b transition-transform duration-300" role="tab" :aria-selected="tab === 'strap'" aria-controls="strap-options" id="strap-tab">Strap</button>
            </div>
            <div x-show="tab === 'case'" class="flex justify-center gap-3 sm:gap-4 flex-wrap" x-transition role="tabpanel" id="case-options" aria-labelledby="case-tab">
                @foreach($config['materials']['case'] as $key => $mat)
                    <button data-swatch="case" data-key="{{ $key }}" data-color="{{ $mat['color'] }}" data-metalness="{{ $mat['metalness'] ?? 0 }}" data-roughness="{{ $mat['roughness'] ?? 0.5 }}" data-price="{{ $mat['price'] }}" style="background:{{ $mat['color'] }}" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold {{ $loop->first ? 'border-gold shadow-[0_0_0_3px_rgba(201,169,110,0.18)]' : 'border-transparent' }}" title="{{ $mat['label'] }}" aria-label="{{ $mat['label'] }} case"></button>
                @endforeach
            </div>
            <div x-show="tab === 'strap'" class="flex justify-center gap-3 sm:gap-4 flex-wrap" x-transition role="tabpanel" id="strap-options" aria-labelledby="strap-tab">
                @foreach($config['materials']['strap'] as $key => $mat)
                    <button data-swatch="strap" data-key="{{ $key }}" data-color="{{ $mat['color'] }}" data-metalness="{{ $mat['metalness'] ?? 0 }}" data-roughness="{{ $mat['roughness'] ?? 0.5 }}" data-price="{{ $mat['price'] }}" style="background:{{ $mat['color'] }}" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold {{ $loop->first ? 'border-gold shadow-[0_0_0_3px_rgba(201,169,110,0.18)]' : 'border-transparent' }}" title="{{ $mat['label'] }}" aria-label="{{ $mat['label'] }} strap"></button>
                @endforeach
            </div>
            <p class="mt-6 font-serif text-xl sm:text-2xl tracking-[0.04em]" id="price-display" data-base="{{ $config['price'] }}" aria-live="polite">{{ $config['price'] }}</p>
            <div class="flex justify-center gap-3 sm:gap-4 mt-6 flex-wrap" aria-label="Key specifications">
                @foreach(['41mm','100m WR','38h Reserve','Sapphire'] as $s)
                    <span class="text-[0.5rem] tracking-[0.2em] text-[#8a857f] uppercase px-2 sm:px-3 py-1.5 border border-white/[0.05] rounded-full">{{ $s }}</span>
                @endforeach
            </div>
        </div>
    </section>

    <section class="py-12 md:py-16 px-6 md:px-8 bg-[#0a0a0a]" aria-label="Watch gallery">
        <div class="max-w-6xl mx-auto">
            <span class="block text-center text-[0.55rem] tracking-[0.4em] uppercase text-gold mb-8 md:mb-10">Gallery</span>
            <div data-stagger class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                @foreach(['case','dial','movement','strap'] as $g)
                    <div class="aspect-square rounded-lg overflow-hidden border border-white/[0.04] bg-coal group cursor-pointer transition-transform duration-500 hover:border-gold/20 hover:-translate-y-1">
                        <img src="{{ $a }}/images/gallery-{{ $g }}.jpg" alt="{{ $config['brand'] }} {{ ucfirst($g) }} Detail" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115" loading="lazy" decoding="async" width="400" height="400">
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <div id="lightbox" class="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm hidden items-center justify-center" role="dialog" aria-modal="true" aria-label="Image viewer">
        <button id="lightbox-close" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors z-10" aria-label="Close viewer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <img id="lightbox-img" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" src="" alt="">
    </div>

    <section class="py-16 md:py-20 px-6 md:px-8" aria-label="Press reviews">
        <div class="max-w-5xl mx-auto">
            <span class="block text-center text-[0.55rem] tracking-[0.4em] uppercase text-gold mb-3">Reviews</span>
            <h2 class="text-center font-serif text-[clamp(1.3rem,3vw,2.2rem)] mb-3">What the Critics Say</h2>
            <p class="text-center text-xs text-[#8a857f] mb-10 md:mb-12">Praised by the world's foremost watch publications</p>
            <div data-stagger class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                @php
                    $reviews = [
                        ['quote' => 'A masterclass in restrained luxury. The CHRONOS Artisan Perpetual manages to feel both timeless and distinctly modern — a rare achievement in contemporary watchmaking.', 'source' => 'Hodinkee', 'author' => 'Jack Forster', 'rating' => 5],
                        ['quote' => 'The attention to detail is extraordinary. From the sunray-brushed dial to the hand-polished anglage on every bridge, this is a watch that rewards close study.', 'source' => 'Monochrome Watches', 'author' => 'David Bredan', 'rating' => 5],
                        ['quote' => 'At a time when many brands chase novelty for its own sake, CHRONOS has doubled down on the fundamentals — and the result is arguably their finest work in decades.', 'source' => 'Revolution', 'author' => 'Wei Koh', 'rating' => 4],
                    ];
                @endphp
                @foreach($reviews as $r)
                    <div class="p-5 md:p-6 rounded-xl border border-white/[0.04] bg-white/[0.01] transition-all duration-500 hover:border-gold/20 hover:bg-gold/[0.02]">
                        <div class="flex gap-0.5 mb-3" role="img" aria-label="{{ $r['rating'] }} out of 5 stars">
                            @for($i=0; $i<5; $i++)
                                <svg class="w-3 h-3 {{ $i < $r['rating'] ? 'text-gold' : 'text-white/[0.06]' }}" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            @endfor
                        </div>
                        <blockquote class="text-xs sm:text-sm text-[#8a857f] leading-relaxed mb-4 italic">&ldquo;{{ $r['quote'] }}&rdquo;</blockquote>
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                                <span class="text-[0.4rem] text-gold font-semibold">{{ substr($r['source'], 0, 1) }}</span>
                            </div>
                            <div>
                                <cite class="text-[0.55rem] not-italic tracking-[0.1em] text-[#f0ece4] block font-medium">{{ $r['source'] }}</cite>
                                <span class="text-[0.45rem] text-[#8a857f]">{{ $r['author'] }}</span>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section class="py-8 md:py-10 border-y border-white/[0.03] overflow-hidden" aria-label="Press mentions">
        <div data-marquee="25" class="flex gap-10 sm:gap-16 whitespace-nowrap">
            @foreach(['The Times','Horology Weekly','Wired','GQ','Esquire','Monochrome','Hodinkee','Revolution'] as $item)
                <span class="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#8a857f] font-light">{{ $item }}</span>
                <span class="text-gold/20" aria-hidden="true">&#10022;</span>
            @endforeach
        </div>
    </section>

    <section class="relative h-[70vh] md:h-screen overflow-hidden bg-coal" data-horizontal-gallery aria-label="Watch detail gallery">
        <div class="absolute inset-0 flex items-center" style="padding: 0 4vw;">
            <div class="flex gap-5 sm:gap-8" data-horizontal-track style="will-change: transform; padding-right: 4vw;">
                @php
                    function gallerySvg($id, $content) {
                        return '<svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 340 510" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">'.$content.'</svg>';
                    }
                    $galleryCards = [
                        ['label'=>'Case Detail','svg'=>gallerySvg('cg1','<defs><radialGradient id="cg1" cx="50%" cy="35%" r="70%"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="100%" stop-color="#0e0e0e"/></radialGradient></defs><rect width="340" height="510" fill="url(#cg1)"/><ellipse cx="170" cy="270" rx="100" ry="130" stroke="#c9a96e" stroke-width="1.5" opacity="0.4"/><ellipse cx="170" cy="270" rx="80" ry="105" stroke="#c9a96e" stroke-width="0.5" opacity="0.2"/><rect x="130" y="132" width="80" height="12" rx="3" fill="#c9a96e" opacity="0.15"/><rect x="130" y="396" width="80" height="12" rx="3" fill="#c9a96e" opacity="0.15"/><path d="M100 310 Q170 350 240 310" stroke="#c9a96e" stroke-width="0.5" opacity="0.15"/><path d="M100 230 Q170 190 240 230" stroke="#c9a96e" stroke-width="0.5" opacity="0.15"/><circle cx="170" cy="270" r="6" fill="#c9a96e" opacity="0.08"/><line x1="170" y1="170" x2="170" y2="190" stroke="#c9a96e" stroke-width="0.5" opacity="0.15"/><line x1="150" y1="270" x2="190" y2="270" stroke="#c9a96e" stroke-width="0.5" opacity="0.15"/>')],
                        ['label'=>'Dial Close','svg'=>gallerySvg('dg1','<defs><radialGradient id="dg1" cx="50%" cy="40%" r="65%"><stop offset="0%" stop-color="#1e1e1e"/><stop offset="100%" stop-color="#080808"/></radialGradient></defs><rect width="340" height="510" fill="url(#dg1)"/><circle cx="170" cy="255" r="115" stroke="#c9a96e" stroke-width="1" opacity="0.35"/><circle cx="170" cy="255" r="108" stroke="#c9a96e" stroke-width="0.3" opacity="0.15"/><g stroke="#c9a96e" stroke-width="0.8" opacity="0.3"><line x1="170" y1="147" x2="170" y2="160"/><line x1="170" y1="350" x2="170" y2="363"/><line x1="62" y1="255" x2="75" y2="255"/><line x1="265" y1="255" x2="278" y2="255"/><line x1="93" y1="178" x2="102" y2="187"/><line x1="238" y1="323" x2="247" y2="332"/><line x1="93" y1="332" x2="102" y2="323"/><line x1="238" y1="178" x2="247" y2="187"/></g><circle cx="170" cy="255" r="2" fill="#c9a96e" opacity="0.6"/><line x1="170" y1="255" x2="170" y2="185" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/><line x1="170" y1="255" x2="215" y2="235" stroke="#c9a96e" stroke-width="0.8" stroke-linecap="round" opacity="0.3"/><circle cx="170" cy="255" r="8" fill="none" stroke="#c9a96e" stroke-width="1" opacity="0.08"/><line x1="170" y1="128" x2="170" y2="138" stroke="#c9a96e" stroke-width="0.5" opacity="0.2"/><line x1="260" y1="255" x2="270" y2="255" stroke="#c9a96e" stroke-width="0.5" opacity="0.2"/>')],
                        ['label'=>'Movement','svg'=>gallerySvg('mg1','<defs><radialGradient id="mg1" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#222222"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient></defs><rect width="340" height="510" fill="url(#mg1)"/><g stroke="#c9a96e" opacity="0.25"><circle cx="170" cy="200" r="55" stroke-width="1.2"/><circle cx="170" cy="200" r="8" stroke-width="0.5"/><circle cx="170" cy="200" r="42" stroke-width="0.3"/><line x1="170" y1="160" x2="170" y2="180" stroke-width="3"/><line x1="150" y1="200" x2="155" y2="200" stroke-width="3"/><line x1="185" y1="200" x2="190" y2="200" stroke-width="3"/><line x1="170" y1="220" x2="170" y2="240" stroke-width="3"/><circle cx="120" cy="300" r="35" stroke-width="1"/><circle cx="120" cy="300" r="12" stroke-width="0.5"/><circle cx="120" cy="300" r="5" stroke-width="0.3"/><circle cx="220" cy="310" r="25" stroke-width="0.8"/><circle cx="220" cy="310" r="4" stroke-width="0.3"/></g><path d="M155 230 Q140 260 135 280" stroke="#c9a96e" stroke-width="0.3" opacity="0.12"/><path d="M185 230 Q200 260 205 280" stroke="#c9a96e" stroke-width="0.3" opacity="0.12"/><circle cx="170" cy="130" r="3" fill="#c9a96e" opacity="0.08"/><circle cx="170" cy="380" r="2" fill="#c9a96e" opacity="0.06"/>')],
                        ['label'=>'Crown Macro','svg'=>gallerySvg('cmg1','<defs><radialGradient id="cmg1" cx="50%" cy="30%" r="75%"><stop offset="0%" stop-color="#2a2620"/><stop offset="100%" stop-color="#0c0b0a"/></radialGradient></defs><rect width="340" height="510" fill="url(#cmg1)"/><g stroke="#c9a96e" opacity="0.35"><line x1="170" y1="410" x2="170" y2="260" stroke-width="1.5"/><rect x="130" y="230" width="80" height="50" rx="3" stroke-width="1"/><line x1="130" y1="237" x2="210" y2="237" stroke-width="0.5"/><line x1="130" y1="243" x2="210" y2="243" stroke-width="0.5"/><line x1="130" y1="249" x2="210" y2="249" stroke-width="0.5"/><line x1="130" y1="255" x2="210" y2="255" stroke-width="0.5"/><line x1="130" y1="261" x2="210" y2="261" stroke-width="0.5"/><line x1="130" y1="267" x2="210" y2="267" stroke-width="0.5"/></g><line x1="170" y1="260" x2="170" y2="230" stroke="#c9a96e" stroke-width="1" opacity="0.2"/><rect x="155" y="280" width="30" height="15" rx="2" fill="none" stroke="#c9a96e" stroke-width="0.5" opacity="0.15"/><path d="M170 295 L170 340" stroke="#c9a96e" stroke-width="0.8" opacity="0.2"/>')],
                        ['label'=>'Strap Detail','svg'=>gallerySvg('sg1','<defs><radialGradient id="sg1" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#1c1a18"/><stop offset="100%" stop-color="#0a0908"/></radialGradient><pattern id="stitch" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><line x1="10" y1="0" x2="10" y2="20" stroke="#c9a96e" stroke-width="0.3" opacity="0.2"/></pattern></defs><rect width="340" height="510" fill="url(#sg1)"/><rect x="100" y="60" width="140" height="390" rx="8" fill="url(#stitch)" stroke="#c9a96e" stroke-width="1" opacity="0.3"/><rect x="110" y="70" width="120" height="370" rx="5" stroke="#c9a96e" stroke-width="0.3" opacity="0.12"/><line x1="170" y1="60" x2="170" y2="450" stroke="#c9a96e" stroke-width="0.2" opacity="0.06"/><g stroke="#c9a96e" stroke-width="0.3" opacity="0.12"><line x1="100" y1="140" x2="240" y2="140"/><line x1="100" y1="200" x2="240" y2="200"/><line x1="100" y1="260" x2="240" y2="260"/><line x1="100" y1="320" x2="240" y2="320"/><line x1="100" y1="380" x2="240" y2="380"/></g>')],
                        ['label'=>'Rotor Spin','svg'=>gallerySvg('rg1','<defs><radialGradient id="rg1" cx="50%" cy="40%" r="65%"><stop offset="0%" stop-color="#1e1e22"/><stop offset="100%" stop-color="#080810"/></radialGradient></defs><rect width="340" height="510" fill="url(#rg1)"/><g stroke="#c9a96e" opacity="0.3" fill="none"><circle cx="170" cy="270" r="80" stroke-width="0.8"/><circle cx="170" cy="270" r="72" stroke-width="0.3"/><circle cx="170" cy="270" r="18" stroke-width="0.8"/><circle cx="170" cy="270" r="10" stroke-width="0.3"/><circle cx="170" cy="270" r="4" stroke-width="0.5"/></g><path d="M170 190 A80 80 0 0 1 170 350 A20 20 0 0 1 170 310 A60 60 0 0 0 170 230 Z" fill="#c9a96e" opacity="0.08"/><path d="M170 190 A80 80 0 0 1 245 230" stroke="#c9a96e" stroke-width="0.5" opacity="0.15"/><circle cx="170" cy="270" r="95" fill="none" stroke="#c9a96e" stroke-width="0.2" opacity="0.06"/>')],
                        ['label'=>'Dial Night','svg'=>gallerySvg('ng1','<defs><radialGradient id="ng1" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#0d1117"/><stop offset="100%" stop-color="#020408"/></radialGradient></defs><rect width="340" height="510" fill="url(#ng1)"/><circle cx="170" cy="260" r="120" stroke="#c9a96e" stroke-width="0.5" opacity="0.15"/><g fill="#c9a96e" opacity="0.35"><circle cx="170" cy="148" r="3"/><circle cx="170" cy="372" r="3"/><circle cx="58" cy="260" r="3"/><circle cx="282" cy="260" r="3"/><circle cx="88" cy="178" r="2"/><circle cx="252" cy="342" r="2"/><circle cx="252" cy="178" r="2"/><circle cx="88" cy="342" r="2"/></g><line x1="170" y1="260" x2="170" y2="195" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" opacity="0.25"/><line x1="170" y1="260" x2="200" y2="248" stroke="#c9a96e" stroke-width="0.8" stroke-linecap="round" opacity="0.2"/><circle cx="170" cy="260" r="2.5" fill="#c9a96e" opacity="0.4"/><rect x="165" y="300" width="10" height="3" rx="1" fill="#c9a96e" opacity="0.08"/>')],
                        ['label'=>'Crystal Sheen','svg'=>gallerySvg('csg1','<defs><radialGradient id="csg1" cx="40%" cy="30%" r="80%"><stop offset="0%" stop-color="#2a2f33"/><stop offset="50%" stop-color="#141618"/><stop offset="100%" stop-color="#080808"/></radialGradient><linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c9a96e" stop-opacity="0.15"/><stop offset="35%" stop-color="#c9a96e" stop-opacity="0"/><stop offset="100%" stop-color="#c9a96e" stop-opacity="0"/></linearGradient></defs><rect width="340" height="510" fill="url(#csg1)"/><ellipse cx="170" cy="260" rx="105" ry="135" stroke="#c9a96e" stroke-width="0.8" opacity="0.2"/><path d="M80 170 Q170 130 260 170 Q270 260 260 350 Q170 390 80 350 Q70 260 80 170" stroke="#c9a96e" stroke-width="0.3" opacity="0.08"/><path d="M100 180 Q170 140 240 180 Q250 250 240 330" stroke="url(#sheen)" stroke-width="2"/><path d="M130 200 Q170 170 210 200" stroke="#c9a96e" stroke-width="0.5" opacity="0.08"/><circle cx="170" cy="260" r="98" fill="none" stroke="#c9a96e" stroke-width="0.3" opacity="0.05"/>')],
                    ];
                @endphp
                @foreach($galleryCards as $card)
                    <div class="gallery-card group relative w-[220px] sm:w-[260px] md:w-[340px] shrink-0 aspect-[2/3] rounded-xl md:rounded-2xl overflow-hidden border border-white/[0.04] bg-gradient-to-br from-[#191919] to-[#0e0e0e] shadow-xl">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10"></div>
                        {!! $card['svg'] !!}
                        <div class="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6">
                            <p class="text-[0.6rem] sm:text-xs tracking-[0.2em] uppercase text-white/60">{{ $card['label'] }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
        <div class="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30" aria-hidden="true">
            <span class="text-[0.45rem] tracking-[0.5em] uppercase text-white/55">Scroll to browse</span>
        </div>
    </section>

    <section class="py-12 md:py-16 px-6 md:px-8 border-t border-white/[0.03]" aria-label="Frequently asked questions">
        <div class="max-w-2xl mx-auto">
            <span class="block text-center text-[0.55rem] tracking-[0.4em] uppercase text-gold mb-3">FAQ</span>
            <h2 class="text-center font-serif text-[clamp(1.3rem,3vw,2.2rem)] mb-10">Everything You Need to Know</h2>
            <div x-data="{ open: null }" class="space-y-2">
                @php
                    $faqs = [
                        ['q' => 'What is the delivery time?', 'a' => 'Each CHRONOS timepiece is assembled to order. Current lead time is 6–8 weeks from configuration confirmation. Express delivery is available upon request.'],
                        ['q' => 'Can I customize the materials?', 'a' => 'Yes — choose from 18K rose gold, forest green ceramic, or stainless steel cases, paired with green leather, vulcanized rubber, or gold bracelet straps. Use the Materials configurator above to explore combinations.'],
                        ['q' => 'What warranty do you offer?', 'a' => 'Every CHRONOS watch comes with a comprehensive 5-year international warranty covering manufacturing defects, movement accuracy, and water resistance.'],
                        ['q' => 'Is international shipping available?', 'a' => 'We ship worldwide via insured express courier (DHL/FedEx). Duties and taxes are included for most destinations.'],
                        ['q' => 'Can I return or exchange?', 'a' => 'We offer a 30-day return policy on unworn watches. Each return is inspected by our atelier before full refund. Custom engravings are non-refundable.'],
                        ['q' => 'How often should I service the movement?', 'a' => 'We recommend a full service every 3–5 years, depending on wear. Our aftercare program includes complimentary inspections at CHRONOS boutiques globally.'],
                    ];
                @endphp
                @foreach($faqs as $i => $f)
                    <div class="border border-white/[0.04] rounded-xl overflow-hidden bg-white/[0.01] transition-all duration-300" :class="open === {{ $i }} ? 'border-gold/30' : ''">
                        <button @click="open = open === {{ $i }} ? null : {{ $i }}" class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm text-[#f0ece4] font-medium hover:text-gold transition-colors" :aria-expanded="open === {{ $i }}" aria-controls="faq-answer-{{ $i }}">
                            <span>{{ $f['q'] }}</span>
                            <svg class="w-3 h-3 text-gold/60 shrink-0 transition-transform duration-300" :class="open === {{ $i }} ? 'rotate-45' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        </button>
                        <div x-show="open === {{ $i }}" x-collapse.duration.300ms role="region" :id="'faq-answer-{{ $i }}'">
                            <p class="px-5 pb-4 text-xs text-[#8a857f] leading-relaxed">{{ $f['a'] }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section id="cta" class="min-h-screen flex items-center justify-center px-6 md:px-8 py-12 md:py-16" aria-label="Enquire section">
        <div class="bg-[rgba(14,14,14,0.72)] backdrop-blur-[32px] rounded-2xl p-6 sm:p-8 md:p-12 max-w-lg w-full text-center transition-transform duration-500 hover:-translate-y-1 border border-white/[0.04]">
            <h2 class="font-serif text-2xl sm:text-3xl md:text-4xl">Configure Yours</h2>
            <p class="mt-3 sm:mt-4 text-xs sm:text-sm text-[#8a857f] leading-relaxed">Each {{ $config['model'] }} is assembled to order. Speak with our horological advisors to begin crafting yours.</p>
            <form id="enquiry-form" method="POST" action="{{ route('watch.enquire') }}" class="mt-5 sm:mt-6 text-left" aria-label="Enquiry form">
                @csrf
                <div id="config-summary" class="mb-4 p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                    <p class="text-[0.55rem] tracking-[0.2em] uppercase text-gold mb-2">Your Configuration</p>
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#8a857f]">
                        <span class="font-medium text-[#f0ece4]">Case:</span>
                        <span id="summary-case" class="px-2 py-1 bg-white/[0.03] border border-white/[0.06] rounded text-gold">Select in Materials</span>
                        <span class="font-medium text-[#f0ece4]">Strap:</span>
                        <span id="summary-strap" class="px-2 py-1 bg-white/[0.03] border border-white/[0.06] rounded text-gold">Select in Materials</span>
                    </div>
                    <p id="cta-price" class="mt-3 text-center font-serif text-lg sm:text-xl tracking-[0.04em] text-gold" data-base="{{ $config['price'] }}">$28,500</p>
                </div>
                <input type="text" name="name" placeholder="Your name" required class="w-full px-4 py-3 mb-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-[#f0ece4] outline-none focus:border-gold" aria-label="Your name">
                <input type="email" name="email" placeholder="Email address" required class="w-full px-4 py-3 mb-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-[#f0ece4] outline-none focus:border-gold" aria-label="Email address">
                <textarea name="message" placeholder="Your configuration details (optional)" rows="2" class="w-full px-4 py-3 mb-4 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-[#f0ece4] outline-none focus:border-gold resize-vertical" aria-label="Configuration details"></textarea>
                <input type="hidden" name="selected_case" value="">
                <input type="hidden" name="selected_strap" value="">
                <label class="flex items-center gap-2 mb-4 text-xs text-[#8a857f]">
                    <input type="checkbox" name="gdpr" required class="rounded border-white/[0.2] bg-white/[0.03] text-gold focus:ring-gold" aria-label="Agree to data storage">
                    I agree to the storage of my personal data
                </label>
                <button type="submit" data-magnetic class="w-full py-3 sm:py-4 bg-gold text-[#050505] text-xs font-semibold tracking-[0.2em] uppercase rounded-sm transition-transform duration-300 hover:bg-gold-hover hover:shadow-[0_8px_32px_rgba(201,169,110,0.3)] disabled:opacity-40">Send Enquiry</button>
                <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;" aria-hidden="true">
            </form>
        </div>
    </section>

    @php $plans = \App\Models\Subscriber::PLANS; @endphp
    <section class="py-16 md:py-24 px-6 md:px-8 border-t border-white/[0.03]" aria-label="Pricing plans">
        <div class="max-w-5xl mx-auto text-center">
            <span class="text-[0.55rem] tracking-[0.4em] uppercase text-gold">Membership</span>
            <h2 class="mt-3 font-serif text-[clamp(1.5rem,3.5vw,2.6rem)] mb-2">Choose Your Tier</h2>
            <p class="text-xs sm:text-sm text-[#8a857f] mb-8">Subscribe to the CHRONOS atelier and unlock exclusive benefits.</p>

            <form id="newsletter-form" method="POST" action="{{ route('newsletter.subscribe') }}" class="hidden">@csrf</form>

            <div class="max-w-sm mx-auto mb-10">
                <input type="email" id="plan-email" placeholder="your@email.com" required class="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-[#f0ece4] outline-none focus:border-gold text-center" aria-label="Email for subscription">
            </div>

            <div class="grid md:grid-cols-3 gap-4 md:gap-6 items-start">
                @foreach($plans as $key => $plan)
                @php $isFeatured = $key === 'gold' @endphp
                <div class="relative flex flex-col rounded-xl border text-left transition-all duration-500 hover:-translate-y-1 {{ $isFeatured ? 'border-gold/40 bg-gold/[0.03] shadow-[0_0_40px_rgba(201,169,110,0.08)] scale-[1.02] md:scale-105' : 'border-white/[0.04] bg-charcoal hover:border-white/[0.1]' }}">
                    @if($plan['badge'])
                    <span class="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[0.45rem] tracking-[0.25em] uppercase font-semibold rounded-full" style="background:{{ $plan['color'] }};color:#050505;">{{ $plan['badge'] }}</span>
                    @endif
                    <div class="p-6 md:p-8 flex flex-col gap-4 flex-1">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span class="w-3 h-3 rounded-full" style="background:{{ $plan['color'] }}"></span>
                                <h3 class="font-serif text-lg md:text-xl font-medium">{{ $plan['label'] }}</h3>
                            </div>
                            <p class="text-xs text-[#8a857f]">{{ $plan['description'] }}</p>
                        </div>

                        <div>
                            @if($plan['price'] > 0)
                                @if($plan['discount_price'])
                                <span class="text-lg md:text-2xl font-serif font-medium">{{ $plan['discount_price'] }}</span>
                                <span class="text-xs text-muted align-baseline">/mo</span>
                                <span class="ms-1.5 text-xs text-muted line-through align-baseline">${{ $plan['price'] }}</span>
                                @else
                                <span class="text-lg md:text-2xl font-serif font-medium">${{ $plan['price'] }}</span>
                                <span class="text-xs text-muted align-baseline">/mo</span>
                                @endif
                            @else
                            <span class="text-lg md:text-2xl font-serif font-medium">Free</span>
                            @endif
                        </div>

                        <ul class="space-y-2 flex-1">
                            @foreach($plan['features'] as $feat)
                            <li class="flex items-start gap-2 text-xs text-[#f0ece4]/80">
                                <svg class="w-3.5 h-3.5 mt-0.5 shrink-0" style="color:{{ $plan['color'] }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                <span>{{ $feat }}</span>
                            </li>
                            @endforeach
                        </ul>

                        <button type="button" data-plan="{{ $key }}" class="plan-subscribe w-full py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-sm transition-all duration-300 {{ $isFeatured ? 'bg-gold text-[#050505] hover:bg-gold-hover hover:shadow-[0_8px_32px_rgba(201,169,110,0.3)]' : 'border border-white/[0.1] text-[#f0ece4] hover:bg-white/[0.05] hover:border-white/[0.2]' }}">
                            {{ $plan['cta'] }}
                        </button>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <div id="mobile-cta" class="fixed bottom-0 left-0 right-0 z-[9997] md:hidden translate-y-full opacity-0 transition-[transform,opacity] duration-500 pointer-events-none" aria-hidden="true">
        <div class="px-4 py-3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent">
            <a href="#cta" class="block w-full py-3 bg-gold text-[#050505] text-xs font-semibold tracking-[0.2em] uppercase rounded-sm text-center transition-transform duration-300 active:scale-[0.98]">Enquire Now</a>
        </div>
    </div>

    <footer class="py-6 md:py-8 px-6 md:px-8 text-center border-t border-white/[0.03]" aria-label="Footer">
        <div class="max-w-6xl mx-auto">
            <p class="font-serif text-xs tracking-[0.4em] text-gold mb-4">{{ $config['brand'] }}</p>
            <div class="flex justify-center gap-6 sm:gap-8 mb-4">
                @foreach(['Instagram','Pinterest','YouTube'] as $link)
                    <span class="text-[0.5rem] tracking-[0.2em] uppercase text-[#8a857f]">{{ $link }}</span>
                @endforeach
            </div>
            <p class="text-[0.45rem] tracking-[0.2em] text-[#8a857f]">&copy; {{ date('Y') }} {{ $config['brand'] }} &mdash; All rights reserved</p>
            @auth
                @can('view admin')
                    <a href="{{ route('admin.dashboard') }}" class="block mt-3 text-[0.5rem] tracking-[0.2em] uppercase text-[#8a857f] hover:text-gold">Admin</a>
                @endcan
            @endauth
        </div>
    </footer>

    </div>
</div>

@foreach([['crystal','Sapphire Crystal','Anti-reflective coating'],['dial','Dial','Sunray brushed finish'],['hands','Hands','Dauphine, polished'],['case','Case','41mm, 316L steel'],['movement','Movement','Calibre CH-4120'],['strap','Strap','Alligator leather']] as $l)
    <div id="label-{{ $l[0] }}" class="fixed z-20 pointer-events-none opacity-0 transition-opacity duration-300" aria-hidden="true">
        <div class="w-px h-8 bg-gold absolute left-1/2 -top-8"></div>
        <div class="w-[5px] h-[5px] rounded-full bg-gold absolute left-1/2 -top-[2px] -translate-x-1/2"></div>
        <div class="absolute left-1/2 -translate-x-1/2 top-3 whitespace-nowrap text-center">
            <b class="block text-[0.55rem] tracking-[0.2em] uppercase text-[#f0ece4] font-medium">{{ $l[1] }}</b>
            <small class="text-[0.45rem] text-[#8a857f]">{{ $l[2] }}</small>
        </div>
    </div>
@endforeach

<button id="back-to-top" class="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-black/80 border border-gold/40 flex items-center justify-center opacity-0 translate-y-4 transition-[opacity,transform] duration-500 pointer-events-none hover:border-gold/70 hover:bg-black/90" aria-label="Back to top">
    <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
</button>

<div id="cookie-consent" class="fixed bottom-0 left-0 right-0 z-[9998] hidden" x-data="{ show: false }" x-init="show = !localStorage.getItem('cookie_consent'); $watch('show', v => { if (!v) localStorage.setItem('cookie_consent', '1'); });" x-show="show" x-transition role="dialog" aria-label="Cookie consent">
    <div class="bg-[#0e0e0e]/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-4">
        <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-xs text-[#8a857f] leading-relaxed">
                We use cookies and analytics to improve your experience. By continuing, you agree to our data practices.
                <a href="#" class="text-gold underline">Privacy Policy</a>
            </p>
            <button @click="show = false" class="shrink-0 px-5 py-2 bg-gold text-[#050505] text-[0.6rem] font-semibold tracking-[0.2em] uppercase rounded-sm transition-transform hover:bg-gold-hover" aria-label="Accept cookies">Accept</button>
        </div>
    </div>
</div>

<style>@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}.no-scrollbar::-webkit-scrollbar{display:none}</style>
@if($jsM)<script type="module" src="{{ $a }}/build/{{ $jsM }}" defer></script>@endif
</body>
</html>



















