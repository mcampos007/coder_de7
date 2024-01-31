import { Router } from "express";
import { ProductManager, Producto } from "../daos/fsManager/ProductManager.js";
import { validateProduct } from "../utils/validateProduct.js";
import __dirname from "../utils.js";
  
const productosJsonPath = `${__dirname}/data/productos.json`;


const router = Router();

//console.log(productosJsonPath);
const manager = new ProductManager(productosJsonPath);

router.get("/", async (req, res) => {
    try{
        const products = await manager.getProducts();
        const {limit} = req.query;
        if (!limit){
            return res.json({
                products,
              });
        }
        const productosLimitados = products.slice(0,Number(limit));
        res.json({
            productosLimitados
        });
    }catch(error){
        console.log(error);
        res.json({
            error: error
        });
    }
  });
  
router.get('/:pid', async (req, res) =>{
try{
    let id = parseInt(req.params.pid);
    const productoBuscado = await manager.getProductById(id);
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

router.post('/', validateProduct , async (req, res) => {
    //thumbnail
    const {  title, description, code, price, status, stock, category, thumbnail } = req.body;

    const producto = new Producto(title, description, code, price, status, stock, category, thumbnail );

    try {
        const isProductAdded = await manager.addProduct(producto);
        if (isProductAdded){
            
            res.send({
                message: "product created",
                producto,
              });
            console.log("Producto creado:");
           // console.log(producto);
        }
        else
        {
            res.json({
             error: "Failed to add product",
            });
        };
      
    } catch (e) {
      res.json({
        error: e.message,
      });
    }
});

router.put('/:pid', validateProduct, async(req, res) =>{
    const pid = req.params.pid;
    const { title, description, code, price, status, stock, category,thumbnail} = req.body;
    const producto = new Producto(title, description, code, price, status, stock, category, thumbnail );
    try {
        const isProductAdded = await manager.updateProduct(pid, producto);
        if (isProductAdded){
            res.json({
                message: "updated product",
                producto,
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

router.delete('/:pid', async(req, res) =>{
    
    const pid = req.params.pid;
    if (!pid){
        res.json({
            error:"No hay producto a eliminar"
        })
    }else{
        try{
            const productDeleted = await manager.deleteProduct(pid);
            console.log(productDeleted);
            if (productDeleted){
                res.json({
                    message:"Product deleted"
                });
            }else{
                res.json({
                    error:"No se puedo eliminar el producto x"
                })
            };
        }
        catch(e){
            res.json({
                error:"No se puedo eliminar el producto"
            })
        }
        
    }
});
 export default router;  

