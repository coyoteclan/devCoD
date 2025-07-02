console.log("script.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    console.log("parent DOMContentLoaded");

    const iframe = document.getElementById('realpage');
        if (!iframe) {
        console.error('iframe#realpage not found');
        return;
    }

    fetch('projects.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            //console.log('projects.json loaded', data);
            setupIframe(iframe, data);
        })
        .catch(err => console.error('Failed to load projects.json:', err));
});

function setupIframe(iframe, projectsData) {
    iframe.addEventListener('load', () => {
        console.log("iframe window loaded");

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc) {
            console.error('Cannot access iframe document');
            return;
        }

        const container = doc.getElementById('projects');
        if (!container) {
            console.error('Cannot find #projects in iframe.');
            return;
        }

        container.innerHTML = '';

        Object.entries(projectsData).forEach(([title, [url, desc]]) => {
            const card = doc.createElement('div');
            card.classList.add('project');
            card.classList.add('w3-animate-opacity');

            card.innerHTML = `
            <h4>${title}</h4>
            <p>${desc}</p>
            <a href="${url}" target="_blank">View on GitHub</a>
            `;

            container.appendChild(card);
            setTimeout(100);
        });

        const nproject = doc.createElement('div');
        nproject.classList.add('project');
        nproject.classList.add('new-project');
        nproject.classList.add('w3-animate-opacity');
        nproject.innerHTML = `
        <a href="https://github.com/coyoteclan/devCoD/blob/main/projects.json" target="_blank">+</a>
        `;

        container.appendChild(nproject);
    });

    // if iframe is already loaded, trigger injection immediately
    if (iframe.contentDocument?.readyState === 'complete') {
        iframe.dispatchEvent(new Event('load'));
    }
}
