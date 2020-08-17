
const Classifier = require("./classifiers.js");
const utils = require("./utils.js");

var input_response_classifier = new Classifier("./classifier_data/input_response_train.json", "./classifier_data/input_response_test.json");
input_response_classifier.train();


module.exports.input_response = (payload, chat, user) => {
    var classify = input_response_classifier.classify(payload.message.text);

    classify = utils.distance(classify, payload.message.text, "./classifier_data/input_response_train.json");
    if (classify == "simple")
        chat.say("Bonjour comment allez vous ?, voulez vous des informations sur les films au cinéma ?");
    else if (classify == "complex")
        chat.say("Bonjour nous allons bien merci et vous ?, voulez vous des informations sur les films au cinéma ?");
}