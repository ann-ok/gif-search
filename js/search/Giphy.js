import config from "../../config/config.js";

export default class Giphy {
    constructor(q, limit, offset) {
        this._apiKey = config.giphy_apy_key

        this._q = q
        this._limit = limit
        this._offset = offset
    }

    get query() {
        return this._q
    }

    getResults = async () => {
        return this.sendRequest(config.giphy_url_search)
    }

    getTags = async () => {
        return this.sendRequest(config.giphy_url_autocomplete)
    }

    sendRequest = async (url) => {
        const data = this.getData()
        const response = await fetch(url + '?' + new URLSearchParams(data));
        return response.json()
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