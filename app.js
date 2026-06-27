/*
========================================================
 StoryBlog Engine X
 File    : app.js
 Version : 1.0.0
========================================================
*/

"use strict";

/* =========================
   BOOT ENGINE
========================= */

(function () {

    function waitForCore() {

        return new Promise((resolve, reject) => {

            let checkCount = 0;

            const interval = setInterval(() => {

                checkCount++;

                // core.js sẵn sàng
                if (typeof startEngine === "function") {

                    clearInterval(interval);
                    resolve();

                }

                // timeout safety
                if (checkCount > 50) {

                    clearInterval(interval);
                    reject(new Error("core.js not ready"));

                }

            }, 100);

        });

    }


    async function boot() {

        try {

            console.log("[App] Booting StoryBlog Engine...");

            // chờ core.js load xong
            await waitForCore();

            // chạy engine chính
            await startEngine();

            console.log("[App] Engine started ✔");

        } catch (err) {

            console.error("[App] Fatal error:", err);

            const app = document.getElementById("app");

            if (app) {

                app.innerHTML = `
                    <div style="padding:20px;color:red;text-align:center;font-family:sans-serif">
                        <h2>Engine Error</h2>
                        <p>${err.message}</p>
                    </div>
                `;

            }

        }

    }

    boot();

})();
