function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function validateTelephone(telephone) {
  var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(telephone);
}

function loginChecker(req, res, next) {
  if (req.session.authorised) {
    res.redirect('/');
    return;
  } else {
    next();
    return;
  }
}

function checkForm(fields) {

  for (var i = 0; i < fields.length; i++) {
    var currElement = fields[i];

    if (currElement == undefined || currElement == '') {
      return false;
    }

  }
  return true;
}

function prices(user) {

  if (user != undefined) {

    var ticketsPrice = 0;
    var lodgePrice = 0;
    var foodPrice = 0;
    var showerPrice = 0;
    
    if (user.duration != undefined && !isNaN(user.duration))
      ticketsPrice = user.duration * 75;
    if (user.lodge  != undefined && user.lodge == 1)
      lodgePrice = (user.lodge * 50) * user.duration;
    if (user.food  != undefined  && user.food == 1)
      foodPrice = (user.food * 20) * user.duration;
    if (user.shower != undefined && user.shower == 1)
      showerPrice = (user.shower * 20) * user.duration;

    var totalPrice = ticketsPrice + lodgePrice + foodPrice + showerPrice;
    
    var prices = {ticketsPrice: ticketsPrice, lodgePrice: lodgePrice, foodPrice: foodPrice, showerPrice: showerPrice, totalPrice: totalPrice}
  
    return prices;
  }

  return -1;
}

module.exports.checkForm = checkForm;
module.exports.loginChecker = loginChecker;
module.exports.validateEmail = validateEmail;
module.exports.validateTelephone = validateTelephone;
module.exports.prices = prices;