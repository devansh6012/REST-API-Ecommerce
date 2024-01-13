import Product from "../models/productModel.js";

// Fetch all products
// GET /api/products
// access: Public
const getProducts =  async (req, res) => {
    const products = await Product.find({});
    res.json(products)
};


// Fetch single product
// GET /api/products/:id
// access: Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        res.json(product)
    } catch (error) {
        next({message: 'Not found'})
    }
};


// Create a product
// POST /api/products
// access: Private/Admin
const createProduct =  async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct)
};


// Update product
// PUT /api/products/:id
// access: Private/Admin
const updateProduct =  async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct)
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
};

// Delete product
// DELETE /api/products/:id
// access: Private/Admin
const deleteProduct =  async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({_id: product._id});
        res.status(200).json({message: 'Product deleted'})

    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };