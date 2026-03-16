(function () {
  'use strict';

  // ===== Dialogue Data =====
  var dialogue = {
    a: [
      'おっ、お嬢ちゃん来たか！待ってたぞー！',
      'なあなあ、この深海魚見たか？デカくないか？',
      'ここのコーヒー、私が淹れたんだぞ。飲むか？',
      'ラボの掃除？……えー、明日でよくないか？',
      'お嬢ちゃん、今日の顔色いいな。なんかあったか？',
      'じゃあこうしたらどうだ？とりあえず座ろう！',
      'ほら、ソファ空いてるぞ！遠慮すんな！',
      '私に任せとけって！……何をかは聞くなよ！',
      'いやー今日も平和だなー！最高！',
      'お嬢ちゃんが来ると場が明るくなるな！',
    ],
    b: [
      '……来たか。今、データを整理していたところだ。',
      '水温が0.3度上昇している。些細だが、記録しておくべきだろう。',
      '報告書はまとめてある。必要なら言ってくれ。',
      '焦る必要はない。順を追って確認しよう。',
      '……静かだな。こういう時間は悪くない。',
      '観測データに気になる点がある。少し見てくれるか。',
      'Aがまた騒いでいたが……まあ、いつものことだ。',
      '効率を考えるなら、まず現状を正確に把握することだ。',
      'お嬢、何か気になることがあるなら聞こう。',
      '問題は切り分けて対処する。それが基本だ。',
    ],
    c: [
      '……よく来たな。',
      '焦るな。まだ崩れちゃいない。',
      '順番を守れ。それだけでうまくいく。',
      '……ここは俺が見ている。安心しろ。',
      '騒がしいのは嫌いじゃない。……少しだけな。',
      'お嬢、今日は少し休め。明日もあるだろう。',
      '……考えすぎるな。答えは動いた先にある。',
      '全体を見ろ。部分に囚われるな。',
      'Aの言うことも、たまには当たる。……たまにはな。',
      '……ここにいる間は、俺たちが守る。',
    ],
  };

  // ===== State =====
  var currentRoom = 'living-room';
  var bubbleTimer = null;

  // ===== DOM refs =====
  var roomBg = document.getElementById('room-bg');
  var viewport = document.getElementById('room-viewport');
  var bubble = document.getElementById('speech-bubble');
  var speechText = document.getElementById('speech-text');
  var roomButtons = document.querySelectorAll('.room-btn');
  var characters = document.querySelectorAll('.character');

  // ===== Room backgrounds (relative paths) =====
  var roomBgMap = {
    'living-room': 'public/assets/maps/living-room.png',
    'control-room': 'public/assets/maps/control-room.png',
  };

  // ===== Helpers =====
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ===== Speech Bubble =====
  function showBubble(charId, charEl) {
    if (bubbleTimer) {
      clearTimeout(bubbleTimer);
      bubbleTimer = null;
    }

    var lines = dialogue[charId];
    if (!lines) return;
    var line = pickRandom(lines);

    speechText.textContent = line;
    bubble.className = 'bubble-' + charId;

    var vpRect = viewport.getBoundingClientRect();
    var charRect = charEl.getBoundingClientRect();

    var charCenterX = charRect.left + charRect.width / 2 - vpRect.left;
    var charTopY = charRect.top - vpRect.top;

    var leftPx = charCenterX - 140;
    var topPx = charTopY - 10;

    var clampedLeft = Math.max(8, Math.min(leftPx, vpRect.width - 288));

    bubble.style.left = clampedLeft + 'px';
    bubble.style.bottom = 'auto';
    bubble.style.top = topPx + 'px';
    bubble.style.transform = 'translateY(-100%)';

    var triangleLeft = charCenterX - clampedLeft - 10;
    bubble.style.setProperty('--tri-left', Math.max(15, Math.min(triangleLeft, 250)) + 'px');

    requestAnimationFrame(function () {
      bubble.classList.remove('hidden');
    });

    bubbleTimer = setTimeout(function () {
      bubble.classList.add('hidden');
      bubbleTimer = null;
    }, 4000);
  }

  // ===== Room Switching =====
  function switchRoom(roomId) {
    if (roomId === currentRoom) return;

    currentRoom = roomId;

    roomButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.room === roomId);
    });

    roomBg.classList.add('fade-out');

    bubble.classList.add('hidden');
    if (bubbleTimer) {
      clearTimeout(bubbleTimer);
      bubbleTimer = null;
    }

    setTimeout(function () {
      roomBg.src = roomBgMap[roomId];
      viewport.className = '';
      viewport.classList.add('room-' + roomId);
      roomBg.classList.remove('fade-out');
    }, 400);
  }

  // ===== Event Listeners =====
  characters.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      showBubble(el.dataset.char, el);
    });
  });

  roomButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchRoom(btn.dataset.room);
    });
  });

  viewport.addEventListener('click', function (e) {
    if (!e.target.closest('.character')) {
      bubble.classList.add('hidden');
      if (bubbleTimer) {
        clearTimeout(bubbleTimer);
        bubbleTimer = null;
      }
    }
  });
})();
