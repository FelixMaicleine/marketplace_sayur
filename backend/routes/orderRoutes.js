const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/user/:userId', orderController.getUserOrders);
router.get('/admin', orderController.getAllOrders);
router.put('/:orderId/done', orderController.markOrderDone);

module.exports = router;
