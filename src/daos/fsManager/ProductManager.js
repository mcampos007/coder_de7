import fs from "fs";

class ProductManager{
    constructor(path){
        this.path = path;
       // console.log("ruta");
        console.log(path);
        if (fs.existsSync(this.path)) {
            try {
              let products = fs.readFileSync(this.path, "utf-8");
              this.products = JSON.parse(products);
            } catch (error) {
              this.products = [];
            }
          } else {
            this.products = [];
          }
    }

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

    //Agrgar un producto
    async addProduct(product) {
        if (this.validarCode(product.code)){
            console.log(`No se puede agregar el producto, ya existe un producto con el código ${product.code}`);
            return false; // 
        }
        
        product.id= this.generaId();
        
        this.products.push(product);
        const respuesta = await this.saveFile(this.products);
        if (respuesta) {
            console.log("Producto creado");
            return true;
            } else {
            console.log("Hubo un error al crear un Producto");
            return false;
            }
        }

    // Método para actualizar un producto existente
    async updateProduct(id, updatedProduct) {
        //const productToUpdate = this.products.find((product) => product.id === id);
        console.log(id);
        const index = this.products.findIndex((product) => product.id === Number(id));
        if (index === -1){
            console.log("Producto no encontrado.");
             return;
        }
        this.products[index] = { ...this.products[index], ...updatedProduct };
        const respuesta = await this.saveFile(this.products);

        if (respuesta) {
            console.log("Producto actualizado correctamente.");
            return true;
        } else {
            console.log("Hubo un error al actualizar el producto.");
            return false;
        }
      }

      async deleteProduct(id){
        console.log(id);
        const producto = this.products.find((p) => p.id == id);
        if (producto){
            const productosSinEliminar = this.products.filter((p) => p.id != Number(id));

            const respuesta = await this.saveFile(productosSinEliminar);

            if (respuesta) {
                console.log("Producto eliminado correctamente.");
                return true;
            } else {
                console.log("Hubo un error al eliminar el producto.");
                return false;
            }
        }else{
            console.log("No existe el producto a eliminar");
            return false;
        }
      }
    
    // REcuperar los productos
       getProducts(){
        
        if (fs.existsSync(this.path)){
            try{
                
                let products =  fs.readFileSync(this.path,"utf-8");
                
                this.products = JSON.parse(products);
                
            }
            catch(error){
                console.log(`${error} Error al recuperar los productos`);
                this.products = [];
            }
        }else{
            console.log(`No existe el archivo de datos`);
            this.products = [];
        }
   
        return this.products;
    }
    //Recuperar un producto a partir de su id
    getProductById(idProducto){
       this.products = this.getProducts();

        //const producto = this.products.find((producto =>producto.id===idProducto));
        const producto = this.products.find((producto =>producto.id===idProducto));
        if (!producto){
           console.log("Not found");
            return false;
        }else{
            //console.log(producto);
            return producto;
        }
    }

      // Generar ID único
    generaId(){
        console.log("Generar ID");
        this.products = this.getProducts();     
        if (this.products.length ===0){
            return 1;
        }else{
            return this.products[this.products.length-1].id + 1;
        }
    }

    // Validar existencia de códe, devuelve true si ya existe o false si no existe
    validarCode(idCode){

        const existe = this.products.find((product) => product.code === idCode);  
        //const existe = this.products.hasOwnProperty('code') && this.products.code === idCode;
        console.log(existe);
        return existe;
    }
}

class Producto{
    constructor(
        title,          //(nombre del producto)
        description,    // (descripción del producto)
        code,           // (código identificador)
        price,          // (precio)
        status,         //Estado de producto, true pot defecto
        stock,          //Existencia
        category,       //Descripción de la categoria
        thumbnail,      // Array con las (ruta de imagenes)
    ){
        this.title = title;          
        this.description = description;    
        this.code = code;     
        this.price = price;   
        this.status = status;
        this.stock = stock;
        this.category = category;       
        this.thumbnail = thumbnail;      
    }
}

export { ProductManager, Producto };
 