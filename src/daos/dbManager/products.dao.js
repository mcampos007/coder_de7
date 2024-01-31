import  {product}  from "../../models/products.model.js";
import mongoose from "mongoose";

class ProductDao {
  async getAllProducts(parametros) {
    const {limit, page, sortOrder, category, status} = parametros;
    const limite = limit || 10;
    const pagenro = page || 1;
    
    console.log(`sort:${sortOrder}`);
    console.log(`category:${category}`);
    console.log(`status:${status}`);

    // Construir el objeto de consulta dinámicamente
    const consulta = {};
    if (category) {
      consulta.category = category;
    }
    if (status !== undefined) {
      consulta.status = status === 'true'; // Convierte el string 'true' a boolean true
    }

    // Construir el objeto de opciones de ordenación dinámicamente
    const opcionesOrdenacion = {};
    if (sortOrder === 'asc') {
      opcionesOrdenacion.price = 1; // 1 para ordenar de manera ascendente
    } else if (sortOrder === 'desc') {
      opcionesOrdenacion.price = -1; // -1 para ordenar de manera descendente
    }

    //return await product.paginate(consulta , {limit:limite, page:pagenro });
    const resultadoPaginacion = await product.paginate(consulta, { limit: limite, page: pagenro });
   // console.log('Documentos recuperados:');
    resultadoPaginacion.docs.forEach(documento => {
     // console.log('ID del documento:', documento._id);
     // console.log('Título:', documento.title); 
    });
    return resultadoPaginacion;
    //return await product.find(consulta).limit(limite).sort(opcionesOrdenacion);
  }

  async getProductById(id) {
    return await product.findById(id);
  }

  async createProduct(producto) {
   const resultado = await product.create(producto);
    console.log(resultado);
    return resultado;
    
  }

  async updateProduct(id, product) {
    return await product.findByIdAndUpdate(id, product);
  }

  async deleteProduct(id) {
    return await product.findByIdAndDelete(id);
  }
}

export default new ProductDao();