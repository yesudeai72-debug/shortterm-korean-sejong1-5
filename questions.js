/*
 * 세종한국어 1 익힘책 · 5과 물건 사기 2 — 시험 문항 데이터
 * 범위: 익힘책 66~69쪽, 72~76쪽 (70쪽 듣기, 71쪽 말하기 제외)
 * 정답은 익힘책 뒤의 「정답」을 따랐습니다.
 * 문항 유형과 그림 표기는 README.md를 보세요.
 */

/* ---------- 그림 도우미 ---------- */
// 이모지를 n개 늘어놓은 그림 (개수를 세는 문제용)
function grid(e, n, cols = 5, size = 24, alt = "") {
  const step = size * 1.15, rows = Math.ceil(n / cols), c = Math.min(n, cols);
  const scene = [];
  for (let i = 0; i < n; i++) scene.push({ e, x: 4 + step / 2 + (i % cols) * step, y: 4 + step / 2 + Math.floor(i / cols) * step, size });
  return { w: c * step + 8, h: rows * step + 8, px: (c * step + 8) * 0.95, alt, scene };
}
// 병 그림
const BOTTLE = { water: ["#d6ecfb", "#6fa8d6", "물"], cola: ["#5a2d1e", "#d63a2f", "COLA"], juice: ["#f7a531", "#3c9a4b", "주스"] };
function bottle(x, y, kind) {
  const [body, band, label] = BOTTLE[kind];
  return [
    { rect: [x + 6, y + 2, 10, 10], fill: body, stroke: "#777", sw: 0.8 },
    { rect: [x + 5, y, 12, 5], rx: 1, fill: "#2b6cb0" },
    { rect: [x, y + 10, 22, 46], rx: 6, fill: body, stroke: "#777", sw: 0.8 },
    { rect: [x, y + 26, 22, 12], fill: band },
    { t: label, x: x + 11, y: y + 35, size: 6, bold: true, fill: "#fff" }
  ];
}
function bottles(kind, n, alt = "") {
  return { w: n * 28 + 6, h: 62, px: (n * 28 + 6) * 1.4, alt, scene: Array.from({ length: n }, (_, i) => bottle(4 + i * 28, 3, kind)).flat() };
}
// 여러 그림을 한 줄로
function row(parts, alt = "") {
  let x = 0; const scene = []; let hmax = 0;
  parts.forEach((p) => {
    p.scene.forEach((l) => {
      const c = { ...l };
      if (c.e || c.t) c.x += x;
      if (c.rect) c.rect = [c.rect[0] + x, ...c.rect.slice(1)];
      if (c.circle) c.circle = [c.circle[0] + x, ...c.circle.slice(1)];
      scene.push(c);
    });
    x += p.w + 6; hmax = Math.max(hmax, p.h);
  });
  return { w: x, h: hmax, px: x * 0.95, alt, scene };
}
const eraserScene = (n) => ({
  w: n * 34 + 6, h: 36, px: (n * 34 + 6) * 1.05, alt: `지우개 ${n}개`,
  scene: Array.from({ length: n }, (_, i) => [
    { rect: [4 + i * 34, 8, 30, 18], rx: 3, fill: "#f4f0e6", stroke: "#999", sw: 0.8 },
    { rect: [18 + i * 34, 6, 16, 22], rx: 2, fill: i % 2 ? "#e0a128" : "#3f74cf" }
  ]).flat()
});

