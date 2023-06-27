const express = require('express');

const router = express.Router();

router.get('/', (req,res) => {
    res.json({"Mesage":"NOTES"})
})

module.exports = router;