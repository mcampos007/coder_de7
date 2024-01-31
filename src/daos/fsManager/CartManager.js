import fs from "fs";
class cartManager{
    constructor(path){
        this.path = path;
        console.log(`Ruta y archivo de datos ${this.path}`)        ;
        if (fs.existsSync(this.path)){
            console.log(`Existe el archivo ${this.path}`);
            try{
                //Leer el archivo y asignarlo a la variable
                let carts = fs.readFileSync(this.path,"utf-8");
                //parxsear la lectura 
                this.carts = JSON.parse(carts);
                console.log(`El contenido del archivo de datos es:\n ${this.carts}`);
            }catch(error){
                console.log(`Se haproducido un error durante la lectura \n ${error} \n se crea un array vacío` );
                //Se crea un error vacío
                this.carts = [];
            }
        }else{
            //Crear un array vacío
            console.log(`Creando un array vacío`);
            this.carts = [];
        };
    };
    //Recuperar los productos en el carrito a partir del ID  
    getProductsInCartById(id){
        console.log(id);
        const cart = this.carts.find(cart => cart.id === id);
        if (!cart){
            console.log("Cart Not Found");
            return false;
        }else{
            return cart;
        }

    };

    //Agrgar un carrito
    async addCart(Cart) {
        Cart.id= this.generaId();
        console.log(Cart.id);
        this.carts.push(Cart);
        const respuesta = await this.saveFile(this.carts);
        if (respuesta) {
            console.log("Carrito creado");
            return true;
        }
        else{
            console.log("Hubo un error al crear el carrito");
            return false;
        };

    };

    //Agregar item a un cart
    async addItemToCart( cId, pId, qTy){
        console.log("Todo el objeto carts")
        console.log(this.carts);

        // Verificar si existe un objeto con el id pasado por parámetro
        const cart = this.carts.find(cart => cart.id === Number(cId));
        console.log("El objeto buscado");
        console.log(cart);

        // Buscar el producto pasado como parametro
         if (cart){
            const productIndex = cart.products.findIndex(item => item.product === Number(pId));
            console.log(`Carrito ${cId} Producto ${pId} Buscado`);
            console.log(productIndex);
            if (productIndex !== -1) {
                // Si existe, aumentar su quantity en 1
                cart.products[productIndex].quantity += 1;
            } else {
                // Si no existe, agregar un nuevo elemento a products con id=2 y quantity en 1
                console.log("No existe el producto, se debe agregar");
                cart.products.push({ product: Number(pId), quantity: 1 });
                console.log("Luego del push");
                console.log(cart.products);
            }
            
            // Actualizar el array carts si es necesario
            const index = this.carts.findIndex(c => c.id === Number(cId));
            if (index !== -1) {
                console.log(`indice a actualizar ${index}`);
                this.carts[index] = cart;
            };
            console.log("Todo el objeto carts al final")
            console.log(this.carts);
            //Actualizar el archivo
            const respuesta = await this.saveFile(this.carts);
            if (respuesta) {
                console.log("Carrito actualizado");
                return true;
            }
            else{
                console.log("Hubo un error al actualizar el carrito");
                return false;
            };

         }else{
            console.log("No se encontró el carito");
         };

        
        
            
                
        
    };

        /*
        if (respuesta) {
            console.log("Producto creado");
            return true;
            } else {
            console.log("Hubo un error al crear un Producto");
            return false;
            }
        }*/
    

    async saveFile(data) {
        try {
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(data, null, "\t")
          );
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }    
    // Generar ID único
    generaId(){
        console.log("Generar ID");
        this.carts = this.getCarts();     
        if (this.carts.length ===0){
            return 1;
        }else{
            return this.carts[this.carts.length-1].id + 1;
        }
    };

    // REcuperar los carrito
    getCarts(){
        
        if (fs.existsSync(this.path)){
            try{             
                let carts =  fs.readFileSync(this.path,"utf-8");
                
                this.carts = JSON.parse(carts);
                
            }
            catch(error){
                console.log(`${error} Error al recuperar los carritos`);
                this.carts = [];
            }
        }else{
            console.log(`No existe el archivo de datos`);
            this.carts = [];
        }
        console.log(this.carts);
        return this.carts;
    };
 
};



    
    /*this.products = this.getProducts();

     //const producto = this.products.find((producto =>producto.id===idProducto));
     const producto = this.products.find((producto =>producto.id===idProducto));
     if (!producto){
        console.log("Not found");
         return false;
     }else{
         //console.log(producto);
         return producto;
     }*/
 

class Cart{
    constructor(
        products       //(Array de productos) 
    ){
        console.log(`products ${products}`);
        this.products = products;
        console.log(this.products);
    }
};

export { cartManager, Cart };
