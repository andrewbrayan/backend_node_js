'use strict';

var controller = {

    test: function (req, res) {
        return res.status(200).send({ message: 'Test' });
    }
};

module.exports = controller;