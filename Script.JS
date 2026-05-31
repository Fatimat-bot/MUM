// ---- ENVELOPPE ----
function openEnvelope() {
  const flap   = document.getElementById('envFlap');
  const heart  = document.getElementById('envHeart');
  const wrap   = document.getElementById('envelopeWrap');
  const letter = document.getElementById('letterCard');

  flap.classList.add('open');
  heart.style.opacity = '0';

  setTimeout(() => {
    wrap.style.opacity = '0';
    wrap.style.transform = 'scale(0.9)';
    wrap.style.pointerEvents = 'none';
  }, 350);

  setTimeout(() => {
    wrap.style.display = 'none';
    letter.classList.add('visible');
  }, 650);
}

function closeEnvelope() {
  const wrap   = document.getElementById('envelopeWrap');
  const letter = document.getElementById('letterCard');
  const flap   = document.getElementById('envFlap');
  const heart  = document.getElementById('envHeart');

  letter.classList.remove('visible');

  setTimeout(() => {
    wrap.style.display = 'flex';
    setTimeout(() => {
      wrap.style.opacity = '1';
      wrap.style.transform = 'scale(1)';
      wrap.style.pointerEvents = 'auto';
      flap.classList.remove('open');
      heart.style.opacity = '1';
    }, 50);
  }, 400);
}

// ---- UPLOAD MÉDIA DANS FLIP-CARDS ----
function loadMedia(input, cardId) {
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) return;

  const url = URL.createObjectURL(file);
  const front = document.querySelector('#' + cardId + ' .flip-front');

  front.innerHTML = '';

  if (isImage) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Souvenir';
    front.appendChild(img);
  } else {
    const vid = document.createElement('video');
    vid.src = url;
    vid.controls = true;
    vid.addEventListener('click', e => e.stopPropagation());
    front.appendChild(vid);
  }

  let badge = front.querySelector('.media-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.classList.add('media-badge');
    front.appendChild(badge);
  }
  badge.textContent = isImage ? '📷 Photo' : '🎬 Vidéo';

  document.getElementById(cardId).classList.add('has-media');
}

// ---- CONFETTIS ----
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#D4537E','#F4C0D1','#EF9F27','#5DCAA5','#ED93B1','#FAC775','#9FE1CB','#72243E'];
  const pieces = [];

  for (let i = 0; i < 160; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      vr: (Math.random() - 0.5) * 0.2
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
    });
    frame++;
    if (frame < 180) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ---- MODAL CŒUR VIDÉO + EMOJIS VOLANTS ----
let floatInterval = null;

function openVideoSurprise() {
  const audio = document.getElementById('bg-audio');
  audio.pause();
  setMusicState(false);

  document.getElementById('heartModal').classList.add('active');
  document.getElementById('surpriseVideo').play();
  startFloatingEmojis();
}

function closeVideoSurprise() {
  document.getElementById('heartModal').classList.remove('active');
  const v = document.getElementById('surpriseVideo');
  v.pause();
  v.currentTime = 0;
  stopFloatingEmojis();

  const audio = document.getElementById('bg-audio');
  audio.play();
  setMusicState(true);
}
function startFloatingEmojis() {
  const emojis = ['❤️','💕','💖','💗','💓','💞','😘','😍','🌸','🌺','🌷','💋','✨','🥰'];

  // Injecter keyframe une seule fois
  if (!document.getElementById('floatUpStyle')) {
    const style = document.createElement('style');
    style.id = 'floatUpStyle';
    style.textContent = `
      @keyframes floatUp {
        0%   { transform: translateY(0) rotate(-10deg) scale(1); opacity: 1; }
        50%  { transform: translateY(-45vh) rotate(10deg) scale(0.9); opacity: 1; }
        100% { transform: translateY(-95vh) rotate(-5deg) scale(0.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function spawnEmoji() {
    const el = document.createElement('span');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const size = Math.random() * 24 + 14;
    const duration = Math.random() * 2 + 2.5;
    el.style.cssText = `
      position: fixed;
      font-size: ${size}px;
      left: ${Math.random() * 96 + 2}vw;
      bottom: 0px;
      pointer-events: none;
      z-index: 1100;
      animation: floatUp ${duration}s ease-out forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (duration + 0.5) * 1000);
  }

  spawnEmoji();
  floatInterval = setInterval(spawnEmoji, 250);
}

function stopFloatingEmojis() {
  if (floatInterval) {
    clearInterval(floatInterval);
    floatInterval = null;
  }
}

// Confettis lancés via enterSite() au clic sur le splash

// ---- MUSIQUE DE FOND YOUTUBE ----
let musicPlaying = false;



// Callback automatique de l'API YouTube


function enterSite() {
  // Lancer la musique MP3
  const audio = document.getElementById('bg-audio');
  audio.volume = 0.6;
  audio.play();
  musicPlaying = true;
  setMusicState(true);

  // Cacher le splash avec animation
  const splash = document.getElementById('splash-screen');
  splash.classList.add('hide');
  setTimeout(() => splash.style.display = 'none', 750);

  // Lancer les confettis
  setTimeout(launchConfetti, 800);
}

function setMusicState(playing) {
  musicPlaying = playing;
  const btn  = document.getElementById('music-btn');
  const icon = document.getElementById('music-icon');
  if (playing) {
    btn.classList.add('playing');
    icon.textContent = '🔊';
  } else {
    btn.classList.remove('playing');
    icon.textContent = '🔇';
  }
}

function toggleMusic() {
  const audio = document.getElementById('bg-audio');
  if (musicPlaying) {
    audio.pause();
    setMusicState(false);
  } else {
    audio.play();
    setMusicState(true);
  }
}

// Pause musique quand une vidéo de flip-card joue
document.addEventListener('DOMContentLoaded', () => {
  const allVideos = document.querySelectorAll('video');

  allVideos.forEach(vid => {
    // Quand une vidéo démarre
    vid.addEventListener('play', () => {
      // Pause toutes les autres vidéos
      allVideos.forEach(other => {
        if (other !== vid) {
          other.pause();
        }
      });

      // Pause la musique de fond
      const audio = document.getElementById('bg-audio');
      audio.pause();
      setMusicState(false);
    });

    // Quand une vidéo se termine ou est mise en pause
    vid.addEventListener('ended', () => {
      const audio = document.getElementById('bg-audio');
      audio.play();
      setMusicState(true);
    });

    vid.addEventListener('pause', () => {
      // Reprendre la musique seulement si aucune autre vidéo ne joue
      const anyPlaying = [...allVideos].some(v => !v.paused);
      if (!anyPlaying) {
        const audio = document.getElementById('bg-audio');
        audio.play();
        setMusicState(true);
      }
    });
  });
});