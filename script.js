// 상단 메뉴 링크와, 각 링크가 가리키는 섹션을 짝지어 둠
const links = [...document.querySelectorAll(".menu a")];
const sections = links.map((link) => document.querySelector(link.hash));

// 메뉴를 클릭해 이동한 직후에는 클릭한 메뉴를 그대로 강조하기 위한 표시
let clicked = false;

// index번째 메뉴만 강조 (-1이면 모두 해제)
function highlight(index) {
  links.forEach((link, i) => {
    if (i === index) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

// 스크롤 위치에 따라 현재 메뉴 찾기
function update() {
  if (clicked) return;

  // 화면 위에서 1/3 지점을 지난 섹션 중 마지막이 현재 섹션
  let current = sections.findLastIndex(
    (section) => section.getBoundingClientRect().top <= window.innerHeight / 3
  );

  // 페이지 끝에 닿으면 마지막 메뉴를 강조
  const root = document.documentElement;
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
    current = links.length - 1;
  }
  highlight(current);
}

// 메뉴 클릭: 해당 섹션으로 부드럽게 이동
links.forEach((link, i) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    // 기기에서 '동작 줄이기'를 켠 사람에게는 바로 이동
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sections[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", link.hash);   // 주소창에도 위치 표시
    clicked = true;
    highlight(i);
  });
});

// 사용자가 직접 움직이기 시작하면 다시 스크롤 위치를 따라감
["wheel", "touchmove", "keydown", "pointerdown"].forEach((type) => {
  window.addEventListener(type, () => { clicked = false; }, { passive: true });
});

window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);
update();
