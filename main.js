document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("heartCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hearts = [];
    const explosions = [];
    const daisies = [];

    // Función para crear corazones
    function createHeart(x, y, size, speedY, color) {
        return { x, y, size, speedY, color };
    }

    // Función para crear una explosión de corazones
    function createExplosion(x, y) {
        const explosionColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            const size = Math.random() * 5 + 5;
            explosions.push({
                x, y,
                size,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                opacity: 1,
                color: explosionColor
            });
        }
    }

    // Dibujar corazón con forma de ❤️
    function drawHeart(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size, y - size, x - size * 2, y + size / 2, x, y + size);
        ctx.bezierCurveTo(x + size * 2, y + size / 2, x + size, y - size, x, y);
        ctx.fill();
    }

    // Dibujar texto "Te amo"
    function drawText(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Te amo", x, y);
    }

    // Dibujar una margarita (flor)
    function drawDaisy(ctx, x, y, size) {
        // Centro de la margarita
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(x, y, size / 4, 0, Math.PI * 2);
        ctx.fill();

        // Pétalos
        ctx.fillStyle = "white";
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const petalX = x + Math.cos(angle) * size;
            const petalY = y + Math.sin(angle) * size;
            ctx.beginPath();
            ctx.ellipse(petalX, petalY, size / 2, size / 4, angle, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Dibujar el fondo (degradado de cielo)
    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#87CEEB"); // Celeste claro
        gradient.addColorStop(1, "#FFD6E0"); // Blanco
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Animar corazones, explosiones y margaritas
    function animate() {
        // Dibujar el fondo
        drawBackground();

        // Dibujar margaritas
        daisies.forEach(daisy => {
            drawDaisy(ctx, daisy.x, daisy.y, daisy.size);
        });

        // Dibujar y mover corazones de lluvia
        hearts.forEach((heart, index) => {
            heart.y += heart.speedY;
            drawHeart(ctx, heart.x, heart.y, heart.size, heart.color);

            if (heart.y > canvas.height) {
                hearts.splice(index, 1);
            }
        });

        // Dibujar y mover explosiones
        explosions.forEach((explosion, index) => {
            explosion.x += explosion.speedX;
            explosion.y += explosion.speedY;
            explosion.opacity -= 0.02;
            drawHeart(ctx, explosion.x, explosion.y, explosion.size, `rgba(${explosion.color}, ${explosion.opacity})`);
            if (explosion.opacity <= 0) {
                explosions.splice(index, 1);
            }
        });

        explosions.forEach((explosion, index) => {
            explosion.x += explosion.speedX;
            explosion.y += explosion.speedY;
            explosion.opacity -= 0.02;
            drawDaisy(ctx,explosion.x * 1.5, explosion.y * 1.5,explosion.size);
            if (explosion.opacity <= 0) {
                explosions.splice(index, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    // Generar lluvia de corazones cada cierto tiempo
    setInterval(() => {
        const x = Math.random() * canvas.width;
        const size = Math.random() * 10 + 5;
        const speedY = Math.random() * 3 + 1;
        hearts.push(createHeart(x, 0, size, speedY, "red"));
    }, 150);

    // Función para mostrar "Te amo" y luego explotar en corazones
    function showTextAndExplode() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;

        // Dibujar "Te amo" en una posición aleatoria
        drawText(ctx, x, y, "red");

        // Esperar un breve momento y luego crear la explosión
        setTimeout(() => {
            createExplosion(x, y);
        }, 3000); // 1 segundo de retraso
    }

    // Generar explosiones automáticas cada cierto tiempo
    setInterval(showTextAndExplode, 3000); // Cada 3 segundos

    // Generar margaritas en posiciones aleatorias
    function generateDaisies() {
        for (let i = 0; i < 30; i++) {
            daisies.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 20 + 10
            });
        }
    }

    // Ajustar tamaño del canvas al cambiar la ventana
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateDaisies(); // Regenerar margaritas al cambiar el tamaño
    });

    // Iniciar animación y generar margaritas
    generateDaisies();
    animate();
});