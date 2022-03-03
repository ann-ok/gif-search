import Searcher from './search/Searcher.js'
import SearchHistory from "./search/SearchHistory.js";
import config from '../config/config.js'


window.addEventListener('load', () => {
    const searchForm = document.getElementById('gif-search-form')
    const results = document.getElementById('results')
    const searchInput = document.getElementById('gif-search')
    const suggest = document.getElementById('search-suggest');

    const store = new SearchHistory('search-history');

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

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(searchForm)
        const text = formData.get('search')
        const searcher = new Searcher(text)
        updateStore(text)

        try {
            console.log('getResults')
            results.innerHTML = await searcher.getResults()
            searchInput.blur()
            await updateTags(searcher, false)
        } catch (error) {
            console.log(error)
        }
    })

    searchInput.addEventListener('input', async (e) => {
        const word = e.target.value
        const searcher = new Searcher(word, 10)

        try {
            await updateTags(searcher)
        } catch (error) {
            console.log(error)
        }
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
            item.onclick = () => {
                searchInput.value = item.innerText
                searchForm.querySelector('button[type=submit]').click()
            }
        })
    }

    async function updateTags(searcher, isShowSuggest = true) {
        suggest.innerHTML = await searcher.getTags()

        const items = document.querySelectorAll('#search-suggest .suggest__item')
        items.forEach(item => {
            item.onmousedown = (e) => {
                e.preventDefault()
                searchInput.value = item.querySelector('span').innerText
                searchForm.querySelector('button[type=submit]').click()
                searchInput.dispatchEvent(new Event('input', {bubbles: true}))
            }
        })

        if (isShowSuggest) {
            showSuggest()
        }
    }
})

function initApp() {
    document.title = config.app_name
    document.getElementById('js-title').innerHTML  = config.app_name
    document.getElementById('js-copyright').innerHTML  = '&#169; ' + config.app_name + ' ' + new Date().getFullYear();
}