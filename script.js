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

    // Escuchar eventos de cambio de tamaño
    window.addEventListener('resize', function() {
        resizeCanvas();
        createStars(); // Recrear estrellas al cambiar el tamaño
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

    // Densidad reducida para un aspecto más realista
    const starCount = Math.floor(canvasWidth * canvasHeight / 1800 * 2);

    // Crear estrellas normales
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;

        // Tamaños más variados - mayoría pequeñas, pocas grandes
        let size;
        const sizeRand = Math.random();
        if (sizeRand < 0.7) {
            // 70% son estrellas pequeñas
            size = Math.random() * 1.0 + 0.3;
        } else if (sizeRand < 0.95) {
            // 25% son estrellas medianas
            size = Math.random() * 1.5 + 1.0;
        } else {
            // 5% son estrellas grandes
            size = Math.random() * 2.0 + 1.5;
        }

        // Colores más variados y realistas para las estrellas
        let color;
        const colorRand = Math.random();

        if (colorRand < 0.65) {
            // Estrellas blancas/azuladas (más comunes)
            const blue = 220 + Math.floor(Math.random() * 35);
            const green = blue - Math.floor(Math.random() * 20);
            const red = green - Math.floor(Math.random() * 20);
            color = `rgb(${red}, ${green}, ${blue})`;
        } else if (colorRand < 0.85) {
            // Estrellas amarillentas
            const red = 220 + Math.floor(Math.random() * 35);
            const green = red - Math.floor(Math.random() * 20);
            const blue = green - Math.floor(Math.random() * 40);
            color = `rgb(${red}, ${green}, ${blue})`;
        } else if (colorRand < 0.95) {
            // Estrellas rojizas
            const red = 220 + Math.floor(Math.random() * 35);
            const green = 130 + Math.floor(Math.random() * 40);
            const blue = 100 + Math.floor(Math.
