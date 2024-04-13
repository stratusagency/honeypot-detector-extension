document.getElementById('checkButton').addEventListener('click', function () {
    const address = document.getElementById('addressInput').value;
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Loading...';
    resultDiv.style.backgroundColor = 'lightblue';

    if (!address) {
        alert('Please enter a valid ERC20 token address');
        resultDiv.textContent = '';
        return;
    }

    fetch(`https://api.honeypot.is/v2/IsHoneypot?address=${address}&pair=0x8ef79d6c328c25da633559c20c75f638a4863462&chainID=1`)
        .then(response => response.json())
        .then(data => {
            resultDiv.textContent = data.honeypotResult.isHoneypot ? '⚠️ HONEYPOT ⚠️' : 'OK';
            resultDiv.style.backgroundColor = data.honeypotResult.isHoneypot ? 'red' : 'green';
        })
        .catch(error => {
            resultDiv.textContent = `Error: ${error.message}`;
            resultDiv.style.backgroundColor = 'orange';
        });
});
