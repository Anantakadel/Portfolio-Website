// Basic environment mock
global.window = { pageYOffset: 0 };
global.document = {
  documentElement: { scrollTop: 0 },
  querySelector: () => ({ style: { transform: '' } })
};

// Mock requestAnimationFrame for Node.js
let pendingFrame = null;
global.requestAnimationFrame = (cb) => {
  if (!pendingFrame) {
    pendingFrame = cb;
    // Simulate immediate frame resolution for benchmark
    process.nextTick(() => {
      const callback = pendingFrame;
      pendingFrame = null;
      if (callback) callback();
    });
  }
};

function runBenchmark(name, setupFn) {
  return new Promise((resolve) => {
    // Reset state
    let lastScrollTop = 0;
    const navbar = document.querySelector(".navbar");

    // Get handler from setup
    const handler = setupFn(navbar, lastScrollTop);

    const iterations = 500000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      global.window.pageYOffset = (i % 200); // Simulate scrolling up and down
      handler();

      // We don't trigger requestAnimationFrame synchronously in the loop
      // to simulate the browser firing scroll events faster than frames
    }

    // Make sure we resolve any pending frames before stopping the clock
    setTimeout(() => {
      const end = performance.now();
      console.log(`${name}: ${(end - start).toFixed(2)}ms`);
      resolve(end - start);
    }, 10);
  });
}

async function run() {
  console.log("Running scroll event benchmarks...");

  // 1. Original Unthrottled
  const timeUnthrottled = await runBenchmark("Unthrottled", (navbar, lastScrollTop) => {
    return () => {
      const scrollTop = global.window.pageYOffset || global.document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };
  });

  // 2. Throttled with rAF
  const timeThrottled = await runBenchmark("Throttled (rAF)", (navbar, lastScrollTop) => {
    let ticking = false;
    return () => {
      if (!ticking) {
        global.requestAnimationFrame(() => {
          const scrollTop = global.window.pageYOffset || global.document.documentElement.scrollTop;

          if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = "translateY(-100%)";
          } else {
            navbar.style.transform = "translateY(0)";
          }

          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
          ticking = false;
        });
        ticking = true;
      }
    };
  });

  console.log(`\nImprovement: ${((timeUnthrottled - timeThrottled) / timeUnthrottled * 100).toFixed(2)}% faster`);
}

run();
