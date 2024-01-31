import { Router } from "express";
import { validateProduct } from "../utils/validateProduct.js";
import __dirname from "../utils.js";
import productsDao from "../daos/dbManager/products.dao.js";

const router = Router();

//Recuperar todos los productos
router.get("/", async (req, res) => {
    try { 
        const products = await productsDao.getAllProducts(req.query);
        res.json(products);
    }catch(error){
        console.log(error);
        res.status(400).json({
            error: error
        });
    }  
  });

// Recuperar un producto
router.get('/:pid', async (req, res) =>{
    try{
        let {pid} = req.params;
        const productoBuscado = await productsDao.getProductById(pid);
            if (!productoBuscado){
                return res.json({
                    error:"El Producto No Existe"
                });
            }
            res.json({
                productoBuscado
            });
    }catch(error){
        console.log(error);
            res.json({
                error: error
            });
    }
});

//REgistrar Producto
router.post('/', validateProduct , async (req, res) => {
    const {  title, description, code, price, status, stock, category, thumbnail } = req.body;
    let product = {};
    try {
        product.title = title;
        product.description = description;
        product.code = code;
        product.price = price;
        product.status = status;
        product.stock = stock;
        product.category = category;
        product.thumbnail = thumbnail;
        const ProductAdded = await productsDao.createProduct(product);
        res.json({
                message: "product created",
                ProductAdded,
              });
        console.log("Producto creado:");
        console.log(ProductAdded);
        }
    catch (e) {
      res.json({
        error: e.message,
      });
    }
});

//Updte Product
router.put('/:pid', validateProduct, async(req, res) =>{
    const pid = req.params.pid;
    
    const { title, description, code, price, status, stock, category,thumbnail} = req.body;
    
    const product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      };

    try {
        const ProductAdded = await productsDao.updateProduct(pid, product);
        if (ProductAdded){
            res.json({
                message: "updated product",
                ProductAdded,
              });
        }
        else
        {
            res.json({
             error: "I cannot update the product",
            });
        };
      
    } catch (e) {
      res.json({
        error: e.message,
      });
    }
});

//Delete Product
router.delete('/:pid', async (req,res) => {
    try{
        let {pid} = req.params;
        const productoEliminado = await productsDao.deleteProduct(pid);
        res.json({
            productoEliminado
        });
    }
    catch(error){
        console.log(error);
        res.json({
            error:error
        });
    }

})

export default router;