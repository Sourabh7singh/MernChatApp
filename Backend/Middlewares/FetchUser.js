const FetchUser=(req,res,next)=>{
    //Fetch user in the between
    req.user="Saurabh"
    next();
}

module.exports = FetchUser;