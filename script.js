// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    setupStarsCanvas();
    setupSimpsonSilhouette();
    setupPlayer();
    startShootingStars();
});

let canvas, ctx, stars = [];
let animationFrameId;
let canvasWidth, canvasHeight;

function setupStarsCanvas() {
    // Crear elemento canvas
    canvas = document.createElement('canvas');
    canvas.id = 'stars-canvas';
    
    // Estilo del canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-2';
    
    // Reemplazar el contenedor de estrellas con el canvas
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        starsContainer.parentNode.replaceChild(canvas, starsContainer);
    } else {
        document.body.appendChild(canvas);
    }
    
    // Obtener contexto 2D para dibujar
    ctx = canvas.getContext('2d');
    
    // Configurar tamaño del canvas para que coincida con la ventana
    resizeCanvas();
    
    // Escuchar eventos de cambio de tamaño con debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            if (window.innerWidth >= 768) { // Recrear estrellas solo en pantallas grandes
                createStars();
            }
        }, 300); // Ajustar el tiempo de espera para reducir carga
    });
    
    // Crear estrellas y empezar la animación
    createStars();
    animate();
    
    // Crear nebulosas (efectos de fondo)
    createNebulas();
}

// Ajustar el tamaño del canvas al tamaño de la ventana
function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    
    // Configurar el tamaño real del canvas (importante para evitar pixelado)
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

// Crear estrellas con propiedades aleatorias - con aspecto más realista
function createStars() {
    stars = []; // Limpiar estrellas existentes

    // Reducir densidad en dispositivos móviles
    const densityFactor = window.innerWidth < 768 ? 0.3 : 1; // Menos estrellas en móviles
    const starCount = Math.floor(canvasWidth * canvasHeight / 1800 * 2 * densityFactor);
    
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const sizeRand = Math.random();
        const size = sizeRand < 0.7 ? Math.random() * 1.0 + 0.3 : 
                     sizeRand < 0.95 ? Math.random() * 1.5 + 1.0 : 
                     Math.random() * 2.0 + 1.5;
        const colorRand = Math.random();
        const color = colorRand < 0.65 ? `rgb(${getRandomRGB(220, 35)}, ${getRandomRGB(200, 20)}, ${getRandomRGB(180, 20)})` :
                     colorRand < 0.85 ? `rgb(${getRandomRGB(220, 35)}, ${getRandomRGB(200, 20)}, ${getRandomRGB(160, 40)})` :
                     colorRand < 0.95 ? `rgb(${getRandomRGB(220, 35)}, ${getRandomRGB(130, 40)}, ${getRandomRGB(100, 30)})` :
                     `rgb(255, 255, 255)`;
        const minOpacity = 0.3 + Math.random() * 0.3;
        const maxOpacity = minOpacity + Math.random() * 0.4;
        const twinkleSpeed = Math.random() * 0.02 + 0.005;
        const offset = Math.random() * Math.PI * 2;

        stars.push({
            x, y, size, color, minOpacity, maxOpacity, twinkleSpeed, offset,
            twinkleValue: offset, glow: size * (Math.random() * 2 + 1)
        });
    }
}

// Crear nebulosas en el fondo
function createNebulas() {
    const nebulaContainer = document.getElementById('galaxy');
    if (!nebulaContainer) return;

    // Limpiar cualquier nebulosa existente
    while (nebulaContainer.firstChild) {
        nebulaContainer.removeChild(nebulaContainer.firstChild);
    }

    const nebulaCount = window.innerWidth < 768 ? 2 : 8; // Menos nebulosas en móviles
    for (let i = 0; i < nebulaCount; i++) {
        const nebula = document.createElement('div');
        nebula.className = 'nebula';
        nebula.style.position = 'absolute';

        const width = Math.random() * 400 + 200;
        const height = Math.random() * 300 + 150;
        nebula.style.width = `${width}px`;
        nebula.style.height = `${height}px`;

        nebula.style.top = `${Math.random() * 80}%`;
        nebula.style.left = `${Math.random() * 80}%`;
        nebula.style.background = `radial-gradient(ellipse at center, rgba(${getRandomRGB(50, 50)}, 0) 0%, rgba(${getRandomRGB(50, 50)}, 0.05) 50%)`;
        nebula.style.borderRadius = '50%';
        nebula.style.filter = 'blur(30px)';
        nebula.style.zIndex = '-1';

        nebulaContainer.appendChild(nebula);
    }
}

// Generar un valor aleatorio para RGB
function getRandomRGB(base, range) {
    return base + Math.floor(Math.random() * range);
}

// Animar las estrellas
function animate() {
    setTimeout(() => {
        animationFrameId = requestAnimationFrame(animate);
        // Lógica de animación aquí
    }, 1000 / 30); // Reducir a 30 FPS
}