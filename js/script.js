import config from "../config/config.js";

let data = {
    api_key: config.giphy_apy_key,
    q: 'test'
};

// fetch(config.giphy_url_search + '?' + new URLSearchParams(data))
//     .then((data) => {
//         console.log(data);
//     });