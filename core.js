window.startEngine = async function () {

    console.log("ENGINE START");

    const app = document.getElementById("app");

    if (!app) {
        console.error("Missing #app div");
        return;
    }

    try {

        const res = await fetch(window.CONFIG.storyUrl);

        if (!res.ok) throw new Error("HTTP " + res.status);

        const story = await res.json();

        app.innerHTML = `
            <h1>${story.title || "No title"}</h1>
            <p>${story.description || ""}</p>
        `;

        console.log("ENGINE OK");

    } catch (err) {

        console.error("LOAD ERROR:", err);

        app.innerHTML = "<h2>Load story failed</h2>";

    }

};
