let TAB_LINK = "";


function log(msg) {
    console.log(msg);

    let s = document.getElementById('status-content');
    if (s.classList.contains('hidden')) {
        s.classList.remove('hidden')
    }

    s.innerText = msg;
}

function error(msg) {
    console.error(msg);

    let s = document.getElementById('error-content');
    if (s.classList.contains('hidden')) {
        s.classList.remove('hidden')
    }

    s.innerText = msg;
}

function setLogo() {
    document.getElementById('logo-img').src = browser.extension.getURL('icons/logo.png');
}

function getCurrentTabLink() {
    browser.tabs.query({currentWindow: true}).then(function(tabs) {
        for (let t of tabs) {
            if (t.active) {
                TAB_LINK = t.url;
                document.querySelector("#article-link").value = TAB_LINK;
            }
        }
    })
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

                console.log('getting params');

                let from = document.querySelector("#from").value;
                let to = document.querySelector("#to").value;

                let subject = document.querySelector("#subject").value;
                let brief = document.querySelector("#brief").value;
                let article_link =  document.querySelector("#article-link").value;

                let sector =  document.querySelector("#sector").value;

                let dateInput =  document.querySelector("#date").value;
                let date = new Date(dateInput).toJSON();

                let impactInput =  document.querySelector("#impact").value;
                let impact = Number(impactInput);

                let body = JSON.stringify({
                    subject: subject,
                    brief: brief,
                    article_link: article_link,
                    sector: sector,
                    date: date,
                    impact: impact
                });

                console.log(body);


                fetch(`https://geop.dadard.fr/relationships?from=${from}&to=${to}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Access-Token': token,
                    },
                    body: body

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

getCurrentTabLink();

setLogo();

listenForClicks();

