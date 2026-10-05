const validate=(schema)=> async(req,res,next)=>{
    try{
      const parseBody=await schema.parseAsync(req.body);
      req.body=parseBody;
      next();
    }catch(err){
        console.log(err.issues);
        const status=422;
        const message="Fill the input properly";
        const extraDetails=err.issues[0].message;
        const error={
            status,
            message,
            extraDetails,
        };
        console.log(message);
        next(error);
    }
};
module.exports=validate;