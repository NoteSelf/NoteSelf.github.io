(function () {
    var shouldRegister = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if ('serviceWorker' in navigator && shouldRegister) {
        navigator.serviceWorker
            .register('sw.js')
            .then((registration) => {
                // only show message on worker installed event
                registration.onupdatefound = function () {
                    var worker = registration.installing;
                    if (!worker) return;

                    worker.onstatechange = function () {
                        if (worker.state === "installed") {
                            console.log('<i class="fa fa-download"></i> Caching completed. This app works offline!');
                        }
                    };
                };
            })
            .catch((err) => { console.log('sw failure', err); });
    }
})();