const Order = require("../models/Order");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//POST
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    } 
});

//GET USER
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const orders = await Order.find({ userId: req.params.id });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ORDER
router.get("/details/:id", verifyToken, async (req, res) => {
    try{
        const getOrder = await Order.findOne({ orderID: req.params.id });
        res.status(200).json(getOrder);
    } catch (err) {
        res.status(500).json(err);
    }
})

//UPDATE
router.put("/update/:id", verifyToken, async (req, res) => {
    try {
        const updateOrder = await Order.findOneAndUpdate(
            { orderID: req.params.id },
            {
                $set: req.body,
            },
            { new: true }
        );

        if (!updateOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.status(200).json(updateOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;