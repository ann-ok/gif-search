export default class NoGifElement extends HTMLElement {
    connectedCallback() {
        const text = this.getAttribute('text')
        this.innerHTML = `<div class="column_l-12">${text}</div>`
    }
}