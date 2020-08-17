module.exports = class Scrapper
{
    constructor(url) {
        this.url = url;
        this.axios = require("axios");
        this.cheerio = require('cheerio');
    }

    async scrap(func) {
        return new Promise((res) => {
            this.axios(this.url).then(async (response) => {
                const html = response.data;
                const $ = this.cheerio.load(html);
                func($);
                res(true);
            }).catch((error) => { console.error(error); res(false); });
        });
    }
};