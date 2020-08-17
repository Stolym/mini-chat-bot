const natural = require('natural');
const fs = require('fs');

module.exports = class Classifier {
    constructor(train_data_path, test_data_path) {
        this.classifier = new natural.BayesClassifier();
        this.train_data = JSON.parse(fs.readFileSync(train_data_path));
        this.test_data = JSON.parse(fs.readFileSync(test_data_path));
        this.mountClassifier();
    }

    mountClassifier() {
        for (var i = 0; i < this.train_data.length; i++) {
            this.classifier.addDocument(this.train_data[i].text, this.train_data[i].label);
        }
    }

    async train() {
        await this.classifier.train();
    }

    classify(str) {
        return this.classifier.classify(str);
    }

    getClassify(str) {
        return this.classifier.getClassifications(str);
    }
}