function searchTicket() {
    var protocol = document.getElementById("protocolInput").value.trim();
    var notification = document.getElementById("notification");
    var progressBar = document.getElementById("progress-bar");
    var errorSound = document.getElementById("errorSound");

    if (protocol) {
        window.location.href = `https://api.apestudio.dev/ticket/${protocol}.html`;
    } else {
        notification.style.display = "flex";
        notification.style.opacity = "1";

        progressBar.style.width = "100%";
        setTimeout(() => {
            progressBar.style.width = "0%";
        }, 10);

        if (errorSound) {
            errorSound.volume = 1.0;
            errorSound.currentTime = 0;
            errorSound.play().catch(error => console.error("Erro ao tocar o áudio:", error));
        }

        setTimeout(function () {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.style.display = "none";
            }, 500);
        }, 8000);
    }
}