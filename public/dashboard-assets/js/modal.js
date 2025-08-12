document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    document.addEventListener('click', function (e) {
        const trigger = e.target.closest('.modal-effect');
        if (!trigger) return;
        e.preventDefault();
        const effect = trigger.getAttribute('data-bs-effect');
        const targetSelector = trigger.getAttribute('data-bs-target');
        const targetModal = document.querySelector(targetSelector);
        if (!targetModal) return;
        targetModal.classList.forEach(cls => {
            if (cls.startsWith('effect-')) {
                targetModal.classList.remove(cls);
            }
        });
        if (effect) {
            targetModal.classList.add(effect);
        }
        const modalInstance = bootstrap.Modal.getOrCreateInstance(targetModal);
        modalInstance.show();
        const removeEffect = function () {
            targetModal.classList.forEach(cls => {
                if (cls.startsWith('effect-')) {
                    targetModal.classList.remove(cls);
                }
            });

            targetModal.removeEventListener('hidden.bs.modal', removeEffect);
        };

        targetModal.addEventListener('hidden.bs.modal', removeEffect);
    });
});