const S = {
  // 66쪽
  chairs: grid("🪑", 3, 3, 30, "의자 세 개"),
  cups: grid("🥤", 5, 5, 26, "컵 다섯 개"),
  erasers: eraserScene(4),
  pencils: grid("✏️", 3, 3, 28, "연필 세 개"),
  // 68쪽
  coffee1: grid("☕", 1, 1, 40, "커피 한 잔"),
  book1: grid("📘", 1, 1, 40, "책 한 권"),
  cola1: bottles("cola", 1, "콜라 한 병"),
  person1: grid("🧍‍♀️", 1, 1, 40, "사람 한 명"),
  apples4: grid("🍎", 4, 4, 26, "사과 네 개"),
  water2: bottles("water", 2, "물 두 병"),
  students8: grid("🧑‍🎓", 8, 4, 24, "학생 여덟 명"),
  coffee4: grid("☕", 4, 4, 26, "커피 네 잔"),
  books3: grid("📘", 3, 3, 28, "책 세 권")
};
// 69쪽
S.breadMilk = grid("🍞🥛", 1, 1, 30, "빵과 우유");
S.bookPen = grid("📙🖊️", 1, 1, 30, "책과 펜");
S.eraserPencil = row([eraserScene(1), grid("✏️", 1, 1, 28)], "지우개와 연필");
S.juiceWater = row([bottles("juice", 1), bottles("water", 1)], "주스와 물");
S.bagClothes = grid("👜👚", 1, 1, 30, "가방과 옷");
S.apples3oranges2 = row([grid("🍎", 3, 3, 24), grid("🍊", 2, 2, 24)], "사과 세 개와 오렌지 두 개");
S.teacherStudents = row([grid("👩‍🏫", 1, 1, 30), grid("🧒", 3, 3, 26)], "선생님 한 명과 학생 세 명");
S.deskThings = {
  w: 130, h: 100, alt: "책상 위에 오렌지 주스 한 잔과 책 네 권",
  scene: [{ f: "desk", x: 15, y: 10 }, { e: "🧃", x: 40, y: 36, size: 22 },
    { rect: [70, 40, 34, 7], fill: "#3f74cf" }, { rect: [72, 33, 32, 7], fill: "#e0a128" }, { rect: [70, 26, 34, 7], fill: "#4caf50" }, { rect: [73, 19, 30, 7], fill: "#d64541" }]
};
S.breadWater = row([grid("🥖", 1, 1, 34), bottles("water", 2)], "빵 한 개와 물 두 병");
S.booksPens = row([grid("📙", 2, 2, 28), grid("🖊️", 3, 3, 26)], "책 두 권과 펜 세 개");

// 72쪽 가게 가격표
const cell = (x, y, e, cnt, price) => [
  { rect: [x, y, 70, 56], rx: 3, fill: "#fff", stroke: "#cfc6b0" },
  { e, x: x + 35, y: y + 20, size: 22 },
  { t: cnt, x: x + 6, y: y + 50, size: 8, fill: "#555", anchor: "start" },
  { t: price, x: x + 64, y: y + 50, size: 11, bold: true, anchor: "end" }
];
S.shop = {
  w: 236, h: 150, alt: "세종 가게 가격표",
  scene: [
    { rect: [0, 0, 236, 150], rx: 4, fill: "#efe8d4" },
    { t: "세종 가게", x: 118, y: 18, size: 12, bold: true, fill: "#555" },
    ...cell(6, 26, "🍎🍎", "2개", "2,500원"), ...cell(83, 26, "🍊", "5개", "8,000원"), ...cell(160, 26, "🥖", "1개", "1,000원"),
    ...cell(6, 88, "💧", "1병", "500원"), ...cell(83, 88, "🥛🥛", "2개", "3,000원"), ...cell(160, 88, "🧃", "1병", "1,800원")
  ]
};
// 73쪽 쓰기 1번
S.things = {
  w: 250, h: 130, alt: "지우개 두 개, 연필 세 자루, 주스 네 병, 물 두 병, 빵 두 개, 사과 세 개",
  scene: [
    ...eraserScene(2).scene.map((l) => (l.rect ? { ...l, rect: [l.rect[0] + 4, l.rect[1] + 2, l.rect[2], l.rect[3]] } : l)),
    { e: "✏️✏️✏️", x: 180, y: 18, size: 18 },
    ...Array.from({ length: 4 }, (_, i) => bottle(8 + i * 26, 42, "juice")).flat(),
    ...Array.from({ length: 2 }, (_, i) => bottle(152 + i * 28, 42, "water")).flat(),
    { e: "🥐🥐", x: 55, y: 116, size: 20 }, { e: "🍎🍎🍎", x: 180, y: 116, size: 20 }
  ]
};

