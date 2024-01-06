const Products = require("../models/Products");
const router = require("express").Router();

//GET ALL PRODUCT
router.get("/", async(req, res) => {
    const qTopic = req.query.top;
    try{
        let products;
        
        if(qTopic) {
            products = await Products.find({ topic: qTopic });
        } else {
            products = await Products.find();
        }

        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT CATEGORY
router.get("/category", async (req, res) => {
    const qCategory = req.query.cat;
    const qTopic = req.query.top;
    try{
        let products;
        
        if (qCategory && qTopic) {
            products = await Products.find({ category: qCategory, topic: qTopic });
          } else if (qCategory) {
            products = await Products.find({ category: qCategory });
          } else if (qTopic) {
            products = await Products.find({ topic: qTopic });
          } else {
            products = await Products.find();
          }

        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT ID
router.get("/find/:id", async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//GET PRODUCT TITLE
router.get('/getProductsByType/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Products.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productType = product.type;

        const similarProducts = await Products.find({ type: productType });

        res.json(similarProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//SEARCH
router.post('/search', async (req, res) => {
  const searchTerm = req.body.searchTerm;

  try{
    const product = await Products.find({ title: { $regex: searchTerm, $options: 'i' } });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
})


module.exports = router;