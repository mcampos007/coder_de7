function validateUsers(req, res, next) {
    
    const { first_name, last_name, email, age, password } = req.body;
    let data = {};
  
    if (!first_name) {    
        data.first_name= "Title is required"
    }
  
    if (!last_name) {
      
        data.last_name = "last_name is required"
      
    }
  
    if (!email) {
      
        data.email = "email is required"
      
    }
  
    if (!age) {
      
        data.age = "age is required"
      
    }
    
    
    if (!password) {
        
          data.password = "password is required"
        
    }

    if (Object.keys(data).length > 0) {
      console.log("faltan datos");
      return res.status(400).json({
        error: "Datos Faltantes",
        data
      });
    }

    
    next();
  }
  
  export { validateUsers };


  
  /* if (!first_name) {
      
    return res.json({
      error: "Title is required",
    });
  }

  if (!last_name) {
    return res.json({
      error: "last_name is required",
    });
  }

  if (!email) {
    return res.json({
      error: "email is required",
    });
  }

  if (!age) {
    return res.json({
      error: "age is required",
    });
  }
  
  /* if (!status) {
      return res.json({
        error: "status is required",
      });
  }; 
  
  if (!password) {
      return res.json({
        error: "password is required",
      });
  } */