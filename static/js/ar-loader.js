const loader = document.querySelector(".ar-loader-container");
const loader_progress = loader.querySelector(".ar-loader-text");
const loader_message = loader.querySelector(".ar-message");

let loader_busy = false;

loader.setProgress = (progress) => loader_progress.textContent = progress;
loader.setMessage = (message) => loader_message.innerHTML = message?.replace(/\n/g, "<br/>");

loader.hide = (force = false) => {
    if (!force && loader_busy) return;

    loader.classList.remove("show");

    setTimeout(() => {
        loader.setProgress("");
        loader.setMessage("");

        loader_busy = false;
    }, 1000);
}

loader.show = (message = "", progress = null) => {
    const percents = progress ? `${progress}` : "";

    loader.classList.add("show");

    loader.setProgress(percents);
    loader.setMessage(message);
}
