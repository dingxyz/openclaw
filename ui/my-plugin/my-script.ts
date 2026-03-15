import "./my-style.css";

/**
 * 侧栏品牌补丁：用自定义 logo / eyebrow / title 覆盖 openclaw-app 侧栏品牌区。
 */
/** 侧栏 logo 图片（import 后由 Vite 解析为可访问 URL） */
import brandLogoUrl from "./images/favicon.png?url";
import iconLogoUrl from "./images/dragon.png?url";
/** 侧栏副标题 */
const BRAND_EYEBROW = "自由自在，如你所愿";
/** 侧栏主标题 */
const BRAND_TITLE = "FreeAI";

/** 将 document 中的 favicon / apple-touch-icon 链接统一为 iconLogoUrl */
function patchFavicons(): void {
  const links = document.head.querySelectorAll<HTMLLinkElement>(
    'link[rel="icon"], link[rel="apple-touch-icon"]',
  );
  links.forEach((link) => {
    if (link.href !== iconLogoUrl) {
      link.href = iconLogoUrl;
      if (link.getAttribute("rel") === "icon") link.type = "image/png";
    }
  });
}

/**
 * 只更新 Lit 已渲染的子元素属性/文本，不替换 innerHTML，
 * 保留 Lit 对 navCollapsed 等条件渲染逻辑的控制权。
 * navCollapsed=true 时子节点不存在，直接跳过。
 */
function patchBrand(el: HTMLElement): void {
  const img = el.querySelector<HTMLImageElement>(".sidebar-brand__logo");
  const eyebrow = el.querySelector<HTMLElement>(".sidebar-brand__eyebrow");
  const title = el.querySelector<HTMLElement>(".sidebar-brand__title");

  if (!img && !eyebrow && !title) return;

  if (img?.getAttribute("src") !== brandLogoUrl) {
    img?.setAttribute("src", brandLogoUrl);
    img?.setAttribute("alt", BRAND_TITLE);
  }
  if (eyebrow && eyebrow.textContent !== BRAND_EYEBROW) eyebrow.textContent = BRAND_EYEBROW;
  if (title && title.textContent !== BRAND_TITLE) title.textContent = BRAND_TITLE;
}

/** 登录门页品牌补丁：logo 与标题改为 brandLogoUrl / BRAND_TITLE，不破坏 Lit 结构 */
function patchLoginGate(header: HTMLElement): void {
  const img = header.querySelector<HTMLImageElement>(".login-gate__logo");
  const title = header.querySelector<HTMLElement>(".login-gate__title");
  if (img?.getAttribute("src") !== brandLogoUrl) {
    img?.setAttribute("src", brandLogoUrl);
    img?.setAttribute("alt", BRAND_TITLE);
  }
  if (title && title.textContent !== BRAND_TITLE) title.textContent = BRAND_TITLE;
}

/** 对侧栏品牌区补丁；若尚未出现则 no-op。openclaw-app 使用 Light DOM，直接从 app 上查询 */
function tryPatchBrand(app: Element): void {
  const brand = app.querySelector<HTMLElement>(".sidebar-brand");
  if (brand) patchBrand(brand);
}

function tryPatchLoginGate(app: Element): void {
  const header = app.querySelector<HTMLElement>(".login-gate__header");
  if (header) patchLoginGate(header);
}

/** dashboard-header 面包屑链接文字改为 BRAND_TITLE */
function tryPatchDashboardHeaderBreadcrumb(app: Element): void {
  const link = app.querySelector<HTMLElement>(".dashboard-header__breadcrumb-link");
  if (link && link.textContent !== BRAND_TITLE) link.textContent = BRAND_TITLE;
}

/** 等 openclaw-app 就绪后补丁品牌区，并监听 DOM 变化以便连接后/重绘后再次补丁 */
async function init(): Promise<void> {
  await customElements.whenDefined("openclaw-app");
  const app = document.querySelector("openclaw-app") as import("lit").LitElement & { updateComplete: Promise<void> } | null;
  if (!app) return;
  await app.updateComplete;

  tryPatchBrand(app);
  tryPatchLoginGate(app);
  tryPatchDashboardHeaderBreadcrumb(app);
  const observer = new MutationObserver(() => {
    tryPatchBrand(app);
    tryPatchLoginGate(app);
    tryPatchDashboardHeaderBreadcrumb(app);
  });
  observer.observe(app, { childList: true, subtree: true });
}

patchFavicons();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void init());
} else {
  void init();
}
