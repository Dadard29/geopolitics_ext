const tokenInput = document.querySelector("#token");

function storeSettings() {
    browser.storage.local.set({
        token: tokenInput.value
    });
}

function updateUI(restoredSettings) {
    tokenInput.value = restoredSettings.token || "";
}

function onError(e) {
    console.error(e)
}

browser.storage.local.get().then(updateUI, onError);

tokenInput.addEventListener("blur", storeSettings);