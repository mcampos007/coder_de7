import  cartModel from "../../models/carts.model.js";
import mongoose, { Mongoose, Types  } from 'mongoose';

class CartDao {
    async getAllCarts(){
        return await cartModel.find();
    };

    async getCartById(id){
       // return await cartModel.findById(id);
//       const result =  await cartModel.findById(id);
    //   const result = await cartModel.findById(id).populate('products.product').exec();
    const result = await cartModel.findById(id).populate('products.product');

  //     await result.execPopulate();
    //   console.log(JSON.stringify(result, null, '\t'));
       console.log(result)
       return result;
    };

    async createCart(cart){
        return await cartModel.create(cart);
    };

    async addProductToCart(cid, pid){
        console.log(cid);
        console.log(pid);
        try {
            const cart = await this.getCartById(cid)
            const nuevoProducto = {
                "product": pid,
                "quantity": 1
            }
            const indexProductoExistente = cart.products.findIndex(item => item.product ===  pid);

            if (indexProductoExistente !== -1) {
            // Si el producto ya existe, incrementar la cantidad en 1
                cart.products[indexProductoExistente].quantity += 1;
            } else {
            // Si el producto no existe, agregarlo al array
                cart.products.push(nuevoProducto);
            }
            
            console.log(`Nuevos productos ${cart.products}`);
            return await this.updateCart(cid, cart)

        }
        catch(error)   {
            console.log(error);
        }
    }
        
        //return await cartModel.cr
    

    async updateCart(id, newCart){
        return await cartModel.findByIdAndUpdate(id, newCart);
    };
    
    //eliminar todo el carrito
    async deleteCart(id){
        return await cartModel.findByIdAndDelete(id);
    }

    //Eliminar los productos del carrito
    async deletePtoductsInCart(id){
        const result = await cartModel.updateOne(
            { _id: id },
            { $unset: { products: '' } }
          );
          console.log(`result ${result}`);
          return result;
    }

    //Delete Product to cart
    async deleteProductToCart(cid, pid){
        //const cartId = "658341aec4107b26b82b87de";
        //const productIdToRemove = "657f088bbf51d6bc5c0353b3";
        const result = await cartModel.updateOne(
            { _id: cid },
            { $pull: { products: { product: pid } } }
          );
          
          console.log(result);
          return result;

    }

    // Update products to Cart
    async updateProductInCart(cid, pid, quantity){
        console.log(`cid ${cid}`);
        console.log(`pid ${pid}`);
        console.log(`quantity ${quantity}`);

        const result = await cartModel.updateOne(    
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } }
          );
          

          console.log(result);
          return result;
    }
    

}

export default new CartDao();
