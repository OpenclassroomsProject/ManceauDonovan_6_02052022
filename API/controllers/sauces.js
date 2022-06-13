const SauceSchema = require('../models/Sauce.js');
const fs = require('fs');
const { dirname } = require('path');



exports.create = (req, res) => {
    const dataSauce = JSON.parse(req.body.sauce);
    const NewSauce = new SauceSchema({
        ...dataSauce,
    });
    NewSauce.imageUrl = `${req.protocol}://${req.headers.host}/${req.file.path}`;


    NewSauce.save().then(() => {
            res.status(201).json({
                message: 'Sauce successfully saved !',
                newSauce: NewSauce
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
};
exports.modify = (req, res) => {
    let dataSauce;
    switch (req.headers['content-type']) {
        case 'application/json':
            dataSauce = req.body;
            replyRequest()
            break;
        default:
            dataSauce = JSON.parse(req.body.sauce);
            dataSauce.imageUrl = `${req.protocol}://${req.headers.host}/${req.file.path}`;

            SauceSchema.findById(req.params._id).then(data => {
                if (!data) return res.status(202).json({ message: "No sauce found with this id !" });
                if (data.userId === req.auth) {
                    deleteLocalfile(data.imageUrl);
                    replyRequest()
                } else {
                    res.status(401).json({
                        error: new Error('Unauthorized request!')
                    });
                }
            })
            break;
    }

    function replyRequest() {
        SauceSchema.findByIdAndUpdate(req.params._id, dataSauce, () => {
            res.status(200).json({ message: "Succes modifying sauce !" });
        })
    }
}
exports.delete = (req, res) => {
    SauceSchema.findById(req.params._id).then(sauce => {
        if (sauce.userId !== req.auth) {
            return res.status(401).json({
                error: new Error('Unauthorized request!')
            });
        }
        deleteLocalfile(sauce.imageUrl);
        SauceSchema.findByIdAndRemove(req.params._id, () => {
            return res.status(200).json({ message: "Sauce successfully deleted !" })
        });
    })

}
exports.like = (req, res) => {
    const userId = req.body.userId;

    SauceSchema.findById(req.params._id).then(sauce => {
            let userVoteDB = 0;
            if (sauce.usersLiked.includes(userId)) userVoteDB = 1;
            if (sauce.usersDisliked.includes(userId)) userVoteDB = -1;
            return { sauce, userVoteDB }
        })
        .then(data => {
            let userVoteDB = data.userVoteDB;
            let update = {};
            let message;

            switch (req.body.like) {
                case 1:
                    update.$push = { usersLiked: userId };
                    update.$inc = { likes: +1 };

                    message = "Like successfully send !";
                    // switch (userVoteDB) {
                    //     case -1:
                    //         update.$pull = { usersDisliked: userId };
                    //         update.$inc = { dislikes: -1 };
                    //         message = ` ${message} Dislike successfully remove !`;

                    //         break;
                    //     case 1:
                    //         return res.status(200).json({ message: "Sauce already liked!" });
                    // }
                    break;
                case -1:
                    update.$push = { usersDisliked: userId };
                    update.$inc = { dislikes: +1 };

                    message = "DisLike  successfully sent !"
                        // switch (userVoteDB) {
                        //     case 1:
                        //         update.$pull = { usersLiked: userId };
                        //         update.$inc = { likes: -1 };
                        //         message = ` ${message} Like successfully remove !`;

                    //         break;
                    //     case -1:
                    //         return res.status(200).json({ message: "Sauce already disliked!" });
                    // }

                    break;
                case 0:
                    switch (userVoteDB) {

                        case 1:
                            update.$pull = { usersLiked: userId };
                            update.$inc = { likes: -1 };
                            message = 'Like successfully remove !';
                            break;
                        case -1:
                            update.$pull = { usersDisliked: userId };
                            update.$inc = { dislikes: -1 }
                            message = 'Dislike successfully remove !';

                            break;
                        case 0:
                            return res.status(200).json({ message: "Same !" });
                    }
                    break;
            }

            SauceSchema.findByIdAndUpdate(req.params._id, update, () => {
                return res.status(200).json({ message: message })
            })



        })
}
exports.getAll = (req, res) => {
    SauceSchema.find()
        .then(data => {
            res.status(200).json(data);
        })
        // .catch(err => res.status(404).json({ error: "Impossible d'accéder a la base de données des sauces !", err }));
};
exports.getOne = (req, res) => {
    SauceSchema.findById(req.params._id)
        .then(data => res.status(200).json(data));
};

function deleteLocalfile(url) {
    const Url = new URL(url);
    fs.unlink(dirname(__dirname) + Url.pathname, (err) => {
        if (err) console.log(err);
    });
}