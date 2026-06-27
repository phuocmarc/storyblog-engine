(function () {

    async function waitForEngine() {

        while (typeof window.startEngine !== "function") {
            await new Promise(r => setTimeout(r, 50));
        }

    }

    async function boot() {

        console.log("APP START");

        await waitForEngine();

        await window.startEngine();

    }

    boot();

})();
