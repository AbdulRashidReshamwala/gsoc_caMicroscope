import React, { useState, useEffect } from "react";
import { Form, Button, Row } from "react-bootstrap";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

export default function ModelTrainingStep2(props) {
  let m = props.model;
  let sM = props.setModel;
  let sS = props.setStage;
  const [filterSize, setFilterSize] = useState(8);
  const [kernalSize, setKernalSize] = useState(5);
  const [strideSize, setStrideSize] = useState(1);
  const [nueronSize, setNueronSize] = useState(256);
  const [activation, setActivation] = useState("relu");
  const [layer, setLayer] = useState("conv2d");

  useEffect(() => tfvis.visor().open(), []);

  function addLayer(model, l) {
    switch (l) {
      case "dense":
        model.add(
          tf.layers.dense({
            units: parseInt(nueronSize),
            activation: activation
          })
        );
        break;
      case "conv2d":
        model.add(
          tf.layers.conv2d({
            kernelSize: parseInt(kernalSize),
            filters: parseInt(filterSize),
            strides: parseInt(strideSize),
            activation: activation,
            kernelInitializer: "VarianceScaling"
          })
        );
        break;
      case "flatten":
        model.add(tf.layers.flatten());
        break;
      default:
        alert("err");
        break;
    }

    return model;
  }

  return (
    <>
      <h3>Configure layer to add</h3>
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Select Layer</Form.Label>
        <Form.Control as="select" onChange={e => setLayer(e.target.value)}>
          <option value="conv2d">Convolution 2D</option>
          <option value="flatten">Flatten</option>
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
      {layer === "conv2d" || layer === "dense" ? (
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Select Activation Layer</Form.Label>
          <Form.Control
            as="select"
            onChange={e => setActivation(e.target.value)}
          >
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
            <option value="tanh">TanH</option>
          </Form.Control>
        </Form.Group>
      ) : null}
      <Row>
        <Button
          style={{ marginRight: "34px" }}
          onClick={() => {
            m = addLayer(m, layer);
            sM(m);
            tfvis.show.modelSummary(
              { name: "Model Summary", tab: "Model Inspection" },
              m
            );
          }}
        >
          Add Layer
        </Button>
        <Button variant="success" onClick={() => sS(3)}>
          Done
        </Button>
      </Row>
    </>
  );
}
