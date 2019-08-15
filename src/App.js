import React, { Component } from "react";
import ImageInput from "./components/ImageInput";
import FaceDetector from "./components/FaceDetector";
import Clarifai from "clarifai";
//import isEmpty from "lodash/isEmpty";

const app = new Clarifai.App({
  apiKey: "YOUR_API_KEY"
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imgURL: "",
      boxes: null
    };
  }

  /*
   * Update state when Clarafai AIP returns bounding box data
   */
  displayFaceBoxes = boxes => {
    this.setState({ boxes: boxes });
  };

  /*
   * keep track of image URL
   */
  onInputChange = event => {
    this.setState({ input: event.target.value.trim() });
  };

  /*
   * Send image to Clarafai and get bounding box data back
   */
  onImageSubmit = () => {
    this.setState({ imgURL: this.state.input.trim() });

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        this.displayFaceBoxes(response);
      })
      .catch(err => console.log(err));
  };

  render() {
    const { imgURL, boxes } = this.state;
    return (
      <div className="container mt-4">
        <h4 className="display-4 text-center mb-4">Face Finder</h4>
        <ImageInput
          onInputChange={this.onInputChange}
          onImageSubmit={this.onImageSubmit}
        />
        {boxes === null ? (
          <h6 className="display-6 text-center mt-4">
            Please enter an image URL
          </h6>
        ) : (
          <FaceDetector imgURL={imgURL} boxes={boxes} />
        )}
      </div>
    );
  }
}

export default App;
