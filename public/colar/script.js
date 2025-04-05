document.addEventListener("DOMContentLoaded", async function () {
    const titleElement = document.querySelector(".clientes-title");
    const editor = document.querySelector(".clientes-content");
    const copiarBtn = document.getElementById("botao-copiar");
    const copiarIcone = document.getElementById("icone-copiar");
    const placeholderText = "Escreva aqui...";

    editor.textContent = placeholderText;

    editor.addEventListener("focus", function () {
        if (editor.textContent === placeholderText) {
            editor.textContent = "";
        }
    });

    editor.addEventListener("blur", function () {
        if (editor.textContent.trim() === "") {
            editor.textContent = placeholderText;
        }
    });

    titleElement.addEventListener("blur", async function () {
        const titleText = titleElement.textContent.trim();
        const urlParts = window.location.pathname.split("/");
        const id = urlParts[urlParts.length - 1];

        if (titleText === "") {
            titleElement.textContent = "Inserir Título_";
            return;
        }

        if (id && !isNaN(id)) {
            try {
                await fetch("/colar/save-title", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, title: titleText }),
                });
            } catch (error) {
                console.error("Erro ao salvar título:", error);
            }
        }
    });

    async function copiarTexto() {
        const copiarIcone = document.getElementById("icone-copiar");
        const text = editor.textContent.trim();

        if (text === "" || text === placeholderText) {
            showNotification({
                title: "Campo vazio",
                description: "Digite um texto antes de salvar.",
                type: "warning"
            });
            return;
        }
        
        const iconeCopiar = `
        <svg id="icone-copiar" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M5 17H4.2C2.42667 17 1 15.5733 1 13.8V4.2C1 2.42667 2.42667 1 4.2 1H13.8C15.5733 1 17 2.42667 17 4.2V5M12.2 9H21.8C22.6487 9 23.4626 9.33714 24.0627 9.93726C24.6629 10.5374 25 11.3513 25 12.2V21.8C25 22.6487 24.6629 23.4626 24.0627 24.0627C23.4626 24.6629 22.6487 25 21.8 25H12.2C11.3513 25 10.5374 24.6629 9.93726 24.0627C9.33714 23.4626 9 22.6487 9 21.8V12.2C9 11.7798 9.08277 11.3637 9.24359 10.9754C9.4044 10.5872 9.64011 10.2344 9.93726 9.93726C10.2344 9.64011 10.5872 9.4044 10.9754 9.24359C11.3637 9.08277 11.7798 9 12.2 9Z" stroke="white" stroke-opacity="0.2" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;

        const iconeCheck = `
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M6 13.5L11 18.5L20 8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;

        copiarIcone.innerHTML = iconeCheck;

        setTimeout(() => {
            copiarIcone.innerHTML = iconeCopiar;
        }, 2000);

        try {
            const response = await fetch("/colar/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, title: titleElement.textContent.trim() }),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();

            if (data.link) {
                await navigator.clipboard.writeText(data.link);

                const newUrl = new URL(data.link);
                window.history.pushState({}, "", newUrl.pathname);

                copiarBtn.classList.add("clicked");
                const originalText = copiarBtn.textContent;
                copiarBtn.textContent = "SALVO";

                showNotification({
                    title: "Sucesso",
                    description: "Link salvo e copiado para a área de transferência.",
                    type: "success"
                });

                setTimeout(() => {
                    copiarBtn.classList.remove("clicked");
                    copiarBtn.textContent = originalText;
                }, 2000);

            } else {
                showNotification({
                    title: "Erro",
                    description: "Erro ao copiar o link.",
                    type: "error"
                })
            }
        } catch (error) {
            console.error("Erro:", error);
            showNotification({
                title: "Erro",
                description: "Erro ao copiar o link.",
                type: "error"
            })
        }
    }

    [copiarBtn, copiarIcone].forEach(el => {
        el.addEventListener("click", copiarTexto);
    });

    const urlParts = window.location.pathname.split("/");
    const id = urlParts[urlParts.length - 1];

    if (id && !isNaN(id)) {
        try {
            const response = await fetch(`/colar/text/${id}`);
            if (response.ok) {
                const data = await response.json();
                editor.textContent = data.text;
                titleElement.textContent = data.title || "Inserir Título_";
            } else {
                console.warn("Texto não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar o texto:", error);
        }
    }

    function showNotification({
        title = "Notificação",
        description = "",
        type = "info",
        duration = 4000,
        sound = null
    }) {
        const notification = document.getElementById("notification");
        const titleEl = document.getElementById("notification-title");
        const descEl = document.getElementById("notification-description");
        const iconEl = document.getElementById("notification-icon");
        const progress = document.getElementById("progress-bar");

        titleEl.textContent = title;
        descEl.innerHTML = description;

        const iconColors = {
            success: "#28a745",
            error: "#FF0042",
            info: "#007bff",
            warning: "#ffc107"
        };
        iconEl.style.background = iconColors[type] || "#333";

        notification.style.display = "flex";
        notification.style.opacity = "1";

        progress.style.transition = "none";
        progress.style.width = "100%";
        void progress.offsetWidth;
        progress.style.transition = `width ${duration}ms linear`;
        progress.style.width = "0%";

        if (sound) {
            const audio = document.getElementById(sound);
            if (audio) {
                audio.volume = 1.0;
                audio.currentTime = 0;
                audio.play().catch(err => console.error("Erro ao tocar áudio:", err));
            }
        }

        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.style.display = "none";
            }, 500);
        }, duration);
    }

});