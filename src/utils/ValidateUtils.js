export default class ValidateUtils {
  static email(value) {
    return /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(value);
  }

  static cpf(value) {
    let valueUnMask = value.replace(/[^\d]+/g, '');

    if (valueUnMask.length === 11) {
      if(valueUnMask !== '00000000000' && valueUnMask !== '99999999999'){
        return this.cpfValidator(value);
      }
    }

    return false;
  }

  static validatePhone(value){
    return value.replace(/[^0-9]/g, '').length >= 10;
  }

  static fullName(value) {
    return /^(([A-zÀ-ú]{3,})([A-zÀ-ú]{1,}|\s)*(\s)+([A-zÀ-ú]{1,}))$/.test(value);
  }

  static confirmed(value, pass) {
    return value === pass;
  }

  static passwordSimple(value, type) {
    switch (type) {
    case 'minimumSize':
      return /.{8}/.test(value);
    case 'hasNumCharacter':
      return /[0-9]+/.test(value);
    case 'hasSpecialCharacter':
      return this.hasSpecialCharacter(value);
    case 'hasLowerCaseCharacter':
      return /[a-z]+/.test(value);
    case 'hasUpperCaseCharacter':
      return /[A-Z]+/.test(value);
    default:
      return false;
    }
  }

  static password(value) {
    let checks = {
        length: false,
        lowerLetters: false,
        upperLetters: false,
        numbers: false,
        symbols: false
    };

    if (/.{8}/.test(value)) {
        checks["length"] = true;
    }

    if (/[0-9]+/.test(value)) {
        checks["numbers"] = true;
    }

    if (/[a-z]+/.test(value)) {
        checks["lowerLetters"] = true;
    }

    if (/[A-Z]+/.test(value)) {
        checks["upperLetters"] = true;
    }

    if (this.hasSpecialCharacter(value)) {
        checks["symbols"] = true;
    }

    const items = Object.keys(checks);
    const total = items.length;
    const score = items.reduce((total, key) => total + (checks[key] ? 1 : 0), 0);

    return {
        ...checks,
        total,
        score,
        isValid: checks.length && checks.lowerLetters && checks.upperLetters && checks.numbers && checks.symbols
    };
}

  static hasSpecialCharacter(text) {
    return /[^a-zA-Z0-9]+/.test(text);
  }

  static cpfValidator(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf === '') return false;
    let add = 0;
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i), 10) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11)
      rev = 0;
    if (rev !== parseInt(cpf.charAt(9), 10))
      return false;
    // Valida 2o digito	
    add = 0;
    for (let i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i), 10) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11)
      rev = 0;
    if (rev !== parseInt(cpf.charAt(10), 10))
      return false;
    return true;
  }
}