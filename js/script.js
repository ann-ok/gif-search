import Searcher from './search/Searcher.js'
import config from '../config/config.js'

window.onload = () => {
    const searchForm = document.getElementById('gif-search-form')
    const results = document.getElementById('results')
    const searchInput = document.getElementById('gif-search')

    loadApp()

    searchForm.onsubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(searchForm)
        const text = formData.get('search')
        const searcher = new Searcher(text)

        searcher.getResults().then(response => {
            results.innerHTML = response
        }).catch(error => {
            console.log(error)
        })
    }

    searchInput.oninput = (e) => {
        const searcher = new Searcher(e.target.value, 10)

        searcher.getTags().then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        })
    }

}

function loadApp() {
    document.title = config.app_name
    document.getElementById('js-title').innerHTML  = config.app_name
    document.getElementById('js-copyright').innerHTML  = '&#169; ' + config.app_name + ' ' + new Date().getFullYear();
}