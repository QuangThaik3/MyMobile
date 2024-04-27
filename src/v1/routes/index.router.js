const express = require('express');
const router = express.Router();

router.get('/checkstatus', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'api ok'
    })
})

router.get('/api/user', (req, res, next) => {
    res.status(200).json({
        status: 'success api',
        message: 'api ok',
        metadata: [
            {
                name: 'anonystick',
                age: 40
            },
            {
                name: 'rolando',
                age: 39
            },
            {
                name: 'messi',
                age: 37
            },
        ]
    })
})

module.exports = router;
