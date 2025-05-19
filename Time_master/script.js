// ===== DOM Elements =====
const sections = document.querySelectorAll('.content-section');
const navLinks = document.querySelectorAll('.nav-link');
const toggleModeBtn = document.getElementById('toggleMode');
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');
const body = document.body;

// ===== Navigation =====
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.target;
    
    // Update active section
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    
    // Update active nav link
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    link.classList.add('active');
    
    // Close mobile menu if open
    if (navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });
});

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinksContainer.classList.toggle('active');
  toggleModeBtn.classList.toggle('active');
});

// ===== Dark/Light Mode Toggle =====
toggleModeBtn.addEventListener('click', () => {
  body.classList.toggle('light');
  toggleModeBtn.textContent = body.classList.contains('light') ? 'Dark Mode' : 'Light Mode';
  drawClock(); // Redraw clock to update colors
});

// ===== Clock =====
function updateClock() {
  const now = new Date();
  const format = document.getElementById('formatToggle').value;
  const zone = document.getElementById('timezoneSelect').value;

  const localTime = zone === 'auto' ? now : new Date(now.toLocaleString('en-US', { timeZone: zone }));

  let h = localTime.getHours();
  let ampm = '';
  if (format === '12') {
    ampm = h >= 12 ? ' PM' : ' AM';
    h = h % 12 || 12;
  }
  document.getElementById('digitalClock').innerText = `${h.toString().padStart(2,'0')}:${localTime.getMinutes().toString().padStart(2,'0')}:${localTime.getSeconds().toString().padStart(2,'0')}${ampm}`;
}
setInterval(updateClock, 1000);
updateClock(); // Initial call

// ===== Stopwatch =====
let stopwatchInterval;
let stopwatchTime = 0;
let stopwatchRunning = false;

function updateStopwatch() {
  stopwatchTime++;
  let secs = stopwatchTime % 60;
  let mins = Math.floor(stopwatchTime / 60) % 60;
  let hrs = Math.floor(stopwatchTime / 3600);
  document.getElementById('stopwatchDisplay').innerText = `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function startStopwatch() {
  if (!stopwatchRunning) {
    stopwatchRunning = true;
    stopwatchInterval = setInterval(updateStopwatch, 1000);
  }
}

function stopStopwatch() {
  stopwatchRunning = false;
  clearInterval(stopwatchInterval);
}

function resetStopwatch() {
  stopStopwatch();
  stopwatchTime = 0;
  document.getElementById('stopwatchDisplay').innerText = '00:00:00';
}

// ===== Timer =====
let timerInterval;
let timerTime = 0;
let timerRunning = false;

function startTimer() {
  if (timerRunning) return;
  
  const input = document.getElementById('timerMinutes').value;
  if (!input || input <= 0) {
    alert('Please enter a valid number of minutes');
    return;
  }
  
  timerTime = parseInt(input) * 60;
  timerRunning = true;
  updateTimerDisplay();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (timerTime <= 0) {
    clearInterval(timerInterval);
    timerRunning = false;
    alert('Timer finished!');
    return;
  }
  timerTime--;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  let mins = Math.floor(timerTime / 60);
  let secs = timerTime % 60;
  document.getElementById('timerDisplay').innerText = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  const input = document.getElementById('timerMinutes').value || 5;
  timerTime = parseInt(input) * 60;
  updateTimerDisplay();
}

// ===== Analog Clock =====
const canvas = document.getElementById("analogClock");
const ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 300;

// Clock styles
const clockStyles = {
  minimal: {
    faceColor: (lightMode) => lightMode ? '#fff' : '#000',
    borderColor: '#00e0ff',
    numberColor: (lightMode) => lightMode ? '#007ea7' : '#00e0ff',
    hourColor: '#00e0ff',
    minuteColor: '#00e0ff',
    secondColor: '#f00',
    showNumbers: true,
    showMarks: false
  },
  neon: {
    faceColor: (lightMode) => lightMode ? '#f0f0f0' : '#111',
    borderColor: '#00e0ff',
    numberColor: '#00e0ff',
    hourColor: '#00e0ff',
    minuteColor: '#00e0ff',
    secondColor: '#ff00ff',
    showNumbers: true,
    showMarks: true,
    glowEffect: true
  },
  vintage: {
    faceColor: (lightMode) => lightMode ? '#f5f5dc' : '#3a2f0f',
    borderColor: '#8b4513',
    numberColor: '#8b4513',
    hourColor: '#8b4513',
    minuteColor: '#8b4513',
    secondColor: '#8b4513',
    showNumbers: true,
    showMarks: true,
    antiqueEffect: true
  }
};

let currentStyle = 'minimal';

// Style selector event listener
document.getElementById('analogStyle').addEventListener('change', (e) => {
  currentStyle = e.target.value;
  drawClock();
});

function drawClock() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = new Date();
  const zone = document.getElementById('analogTimezone').value;
  const local = zone === 'auto' ? now : new Date(now.toLocaleString('en-US', { timeZone: zone }));
  const style = clockStyles[currentStyle];
  const lightMode = body.classList.contains('light');

  const radius = canvas.width / 2;
  ctx.save();
  ctx.translate(radius, radius);
  
  // Clock face
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, 2 * Math.PI);
  ctx.fillStyle = style.faceColor(lightMode);
  ctx.fill();
  ctx.strokeStyle = style.borderColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Add glow effect for neon style
  if (style.glowEffect) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = style.borderColor;
  }

  // Numbers
  if (style.showNumbers) {
    ctx.font = "18px Orbitron";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = typeof style.numberColor === 'function' ? style.numberColor(lightMode) : style.numberColor;
    
    for (let num = 1; num <= 12; num++) {
      const ang = (num * Math.PI) / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
  }

  // Hour marks
  if (style.showMarks) {
    for (let i = 0; i < 60; i++) {
      const ang = (i * Math.PI) / 30;
      ctx.beginPath();
      const length = i % 5 === 0 ? 15 : 5;
      ctx.lineWidth = i % 5 === 0 ? 3 : 1;
      ctx.strokeStyle = typeof style.numberColor === 'function' ? style.numberColor(lightMode) : style.numberColor;
      ctx.moveTo(0, -radius * 0.95);
      ctx.lineTo(0, -radius * 0.95 + length);
      ctx.stroke();
      ctx.rotate(ang);
    }
  }

  const hour = local.getHours() % 12;
  const minute = local.getMinutes();
  const second = local.getSeconds();

  // Add antique effect for vintage style
  if (style.antiqueEffect) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.92, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.2)';
    ctx.lineWidth = 10;
    ctx.stroke();
  }

  // Hour hand
  drawHand((hour + minute / 60) * 30, radius * 0.5, 7, style.hourColor);
  // Minute hand
  drawHand((minute + second / 60) * 6, radius * 0.75, 5, style.minuteColor);
  // Second hand
  drawHand(second * 6, radius * 0.9, 2, style.secondColor);
  
  // Center dot
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, 2 * Math.PI);
  ctx.fillStyle = style.secondColor;
  ctx.fill();
  
  ctx.restore();
}

function drawHand(angle, length, width, color) {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.moveTo(0, 0);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.restore();
}

setInterval(drawClock, 1000);
drawClock(); // Initial draw