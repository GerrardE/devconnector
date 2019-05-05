import validator from 'validator';
import isEmpty from './isEmpty';

const validPost = (data) => {
  let errors = {};
  data.text = !isEmpty(data.text) ? data.text : '';

  // Text validations
  if (!validator.isLength(data.text, { min:10, max:300 })) {
    errors.text = 'Post must be between 10 to 300 characters';
  }

  // Text validations
  if (validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

export default validPost;