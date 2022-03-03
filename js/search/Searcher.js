import GifElement from '../elements/gif/GifElement.js'
import NoGifElement from '../elements/gif/NoGifElement.js'
import SuggestElement from '../elements/suggest/SuggestElement.js'
import Giphy from './Giphy.js';

customElements.define('gif-element', GifElement)
customElements.define('no-gif-element', NoGifElement)
customElements.define('suggest-element', SuggestElement)

export default class Searcher {
    #tags = 'tags'
    #maxTagsSuggest = 10
    #maxTagsStorage = 5

    constructor(query, limit = 9, offset = 0) {
        this._giphy = new Giphy(query, limit, offset)
    }

    getResults = async () => {
        const div = document.createElement('div')
        div.classList.add('column-row')

        if (this._giphy.query.length < 3) {
            const text = 'Введите минимум 3 символа'
            div.innerHTML = `<no-gif-element text="${text}"></no-gif-element>`
            return div.outerHTML
        }

        const response = await this._giphy.getResults()
        const gifs = response.data

        if (!gifs.length) {
            const text = 'Результаты не найдены'
            div.innerHTML = `<no-gif-element text="${text}"></no-gif-element>`
            return div.outerHTML
        }

        gifs.forEach(element => {
            const gif = document.createElement('div')
            gif.classList.add('column_l-4')
            gif.innerHTML = `<gif-element url="${element.images.original.url}" title="${element.title}"></gif-element>`
            div.append(gif)
        })

        this.saveLocalStorageTag(this._giphy.query)

        return div.outerHTML
    }

    getTags = async() => {
        const response = await this._giphy.getTags()
        const tags = response['data']

        if (!tags.length) {
            return ''
        }

        const div = document.createElement('div')
        const localStorageTags = this.getLocalStorageTags()

        localStorageTags.forEach(element => {
            const tag = document.createElement('suggest-element')
            tag.setAttribute('text', element)
            tag.setAttribute('isStorage', true)
            div.append(tag)
        })

        for (let i = localStorageTags.length; i <= this.#maxTagsSuggest, i < tags.length; i++) {
            if (localStorageTags.includes(tags[i].name)) {
                continue
            }
            const tag = document.createElement('suggest-element')
            tag.setAttribute('text', tags[i].name)
            div.append(tag)
        }

        return div.innerHTML
    }

    saveLocalStorageTag(tag) {
        let tags = this.getAllLocalStorageTags()

        if (!tags.includes(tag)) {
            tags.push(tag)
            localStorage.setItem(this.#tags, JSON.stringify(tags))
        }
    }

    getLocalStorageTags() {
        const tags = this.getAllLocalStorageTags()
        if (!tags) {
            return []
        }

        let neededTags = tags.filter(tag => tag.startsWith(this._giphy.query))
        if (neededTags.length > this.#maxTagsSuggest) {
            neededTags = neededTags.slice(-this.#maxTagsSuggest, neededTags.length)
        }

        return neededTags.slice(-this.#maxTagsStorage, neededTags.length).reverse()
    }

    getAllLocalStorageTags() {
        if (localStorage.getItem(this.#tags) === null) {
            return []
        }
        return JSON.parse(localStorage.getItem(this.#tags))
    }
}