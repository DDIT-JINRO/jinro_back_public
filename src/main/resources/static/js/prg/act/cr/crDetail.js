document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("poster-modal");
    const modalImg = document.getElementById("modal-image");
    const posterImg = document.getElementById("poster-modal-trigger");
    const closeBtn = document.querySelector(".close-button");

    if (posterImg && modal && modalImg && closeBtn) {
        posterImg.addEventListener('click', function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            modalImg.alt = this.alt;
        });

        closeBtn.addEventListener('click', function() {
            modal.style.display = "none";
        });

        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }
});