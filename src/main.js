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
      'おっ、腹減ってないか？なんか作ろうか！',
      'この水槽さぁ、ずっと見てると眠くならないか？私はなる！',
      'お嬢ちゃん、難しい顔すんなって！なんとかなるって！',
      'Bがまた小難しいこと言ってたけど、要するに大丈夫ってことだろ？',
      'Cが黙ってるとカッコいいけど、あれ実は寝てるだけの時あるからな！',
      '深海って暗いだろ？だから私が明るくしてんだよ！……うまくないか？',
      'よーし、今日もいっちょやるかー！……何をやるかは今から考える！',
      'お嬢ちゃんが来ない日はさ、正直ちょっとヒマなんだよな。',
      'おいおい、そんな隅っこにいないでこっち来いって！',
      'あーっ、それ面白くないか？ちょっとそれやってみようぜ！',
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
      '深海の圧力環境下では、通常と異なる反応が起きる。……興味深い話だろう？',
      '記録は正確に。曖昧な情報が一番厄介だ。',
      'Aの発想は……荒削りだが、時折本質を突く。認めざるを得ない。',
      'Cは多くを語らないが、見るべき所は見ている。……信頼に足る。',
      '休憩も計画のうちだ。お嬢、少し座ったらどうだ。',
      'この観測機器の精度は悪くない。だが、検証は怠らない方がいい。',
      '……私が整理しておく。お嬢は、自分のペースで構わない。',
      '感情で判断するなとは言わない。だが、事実も並べてから決めるべきだ。',
      '……不思議だな。お嬢が来ると、ラボの空気が少し変わる。',
      '結論を急ぐ必要はない。材料が揃えば、答えは自ずと見える。',
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
      '深海は静かだ。……だが、その静けさの中に全部ある。',
      '慌てるな。手順通りにやれば、崩れるもんも崩れない。',
      '……お嬢、顔に出てるぞ。何があった。',
      'Aがうるさい？……あれでもだいぶ抑えてる方だ。',
      'Bの分析は正確だ。あいつが大丈夫と言うなら、大丈夫だろう。',
      '……言葉にしなくていい。ここにいろ。',
      '迷った時は止まれ。止まって、周りを見ろ。それだけだ。',
      '俺は細かいことは言わない。……ただ、無茶はするなよ。',
      '……今日の海は穏やかだな。こういう日は悪くない。',
      'お嬢が頑張ってるのは、見てりゃわかる。……だから、たまには抜け。',
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

  // ===== Theme Song (BGM) =====
  var themeSong = document.getElementById('theme-song');
  var themeVolume = 1.0;
  var themeFadeTimer = null;
  var mediaIsPlaying = false;
  var themeUnmuted = false;

  // Try autoplay immediately (muted first if needed, then unmute on interaction)
  function initThemeSong() {
    themeSong.volume = themeVolume;
    var playPromise = themeSong.play();
    if (playPromise) {
      playPromise.then(function () {
        // Autoplay with sound succeeded
        themeUnmuted = true;
      }).catch(function () {
        // Blocked by browser - try muted autoplay, then unmute on first interaction
        themeSong.muted = true;
        themeSong.play().catch(function () {});
        function unmute() {
          themeSong.muted = false;
          themeSong.volume = 0;
          themeUnmuted = true;
          fadeThemeSong(themeVolume, 800);
          document.removeEventListener('click', unmute);
          document.removeEventListener('touchstart', unmute);
          document.removeEventListener('keydown', unmute);
        }
        document.addEventListener('click', unmute, { once: false });
        document.addEventListener('touchstart', unmute, { once: false });
        document.addEventListener('keydown', unmute, { once: false });
      });
    }
  }

  initThemeSong();

  // Fade theme song volume
  function fadeThemeSong(targetVol, duration, callback) {
    if (themeFadeTimer) cancelAnimationFrame(themeFadeTimer);
    var startVol = themeSong.volume;
    var startTime = performance.now();

    function step(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      themeSong.volume = startVol + (targetVol - startVol) * progress;
      if (progress < 1) {
        themeFadeTimer = requestAnimationFrame(step);
      } else {
        themeSong.volume = targetVol;
        themeFadeTimer = null;
        if (targetVol === 0) themeSong.pause();
        if (callback) callback();
      }
    }
    if (themeSong.paused && targetVol > 0) {
      themeSong.volume = 0;
      themeSong.play().catch(function () {});
    }
    themeFadeTimer = requestAnimationFrame(step);
  }

  // ===== Media Player =====
  var mediaTabs = document.querySelectorAll('.media-tab');
  var mediaInputs = document.querySelectorAll('.media-input-content');
  var mediaPlayer = document.getElementById('media-player');
  var playerContainer = document.getElementById('player-container');
  var urlInput = document.getElementById('url-input');
  var urlSubmit = document.getElementById('url-submit');
  var mediaClose = document.getElementById('media-close');
  var videoFileInput = document.getElementById('video-file-input');
  var photoFileInput = document.getElementById('photo-file-input');
  var genericFileInput = document.getElementById('generic-file-input');

  // Media reaction comments (generic, not about specific content)
  var mediaReactions = {
    a: [
      'おっ、何か始まるのか！？',
      'お、再生するぞ！みんな注目ー！',
      'わくわくするなあ！何だろ！',
      'ほほー、ちょっと見てみようぜ！',
      'おお！いいねいいね！',
      'よーし、鑑賞タイムだ！',
      'お嬢ちゃんのチョイスか！楽しみだ！',
    ],
    b: [
      '……再生するのか。見てみよう。',
      'ふむ、確認しよう。',
      '……少し気になるな。再生してくれ。',
      'データの一種だと思えば、確認は必要だ。',
      '了解した。視聴しよう。',
      '……お嬢のセレクトか。悪くない。',
    ],
    c: [
      '……再生しろ。',
      '……聞いてやる。',
      'ふん……見てみるか。',
      '……静かにしろ。始まるぞ。',
      '……お嬢が選んだなら、見る価値はあるだろう。',
      '……いいだろう。付き合ってやる。',
    ],
  };

  // Tab switching
  mediaTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      mediaTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      var type = tab.dataset.type;
      mediaInputs.forEach(function (input) { input.classList.add('hidden'); });
      document.getElementById('input-' + type).classList.remove('hidden');
    });
  });

  // Show character reaction when media plays
  function triggerMediaReaction() {
    var charIds = ['a', 'b', 'c'];
    var chosen = pickRandom(charIds);
    var charEl = document.getElementById('char-' + chosen);
    var lines = mediaReactions[chosen];
    var line = pickRandom(lines);

    if (bubbleTimer) {
      clearTimeout(bubbleTimer);
      bubbleTimer = null;
    }

    speechText.textContent = line;
    bubble.className = 'bubble-' + chosen;

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

  // Parse URL to determine media type
  function parseMediaUrl(url) {
    // YouTube
    var ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return { type: 'youtube', id: ytMatch[1] };

    // SUNO AI - extract UUID from various URL patterns
    if (url.indexOf('suno.com') !== -1 || url.indexOf('suno.ai') !== -1) {
      // Match UUID pattern in URL: /song/UUID or /s/SHORT_ID
      var sunoUuid = url.match(/\/song\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
      if (sunoUuid) {
        return { type: 'suno', audioUrl: 'https://cdn1.suno.ai/' + sunoUuid[1] + '.mp3' };
      }
      // Short URL /s/ID - try to use as-is via audio (won't work directly, but provide fallback)
      var sunoShort = url.match(/\/s\/([a-zA-Z0-9_-]+)/);
      if (sunoShort) {
        return { type: 'suno-short', url: url };
      }
      return { type: 'suno-short', url: url };
    }

    // Direct media file URLs
    var lower = url.toLowerCase();
    if (lower.match(/\.(mp4|webm|ogv|mov)(\?|$)/)) return { type: 'video-url', url: url };
    if (lower.match(/\.(mp3|wav|ogg|flac|aac|m4a)(\?|$)/)) return { type: 'audio-url', url: url };
    if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/)) return { type: 'image-url', url: url };

    // Unknown URL - try as iframe
    return { type: 'iframe', url: url };
  }

  // Display media in player (with theme song fade-out)
  function showMedia(html) {
    mediaIsPlaying = true;
    // Fade out theme song over 0.8s, then show media
    fadeThemeSong(0, 800, function () {
      playerContainer.innerHTML = html;
      mediaPlayer.classList.remove('hidden');
      triggerMediaReaction();
      // Listen for media end to resume theme song
      var mediaEl = playerContainer.querySelector('video, audio');
      if (mediaEl) {
        mediaEl.addEventListener('ended', function () {
          resumeThemeSong();
        });
      }
    });
  }

  function resumeThemeSong() {
    mediaIsPlaying = false;
    fadeThemeSong(themeVolume, 800);
  }

  function closeMedia() {
    // Stop any playing media
    var mediaEl = playerContainer.querySelector('video, audio');
    if (mediaEl) {
      mediaEl.pause();
      mediaEl.src = '';
    }
    // Remove iframes
    var iframes = playerContainer.querySelectorAll('iframe');
    iframes.forEach(function (f) { f.src = ''; });

    mediaPlayer.classList.add('hidden');
    playerContainer.innerHTML = '';
    resumeThemeSong();
  }

  // Sanitize URL for HTML attribute
  function escAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // URL submit
  urlSubmit.addEventListener('click', function () {
    var url = urlInput.value.trim();
    if (!url) return;

    var parsed = parseMediaUrl(url);

    if (parsed.type === 'youtube') {
      showMedia('<iframe src="https://www.youtube.com/embed/' + escAttr(parsed.id) + '?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
    } else if (parsed.type === 'suno') {
      // SUNO AI with UUID - play via CDN audio URL
      showMedia('<audio controls autoplay src="' + escAttr(parsed.audioUrl) + '"></audio>');
    } else if (parsed.type === 'suno-short') {
      // SUNO AI short URL - open in iframe as fallback
      showMedia('<iframe src="' + escAttr(parsed.url) + '" allow="autoplay" allowfullscreen></iframe>');
    } else if (parsed.type === 'video-url') {
      showMedia('<video controls autoplay playsinline src="' + escAttr(url) + '"></video>');
    } else if (parsed.type === 'audio-url') {
      showMedia('<audio controls autoplay src="' + escAttr(url) + '"></audio>');
    } else if (parsed.type === 'image-url') {
      showMedia('<img src="' + escAttr(url) + '" alt="投稿画像" />');
    } else {
      showMedia('<iframe src="' + escAttr(url) + '" allow="autoplay" allowfullscreen></iframe>');
    }

    urlInput.value = '';
  });

  // Enter key on URL input
  urlInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') urlSubmit.click();
  });

  // Close button
  mediaClose.addEventListener('click', closeMedia);

  // File inputs
  function handleFileSelect(file) {
    if (!file) return;
    var objUrl = URL.createObjectURL(file);
    var type = file.type;

    if (type.indexOf('video') === 0) {
      showMedia('<video controls autoplay playsinline src="' + objUrl + '"></video>');
    } else if (type.indexOf('audio') === 0) {
      showMedia('<audio controls autoplay src="' + objUrl + '"></audio>');
    } else if (type.indexOf('image') === 0) {
      showMedia('<img src="' + objUrl + '" alt="投稿画像" />');
    } else {
      showMedia('<p style="color:#6880a0;padding:20px;text-align:center;">このファイル形式は再生できません</p>');
    }
  }

  videoFileInput.addEventListener('change', function () {
    handleFileSelect(this.files[0]);
    this.value = '';
  });

  photoFileInput.addEventListener('change', function () {
    handleFileSelect(this.files[0]);
    this.value = '';
  });

  genericFileInput.addEventListener('change', function () {
    handleFileSelect(this.files[0]);
    this.value = '';
  });
})();
