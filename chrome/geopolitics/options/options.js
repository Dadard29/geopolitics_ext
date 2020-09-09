const tokenInput = document.querySelector("#token");

function storeSettings() {
    chrome.storage.local.set({
        token: tokenInput.value
    }, function() {
        console.log(`token set`)
    });
}

function updateUI(restoredSettings) {
    tokenInput.value = restoredSettings.token || "";
}

function onError(e) {
    console.error(e)
}

chrome.storage.local.get(['token'], updateUI);

tokenInput.addEventListener("blur", storeSettings);