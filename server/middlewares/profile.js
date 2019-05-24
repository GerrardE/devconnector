import validator from 'validator';
import isEmpty from './isEmpty';

const validProfile = (data) => {
  let errors = {};
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // Handle validations
  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Profile handle needs to be between 2 and 40 characters';
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required';
  }

  // Status validation
  if (validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }

  // Skills validation
  if (validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  // URL validations
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = 'Invalid URL'
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = 'Invalid URL'
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = 'Invalid URL'
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = 'Invalid URL'
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = 'Invalid URL'
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = 'Invalid URL'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

export default validProfile;