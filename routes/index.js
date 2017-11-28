var express = require('express');
var router = express.Router();
var _ = require('lodash')

var fs = require('fs'), // needed to read JSON file from disk
    Collection = require('postman-collection').Collection,
    myCollection;

myCollection = new Collection(JSON.parse(fs.readFileSync('sample.postman_collection.json').toString()));
const members = myCollection.items.members

members.forEach(item => {

    const route = `/${item.request.url.path.map(item => item.startsWith('{{')
        ? item.replace('{{', ':').replace('}}', '')
        : item).join('/')}`

    router[item.request.method.toLowerCase()](route, function (req, res, next) {
        res.header('Content-Type', 'application/json')
        res.send(item.responses.members[0].body)
    });
})

module.exports = router