import { Router } from "express";
import { validateCart } from "../utils/validateCart.js";
import __dirname from "../utils.js";
import cartsDao from "../daos/dbManager/carts.dao.js";

const router = Router();

// Recuperar todos los carritos
router.get('/', async (req,res) => {
    try {
        const carts = await cartsDao.getAllCarts();
        res.json(carts)
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            error: error
        });
    }
})

//Recupera un carrito
router.get('/:pid', async (req, res) =>{
    try{
        let {pid} = req.params;
        const cartBuscado = await cartsDao.getCartById(pid);
            if (!cartBuscado){
                return res.json({
                    error:"El Carrito No Existe"
                });
            }
            res.json({
                cartBuscado
            });
    }catch(error){
        console.log(error);
            res.status(400).json({
                error: error
            });
    }
    });

//Registrar un carrito
router.post('/', validateCart , async (req, res) => {
   // const {  product, quantity } = req.body;
   console.log(req.body);
    let products = {};
    let cart = req.body;
    try {
        //cart.products = [{"_id": products, "quantity": quantity}]
        const CartAdded = await cartsDao.createCart(cart);
        res.json({
                message: "Cart created",
                CartAdded,
              });
        console.log("Cart creado:");
        console.log(CartAdded);
        }
    catch (e) {
      res.json({
        error: e.message,
      });
    }
});   

//Registrar un producto a uncarrito
router.post('/:cid/product/:pid', validateCart , async (req, res) => {
    // const {  product, quantity } = req.body;
    const {cid, pid} = req.params;
     try {
         //cart.products = [{"_id": products, "quantity": quantity}]
        const CartAdded = await cartsDao.addProductToCart(cid, pid);
         res.json({
                 message: "Cart Update",
                 CartAdded,
               });
         console.log("Cart Updated:");
         console.log(CartAdded);
         }
     catch (e) {
       res.json({
         error: e.message,
       });
     }
 });   

//Update Cart
router.put('/:cid', validateCart, async(req, res) =>{
    const cid = req.params.cid;    
    let products = req.body.products;
    let cart = {};
   // cart._id = cid;
    cart.products = products;
    console.log(cart);

    //  Rutina para consolidar productos
        const consolidatedProducts = {};
        cart.products.forEach(product => {
            const productId = product.product;
            if (consolidatedProducts[productId]) {
            // El producto ya existe, suma la cantidad actual
            consolidatedProducts[productId].quantity += product.quantity;
            } else {
            // Agrega una nueva entrada para el producto
            consolidatedProducts[productId] = {
                product: productId,
                quantity: product.quantity
            };
            }
        });
        cart.products = Object.values(consolidatedProducts);
        /// Fin consolidacion
        try {

            const cartAdded = await cartsDao.updateCart(cid, cart);
            if (cartAdded){
                res.json({
                    message: "updated cart",
                    cartAdded,
                });
            }
            else
            {
                res.json({
                error: "I cannot update the cart",
                });
            };
        
        } catch (e) {
        res.json({
            error: e.message,
        });
        }
    });

// Update quantity in cart
router.put('/:cid/products/:pid' , async(req, res) => {
    try{
        const {cid, pid} = req.params;
        const quantity = req.body.quantity||1;
        const productUpdate = await cartsDao.updateProductInCart(cid, pid, quantity);
        console.log(`productUpdate:${productUpdate}`);
        res.json({productUpdate});
    }
    catch(error){
        console.log(error);
        res.json({
            error:error
        });
    }

});

// Delete all products in Cart
router.delete('/:cid', async (req,res) => {
    try{
        let {cid} = req.params;
        //const cartEliminado = await cartsDao.deleteCart(cid);
        const cartEliminado = await cartsDao.deletePtoductsInCart(cid);
        res.json({
            cartEliminado
        });
    }
    catch(error){
        console.log(error);
        res.json({
            error:error
        });
    }

})   

//eliminar del carrito el producto seleccionado
//DELETE api/carts/:cid/products/:pid 
router.delete('/:cid/products/:pid', async(req, res) => {
    try{
        const {cid, pid } = req.params;
        console.log(`cid${cid}`);
        console.log(`pid${pid}`);
        const productoEliminado = await cartsDao.deleteProductToCart(cid, pid);
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
    
});

export default router;  

