import { dialogue } from './dialogue.js';

// ===== State =====
let currentRoom = 'living-room';
let bubbleTimer = null;

// ===== DOM refs =====
const roomBg = document.getElementById('room-bg');
const viewport = document.getElementById('room-viewport');
const bubble = document.getElementById('speech-bubble');
const speechText = document.getElementById('speech-text');
const roomButtons = document.querySelectorAll('.room-btn');
const characters = document.querySelectorAll('.character');

// ===== Room backgrounds =====
const roomBgMap = {
  'living-room': '/assets/maps/living-room.png',
  'control-room': '/assets/maps/control-room.png',
};

// ===== Helpers =====
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== Speech Bubble =====
function showBubble(charId, charEl) {
  // Clear any existing timer
  if (bubbleTimer) {
    clearTimeout(bubbleTimer);
    bubbleTimer = null;
  }

  // Get random line
  const lines = dialogue[charId];
  if (!lines) return;
  const line = pickRandom(lines);

  // Set text
  speechText.textContent = line;

  // Set color class
  bubble.className = `bubble-${charId}`;

  // Position bubble above the character
  const vpRect = viewport.getBoundingClientRect();
  const charRect = charEl.getBoundingClientRect();

  const charCenterX = charRect.left + charRect.width / 2 - vpRect.left;
  const charTopY = charRect.top - vpRect.top;

  // Convert to percentage-based positioning
  const leftPx = charCenterX - 140; // half of max-width 280
  const topPx = charTopY - 10; // above character with gap

  // Clamp within viewport
  const clampedLeft = Math.max(8, Math.min(leftPx, vpRect.width - 288));

  bubble.style.left = clampedLeft + 'px';
  bubble.style.bottom = 'auto';
  bubble.style.top = topPx + 'px';
  bubble.style.transform = 'translateY(-100%)';

  // Adjust triangle position to point at character
  const triangleLeft = charCenterX - clampedLeft - 10; // 10 = half triangle width
  bubble.style.setProperty('--tri-left', Math.max(15, Math.min(triangleLeft, 250)) + 'px');

  // Show
  requestAnimationFrame(() => {
    bubble.classList.remove('hidden');
  });

  // Auto-hide after 4 seconds
  bubbleTimer = setTimeout(() => {
    bubble.classList.add('hidden');
    bubbleTimer = null;
  }, 4000);
}

// ===== Room Switching =====
function switchRoom(roomId) {
  if (roomId === currentRoom) return;

  currentRoom = roomId;

  // Update button states
  roomButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.room === roomId);
  });

  // Fade out bg, swap, fade in
  roomBg.classList.add('fade-out');

  // Hide any bubble
  bubble.classList.add('hidden');
  if (bubbleTimer) {
    clearTimeout(bubbleTimer);
    bubbleTimer = null;
  }

  setTimeout(() => {
    roomBg.src = roomBgMap[roomId];
    // Update character layout class
    viewport.className = '';
    viewport.classList.add(`room-${roomId}`);
    roomBg.classList.remove('fade-out');
  }, 400);
}

// ===== Event Listeners =====

// Character taps
characters.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const charId = el.dataset.char;
    showBubble(charId, el);
  });
});

// Room navigation
roomButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    switchRoom(btn.dataset.room);
  });
});

// Tap outside characters hides bubble
viewport.addEventListener('click', (e) => {
  if (!e.target.closest('.character')) {
    bubble.classList.add('hidden');
    if (bubbleTimer) {
      clearTimeout(bubbleTimer);
      bubbleTimer = null;
    }
  }
});
