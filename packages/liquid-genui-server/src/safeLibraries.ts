export interface LibraryConfig {
  name: string;
  src: string;
}

export interface CategoryLibraries {
  category: string;
  libs: LibraryConfig[];
}

export const DEFAULT_SAFE_LIBRARIES: CategoryLibraries[] = [
  {
    category: 'styles',
    libs: [
      {
        name: 'tailwind',
        src: '<script src="https://unpkg.com/@tailwindcss/browser@4"></script>'
      }
    ],
  },
  {
    category: 'charts',
    libs: [
      {
        name: 'chart.js',
        src: '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
      }
    ]
  },
  {
    category: 'icons',
    libs: [
      {
        name: 'FontAwesome',
        src: '(vía CDN estándar) o Heroicons / Lucide vía SVG online'
      }
    ]
  },
  {
    category: 'general-animations',
    libs: [
      {
        name: 'gsap',
        src: '<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>'
      },
      {
        name: 'anime.js',
        src: '<script src="https://cdn.jsdelivr.net/npm/animejs"></script>'
      },
      {
        name: 'web-animations-js',
        src: '<script src="https://cdn.jsdelivr.net/npm/web-animations-js"></script>'
      }
    ]
  },
  {
    category: 'scroll-animations',
    libs: [
      {
        name: 'aos',
        src: '<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css"> y JS: <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>'
      },
      {
        name: 'scrollmagic',
        src: '<script src="https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.8/ScrollMagic.min.js"></script>'
      },
      {
        name: 'motionscroll',
        src: '<script src="https://cdn.jsdelivr.net/gh/louisho5/MotionScroll@latest/motionscroll.min.js"></script>'
      }
    ]
  },
  {
    category: 'json-animations',
    libs: [
      {
        name: 'lottie-web',
        src: '<script src="https://cdn.jsdelivr.net/npm/lottie-web"></script>'
      }
    ]
  },
  {
    category: '3d-scenes',
    libs: [
      {
        name: 'three.js',
        src: '<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>'
      }
    ]
  },
  {
    category: 'drag-drop-gestures',
    libs: [
      {
        name: 'interact.js',
        src: '<script src="https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js"></script>'
      },
      {
        name: 'sortablejs',
        src: '<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>'
      }
    ]
  },
  {
    category: 'sliders-carousels',
    libs: [
      {
        name: 'swiper',
        src: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css" /> y JS: <script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>'
      }
    ]
  },
  {
    category: 'tooltips-popovers',
    libs: [
      {
        name: 'tippy.js',
        src: '<script src="https://cdn.jsdelivr.net/npm/tippy.js@6/dist/tippy-bundle.umd.min.js"></script>'
      }
    ]
  },
  {
    category: 'typing-effects',
    libs: [
      {
        name: 'typed.js',
        src: '<script src="https://unpkg.com/typed.js@3.0.0/dist/typed.umd.js"></script>'
      }, {
        name: 'highlight.js',
        src: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"> y <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>, para compatibilidad con JS: <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js"></script> y para ts: <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js"></script>'
      }
    ]
  },
  {
    category: 'general-utilities',
    libs: [
      {
        name: 'lodash',
        src: '<script src="https://cdn.jsdelivr.net/npm/lodash"></script>'
      },
      {
        name: 'day.js',
        src: '<script src="https://cdn.jsdelivr.net/npm/dayjs"></script>'
      }
    ]
  }
];
