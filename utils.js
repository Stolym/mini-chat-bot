const natural = require('natural');
const fs = require('fs');

module.exports.distance = (cl, text, path) => {
    var data = JSON.parse(fs.readFileSync(path));

    for (var i = 0; i < data.length; i++) {
        if (natural.JaroWinklerDistance(data[i].text, text) > 0.90)
            return data[i].label;
    }
    return cl;
};