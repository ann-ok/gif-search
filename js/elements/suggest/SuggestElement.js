export default class GifElement extends HTMLElement {
    connectedCallback() {
        const url = this.getAttribute('url')
        const title = this.getAttribute('title')

        this.innerHTML = `<div class="gif">
            <img class="gif__image" src="${url}" alt="${title}">
            <p class="gif__text">${title}</p>
        </div>`
    }
}