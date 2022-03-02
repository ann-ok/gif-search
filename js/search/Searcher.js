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

    constructor(q, limit = 9, offset = 0) {
        this._giphy = new Giphy(q, limit, offset)
    }

    getResults() {
        return new Promise((resolve, reject) => {
            const div = document.createElement('div')
            div.classList.add('column-row')

            this.checkQ(this._giphy.q)
                .then(() => {
                    this._giphy.getResults()
                        .then(response => {
                            this.saveLocalStorageTag(this._giphy.q)
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

                            return div.outerHTML
                        }).then(data => {
                        resolve(data)
                    }).catch(error => {
                        reject(error)
                    })
                }).catch(() => {
                    const text = 'Введите минимум 3 символа'
                    div.innerHTML = `<no-gif-element text="${text}"></no-gif-element>`
                    resolve(div.outerHTML)
            })
        })
    }

    checkQ(q) {
        return new Promise((resolve, reject) => {
            if (q.length < 3) reject()
            resolve()
        })
    }

    getTags() {
        return new Promise((resolve, reject) => {
            this._giphy.getTags()
                .then(response => {
                    const tags = response['data']

                    if (!tags.length) {
                        return ''
                    }

                    const div = document.createElement('div')

                    const localStorageTags = this.getLocalStorageTags()
                    let tagsCount = 0

                    localStorageTags.forEach(element => {
                        const tag = document.createElement('suggest-element')
                        tag.setAttribute('text', element)
                        tag.setAttribute('isStorage', true)
                        div.append(tag)
                        tagsCount++
                    })

                    for (let i = tagsCount; i <= this.#maxTagsSuggest, i < tags.length; i++) {
                        const tagText = tags[i].name
                        if (localStorageTags.includes(tagText)) {
                            continue;
                        }
                        const tag = document.createElement('suggest-element')
                        tag.setAttribute('text', tags[i].name)
                        div.append(tag)
                    }

                    return div.innerHTML
                }).then(data => {
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    saveLocalStorageTag(tag) {
        const tags = this.getAllLocalStorageTags()

        if (!tags.includes(tag)) {
            tags.push(tag)
            localStorage.setItem(this.#tags, JSON.stringify(tags));
        }
    }

    getLocalStorageTags() {
        const tags = this.getAllLocalStorageTags()
        if (!tags) {
            return []
        }
        const neededTags = tags.filter(tag => tag.startsWith(this._giphy.q))
        return neededTags.slice(-5, neededTags.length).reverse()
    }

    getAllLocalStorageTags() {
        if (localStorage.getItem(this.#tags) === null) {
            return []
        }
        return JSON.parse(localStorage.getItem(this.#tags))
    }

}