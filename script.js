const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Runner = Matter.Runner;
const Events = Matter.Events;

const engine = Engine.create();
const world = engine.world;

// Canvas setup
const mainCanvas = document.querySelector('#world');
const overlayCanvas = document.querySelector('#overlay');
const ctx = overlayCanvas.getContext('2d');

// Sync canvas size
function resizeCanvases() {
  mainCanvas.width = window.innerWidth;
  mainCanvas.height = window.innerHeight;
  overlayCanvas.width = window.innerWidth;
  overlayCanvas.height = window.innerHeight;
}
resizeCanvases();
window.addEventListener('resize', resizeCanvases);

// Matter renderer
const render = Render.create({
  canvas: mainCanvas,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "#f0f0f0"
  }
});

Render.run(render);

const numImages = 5;
const woodImages = [];
let imagesLoaded = 0;

for (let i = 1; i <= numImages; i++) {
  const img = new Image();
  img.src = `images/wood${i}.png`;
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === numImages) {
      Events.on(engine, 'afterUpdate', drawBlocks);
      const runner = Runner.create();
      Runner.run(runner, engine);
    }
  };
  woodImages.push(img);
}

const blockWidth = 250;
const blockHeight = 130;
const blocks = [];
let blocksCreated = false;

const floor = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });
const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight * 2, { isStatic: true });
const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight * 2, { isStatic: true });

World.add(world, [floor, leftWall, rightWall]);

// Create blocks on first mouse move
window.addEventListener('mousemove', () => {
  if (blocksCreated) return;
  blocksCreated = true;

const blockCount = 5;
  for (let i = 0; i < blockCount; i++) {
    const block = Bodies.rectangle(
      Math.random() * (window.innerWidth - blockWidth),
      -200 - i * 120,
      blockWidth,
      blockHeight,
      {
        restitution: 0.4,
        render: { visible: false }
      }
    );
    block.imageIndex = i % numImages;
    blocks.push(block);
    World.add(world, block);
  }
});

function drawBlocks() {
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  blocks.forEach(block => {
    const { x, y } = block.position;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(block.angle);

    // Draw wood image as the block
    const img = woodImages[block.imageIndex];
    if (img.complete) {
      ctx.drawImage(img, -blockWidth / 2, -blockHeight / 2, blockWidth, blockHeight);
    }

    ctx.restore();
  });
}