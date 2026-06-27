document.body.innerHTML = "<h2>CORE IS RUNNING</h2>"
/*
========================================================
 StoryBlog Engine X
 File    : core.js
 Version : 1.0.0
========================================================
*/
console.log("CORE START");
"use strict";

/* =========================
   ENGINE CORE
========================= */

const StoryEngine = {

    state: {
        story: null,
        chapters: [],
        loaded: false
    },

    cache: new Map()

};


/* =========================
   CONFIG SHORTCUT
========================= */

const CONFIG_REF = () => CONFIG;


/* =========================
   BASE URL (jsDelivr)
========================= */

function getBaseURL() {

    const c = CONFIG_REF();

    return `https://cdn.jsdelivr.net/gh/${c.github.user}/${c.github.repo}@${c.github.branch}/stories/${c.story.folder}`;

}


/* =========================
   FETCH HELPERS
========================= */

async function fetchJSON(url) {

    const res = await fetch(url);

    if (!res.ok) throw new Error(`JSON error: ${url}`);

    return await res.json();

}


async function fetchText(url) {

    const res = await fetch(url);

    if (!res.ok) throw new Error(`Text error: ${url}`);

    return await res.text();

}


/* =========================
   CACHE
========================= */

function cacheGet(key) {
    return StoryEngine.cache.get(key);
}

function cacheSet(key, value) {
    StoryEngine.cache.set(key, value);
}


/* =========================
   LOAD STORY.JSON
========================= */

async function loadStory() {

    const url = "https://phuocmarc.github.io/storyblog-engine/stories/nhung-cuoc-xe-am-duong/story.json";

    console.log("FETCH STORY:", url);

    const res = await fetch(url);

    console.log("STATUS:", res.status);

    const data = await res.json();

    StoryEngine.state.story = data;

    return data;
}


/* =========================
   LOAD CHAPTER TEXT
========================= */

async function loadChapter(file) {

    const url = `${getBaseURL()}/chapters/${file}`;

    if (cacheGet(url)) return cacheGet(url);

    const data = await fetchText(url);

    cacheSet(url, data);

    return data;

}


/* =========================
   INIT ENGINE
========================= */

async function initEngine() {

    try {

        console.log("[StoryEngine] Starting...");

        const story = await loadStory();

        console.log("[StoryEngine] Loaded story:", story.title);

        StoryEngine.state.loaded = true;

    } catch (err) {

        console.error("[StoryEngine] Init error:", err);

    }

}
/* =========================
   RENDER SYSTEM
========================= */

function getAppRoot() {
    return document.getElementById("app");
}


/* =========================
   CREATE CHAPTER ITEM UI
========================= */

function createChapterItem(index, chapterData) {

    const item = document.createElement("div");
    item.className = "chapter-item";
    item.dataset.index = index;

    const title = document.createElement("div");
    title.className = "chapter-title";

    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.textContent = "▶";

    const text = document.createElement("span");
    text.className = "chapter-text";
    text.textContent = chapterData.title || `Chương ${index + 1}`;

    title.appendChild(arrow);
    title.appendChild(text);

    const content = document.createElement("div");
    content.className = "chapter-content";
    content.innerHTML = "";

    title.addEventListener("click", async () => {

        item.classList.toggle("active");

        if (!content.dataset.loaded) {

            const md = await loadChapter(chapterData.file);

            content.innerHTML = parseMarkdown(md);

            content.dataset.loaded = "true";
        }

    });

    item.appendChild(title);
    item.appendChild(content);

    return item;
}


/* =========================
   SIMPLE MARKDOWN PARSER
========================= */

function parseMarkdown(text) {

    if (!text) return "";

    return text
        .split("\n")
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join("");

}


/* =========================
   HTML ESCAPE
========================= */

function escapeHtml(str) {

    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

}


/* =========================
   RENDER CHAPTER LIST
========================= */

