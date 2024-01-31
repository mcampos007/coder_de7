import { Router } from "express";
import { cartManager, Cart } from "../daos/fsManager/CartManager.js";
import __dirname from "../utils.js";

const cartsJsonPath = `${__dirname}/data/carts.json`;

const router = Router();

console.log(cartsJsonPath);

const manager = new cartManager(cartsJsonPath);

// REcuperar todos los carritos
router.get('/', (req,res) => {
    const carts = manager.getCarts();
    res.render('carts', {
        title:"Listado de Carritos",
        carts});
})

router.get('/:cid', async (req, res) =>{
try{
    let cid = parseInt(req.params.cid);
    const productosEnCarritoBuscado = await manager.getProductsInCartById(cid);
        if (!productosEnCarritoBuscado){
            return res.json({
                error:"El Carrito No Existe"
            });
        }
        res.render('cartDetails',{
            cid,
            productosEnCarritoBuscado
        });
}catch(error){
    console.log(error);
        res.json({
            error: error
        });
    }
});

router.post('/', async (req, res) => {
    
    //const cartDetails= req.body;
    // for (const { id, quantity } of cartDetails) {
    //     console.log("ID:", id);
    //     console.log("Quantity:", quantity);
    // };
    const  cartDetails = [];
    const nuevoCarrito = new Cart(cartDetails);
    console.log(nuevoCarrito);
    try {
        const IsCartAdded = await manager.addCart(nuevoCarrito);
        if (IsCartAdded){

            res.render(
                "carts", {
                    title:"Listado de Carritos",
                    message: "Listado de Carritos"
            });
        }
        else{
            res.json({
                error: "Failded to add cart"
            });
        }
        
    }
    catch(e){
        res.json({
            error:e.messages,
        });
    };
    
});   



router.post('/:cid/product/:pid', async(req, res) =>{
    const {cid, pid } = req.params;

    const {product, quantity} = req.body;
    // REcuperar los productos del  carrito
    try{
        const isItemUpdate = await manager.addItemToCart(cid, pid, quantity);
        console.log(isItemUpdate);
        res.json("Fin Proc");
    }
    catch(e){
        res.json({
            error:e.messages
        });
    };
    
    

});

    export default router;  