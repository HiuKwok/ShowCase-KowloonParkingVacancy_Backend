
const express = require('express');
const logger = require('../component/logger');
const db = require('../component/dbPool');
const exUtil = require('../util/exUtil');
const up = require('../Logic/updater');
const util = require('../util/util')

const router = express.Router();



router.get('/', function (req, res) {
    up.getInfoFromGov()
        .then( (data) => { exUtil.stdResponse200(res, data);})
        .catch( (err) => {
            util.onRejectPrintMsg(err);
            exUtil.stdResponse500(res, err);
        });
});




router.post('/', function (req, res) {

    db.pool.connect().then(client => {
        up.updateVacancyInfo(client)
            .then( data => {
                logger.info("Update vacancy record with size: " + data);
                exUtil.stdResponse201(res, data);
            } )
            .catch((err) => { exUtil.stdResponse500(err); })
            .then( () => {client.release();});
    });

});

module.exports = router;