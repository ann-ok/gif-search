export default class GifElement extends HTMLElement {
    connectedCallback() {
        const text = this.getAttribute('text')

        this.innerHTML = `<div class="suggest__item">
                              <img class="suggest__image" src="images/search.png" alt="Search">
                              <span>${text}</span>
                          </div>`
    }
}