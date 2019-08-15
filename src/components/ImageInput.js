import React from "react";
import PropTypes from "prop-types";

/*
 * Input for the user supplied image URL
 */
const ImageInput = ({ onInputChange, onImageSubmit }) => {
  return (
    <div className="center">
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Image URL</span>
        </div>
        <input
          type="text"
          className="form-control"
          id="img-url"
          onChange={onInputChange}
        />
        <input
          type="submit"
          value="Detect Faces"
          className="btn btn-primary btn-block mt-4"
          onClick={onImageSubmit}
        />
      </div>
    </div>
  );
};

ImageInput.propTypes = {
  onInputChange: PropTypes.func,
  onImageSubmit: PropTypes.func
};

export default ImageInput;
