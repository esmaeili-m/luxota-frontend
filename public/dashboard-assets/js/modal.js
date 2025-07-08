(function () {
    "use strict";
        document.querySelectorAll(".modal-effect").forEach(e => {
            e.addEventListener('click', function (e) {
                e.preventDefault();
                let effect = this.getAttribute('data-bs-effect');
                document.querySelector("#create").classList.add(effect);
            });
        })
        /* hide modal effects */
        document.getElementById("create").addEventListener('hidden.bs.modal', function (e) {
            let removeClass = this.classList.value.match(/(^|\s)effect-\S+/g);
            removeClass = removeClass[0].trim();
            this.classList.remove(removeClass);
        });
})();