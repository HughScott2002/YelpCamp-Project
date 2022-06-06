module.exports = (func) => {
  //Return a function and chain on a dot catch
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

// function wrapAsync(fn){
//   //Return a function and chain on a dot catch
//   return function(req, res, next){
//     func(req, res, next).catch(next);
//   };
// };
