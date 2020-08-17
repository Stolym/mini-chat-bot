var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

MongoClient.connect(url, async function(err, client) {
    if (err) throw err;
    db = await client.db("cinemas_bot");
    console.log("Connected to db !");
});

module.exports.get_data_id = async (id) => {
    return await db.collection("Account").findOne({ _id: id });
}

module.exports.update_data_id = async (id, query) => {
    return await db.collection("Account").updateOne({ _id: id }, query);
}

module.exports.insert_data_id = async (object) => {
    return await db.collection("Account").insertOne(object);
}
