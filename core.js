/*
========================================================
 StoryBlog Engine X
 File    : core.js
 Version : 1.0.0
========================================================
*/

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

    const url = `${getBaseURL()}/story.json`;

    if (cacheGet(url)) return cacheGet(url);

    const data = await fetchJSON(url);

    cacheSet(url, data);

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
