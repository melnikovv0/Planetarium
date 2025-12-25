const canvas = document.getElementById("solarSystem");
const ctx = canvas.getContext("2d");


const stars = [];
const starCount = 150;

function generateStars() {
  stars.length = 0;
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.5
    });
  }
}

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  generateStars(); 
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let centerX, centerY, scale;
function updateScale() {
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  scale = canvas.width / 280;
}

let zoomedPlanet = null;
let speedMultiplier = 1;

const images = {
  Sun: new Image(),
  Mercury: new Image(),
  Venus: new Image(),
  Earth: new Image(),
  Mars: new Image(),
  Jupiter: new Image(),
  Saturn: new Image(),
  Uranus: new Image(),
  Neptune: new Image()
};

images.Sun.src = "planets/sun.png";
images.Mercury.src = "planets/mercury.png";
images.Venus.src = "planets/venus.png";
images.Earth.src = "planets/earth.png";
images.Mars.src = "planets/mars.png";
images.Jupiter.src = "planets/jupiter.png";
images.Saturn.src = "planets/saturn.png";
images.Uranus.src = "planets/uranus.png";
images.Neptune.src = "planets/neptune.png";

const planets = [
  {
    name: "Mercury",
    orbit: 20,
    size: 4.5,
    speed: 0.03,
    angle: 0,
    description: "Mercury is the smallest planet and closest to the Sun. It has no atmosphere to retain heat, leading to extreme temperature differences between day and night. Its surface is heavily cratered, resembling the Moon."
  },
  {
    name: "Venus",
    orbit: 30,
    size: 7.5,
    speed: 0.025,
    angle: 0,
    description: "Venus is similar in size to Earth but has a thick atmosphere rich in carbon dioxide, causing a strong greenhouse effect. It's the hottest planet in the solar system and rotates in the opposite direction of most planets."
  },
  {
    name: "Earth",
    orbit: 40,
    size: 8.5,
    speed: 0.02,
    angle: 0,
    description: "Earth is the only known planet to support life. It has a breathable atmosphere, liquid water on its surface, and a magnetic field that protects it from solar radiation. It has one natural satellite: the Moon."
  },
  {
    name: "Mars",
    orbit: 50,
    size: 7.5,
    speed: 0.017,
    angle: 0,
    description: "Mars, known as the Red Planet, has a cold desert climate and thin atmosphere composed mostly of carbon dioxide. It hosts the tallest volcano (Olympus Mons) and the deepest canyon (Valles Marineris) in the solar system."
  },
  {
    name: "Jupiter",
    orbit: 70,
    size: 16,
    speed: 0.012,
    angle: 0,
    description: "Jupiter is the largest planet in the solar system, a gas giant composed mainly of hydrogen and helium. It has a strong magnetic field and at least 79 moons, including Ganymede, the largest moon in the solar system."
  },
  {
    name: "Saturn",
    orbit: 90,
    size: 14.5,
    speed: 0.009,
    angle: 0,
    description: "Saturn is famous for its spectacular ring system made of ice and rock particles. It is a gas giant like Jupiter, with a low density and many moons, including Titan, which has a dense atmosphere and liquid lakes of methane."
  },
  {
    name: "Uranus",
    orbit: 110,
    size: 11,
    speed: 0.006,
    angle: 0,
    description: "Uranus is an ice giant with a pale blue color due to methane in its atmosphere. It rotates on its side, making its axis nearly parallel to its orbit. It has a faint ring system and at least 27 known moons."
  },
  {
    name: "Neptune",
    orbit: 130,
    size: 10.5,
    speed: 0.004,
    angle: 0,
    description: "Neptune is the most distant planet in the solar system. It is an ice giant with strong winds and massive storms. Its deep blue color is due to methane in the atmosphere. It has 14 known moons, including Triton."
  }
];


function draw() {
  updateScale();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    const x = star.x * canvas.width;
    const y = star.y * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, star.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
  });

  ctx.save();

  if (zoomedPlanet) {
    const zoomFactor = 3;
    const offsetX = centerX - zoomedPlanet.x * zoomFactor;
    const offsetY = centerY - zoomedPlanet.y * zoomFactor;
    ctx.translate(offsetX, offsetY);
    ctx.scale(zoomFactor, zoomFactor);
  }

  const time = Date.now() * 0.002;
  const pulse = Math.sin(time) * 2 + 20;
  const sunSize = pulse * scale;

  if (images.Sun.complete) {
    ctx.drawImage(images.Sun, centerX - sunSize, centerY - sunSize, sunSize * 2, sunSize * 2);
  } else {
    ctx.beginPath();
    ctx.arc(centerX, centerY, sunSize, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
  }

  planets.forEach(p => {
    p.angle += p.speed * speedMultiplier;
    const orbit = p.orbit * scale;
    const size = p.size * scale;
    const x = centerX + Math.cos(p.angle) * orbit;
    const y = centerY + Math.sin(p.angle) * orbit;

    p.x = x;
    p.y = y;
    p.drawSize = size;

    if (!zoomedPlanet) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbit, 0, 2 * Math.PI);
      ctx.strokeStyle = "#444";
      ctx.stroke();
    }

    const img = images[p.name];
    if (img && img.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(img, x - size, y - size, size * 2, size * 2);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = "gray";
      ctx.fill();
    }
  });

  ctx.restore();
  requestAnimationFrame(draw);
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  if (zoomedPlanet) {
    const zoomFactor = 3;
    const offsetX = centerX - zoomedPlanet.x * zoomFactor;
    const offsetY = centerY - zoomedPlanet.y * zoomFactor;
    x = (x - offsetX) / zoomFactor;
    y = (y - offsetY) / zoomFactor;
  }

  planets.forEach(p => {
    const dx = x - p.x;
    const dy = y - p.y;
    if (Math.sqrt(dx * dx + dy * dy) <= p.drawSize + 5) {
      if (!zoomedPlanet) {
        zoomedPlanet = p;
        showInfo(p);
      }
    }
  });
});

function showInfo(planet) {
  document.getElementById("planetName").textContent = planet.name;
  document.getElementById("planetDesc").textContent = planet.description;
  document.getElementById("infoBox").hidden = false;
}

function closeInfo() {
  document.getElementById("infoBox").hidden = true;
}

function resetView() {
  zoomedPlanet = null;
  closeInfo();
}

document.getElementById("searchBtn").addEventListener("click", () => {
  handleSearch();
});

document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

function handleSearch() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const found = planets.find(p => p.name.toLowerCase() === input);
  if (found) {
    zoomedPlanet = found;
    showInfo(found);
  } else {
    alert("Planet not found.");
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('Service Worker registered'))
    .catch(err => console.error(' SW registration failed', err));
}




draw();
