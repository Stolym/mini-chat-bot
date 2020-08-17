'use strict';
const PORT = process.env.PORT || 3000;

const Classifier = require("./classifiers.js");
const Scrapper = require('./data_cinemas.js');
const BootBot = require('bootbot');

const input = require("./input.js");
const subject = require("./subject.js");
const database = require('./database.js');
const natural = require('natural');
const fs = require('fs');

const helper = (payload, chat, user) => {
    return chat.say("Le chat fonctionne sur du natural language processing donc ne peut comprendre tout ce que vous dites !\nVous pouvez le saluer pour l'activer et de même pour le désactiver.\nUne fois actif vous pouvez lui demander de changer de date ou alors des informations sur le cinéma(Nourriture/Listes des films/Information sur un film)");
}

const response = {
    "input": async (payload, chat, data) => {
        var user = await database.get_data_id(payload.sender.id);

        if (user.state >= 1)
            return;
        database.update_data_id(payload.sender.id, { $set: { state: 1, date: new Date() }}).then(() => {
            input.input_response(payload, chat, user);
        });
    },
    "output": async (payload, chat, data) => {
        var user = await database.get_data_id(payload.sender.id);

        if (user.state == 0)
            return;
        database.update_data_id(payload.sender.id, { $set: { state: 0, date: new Date() }}).then(() => {
            chat.say("Au revoir merci d'avoir utiliser nos services, n'hesitez pas a mettre un commentaire !");
        });
    },
    "subject": async (payload, chat, data) => {
        var user = await database.get_data_id(payload.sender.id);

        if (user.state == 0)
            return chat.say("Veuillez activer le bot en le saluant !");
        else if (natural.JaroWinklerDistance(payload.message.text, "Aide") > 0.8 || natural.JaroWinklerDistance(payload.message.text, "Help") > 0.8)
            return helper(payload, chat, user);
        subject.subject_response(payload, chat, user, data);
    },
    "outSubject": async (payload, chat, data) => {
        chat.say("je ne comprends pas ce que vous désirez ...");
    },
};

class myBot {
    constructor()
    {
        this.data = [];
        this.classifierState = new Classifier("./classifier_data/user_state_train.json", "./classifier_data/user_state_test.json");
        this.bot = new BootBot(JSON.parse(fs.readFileSync("./config.json")));
        this.nounInflector = new natural.NounInflector();

        this.classifierState.train();
        this.bot.on("message", (payload, chat) => {
            this.message(payload, chat);
        });
    }
    async checkUserExist(payload, chat) {
        if (await database.get_data_id(payload.sender.id) == undefined) {
            await database.insert_data_id({
                _id: payload.sender.id,
                state: 0,
                memory: "none",
                date: new Date(),
            });
            chat.say("Bienvenue sur notre page facebook ! si vous avez besoin de quoi que ce soit en rapport avec notre page ou site vous pouvez me le demander :D");
        }
    }

    stateUser(payload, chat) {
        var state = this.classifierState.classify(payload.message.text);

        response[state](payload, chat, this.data);
    }

    message(payload, chat) {
        this.checkUserExist(payload, chat);
        this.stateUser(payload, chat);
    }
}

exports.bot = new myBot();
new Scrapper().scrap(async (data) => { exports.bot.data = data; exports.bot.bot.start(PORT); });