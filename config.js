/*
==========================================================
 StoryBlog Engine X
 File    : config.js
 Version : 1.0.0
==========================================================
*/

"use strict";

const CONFIG = {

    // ==========================
    // Website
    // ==========================
    site: {

        name: "StoryBlog Engine X",

        version: "1.0.0"

    },

    // ==========================
    // GitHub Repository
    // ==========================
    github: {

        user: "phuocmarc",

        repo: "storyblog-engine",

        branch: "main"

    },

    // ==========================
    // Truyện
    // ==========================
    story: {

        folder: "nhung-cuoc-xe-am-duong",

        infoFile: "info.json",

        chapterListFile: "chapters.json",

        chapterFolder: "chapters"

    },

    // ==========================
    // Giao diện
    // ==========================
    theme: {

        mode: "light",

        primaryColor: "#2196F3"

    },

    // ==========================
    // Trình đọc
    // ==========================
    reader: {

        fontFamily: "Arial, sans-serif",

        fontSize: 18,

        lineHeight: 1.8,

        chapterHeight: 320

    },

    // ==========================
    // Cache
    // ==========================
    cache: {

        enable: true

    },

    // ==========================
    // Debug
    // ==========================
    debug: false

};

Object.freeze(CONFIG);
