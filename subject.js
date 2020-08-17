
const Scrapper = require('./data_cinemas.js');
const Classifier = require("./classifiers.js");
const utils = require("./utils.js");
const natural = require('natural');

var subject_response_classifier = new Classifier("./classifier_data/subject_response_train.json", "./classifier_data/subject_response_train.json");
subject_response_classifier.train();


const film_information = async (payload, chat, user, data) => {
    for (var i = 0; i < data.length; i++)
        await chat.say(data[i].title);
}

const film_in_chat = async (payload, chat, user, data) => {
    for (var i = 0; i < data.length; i++) {
        var substring_data = natural.LevenshteinDistance(data[i].title, payload.message.text, { search: true });
        if (natural.JaroWinklerDistance(data[i].title, substring_data.substring) > 0.8) {
            await chat.say("Présentation de "+data[i].title);
            await chat.say("Auteur "+data[i].author);
            await chat.say({
                attachment: 'image',
                url: data[i].href_picture
            }, { typing: true });
            await chat.say("Lien du film "+data[i].href);
            for (var j = 0; j < data[i].timetable.length; j++) {
                await chat.say("Horaire "+data[i].timetable[j].time);
                await chat.say("Réserver "+data[i].timetable[j].href);
            }
            break;
        }
    }
}

module.exports.subject_response = (payload, chat, user, data) => {
    var classify = subject_response_classifier.classify(payload.message.text);

    if (classify == "inputResponse")
        return film_information(payload, chat, user, data);
    else if (classify == "filmInformation")
        return film_in_chat(payload, chat, user, data);
    else if (classify == "foodInformation")
        return chat.say("Pour la nourriture il y'a\nPopcorn (Mini/Maxi,3/8$)\nSoda Canette/bouteille (1.5/3$)\nChips 3.5$\nBonbons 2$/100g (Food Information)");
};