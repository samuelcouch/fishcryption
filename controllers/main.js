var bcrypt = require('bcrypt'),
    ObjectId = require('mongodb').ObjectID,
    request = require('request'),
    twilio = require('twilio')(accountSid, authToken);


exports.index = function(req, res) {
  res.send('Index page!')
};

exports.route = function(app) {

    app.post('/createMessage', function(req, res) {
        var number = req.body.number;
        var msg = req.body.msg;
        if (!username) {
            res.status(400).send('Goddammit give me a goddamn email');
        } else {
            var fish_url = "http://api.fishplayspokemon.com/position";
            request(fish_url, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var json_ret = JSON.parse(body);
                    var salt = json_ret.x + json_ret.y;
                    var cipher = crypto.createCipher('aes256', salt);
                    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
                    var newMessage = {};
                    newMessage.message = encrypted;
                    db.collection('messages').save(newMessage, function(err, savedMsg) {
                        if (err) {
                            console.log("what the fuck");
                            res.status(500).send();
                        } else {
                            var ID = savedMsg._id; // i dunno if this works
                            twilio.messages.create({
                                body: encrypted,
                                to: number,
                                from: "+3106260020"
                            }, function(err, message) {
                                console.log(message.sid);
                                res.status(200).send();
                            });
                        }
                    });
                }
            });
        }
    });

    app.post('/retrieveMessage', function(req, res){
        var salt = req.body.salt;
        var ID = req.body.ID;
        userObjectID = new ObjectID(ID);
        db.collection('messages').find({
            _id: userObjectID
        }).toArray(function(err, message) {
            if (err) {
                res.status(500).send("goddammit");
            } else {
                var decipher = crypto.createDecipher('aes256', salt);
                var decrypted = decipher.update(message[0].message, 'hex', 'utf8') + decipher.final('utf8');

                res.status(200).send(decrypted);
            }
        });
    });
}
