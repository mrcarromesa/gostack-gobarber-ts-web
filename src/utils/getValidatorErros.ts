import { ValidationError } from 'yup';

interface Erros {
  [key: string]: string;
}

const getValidatorErros = (erros: ValidationError) : Erros => {
  const validators: Erros = {};

  erros.inner.forEach((error) => {
    validators[error.path] = error.message;
  });

  return validators;
};

export default getValidatorErros;
