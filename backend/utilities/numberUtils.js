
module.exports = function maskNumber(number, lastDigit) {
    let masked = "";
    for (let index = 0; index < number.length; index++) {
      const element = number[index];
      if (index >= number.length - lastDigit) {
        masked += element;
      } else {
        masked += "*";
      }
    }
  
    return masked;
  }