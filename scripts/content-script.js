function checkIfHoneypot(tokenAddress, statusText) {
    fetch(`https://api.honeypot.is/v2/IsHoneypot?address=${tokenAddress}&chainID=1`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            statusText.textContent = `Token Address: ${tokenAddress} - ${data.honeypotResult.isHoneypot ? 'Honeypot detected!' : 'No honeypot detected.'}`;
            statusText.parentNode.style.backgroundColor = data.honeypotResult.isHoneypot ? 'red' : 'green';
        })
        .catch(error => {
            statusText.textContent = `Error: ${error.message}`;
            statusText.parentNode.style.backgroundColor = 'orange';
        });
}

function createStatusBar(tokenAddress) {
    const bar = document.createElement('div');
    const div = document.createElement('div');
    const statusText = document.createElement('span');
    const closeButton = document.createElement('button');
    const closeImage = document.createElement('img');

    bar.style.position = 'fixed';
    bar.style.top = 0;
    bar.style.left = 0;
    bar.style.right = 0;
    bar.style.display = 'flex';
    bar.style.alignItems = 'center';
    bar.style.justifyContent = 'space-between';
    bar.style.width = '100vw';
    bar.style.padding = '10px';
    bar.style.fontSize = '16px';
    bar.style.color = 'white';
    bar.style.textAlign = 'center';
    bar.style.zIndex = '10000';
    bar.style.backgroundColor = 'lightblue';

    closeImage.src = chrome.extension.getURL('icons/close.png');
    closeImage.alt = 'Close';
    closeImage.style.width = '18px';
    closeImage.style.height = '18px';

    closeButton.appendChild(closeImage);
    closeButton.style = `
        display: grid;
        place-items: center;

        background: none;
        cursor: pointer;
        border: none;
    `;
    closeButton.onclick = function () {
        document.body.removeChild(bar);
        document.body.style.paddingTop = '0';
    };

    statusText.textContent = `Token Address: ${tokenAddress} - Checking if honeypot...`;
    statusText.style = `
        position: absolute;
        transform: translateX(-50%);
        left: 50%;
    `;
    statusText.style.flexGrow = '1';
    statusText.style.textAlign = 'center';

    bar.append(div, statusText, closeButton);

    document.body.style.paddingTop = '50px';
    document.body.prepend(bar);

    return statusText;
}

(function () {
    const url = window.location.href;
    const addressRegex = /0x[a-fA-F0-9]{40}/;
    const match = url.match(addressRegex);

    if (match) {
        const tokenAddress = match[0];
        const statusText = createStatusBar(tokenAddress);
        checkIfHoneypot(tokenAddress, statusText);
    }
})();
