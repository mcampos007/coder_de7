function validateProduct(req, res, next) {
    
    const { title, description, code, price, status, stock, category } = req.body;
  
    if (!title) {
      return res.json({
        error: "Title is required",
      });
    }
  
    if (!description) {
      return res.json({
        error: "Description is required",
      });
    }
  
    if (!code) {
      return res.json({
        error: "code is required",
      });
    }
  
    if (!price) {
      return res.json({
        error: "Price is required",
      });
    }
    
    /* if (!status) {
        return res.json({
          error: "status is required",
        });
    }; */
    
    if (!stock) {
        return res.json({
          error: "stock is required",
        });
    }
     if (!category) {
            return res.json({
              error: "category is required",
            });
     };
  
    next();
  }
  
  export { validateProduct };