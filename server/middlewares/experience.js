import validator from 'validator';
import isEmpty from './isEmpty';

const validExperience = (data) => {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // title validation
  if (validator.isEmpty(data.title)) {
    errors.title = 'Job title field is required';
  }

  // company validation
  if (validator.isEmpty(data.company)) {
    errors.company = 'Company field is required';
  }

  // from validation
  if (validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validExperience;
