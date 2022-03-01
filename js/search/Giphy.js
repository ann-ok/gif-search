import config from "../../config/config.js";

export default class Giphy {
    constructor(q, limit, offset) {
        this._apiKey = config.giphy_apy_key

        this._q = q
        this._limit = limit
        this._offset = offset
    }

    get q() {
        return this._q
    }

    getResults() {
        return this.sendRequest(config.giphy_url_search)
    }

    getTags() {
        return this.sendRequest(config.giphy_url_autocomplete)
    }

    sendRequest(url) {
        return new Promise((resolve, reject) => {
            const data = this.getData()

            fetch(url + '?' + new URLSearchParams(data))
                .then(response => {
                    return response.json()
                }).then(data => {
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    /**
     * @return {{q: string, offset: number, api_key: string, limit: number}}
     */
    getData() {
        return {
            api_key: this._apiKey,
            q: this._q,
            offset: this._offset,
            limit: this._limit
        }
    }
}