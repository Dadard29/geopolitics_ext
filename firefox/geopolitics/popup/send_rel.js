function log(msg) {
    let s = document.getElementById('status-content');
    if (s.classList.contains('hidden')) {
        s.classList.remove('hidden')
    }

    s.innerText = msg;
}

function error(msg) {
    let s = document.getElementById('error-content');
    if (s.classList.contains('hidden')) {
        s.classList.remove('hidden')
    }

    s.innerText = msg;
}

function listenForClicks() {
    document.getElementById('submit').addEventListener("click", (e) => {

        browser.storage.local.get().then(function(s) {

            let token = s.token;
            if (!token) {
                error('token not found');
            }

            return token

        }).then(function(token) {

            if (token) {
                fetch(`https://geop.dadard.fr/relationships?from=${from}&to=${to}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Access-Token': token,
                    }
                }).then(function (r) {
                    r.json().then(function (j) {
                        if (r.status === 200) {
                            log(j.Message);
                        } else {
                            error(j.Message);
                        }
                    });
                }).catch(function(err) {
                    error(err);
                });
            }
        });
    });
}

listenForClicks();

