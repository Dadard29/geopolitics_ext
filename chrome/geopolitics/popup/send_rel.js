let whiteList = [
    "www.lemonde.fr"
];


let TAB_LINK = "";

function log(msg) {
    console.log(msg);

    let s = document.getElementById('status-content');
    if (s.classList.contains('hidden')) {
        s.classList.remove('hidden')
    }

    let e = document.getElementById('error-content');
    if (!e.classList.contains('hidden')) {
        e.classList.add('hidden')
    }

    s.innerText = msg;
}

function error(msg) {
    console.log(msg);

    let s = document.getElementById('error-content');
    if (s.classList.contains('hidden')) {
        s.classList.remove('hidden')
    }

    let e = document.getElementById('status-content');
    if (!e.classList.contains('hidden')) {
        e.classList.add('hidden')
    }

    s.innerText = msg;
}

function setLogo() {
    document.getElementById('logo-img').src = chrome.extension.getURL('icons/logo.png');
}

function getCurrentTabLink() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let t = tabs[0];
        TAB_LINK = t.url;

        let url = new URL(TAB_LINK);
        let found = false;
        for (let h of whiteList) {
            if (url.hostname === h) {
                found = true;
            }
        }

        if (!found) {
            let f = document.querySelector("#form");
            if (!f.classList.contains('hidden')) {
                f.classList.add('hidden');
                error('this website cannot be used as a reference');
            }
        }

        document.querySelector("#article-link").value = TAB_LINK;
    })
}

function listenForClicks() {
    document.getElementById('submit').addEventListener("click", (e) => {

        chrome.storage.local.get(['token'], function(s) {

            let token = s.token;
            if (!token) {
                error('token not found');
            } else {

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

