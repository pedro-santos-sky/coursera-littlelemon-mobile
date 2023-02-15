export const validateName = (name) => {

    return name.match(/^[a-zA-Z]+$/)
}


export const validateEmail = (email) => {
    return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
         )
}

export const validatePassword = (password) => {
    const regEx = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
    return regEx.test(password)
}


export const validateTelNum = number => {
    if (isNaN(number)) {
      return false;
    } else if (number.length == 10) {
      return true;
    }
  };