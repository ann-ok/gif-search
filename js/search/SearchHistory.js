export default class SearchHistory {
    #maxCount = 3
    #localStorageKey = 'search-history'

    constructor(id) {
        this._element = document.getElementById(id);
        this._element.classList.add('search-history')
        this._element.insertAdjacentHTML('beforeend', '<div class="search-history__title">Вы искали:</div>')
        this._element.insertAdjacentHTML('beforeend', '<div class="search-history__items" id="search-history__items"></div>')
        this._items = document.getElementById('search-history__items')
        this.updateItems()
    }

    setWord(word) {
        const words = this.getWords()

        if (words.includes(word)) {
            return
        }

        words.push(word)

        if (words.length > this.#maxCount) {
            words.shift()
        }

        localStorage.setItem(this.#localStorageKey, JSON.stringify(words))
        this.updateItems()
    }

    updateItems() {
        this._items.innerHTML = ''
        const words = this.getWords()
        words.reverse().forEach(word => {
            this._items.insertAdjacentHTML('beforeend', `<div class="search-history__item">${word}</div>`)
        })
        this._element.style.opacity = words.length ? 1 : 0
    }

    getStorageKey() {
        return this.#localStorageKey
    }

    getWords() {
        return localStorage.getItem(this.#localStorageKey) === null ? [] : (JSON.parse(localStorage.getItem(this.#localStorageKey)))
    }
}