function validateCart(req, res, next) {
    
    const { quantity, product } = req.body;
    console.log(req.body);
  
    /* if (!quantity) {
      return res.json({
        error: "Quantity is required",
      });
    }
  
    if (!product) {
      return res.json({
        error: "Product is required",
      });
    }
   */
    next();
  }
  
  export { validateCart };