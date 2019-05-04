import validator from 'validator';
import isEmpty from './isEmpty';

const validEducation = (data) => {
  let errors = {};
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // school validation
  if (validator.isEmpty(data.school)) {
    errors.school = 'School field is required';
  }

  // degree validation
  if (validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required';
  }

  // Field of study validation
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study is required';
  }

  // from validation
  if (validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

export default validEducation;