(function() {
    console.log('seting up stuff');
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function log(msg) {
        let s = document.getElementById('status-content');
        if (s.classList.contains('hidden')) {
            s.classList.remove('hidden')
        }

        s.innerText = msg;

    }

    function send_rel() {
        log('sending');
    }

    browser.runtime.onMessage.addListener((message) => {
        console.log('command received');
        if (message.command === 'send') {
            send_rel();
        }
    })
});