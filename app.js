(function () {
  "use strict";

  const exam = window.EXAM;
  const root = document.getElementById("exam");
  const graders = []; // { el, check(): boolean, show(): void, lock(): void }

  /* ---------- 작은 도우미 ---------- */
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    kids.flat().forEach((c) => c != null && el.append(c.nodeType ? c : document.createTextNode(c)));
    return el;
  };
  const circled = (n) => "①②③④⑤⑥⑦⑧⑨⑩"[n] || `(${n + 1})`;
  const norm = (s) =>
    (s || "")
      .normalize("NFC")
      .trim()
      .replace(/^(네|예|아니요|아니오)\s*[,，]?\s*/, "")
      .replace(/[\s.,!?~。，·]/g, "");

  /* ---------- 국기 (SVG) ---------- */
  function star(cx, cy, r, rot = -90) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const rad = ((rot + i * 36) * Math.PI) / 180;
      const rr = i % 2 ? r * 0.382 : r;
      pts.push((cx + rr * Math.cos(rad)).toFixed(2) + "," + (cy + rr * Math.sin(rad)).toFixed(2));
    }
    return `<polygon points="${pts.join(" ")}" fill="#ffde00"/>`;
  }
  function trigram(x, y, angle, pattern) {
    // pattern: 3 rows, true = 끊긴 막대
    let s = `<g transform="translate(${x} ${y}) rotate(${angle})">`;
    pattern.forEach((broken, i) => {
      const yy = -5 + i * 5;
      if (broken) s += `<rect x="-6" y="${yy - 1.5}" width="5.2" height="3" /><rect x="0.8" y="${yy - 1.5}" width="5.2" height="3" />`;
      else s += `<rect x="-6" y="${yy - 1.5}" width="12" height="3" />`;
    });
    return s + "</g>";
  }
  const FLAGS = {
    kr: () =>
      `<svg viewBox="0 0 90 60"><rect width="90" height="60" fill="#fff"/>
       <g transform="rotate(33.7 45 30)">
        <circle cx="45" cy="30" r="15" fill="#0047a0"/>
        <path d="M30 30a15 15 0 0 1 30 0a7.5 7.5 0 0 1-15 0a7.5 7.5 0 0 0-15 0z" fill="#cd2e3a"/>
       </g>
       <g fill="#000">
        ${trigram(18, 12, -56.3, [false, false, false])}
        ${trigram(72, 48, -56.3, [true, true, true])}
        ${trigram(72, 12, 56.3, [true, false, true])}
        ${trigram(18, 48, 56.3, [false, true, false])}
       </g></svg>`,
    vn: () => `<svg viewBox="0 0 90 60"><rect width="90" height="60" fill="#da251d"/>${star(45, 31, 17)}</svg>`,
    cn: () =>
      `<svg viewBox="0 0 90 60"><rect width="90" height="60" fill="#de2910"/>${star(15, 15, 9)}${star(30, 6, 3, -40)}${star(36, 12, 3, -20)}${star(36, 21, 3, 0)}${star(30, 27, 3, 20)}</svg>`,
    tw: () => {
      // 청천백일만지홍기: 빨간 바탕, 왼쪽 위 파란 칸, 흰 해(빛살 12개)
      const cx = 22.5, cy = 15, pts = [];
      for (let i = 0; i < 24; i++) {
        const a = ((i * 15 - 90) * Math.PI) / 180;
        const r = i % 2 ? 6.6 : 11.25;
        pts.push((cx + r * Math.cos(a)).toFixed(2) + "," + (cy + r * Math.sin(a)).toFixed(2));
      }
      return `<svg viewBox="0 0 90 60"><rect width="90" height="60" fill="#fe0000"/>
        <rect width="45" height="30" fill="#000095"/>
        <polygon points="${pts.join(" ")}" fill="#fff"/>
        <circle cx="${cx}" cy="${cy}" r="6.4" fill="#000095"/>
        <circle cx="${cx}" cy="${cy}" r="5.6" fill="#fff"/></svg>`;
    },
    us: () => {
      let s = `<svg viewBox="0 0 90 60"><rect width="90" height="60" fill="#fff"/>`;
      for (let i = 0; i < 13; i += 2) s += `<rect y="${(i * 60) / 13}" width="90" height="${60 / 13}" fill="#b22234"/>`;
      s += `<rect width="38" height="${(7 * 60) / 13}" fill="#3c3b6e"/>`;
      for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) s += `<circle cx="${4 + c * 6}" cy="${4 + r * 6.2}" r="1.1" fill="#fff"/>`;
      return s + "</svg>";
    }
  };
  /* ---------- 그림 장면 (가구 + 이모지를 겹쳐서 그림) ---------- */
  const W = 'stroke="#6b4524" stroke-width="1.5"';
  const FURN = {
    desk: () =>
      `<rect x="30" y="48" width="6" height="40" fill="#b5b5b5"/><rect x="64" y="48" width="6" height="40" fill="#b5b5b5"/>
       <rect x="0" y="38" width="100" height="10" rx="2" fill="#c8915a" ${W}/>
       <rect x="5" y="48" width="7" height="52" fill="#8d8d8d"/><rect x="88" y="48" width="7" height="52" fill="#8d8d8d"/>`,
    chair: () =>
      `<rect x="28" y="60" width="4" height="32" fill="#aaa"/><rect x="68" y="60" width="4" height="32" fill="#aaa"/>
       <rect x="22" y="8" width="56" height="30" rx="3" fill="#d9a66b" ${W}/>
       <rect x="24" y="38" width="5" height="22" fill="#8d8d8d"/><rect x="71" y="38" width="5" height="22" fill="#8d8d8d"/>
       <rect x="12" y="58" width="76" height="9" rx="2" fill="#c8915a" ${W}/>
       <rect x="15" y="67" width="6" height="33" fill="#8d8d8d"/><rect x="79" y="67" width="6" height="33" fill="#8d8d8d"/>`,
    stool: () =>
      `<rect x="46" y="50" width="8" height="46" fill="#8a5a33"/>
       <polygon points="14,48 23,48 12,100 4,100" fill="#a26a3c"/><polygon points="77,48 86,48 96,100 88,100" fill="#a26a3c"/>
       <ellipse cx="50" cy="45" rx="46" ry="9" fill="#b07a45" ${W}/>`,
    bed: () =>
      `<rect x="0" y="28" width="11" height="72" rx="3" fill="#3fae8c"/>
       <rect x="12" y="80" width="6" height="20" fill="#7cc24f"/><rect x="92" y="80" width="6" height="20" fill="#7cc24f"/>
       <rect x="8" y="72" width="92" height="9" fill="#d98bb0"/>
       <rect x="8" y="54" width="92" height="20" rx="4" fill="#f6b3d0" stroke="#c76d96" stroke-width="1.5"/>
       <ellipse cx="24" cy="54" rx="12" ry="5" fill="#fff" stroke="#bbb"/>`,
    house: () =>
      `<rect x="10" y="40" width="80" height="60" fill="#f6dc8c" stroke="#a6862f" stroke-width="1.5"/>
       <polygon points="0,42 50,4 100,42" fill="#d9443a" stroke="#8f241d" stroke-width="1.5"/>
       <rect x="17" y="52" width="16" height="14" fill="#9fd3f0" stroke="#5b8fa8"/><rect x="67" y="52" width="16" height="14" fill="#9fd3f0" stroke="#5b8fa8"/>
       <rect x="39" y="60" width="22" height="40" fill="#5a3a22" stroke="#3b2a1c"/>`
  };
  function sceneSVG(spec) {
    const w = spec.w || 120, hh = spec.h || 100;
    let s = `<svg viewBox="0 0 ${w} ${hh}" role="img" aria-label="${spec.alt || "그림"}">`;
    spec.scene.forEach((l) => {
      if (l.f) s += `<g transform="translate(${l.x || 0} ${l.y || 0}) scale(${l.s || 1})">${FURN[l.f]()}</g>`;
      else if (l.rect) s += `<rect x="${l.rect[0]}" y="${l.rect[1]}" width="${l.rect[2]}" height="${l.rect[3]}" rx="${l.rx || 0}" fill="${l.fill || "#bbb"}"${l.stroke ? ` stroke="${l.stroke}" stroke-width="${l.sw || 1}"` : ""}/>`;
      else if (l.circle) s += `<circle cx="${l.circle[0]}" cy="${l.circle[1]}" r="${l.circle[2]}" fill="${l.fill || "#ddd"}"${l.stroke ? ` stroke="${l.stroke}" stroke-width="${l.sw || 1}"` : ""}/>`;
      else if (l.line) s += `<line x1="${l.line[0]}" y1="${l.line[1]}" x2="${l.line[2]}" y2="${l.line[3]}" stroke="${l.stroke || "#d33"}" stroke-width="${l.sw || 1.5}"/>`;
      else if (l.arrow) {
        const [x1, y, x2] = l.arrow;
        s += `<line x1="${x1 + 6}" y1="${y}" x2="${x2 - 6}" y2="${y}" stroke="#127c86" stroke-width="2.5"/>
              <polygon points="${x1},${y} ${x1 + 8},${y - 5} ${x1 + 8},${y + 5}" fill="#127c86"/>
              <polygon points="${x2},${y} ${x2 - 8},${y - 5} ${x2 - 8},${y + 5}" fill="#127c86"/>`;
      } else if (l.t) s += `<text x="${l.x}" y="${l.y}" font-size="${l.size || 11}" text-anchor="${l.anchor || "middle"}" fill="${l.fill || "#1d2430"}" font-weight="${l.bold ? 700 : 500}">${l.t}</text>`;
      else if (l.e) s += `<text x="${l.x}" y="${l.y}" font-size="${l.size || 24}" text-anchor="middle" dominant-baseline="central">${l.e}</text>`;
    });
    return s + "</svg>";
  }

  function pic(p, cls = "pic") {
    if (!p) return null;
    if (typeof p === "object" && p.scene) {
      const el = h("div", { class: cls + " scene", html: sceneSVG(p) });
      el.style.setProperty("--scene-w", (p.px || (p.w || 120) * 0.9) + "px");
      return el;
    }
    if (p.startsWith("flag:")) return h("div", { class: cls + " flag", html: FLAGS[p.slice(5)]() });
    return h("div", { class: cls, "aria-hidden": "true" }, p);
  }

  /* ---------- 듣기 (음성 파일 또는 브라우저 읽어 주기) ---------- */
  let koVoice = null;
  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices().filter((v) => /^ko/i.test(v.lang));
    koVoice = vs.find((v) => /google|yuna|heami|sunhi|natural/i.test(v.name)) || vs[0] || null;
  }
  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  let playing = null; // { btn, stop() }
  function stopPlaying() {
    if (!playing) return;
    playing.stop();
    playing.btn.classList.remove("playing");
    playing.btn.textContent = "▶ 듣기";
    playing = null;
  }
  function tts(listen, btn) {
    if (!("speechSynthesis" in window)) {
      alert("이 브라우저는 읽어 주기 기능을 지원하지 않아요. 크롬이나 엣지, 사파리에서 열어 주세요.");
      return stopPlaying();
    }
    speechSynthesis.cancel();
    const lines = listen.lines;
    lines.forEach(([spk, text], i) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ko-KR";
      if (koVoice) u.voice = koVoice;
      u.rate = listen.rate || 0.85;
      u.pitch = /^(나|여자|여)$/.test(spk) ? 1.3 : 0.8;
      if (i === lines.length - 1) u.onend = () => playing && playing.btn === btn && stopPlaying();
      speechSynthesis.speak(u);
    });
    playing.stop = () => speechSynthesis.cancel();
  }
  function listenButton(listen) {
    const btn = h("button", { type: "button", class: "listen-btn" }, "▶ 듣기");
    btn.addEventListener("click", () => {
      if (playing && playing.btn === btn) return stopPlaying();
      stopPlaying();
      playing = { btn, stop() {} };
      btn.classList.add("playing");
      btn.textContent = "■ 멈추기";
      if (listen.audio) {
        const a = new Audio(listen.audio);
        playing.stop = () => a.pause();
        a.onended = () => playing && playing.btn === btn && stopPlaying();
        a.play().catch(() => tts(listen, btn)); // 음성 파일이 없으면 읽어 주기로 대신함
      } else tts(listen, btn);
    });
    return btn;
  }

  /* ---------- 결과 표시 ---------- */
  function mark(el, ok, answerText) {
    el.classList.add(ok ? "is-right" : "is-wrong");
    if (!ok && answerText) el.append(h("span", { class: "answer-key" }, "정답: " + answerText));
  }

  /* ---------- 유형별 렌더러 ---------- */
  const R = {};

  R.match = (g, wrap) => {
    const list = h("div", { class: "match-grid" });
    g.items.forEach((it, i) => {
      const sel = h("select", { "aria-label": `(${i + 1}) 알맞은 말` },
        h("option", { value: "" }, "— 고르세요 —"),
        g.options.map((o) => h("option", { value: o }, o)));
      const cell = h("div", { class: "match-item" }, h("span", { class: "num" }, `(${i + 1})`), pic(it.pic), sel);
      list.append(cell);
      graders.push({
        check: () => sel.value === it.answer,
        show(ok) { mark(cell, ok, it.answer); },
        lock() { sel.disabled = true; }
      });
    });
    wrap.append(list);
  };

  // 그림을 보고 단어 고르기 (버튼)
  R.picword = (g, wrap) => {
    const list = h("div", { class: "pw-list" });
    g.items.forEach((it, i) => {
      const name = `pw-${graders.length}`;
      const btns = h("div", { class: "pw-opts" },
        g.options.map((o) => h("label", { class: "pill" }, h("input", { type: "radio", name, value: o }), h("span", {}, o))));
      const row = h("div", { class: "pw-item" }, h("span", { class: "num" }, `(${i + 1})`),
        h("div", { class: "pw-pic" }, pic(it.pic, "pic big"), it.label ? h("b", { class: "pw-label" }, it.label) : null), btns);
      list.append(row);
      graders.push({
        check: () => (row.querySelector("input:checked") || {}).value === it.answer,
        show(ok) { mark(row, ok, it.answer); },
        lock() { row.querySelectorAll("input").forEach((x) => (x.disabled = true)); }
      });
    });
    wrap.append(list);
  };

  // 단어를 보고 그림 고르기
  R.wordpic = (g, wrap) => {
    const list = h("div", { class: "wp-list" });
    g.items.forEach((it, i) => {
      const name = `wp-${graders.length}`;
      const opts = h("div", { class: "wp-opts" });
      g.options.forEach((o, k) =>
        opts.append(h("label", { class: "choice wp-card" },
          h("input", { type: "radio", name, value: String(k) }),
          h("span", { class: "mark" }, circled(k)),
          h("span", { class: "pic-opt", "aria-label": `${k + 1}번 그림` }, o))));
      const row = h("div", { class: "wp-item" },
        h("div", { class: "wp-word" }, h("span", { class: "num" }, `(${i + 1})`), h("b", {}, it.word)),
        opts);
      list.append(row);
      graders.push({
        check: () => (row.querySelector("input:checked") || {}).value === String(it.answer),
        show(ok) {
          mark(row, ok, ok ? null : circled(it.answer));
          opts.children[it.answer].classList.add("correct-opt");
        },
        lock() { row.querySelectorAll("input").forEach((x) => (x.disabled = true)); }
      });
    });
    wrap.append(list);
  };

  // 대화 속 빈칸 (듣기) — 문장 안의 {0}, {1} … 자리에 빈칸이 들어감
  R.dialog = (g, wrap) => {
    g.items.forEach((it, i) => {
      const box = h("div", { class: "dialog" });
      if (it.listen || it.pic || g.items.length > 1)
        box.append(h("div", { class: "dialog-head" }, h("span", { class: "num" }, `(${i + 1})`), it.pic ? pic(it.pic) : null, it.listen ? listenButton(it.listen) : null));
      it.lines.forEach(([spk, text]) => {
        const line = h("div", { class: "dialog-line" }, h("span", { class: "spk" }, spk));
        const body = h("span", { class: "dialog-text" });
        text.split(/\{(\d)\}/).forEach((part, k) => {
          if (k % 2 === 0) { if (part) body.append(part); return; }
          const n = Number(part), ans = it.answers[n];
          const input = h("input", { type: "text", class: "blank", autocomplete: "off", spellcheck: "false", "aria-label": `(${i + 1}) ${circled(n)} 빈칸` });
          const slot = h("span", { class: "blank-wrap" }, h("span", { class: "mark-num" }, circled(n)), input);
          body.append(slot);
          graders.push({
            check: () => ans.some((a) => norm(a) === norm(input.value)),
            show(ok) { mark(slot, ok, ans[0]); },
            lock() { input.readOnly = true; }
          });
        });
        line.append(body);
        box.append(line);
      });
      wrap.append(box);
    });
  };

  R.fill = (g, wrap) => {
    const list = h("div", { class: "fill-list" + (g.short ? " short" : "") });
    g.items.forEach((it, i) => {
      const input = h("input", {
        type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
        class: g.short ? "blank blank-short" : "blank",
        "aria-label": `(${i + 1}) 빈칸`
      });
      const num = g.card || g.circled ? circled(i) : `(${i + 1})`;
      const line = h("div", { class: "fill-line" },
        it.before ? h("span", {}, it.before + " ") : null,
        input,
        it.after ? h("span", {}, (g.tight ? "" : " ") + it.after) : g.short ? null : h("span", {}, "."),
        it.hint ? h("span", { class: "hint" }, ` (${it.hint})`) : null);
      const row = h("div", { class: "fill-item" + (it.pic ? " with-pic" : "") },
        h("span", { class: "num" }, num),
        it.pic ? pic(it.pic) : null,
        h("div", { class: "fill-body" }, it.q ? h("div", { class: "q" }, it.q) : null, line));
      list.append(row);
      graders.push({
        check: () => it.answers.some((a) => norm(a) === norm(input.value)),
        show(ok) { mark(row, ok, it.answers[0]); },
        lock() { input.readOnly = true; }
      });
    });
    wrap.append(list);
  };

  R.pick = (g, wrap) => {
    const list = h("div", { class: "pick-list" });
    g.items.forEach((it, i) => {
      const name = `pick-${graders.length}`;
      const btns = g.choices.map((c) =>
        h("label", { class: "pill" }, h("input", { type: "radio", name, value: c }), h("span", {}, c)));
      const row = h("div", { class: "pick-item" },
        h("span", { class: "num" }, `(${i + 1})`),
        h("span", { class: "word" }, it.word),
        h("span", { class: "paren" }, "(", ...btns.flatMap((b, k) => (k ? ["/", b] : [b])), ")"),
        it.tail ? h("span", {}, " " + it.tail) : h("span", {}, "."));
      list.append(row);
      graders.push({
        check: () => (row.querySelector("input:checked") || {}).value === it.answer,
        show(ok) { mark(row, ok, it.answer); },
        lock() { row.querySelectorAll("input").forEach((x) => (x.disabled = true)); }
      });
    });
    wrap.append(list);
  };

  R.ox = (g, wrap) => {
    const list = h("div", { class: "ox-list" });
    g.items.forEach((it, i) => {
      const name = `ox-${graders.length}`;
      const row = h("div", { class: "ox-item" },
        h("span", { class: "num" }, `(${i + 1})`),
        it.pic ? pic(it.pic) : null,
        h("span", { class: "q" }, it.q),
        h("span", { class: "ox-btns" },
          ["O", "X"].map((v) => h("label", { class: "pill ox" }, h("input", { type: "radio", name, value: v }), h("span", {}, v)))));
      list.append(row);
      graders.push({
        check: () => (row.querySelector("input:checked") || {}).value === it.answer,
        show(ok) { mark(row, ok, it.answer); },
        lock() { row.querySelectorAll("input").forEach((x) => (x.disabled = true)); }
      });
    });
    wrap.append(list);
  };

  R.choice = (g, wrap) => {
    g.items.forEach((it) => {
      const name = `ch-${graders.length}`;
      const opts = h("div", { class: "choices" + (g.picOptions ? " pic-choices" : it.options.every((o) => o.length <= 6) ? " two-col" : "") });
      it.options.forEach((o, k) => {
        opts.append(h("label", { class: "choice" },
          h("input", { type: "radio", name, value: String(k) }),
          h("span", { class: "mark" }, circled(k)),
          g.picOptions ? h("span", { class: "pic-opt", "aria-label": `${k + 1}번 그림` }, o) : h("span", {}, o)));
      });
      wrap.append(opts);
      graders.push({
        check: () => (opts.querySelector("input:checked") || {}).value === String(it.answer),
        show(ok) {
          mark(opts, ok, ok ? null : circled(it.answer) + (g.picOptions ? "" : " " + it.options[it.answer]));
          opts.children[it.answer].classList.add("correct-opt");
        },
        lock() { opts.querySelectorAll("input").forEach((x) => (x.disabled = true)); }
      });
    });
  };

  R.free = (g, wrap) => {
    g.items.forEach((it) => {
      wrap.append(h("textarea", { class: "free", rows: "5", placeholder: it.placeholder || "" }));
      wrap.append(h("p", { class: "teacher-note" }, "※ 이 문항은 자동 채점하지 않아요. 선생님이 확인해요."));
    });
  };

  R.self = (g, wrap) => {
    const table = h("table", { class: "self-table" });
    g.items.forEach((it, i) => {
      const name = `self-${i}`;
      table.append(h("tr", {},
        h("th", {}, it.area),
        h("td", {}, it.q),
        h("td", { class: "self-scale" },
          it.scale.map((s) => h("label", { class: "pill" }, h("input", { type: "radio", name, value: s }), h("span", {}, s))))));
    });
    wrap.append(table);
    if (g.footnote) wrap.append(h("p", { class: "teacher-note" }, g.footnote));
    if (g.checklist) {
      const t = h("table", { class: "self-table" }, h("tr", {}, h("th", {}, "영역"), h("th", {}, "내용"), h("th", {}, "교사 확인")));
      g.checklist.forEach((c) =>
        t.append(h("tr", {},
          h("th", {}, c.area),
          h("td", { class: "checks" }, c.words.map((w) => h("label", { class: "check" }, h("input", { type: "checkbox" }), " " + w))),
          h("td", { class: "teacher-cell" }, ""))));
      wrap.append(t);
    }
  };

  /* ---------- 화면 만들기 ---------- */
  function render() {
    document.title = exam.title;
    document.getElementById("title").textContent = exam.title;
    document.getElementById("subtitle").textContent = exam.subtitle;

    exam.sections.forEach((sec) => {
      const s = h("section", { class: "section" },
        h("header", { class: "sec-head" },
          h("h2", {}, sec.heading),
          h("span", { class: "page-tag" }, `익힘책 ${sec.page}쪽`)));

      if (sec.passage) {
        s.append(h("p", { class: "note" }, sec.passage.note));
        s.append(h("div", { class: "passage" }, sec.passage.text));
      }

      sec.groups.forEach((g) => {
        const wrap = h("div", { class: "group" });
        if (g.note) wrap.append(h("p", { class: "note", html: g.note }));
        if (g.passage) wrap.append(h("div", { class: "passage" }, g.passage));
        if (g.listen) wrap.append(h("div", { class: "listen-row" }, listenButton(g.listen)));
        if (g.figure) wrap.append(pic(g.figure, typeof g.figure === "string" ? "figure small" : "figure"));
        wrap.append(h("h3", { class: "instr", html: g.instruction.replace(/</g, "&lt;").replace(/&lt;(\/?)(u|b|br)>/g, "<$1$2>") }));
        if (g.example) {
          wrap.append(h("div", { class: "example" },
            h("span", { class: "ex-label" }, "보기"),
            g.example.pic ? pic(g.example.pic) : null,
            h("div", {}, g.example.lines.map((l) => h("div", { html: l })))));
        }
        if (g.card) {
          wrap.append(h("div", { class: "id-card" },
            pic(g.card.pic, "id-photo"),
            h("div", { class: "id-title" }, g.card.title),
            h("div", { class: "id-name" }, g.card.name),
            h("div", { class: "id-org" }, g.card.org)));
        }
        if (g.flow) {
          wrap.append(h("ol", { class: "flow" },
            g.flow.map((f) => h("li", {},
              f.num != null ? h("span", { class: "flow-num" }, circled(f.num)) : null,
              h("span", { class: "flow-pic", "aria-hidden": "true" }, f.pic),
              h("span", { class: "flow-label" }, f.label)))));
        }
        if (g.box) wrap.append(h("div", { class: "box" }, g.box));
        R[g.type](g, wrap);
        s.append(wrap);
      });
      root.append(s);
    });

    document.getElementById("total").textContent = graders.length;
  }

  /* ---------- 채점 ---------- */
  function grade() {
    const name = document.getElementById("student").value.trim();
    let right = 0;
    graders.forEach((g) => {
      const ok = g.check();
      if (ok) right++;
      g.show(ok);
      g.lock();
    });
    const total = graders.length;
    const score = Math.round((right / total) * 100);
    const box = document.getElementById("result");
    box.hidden = false;
    box.innerHTML = `<strong>${name ? name + " 학생 " : ""}점수: ${score}점</strong> <span>(${right} / ${total} 문항 정답)</span>
      <p>틀린 문항은 빨간색으로, 정답은 그 아래에 보여요. 자유 쓰기와 자기 평가는 점수에 들어가지 않아요.</p>`;
    document.body.classList.add("graded");
    document.getElementById("submit").hidden = true;
    document.getElementById("retry").hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function countUnanswered() {
    let n = 0;
    root.querySelectorAll(".match-item select").forEach((s) => !s.value && n++);
    root.querySelectorAll("input.blank").forEach((i) => !i.value.trim() && n++);
    root.querySelectorAll(".pick-item, .ox-item, .choices, .pw-item, .wp-item").forEach((el) => !el.querySelector("input:checked") && n++);
    return n;
  }

  document.getElementById("submit").addEventListener("click", () => {
    const left = countUnanswered();
    if (left && !confirm(`아직 답하지 않은 문항이 ${left}개 있어요. 제출할까요?`)) return;
    grade();
  });
  document.getElementById("retry").addEventListener("click", () => {
    if (confirm("답을 모두 지우고 다시 풀까요?")) location.reload();
  });
  document.getElementById("print").addEventListener("click", () => window.print());

  render();
})();