/* 정답: 두 낱말의 순서를 바꿔 써도 맞게 */
const both = (a, b, tail) => [`${a}하고 ${b}${tail}`, `${b}하고 ${a}${tail}`];

window.EXAM = {
  title: "세종한국어 1 · 5과 물건 사기 2",
  subtitle: "익힘책 66~69쪽, 72~76쪽 단원 평가",
  sections: [
    /* ---------------- 66쪽 ---------------- */
    {
      page: 66,
      heading: "어휘와 표현 1",
      groups: [
        {
          instruction: "1. (1) 그림을 보고 몇 개인지 알맞은 말을 고르세요.",
          type: "picword",
          options: ["하나", "둘", "셋", "넷", "다섯"],
          items: [
            { pic: bottles("water", 1, "물 한 병"), label: "물", answer: "하나" },
            { pic: grid("🍞", 4, 4, 24, "빵 네 개"), label: "빵", answer: "넷" },
            { pic: grid("🥛", 2, 2, 26, "우유 두 개"), label: "우유", answer: "둘" },
            { pic: grid("🍅", 5, 5, 20, "토마토 다섯 개"), label: "토마토", answer: "다섯" },
            { pic: bottles("juice", 3, "오렌지 주스 세 병"), label: "오렌지 주스", answer: "셋" }
          ]
        },
        {
          instruction: "(2) 알맞은 숫자를 고르세요.",
          type: "picword",
          options: ["1", "2", "3", "4", "5"],
          items: [
            { label: "셋", answer: "3" },
            { label: "둘", answer: "2" },
            { label: "넷", answer: "4" },
            { label: "다섯", answer: "5" },
            { label: "하나", answer: "1" }
          ]
        },
        {
          instruction: "2. 그림을 보고 알맞은 말을 쓰세요.",
          example: { pic: S.chairs, lines: ["가: 의자가 몇 개 있어요?", "나: 의자가 <u>세</u> 개 있어요."] },
          type: "fill",
          short: true,
          items: [
            { pic: S.cups, q: "가: 컵이 몇 개 있어요?", before: "나: 컵이", after: "개 있어요.", answers: ["다섯"] },
            { pic: S.erasers, q: "가: 지우개가 몇 개 있어요?", before: "나: 지우개가", after: "개 있어요.", answers: ["네"] },
            { pic: S.pencils, q: "가: 연필이 몇 개 있어요?", before: "나: 연필이", after: "개 있어요.", answers: ["세"] }
          ]
        }
      ]
    },

    /* ---------------- 67쪽 ---------------- */
    {
      page: 67,
      heading: "문법 1: -ㅂ니다/습니다, -ㅂ니까/습니까",
      groups: [
        {
          instruction: "1. <보기>와 같이 쓰세요.",
          example: { lines: ["마크 씨는 학생<u>입니다</u>.　마크 씨는 학생<u>입니까</u>?"] },
          type: "fill",
          short: true,
          tight: true,
          items: [
            { before: "저는 유키", after: ".", answers: ["입니다"] },
            { before: "사과가 얼마", after: "?", answers: ["입니까"] },
            { before: "민수 씨는 의사", after: ".", answers: ["입니다"] },
            { before: "토야 씨는 직업이 무엇", after: "?", answers: ["입니까"] }
          ]
        },
        {
          instruction: "2. <보기>와 같이 문장을 완성하세요.",
          example: { lines: ["가: 민수 씨는 무엇을 <u>합니까</u>? (하다)", "나: 민수 씨는 전화를 <u>합니다</u>."] },
          type: "dialog",
          items: [
            { lines: [["가", "마크 씨는 어디에 {0}? (가다)"], ["나", "마크 씨는 학교에 {1}."]], answers: [["갑니까"], ["갑니다"]] },
            { lines: [["가", "수진 씨는 무엇을 {0}? (사다)"], ["나", "수진 씨는 옷을 {1}."]], answers: [["삽니까"], ["삽니다"]] },
            { lines: [["가", "타완 씨는 무엇을 {0}? (먹다)"], ["나", "타완 씨는 밥을 {1}."]], answers: [["먹습니까"], ["먹습니다"]] },
            { lines: [["가", "민수 씨는 무엇을 {0}? (읽다)"], ["나", "민수 씨는 책을 {1}."]], answers: [["읽습니까"], ["읽습니다"]] }
          ]
        }
      ]
    },

    /* ---------------- 68쪽 ---------------- */
    {
      page: 68,
      heading: "어휘와 표현 2",
      groups: [
        {
          instruction: "1. 그림을 보고 알맞은 단위를 고르세요.",
          type: "picword",
          options: ["병", "명", "권", "잔"],
          items: [
            { pic: S.coffee1, answer: "잔" },
            { pic: S.book1, answer: "권" },
            { pic: S.cola1, answer: "병" },
            { pic: S.person1, answer: "명" }
          ]
        },
        {
          instruction: "2. 그림을 보고 <보기>와 같이 대화를 완성하세요.",
          example: { pic: S.apples4, lines: ["가: 사과가 <u>몇 개</u> 있어요?", "나: <u>네 개 있어요</u>."] },
          type: "dialog",
          items: [
            { pic: S.water2, lines: [["가", "물이 {0} 있어요?"], ["나", "{1}."]], answers: [["몇 병"], ["두 병 있어요", "물이 두 병 있어요"]] },
            { pic: S.students8, lines: [["가", "학생이 {0} 있어요?"], ["나", "{1}."]], answers: [["몇 명"], ["여덟 명 있어요", "학생이 여덟 명 있어요"]] },
            { pic: S.coffee4, lines: [["가", "커피를 {0} 마셔요?"], ["나", "{1}."]], answers: [["몇 잔"], ["네 잔 마셔요", "커피를 네 잔 마셔요"]] },
            { pic: S.books3, lines: [["가", "마크 씨가 책을 {0} 사요?"], ["나", "{1}."]], answers: [["몇 권"], ["세 권 사요", "책을 세 권 사요", "마크 씨가 책을 세 권 사요"]] }
          ]
        }
      ]
    },

    /* ---------------- 69쪽 ---------------- */
    {
      page: 69,
      heading: "문법 2: 하고",
      groups: [
        {
          instruction: "1. <보기>와 같이 쓰세요.",
          example: { pic: S.breadMilk, lines: ["<u>빵하고 우유</u> 주세요."] },
          type: "fill",
          items: [
            { pic: S.bookPen, before: "", after: "주세요.", answers: [...both("책", "펜", ""), ...both("공책", "펜", "")] },
            { pic: S.eraserPencil, before: "", after: "주세요.", answers: both("연필", "지우개", "") },
            { pic: S.juiceWater, before: "", after: "주세요.", answers: both("주스", "물", "") },
            { pic: S.bagClothes, before: "", after: "주세요.", answers: both("가방", "옷", "") }
          ]
        },
        {
          instruction: "2. <보기>와 같이 문장을 완성하세요.",
          example: { pic: S.apples3oranges2, lines: ["가: 무엇이 있어요?", "나: <u>사과 세 개하고 오렌지 두 개가 있어요</u>."] },
          type: "fill",
          items: [
            { pic: S.teacherStudents, q: "가: 교실에 누가 있어요?", before: "나:", answers: ["선생님 한 명하고 학생 세 명이 있어요", "학생 세 명하고 선생님 한 명이 있어요"] },
            { pic: S.deskThings, q: "가: 책상 위에 무엇이 있어요?", before: "나:", answers: ["오렌지 주스 한 잔하고 책 네 권이 있어요", "책 네 권하고 오렌지 주스 한 잔이 있어요", "주스 한 잔하고 책 네 권이 있어요"] },
            { pic: S.breadWater, q: "가: 뭐 드릴까요?", before: "나:", answers: ["빵 한 개하고 물 두 병을 주세요", "빵 한 개하고 물 두 병 주세요", "물 두 병하고 빵 한 개를 주세요", "물 두 병하고 빵 한 개 주세요"] },
            { pic: S.booksPens, q: "가: 무엇을 사요?", before: "나:", answers: ["책 두 권하고 펜 세 개를 사요", "책 두 권하고 펜 세 개 사요", "펜 세 개하고 책 두 권을 사요", "펜 세 개하고 책 두 권 사요"] }
          ]
        }
      ]
    },

    /* ---------------- 72쪽 읽기 ---------------- */
    {
      page: 72,
      heading: "읽기",
      groups: [
        {
          note: "※ [1~2] 다음을 읽고 질문에 답하세요.",
          figure: S.shop,
          instruction: "1. 읽은 내용과 같으면 O, 다르면 X 하세요.",
          type: "ox",
          items: [
            { q: "우유 두 개는 삼천 원이에요.", answer: "O" },
            { q: "오렌지 다섯 개는 구천 원이에요.", answer: "X" },
            { q: "빵 두 개는 이천 원이에요.", answer: "O" }
          ]
        },
        {
          instruction: "2. 다음 메모를 읽고 질문에 답하세요.",
          box: "📝 사과 4개\n　 빵 3개\n　 물 1병",
          type: "fill",
          items: [
            { q: "무엇을 사요?", before: "사과 네 개하고", answers: ["빵 세 개하고 물 한 병을 사요", "빵 세 개하고 물 한 병 사요", "빵 세 개하고 물 한 병"] },
            { q: "모두 얼마예요?", before: "", answers: ["팔천오백 원이에요", "모두 팔천오백 원이에요", "팔천오백 원", "8,500원이에요", "8,500원"] }
          ]
        }
      ]
    },

    /* ---------------- 73쪽 쓰기 ---------------- */
    {
      page: 73,
      heading: "쓰기",
      groups: [
        {
          instruction: "1. 무엇이 얼마나 있어요? 그림을 보고 <보기>와 같이 글을 완성하세요.",
          figure: S.things,
          example: { lines: ["<u>지우개 두 개하고 연필 세 자루가 있습니다</u>."] },
          type: "fill",
          items: [
            { hint: "주스, 물", before: "", answers: ["주스 네 병하고 물 두 병이 있습니다", "주스 네 병하고 물 두 병이 있어요", "물 두 병하고 주스 네 병이 있습니다", "물 두 병하고 주스 네 병이 있어요"] },
            { hint: "빵, 사과", before: "", answers: ["빵 두 개하고 사과 세 개가 있습니다", "빵 두 개하고 사과 세 개가 있어요", "사과 세 개하고 빵 두 개가 있습니다", "사과 세 개하고 빵 두 개가 있어요"] }
          ]
        },
        {
          instruction: "2. 친구하고 공원에 가요. 공원에서 밥을 먹어요. 무엇을 사요? 얼마나 사요? 써 보세요.",
          figure: "🛒🧺",
          type: "free",
          items: [{ placeholder: "저는 빵 두 개하고 우유 한 개를 삽니다. …" }]
        }
      ]
    },

    /* ---------------- 74~76쪽 ---------------- */
    {
      page: "74~76",
      heading: "실력 확인하기",
      groups: [
        {
          note: "※ [1~2] (　　)에 알맞은 것을 고르세요.",
          instruction: "1.",
          box: "책상 위에 책이 몇 (　　) 있어요?",
          type: "choice",
          items: [{ options: ["병", "권", "명", "잔"], answer: 1 }]
        },
        {
          instruction: "2.",
          box: "교실에 선생님(　　) 학생이 있어요.",
          type: "choice",
          items: [{ options: ["이", "는", "을", "하고"], answer: 3 }]
        },
        {
          note: "※ [3~4] 다음 밑줄 친 부분에 들어갈 말로 알맞은 것을 고르세요.",
          instruction: "3.",
          box: "가: ____________________?\n나: 오렌지 두 개 주세요.",
          type: "choice",
          items: [{ options: ["몇 개 있어요", "오렌지 있어요", "무엇을 드릴까요", "오렌지는 얼마예요"], answer: 2 }]
        },
        {
          instruction: "4.",
          box: "가: 공책하고 펜 있어요?\n나: ____________________.",
          type: "choice",
          items: [{ options: ["네, 모두 있습니다", "펜 다섯 개 주세요", "공책하고 펜을 사요", "죄송합니다, 사과가 없습니다"], answer: 0 }]
        },
        {
          instruction: "5. 다음 중 <u>틀린</u> 것을 고르세요.",
          type: "choice",
          items: [{ options: ["펜 하나를 사요.", "커피를 두 잔 마셔요.", "사과 다섯 개 주세요.", "학생이 열한 병 있어요."], answer: 3 }]
        },
        {
          note: "※ [6~7] 다음을 읽고 질문에 답하세요.",
          passage: "점원: 뭐 드릴까요?\n로라: 빵하고 우유하고 물 있어요?\n점원: 물이 없어요. 빵하고 우유가 있어요. 몇 개 드릴까요?\n로라: 빵 두 개하고 우유 하나 주세요. 얼마예요?\n점원: 모두 천팔백 원입니다.",
          instruction: "6. 어느 장소에 대한 글이에요?",
          type: "choice",
          items: [{ options: ["가게", "학교", "회사", "식당"], answer: 0 }]
        },
        {
          instruction: "7. 이 글의 내용과 같은 것을 고르세요.",
          type: "choice",
          items: [{ options: ["물이 있어요.", "빵하고 우유가 없어요.", "로라는 빵 2개하고 우유 2개를 사요.", "빵 두 개하고 우유 한 개는 1,800원이에요."], answer: 3 }]
        },
        {
          note: "※ [8~9] 다음을 읽고 질문에 답하세요.",
          passage: "저는 시장에 갑니다. 오늘 시장에 오렌지가 없습니다. 빵하고 사과하고 물이 있습니다. 저는 빵 두 개하고 사과 다섯 개를 삽니다. 모두 9,000원입니다.",
          instruction: "8. 무엇에 대한 글이에요?",
          type: "choice",
          items: [{ options: ["위치", "공부", "물건 사기", "자기소개"], answer: 2 }]
        },
        {
          instruction: "9. 이 글의 내용과 <u>다른</u> 것을 고르세요.",
          type: "choice",
          items: [{ options: ["시장에는 물이 있어요.", "시장에는 오렌지가 있어요.", "시장에서 빵하고 사과를 사요.", "빵 두 개하고 사과 다섯 개는 구천 원이에요."], answer: 1 }]
        }
      ]
    },

    /* ---------------- 76쪽 자기 평가 ---------------- */
    {
      page: 76,
      heading: "자기 평가",
      groups: [
        {
          instruction: "✪ 아는 것에 ✔ 하세요. (점수에 들어가지 않아요)",
          type: "self",
          items: [
            { area: "듣기", q: "‘무엇을 사요? 얼마예요?’ 알아요?", scale: ["네", "아니요"] },
            { area: "읽기", q: "‘무엇을 팔아요? 얼마예요?’ 알아요?", scale: ["네", "아니요"] },
            { area: "말하기", q: "여러분은 가게에서 물건을 살 수 있어요?", scale: ["2", "1", "0"] },
            { area: "쓰기", q: "‘무엇을 얼마나 사요?’ 쓸 수 있어요?", scale: ["2", "1", "0"] }
          ],
          checklist: [
            { area: "어휘와 표현", words: ["하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉", "열", "열하나", "사과 한 개", "사과 두 개", "사과 세 개", "물 한 병", "물 두 병", "물 세 병"] },
            { area: "문법", words: ["-ㅂ니다/습니다, -ㅂ니까/습니까", "하고"] }
          ],
          footnote: "✪ 잘할 수 있으면 2, 보통이면 1, 못하면 0에 ✔ 하세요."
        }
      ]
    }
  ]
};
