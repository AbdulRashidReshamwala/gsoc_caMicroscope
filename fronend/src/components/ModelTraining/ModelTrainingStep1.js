import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

export default function ModelTrainingStep1(props) {
  let m = props.model;
  let sM = props.setModel;
  let sS = props.setStage;
  const inputSize = props.inputSize;
  const setInputSize = props.setInputSize;
  const [filterSize, setFilterSize] = useState(8);
  const [kernalSize, setKernalSize] = useState(5);
  const [strideSize, setStrideSize] = useState(1);
  const [nueronSize, setNueronSize] = useState(256);
  const [activation, setActivation] = useState("relu");
  const [layer, setLayer] = useState("conv2d");

  function createModel(inputSize, channels, l, image) {
    let inputShape;
    if (image) {
      inputShape = [inputSize, inputSize, channels];
    } else {
      inputShape = [inputSize];
    }
    // let model = tf.sequential();
    const model = tf.sequential();
    switch (l) {
      case "dense":
        model.add(
          tf.layers.dense({
            inputShape: inputShape,
            units: parseInt(nueronSize),
            activation: activation
          })
        );
        break;
      case "conv2d":
        model.add(
          tf.layers.conv2d({
            inputShape: inputShape,
            kernelSize: parseInt(kernalSize),
            filters: parseInt(filterSize),
            strides: parseInt(strideSize),
            activation: activation,
            kernelInitializer: "VarianceScaling"
          })
        );
        break;
      default:
        alert("err");
        break;
    }

    return model;
  }

  return (
    <>
      <h3>Select Type Starting layer</h3>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Input Size </Form.Label>
        <Form.Control
          value={inputSize}
          type="number"
          placeholder="eg : 256"
          onChange={e => setInputSize(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Select Layer</Form.Label>
        <Form.Control as="select" onChange={e => setLayer(e.target.value)}>
          <option value="conv2d">Convolution 2D</option>
          <option value="dense">Dense</option>
        </Form.Control>
      </Form.Group>
      {layer === "dense" ? (
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Input Size Nuerons</Form.Label>
          <Form.Control
            value={nueronSize}
            type="nmumber"
            placeholder="eg : 256"
            onChange={e => setNueronSize(e.target.value)}
          />
        </Form.Group>
      ) : null}
      {layer === "conv2d" ? (
        <>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Kernal Size</Form.Label>
            <Form.Control
              value={kernalSize}
              type="number"
              placeholder="eg : 256"
              onChange={e => setKernalSize(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Number Filters</Form.Label>
            <Form.Control
              value={filterSize}
              type="number"
              placeholder="eg : 256"
              onChange={e => setFilterSize(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Stride</Form.Label>
            <Form.Control
              value={strideSize}
              type="number"
              placeholder="eg : 256"
              onChange={e => {
                console.log(e.target.value);
                setStrideSize(e.target.value);
              }}
            />
          </Form.Group>
        </>
      ) : null}

      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Select Activation Layer</Form.Label>
        <Form.Control as="select" onChange={e => setActivation(e.target.value)}>
          <option value="relu">ReLU</option>
          <option value="sigmoid">Sigmoid</option>
          <option value="tanh">TanH</option>
        </Form.Control>
      </Form.Group>
      <br />
      <Button
        onClick={() => {
          m = createModel(inputSize, 3, layer, true);
          sM(m);
          tfvis.show.modelSummary(
            { name: "Model Summary", tab: "Model Inspection" },
            m
          );
          sS(2);
        }}
      >
        Add Layer
      </Button>
    </>
  );
}