async function renderChapters() {

    const app = getAppRoot();

    const story = StoryEngine.state.story;

    if (!story || !story.chapters) return;

    const container = document.createElement("div");
    container.className = "chapter-list";

    story.chapters.forEach((chapter, index) => {

        const item = createChapterItem(index, chapter);

        container.appendChild(item);

    });

    app.appendChild(container);

}


/* =========================
   MAIN START
========================= */
console.log("CORE 1");
window.startEngine = async function () {
console.log("ENGINE CREATED");
    await initEngine();

    await renderChapters();

}
console.log("CORE 2");
/* =========================
   UI: STORY HEADER
========================= */

function renderHeader() {

    const app = getAppRoot();
    const story = StoryEngine.state.story;

    if (!story) return;

    const header = document.createElement("div");
    header.className = "story-header";

    const title = document.createElement("h1");
    title.className = "story-title";
    title.textContent = story.title || "Untitled Story";

    const desc = document.createElement("p");
    desc.className = "story-desc";
    desc.textContent = story.description || "";

    header.appendChild(title);
    header.appendChild(desc);

    app.appendChild(header);
}


/* =========================
   IMPROVED CHAPTER ITEM UI
   (override styling logic hook)
========================= */

function enhanceChapterBehavior() {

    document.querySelectorAll(".chapter-item").forEach(item => {

        const content = item.querySelector(".chapter-content");

        // scroll limit safety
        content.style.maxHeight = "0px";
        content.style.overflow = "hidden";

        const observer = new MutationObserver(() => {

            if (item.classList.contains("active")) {

                content.style.maxHeight = CONFIG.reader.chapterHeight + "px";
                content.style.overflow = "auto";

            } else {

                content.style.maxHeight = "0px";

            }

        });

        observer.observe(item, { attributes: true });

    });
}


/* =========================
   AUTO CLEAN EMPTY CHAPTERS
========================= */

function removeEmptyChapters() {

    document.querySelectorAll(".chapter-item").forEach(item => {

        const index = item.dataset.index;

        const chapter = StoryEngine.state.story.chapters[index];

        if (!chapter || !chapter.file) {

            item.remove();

        }

    });

}


/* =========================
   FINAL START PIPELINE UPDATE
========================= */

async function startEngine() {

    await initEngine();

    renderHeader();

    await renderChapters();

    removeEmptyChapters();

    enhanceChapterBehavior();

}
/* =========================
   GLOBAL RESET
========================= */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    background: #f5f6fa;
    color: #222;
    line-height: 1.6;
}


/* =========================
   STORY HEADER
========================= */

.story-header {
    max-width: 800px;
    margin: 30px auto 20px;
    padding: 20px;
    text-align: center;
}

.story-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
}

.story-desc {
    font-size: 14px;
    color: #666;
}


/* =========================
   CHAPTER LIST
========================= */

.chapter-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 10px;
}


/* =========================
   CHAPTER ITEM
========================= */

.chapter-item {
    background: #fff;
    border-radius: 10px;
    margin-bottom: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chapter-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}


/* =========================
   CHAPTER TITLE
========================= */

.chapter-title {
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-weight: 600;
    background: #fafafa;
}

.chapter-title:hover {
    background: #f0f4ff;
}

.arrow {
    transition: transform 0.3s ease;
    display: inline-block;
}

.chapter-item.active .arrow {
    transform: rotate(90deg);
}


/* =========================
   CHAPTER CONTENT
========================= */

.chapter-content {
    max-height: 0;
    overflow: hidden;
    padding: 0 16px;
    background: #fff;
    transition: max-height 0.4s ease, padding 0.3s ease;
}

.chapter-item.active .chapter-content {
    padding: 14px 16px;
}


/* =========================
   MARKDOWN TEXT
========================= */

.chapter-content p {
    margin-bottom: 10px;
    font-size: 15px;
}


/* =========================
   SCROLL AREA (READING ZONE)
========================= */

.chapter-content {
    overflow-y: auto;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {

    .story-title {
        font-size: 22px;
    }

    .chapter-content {
        font-size: 14px;
    }
}
console.log("CORE END");
