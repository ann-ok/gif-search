export default class GifElement extends HTMLElement {
    connectedCallback() {
        const text = this.getAttribute('text')
        const storageClass = this.getAttribute('isStorage') ? 'suggest__item_storage' : ''

        this.innerHTML = `<div class="suggest__item ${storageClass}">
                              <img class="suggest__image" src="images/search.png" alt="Search">
                              <span>${text}</span>
                          </div>`
    }
}