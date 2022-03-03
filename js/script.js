import Searcher from './search/Searcher.js'
import Store from "./search/Store.js";
import config from '../config/config.js'


window.addEventListener('load', () => {
    const searchForm = document.getElementById('gif-search-form')
    const results = document.getElementById('results')
    const searchInput = document.getElementById('gif-search')
    const suggest = document.getElementById('search-suggest');

    const store = new Store('search-history');

    initApp()
    initSuggest(searchInput.offsetWidth, searchInput.offsetLeft)
    updateStore()

    // Событие не работает на вкладке, которая вносит изменения, но срабатывает на остальных вкладках домена в браузере
    window.addEventListener('storage', function(event) {
        if (event.key === store.getStorageKey()) {
            store.updateItems()
            updateStore()
        }
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const formData = new FormData(searchForm)
        const text = formData.get('search')
        const searcher = new Searcher(text)
        updateStore(text)

        searcher.getResults().then(response => {
            results.innerHTML = response
            searchInput.blur()
        }).catch(error => {
            console.log(error)
        })
    })

    searchInput.addEventListener('input', (e) => {
        const word = e.target.value
        const searcher = new Searcher(word, 10)

        searcher.getTags().then(response => {
            suggest.innerHTML = response

            const items = document.querySelectorAll('#search-suggest .suggest__item')
            items.forEach(item => {
                item.addEventListener('mousedown',(e) => {
                    e.preventDefault()
                    searchInput.value = item.querySelector('span').innerText
                    searchForm.querySelector('button[type=submit]').click()
                    searchInput.dispatchEvent(new Event('input', {bubbles:true}))
                })
            })

            showSuggest()
        }).catch(error => {
            console.log(error)
        })
    })

    searchInput.addEventListener('focusout', () => {
        hideSuggest()
    })

    searchInput.addEventListener('focusin', () => {
        showSuggest()
    })

    function initSuggest(width, left) {
        suggest.style.width = width + 'px'
        suggest.style.left = left + 'px'
        hideSuggest()
    }

    function hideSuggest() {
        suggest.hidden = true
    }

    function showSuggest() {
        if (suggest.innerHTML) {
            suggest.hidden = false
        } else {
            hideSuggest()
        }
    }

    function updateStore(word = '') {
        if (word) {
            store.setWord(word)
        }

        const items = document.querySelectorAll('#search-history__items div')
        items.forEach(item => {
            item.addEventListener('click',(e) => {
                searchInput.value = item.innerText
                searchForm.querySelector('button[type=submit]').click()
                searchInput.dispatchEvent(new Event('input', {bubbles:true}))
            })
        })
    }
})

function initApp() {
    document.title = config.app_name
    document.getElementById('js-title').innerHTML  = config.app_name
    document.getElementById('js-copyright').innerHTML  = '&#169; ' + config.app_name + ' ' + new Date().getFullYear();
}