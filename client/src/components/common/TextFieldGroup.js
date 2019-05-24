import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({ name, placeholder, value, label, error, info, type, onChange, disabled, required }) => {
  return (
    <div className="form-group">
      <input type={type} className={classnames('form-control form-control-lg', { 'is-invalid': error })} placeholder={placeholder} name={name} value={value} onChange={onChange} disabled={disabled} required={required}></input>

      {error && (<div className="invalid-feedback">{error}</div>)}
      {info && <small className="form-text text-muted">{info}</small>}
    </div>
  )
}

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  info: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.string
}

TextFieldGroup.defaultProps = {
  type: 'text',
  required: false
}

export default TextFieldGroup;
