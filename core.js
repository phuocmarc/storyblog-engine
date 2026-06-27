window.startEngine = async function () {

    console.log("ENGINE START");

    const app = document.getElementById("app");

    if (!app) return;

    try {

        const url = "https://phuocmarc.github.io/storyblog-engine/stories/nhung-cuoc-xe-am-duong/story.json";

        const res = await fetch(url);

        const story = await res.json();

        app.innerHTML = `
            <h1>${story.title}</h1>
            <p>${story.description}</p>
        `;

        console.log("ENGINE OK");

    } catch (e) {

        console.error("ENGINE ERROR:", e);

        app.innerHTML = "Load story failed";

    }

};
