const Scrapper = require("./scrapper.js");

module.exports = class data_cinemas {
    constructor() {
        this.data = [];
        this.date = new Date();
        this.scrapper = new Scrapper("http://www.cinemas-lumiere.com/programmation/fourmi/"+this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+this.date.getDate()+".html");
    }

    update_date(date) {
        this.date = date;
        this.scrapper.url = "http://www.cinemas-lumiere.com/programmation/fourmi/"+this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+this.date.getDate()+".html";
    }

    scrap(then) {
        this.data = [];
        this.scrapper.scrap(($) => {
            const cineTable = $(".movie-card-container > div > a");
            cineTable.each((i, elem) => {
                var index = i;
                this.data.push({
                    title: $(elem).find("h3")[0].children[0].data,
                    href: elem.attribs.href,
                    href_picture: $(elem).find(".poster")[0].children[1].attribs["data-src"],
                    author: $(elem).find(".filmmakers")[0].children[0].data,
                    information: $(elem).find(".informations")[0].children[0].data,
                    timetable: [],
                });
                $(elem.parent).find("div > div > a > div > time").each((i, elem) => {
                    this.data[index].timetable.push({
                        time: elem.attribs.datetime,
                        href: elem.parent.parent.attribs.href
                    });
                });
            });
        }).then(() => {
            console.log("Scrapped data !");
            then(this.data);
        });
    }
}