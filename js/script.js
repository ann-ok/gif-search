import Searcher from './search/Searcher.js'
import config from '../config/config.js'

window.addEventListener('load', () => {
    const searchForm = document.getElementById('gif-search-form')
    const results = document.getElementById('results')
    const searchInput = document.getElementById('gif-search')
    const suggest = document.getElementById('search-suggest');

    initApp()
    initSuggest(searchInput.offsetWidth, searchInput.offsetLeft)

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const formData = new FormData(searchForm)
        const text = formData.get('search')
        const searcher = new Searcher(text)

        searcher.getResults().then(response => {
            results.innerHTML = response
        }).catch(error => {
            console.log(error)
        })
    })

    searchInput.addEventListener('input', (e) => {
        const searcher = new Searcher(e.target.value, 10)

        searcher.getTags().then(response => {
            suggest.innerHTML = response

            const items = document.querySelectorAll('#search-suggest .suggest__item')
            items.forEach(item => {
                item.addEventListener('mousedown',(e) => {
                    e.preventDefault()
                    searchInput.value = item.querySelector('span').innerText
                    searchForm.querySelector('button[type=submit]').click()
                    searchInput.blur()
                    searchInput.dispatchEvent(new Event('input', {bubbles:true}));
                })
            })
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
    }

    function hideSuggest() {
        suggest.hidden = true
    }

    function showSuggest() {
        suggest.hidden = false
    }
})

function initApp() {
    document.title = config.app_name
    document.getElementById('js-title').innerHTML  = config.app_name
    document.getElementById('js-copyright').innerHTML  = '&#169; ' + config.app_name + ' ' + new Date().getFullYear();
}