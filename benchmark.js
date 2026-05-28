const { performance } = require('perf_hooks');

// Mock DOM
let classAdded = false;
const header = {
    classList: {
        add: () => { classAdded = true; },
        remove: () => { classAdded = false; }
    }
};
let window = { scrollY: 0 };

// Mock requestAnimationFrame
let frameCallbacks = [];
const requestAnimationFrame = (cb) => {
    frameCallbacks.push(cb);
};
const triggerFrames = () => {
    const callbacks = frameCallbacks;
    frameCallbacks = [];
    callbacks.forEach(cb => cb());
};

// Original
let originalExecutions = 0;
function runOriginal() {
    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
        window.scrollY = i % 100;
        // event listener
        originalExecutions++;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        if (i % 1000 === 0) triggerFrames(); // simulate frame once every 1000 events
    }
    triggerFrames();
    const end = performance.now();
    return end - start;
}

// Optimized
let optimizedExecutions = 0;
let ticking = false;
function runOptimized() {
    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
        window.scrollY = i % 100;
        // event listener
        if (!ticking) {
            requestAnimationFrame(() => {
                optimizedExecutions++;
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
        if (i % 1000 === 0) triggerFrames(); // simulate frame
    }
    triggerFrames();
    const end = performance.now();
    return end - start;
}

const origTime = runOriginal();
const optTime = runOptimized();

console.log(`Original Time: ${origTime.toFixed(2)}ms, DOM operations/callbacks: ${originalExecutions}`);
console.log(`Optimized Time: ${optTime.toFixed(2)}ms, DOM operations/callbacks: ${optimizedExecutions}`);
console.log(`Improvement: DOM operations reduced by ${((originalExecutions - optimizedExecutions) / originalExecutions * 100).toFixed(2)}%`);
