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
            createStars(); // Recrear estrellas al cambiar el tamaño
        }, 200); // Espera 200ms antes de ejecutar
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
    const densityFactor = window.innerWidth < 768 ? 0.5 : 1; // Menos estrellas en móviles
    const starCount = Math.floor(canvasWidth * canvasHeight / 1800 * 2 * densityFactor);
    
    // Crear estrellas normales
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        
        // Tamaños y colores variados
        let size;
        const sizeRand = Math.random();
        if (sizeRand < 0.7) {
            size = Math.random() * 1.0 + 0.3;
        } else if (sizeRand < 0.95) {
            size = Math.random() * 1.5 + 1.0;
        } else {
            size = Math.random() * 2.0 + 1.5;
        }
        
        let color;
        const colorRand = Math.random();
        if (colorRand < 0.65) {
            const blue = 220 + Math.floor(Math.random() * 35);
            const green = blue - Math.floor(Math.random() * 20);
            const red = green - Math.floor(Math.random() * 20);
            color = `rgb(${red}, ${green}, ${blue})`;
        } else if (colorRand < 0.85) {
            const red = 220 + Math.floor(Math.random() * 35);
            const green = red - Math.floor(Math.random() * 20);
            const blue = green - Math.floor(Math.random() * 40);
            color = `rgb(${red}, ${green}, ${blue})`;
        } else if (colorRand < 0.95) {
            const red = 220 + Math.floor(Math.random() * 35);
            const green = 130 + Math.floor(Math.random() * 40);
            const blue = 100 + Math.floor(Math.random() * 30);
            color = `rgb(${red}, ${green}, ${blue})`;
        } else {
            color = `rgb(255, 255, 255)`;
        }
        
        const minOpacity = 0.3 + Math.random() * 0.3;
        const maxOpacity = minOpacity + Math.random() * 0.4;
        const minScale = 0.85 + Math.random() * 0.1;
        const maxScale = minScale + Math.random() * 0.2;
        const twinkleSpeed = Math.random() * 0.02 + 0.005;
        const offset = Math.random() * Math.PI * 2;
        const glow = size * (Math.random() * 2 + 1);
        
        stars.push({
            x,
            y,
            size,
            color,
            minOpacity,
            maxOpacity,
            minScale,
            maxScale,
            twinkleSpeed,
            offset,
            twinkleValue: offset,
            glow,
            isBright: false
        });
    }
}

// Crear efecto de nebulosas en el fondo
function createNebulas() {
    const nebulaContainer = document.getElementById('galaxy');
    if (!nebulaContainer) return;

    // Limpiar cualquier nebulosa existente
    while (nebulaContainer.firstChild) {
        nebulaContainer.removeChild(nebulaContainer.firstChild);
    }

    // Reducir número de nebulosas en móviles
    const nebulaCount = window.innerWidth < 768 ? 4 : 8;
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

        let r, g, b, opacity;
        const nebulaType = Math.random();
        if (nebulaType < 0.4) {
            r = Math.floor(Math.random() * 60 + 20);
            g = Math.floor(Math.random() * 80 + 40);
            b = Math.floor(Math.random() * 120 + 100);
            opacity = 0.05;
        } else if (nebulaType < 0.7) {
            r = Math.floor(Math.random() * 100 + 80);
            g = Math.floor(Math.random() * 40 + 20);
            b = Math.floor(Math.random() * 100 + 80);
            opacity = 0.04;
        } else {
            r = Math.floor(Math.random() * 40 + 20);
            g = Math.floor(Math.random() * 100 + 60);
            b = Math.floor(Math.random() * 90 + 70);
            opacity = 0.03;
        }

        nebula.style.background = `radial-gradient(ellipse at center, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, ${opacity}) 50%, rgba(${r}, ${g}, ${b}, ${opacity * 0.8}) 70%, rgba(${r}, ${g}, ${b}, 0) 100%)`;
        nebula.style.borderRadius = '50%';
        nebula.style.transform = `rotate(${Math.random() * 360}deg)`;
        nebula.style.opacity = '1';
        nebula.style.filter = 'blur(40px)';
        nebula.style.zIndex = '-1';

        nebulaContainer.appendChild(nebula);
    }
}

// El resto del código sigue igual (incluyendo las funciones de visualización de barras y audio)