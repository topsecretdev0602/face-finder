import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

/*
 * Displays the user supplied image and draws the bounding boxes on the image
 */
class FaceDetector extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  static propTypes = {
    imgURL: PropTypes.string.isRequired,
    faces: PropTypes.array
  };

  /*
   * Draw the image and the bounding boxes now that the component has mounted
   */
  componentDidMount() {
    this.drawBoxes(
      this.calculateFaceLocations(this.props.boxes.outputs[0].data.regions),
      this.props.imgURL
    );
  }

  /*
   * Draw the image and the bounding boxes if the image updates
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.imgURL !== this.props.imgURL ||
      (prevProps.boxes.output !== undefined &&
        prevProps.boxes.output[0].data.regions) !==
        (this.props.boxes.outputs !== undefined &&
          this.props.boxes.outputs[0].data.regions)
    ) {
      this.drawBoxes(
        this.calculateFaceLocations(this.props.boxes.outputs[0].data.regions),
        this.props.imgURL
      );
    }
  }

  /*
   * The Clarafai API returns the bounding boxes normalized between 0 and 1.
   * To draw them on the correct place on the image you need to multiply those numbers by the width and height of the image.
   */
  calculateFaceLocations = boxes => {
    if (boxes === undefined) {
      return;
    }
    return boxes.map(box => {
      const face = box.region_info.bounding_box;
      const canvas = this.canvasRef.current;
      const width = Number(canvas.width);
      const height = Number(canvas.height);
      return {
        x: face.left_col * width,
        y: face.top_row * height,
        width: face.right_col * width - face.left_col * width,
        height: face.bottom_row * height - face.top_row * height
      };
    });
  };

  /*
   * Overlay the bounding boxes on the canvas
   */
  drawBoxes = (boxes, imgURL) => {
    const canvas = this.canvasRef.current;
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imgURL;
      img.onload = function() {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (boxes !== undefined) {
          return boxes.map(box => {
            ctx.rect(box.x, box.y, box.width, box.height);
            ctx.strokeStyle = "#FFFFFF";
            ctx.stroke();
          });
        }
      };
    }
  };

  render() {
    const { boxes } = this.props;
    const regions = boxes.outputs[0].data.regions;
    return (
      <div className="center">
        <Fragment>
          {regions === undefined ? (
            <h6 className="display-6 text-center mb-4">No faces detected.</h6>
          ) : (
            <h6 className="display-6 text-center mb-4">
              Faces detected: {regions.length}
            </h6>
          )}
          <div className="text-center">
            <canvas ref={this.canvasRef} width="800" height="800" />
          </div>
        </Fragment>
      </div>
    );
  }
}

export default FaceDetector;
