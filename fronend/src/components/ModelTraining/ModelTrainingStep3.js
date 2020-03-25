import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

export default function ModelTrainingStep3(props) {
  const [allDataset, setAllDataset] = useState(null);
  const [selectedDatasetData, setSelectedDatasetData] = useState(null);
  const [optimizor, setOptimizor] = useState("adam");
  const [lossFunction, setLossFunction] = useState("meanSquaredError");
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [dataFlag, setDataFlag] = useState(null);
  const model = props.model;
  const setModel = props.setModel;
  const inputSize = props.inputSize;
  const imageTensor = useRef([]);
  const labelTensor = useRef([]);

  useEffect(() => {
    axios
      .get("https://afternoon-plains-91928.herokuapp.com/dataset/all")
      .then(res => setAllDataset(res.data.datasets))
      .catch(err => alert(err));
  }, []);

  useEffect(() => {
    selectedDataset
      ? axios
          .get(
            `https://afternoon-plains-91928.herokuapp.com/dataset/view/${selectedDataset}`
          )
          .then(res => setSelectedDatasetData(res.data))
          .catch(err => alert(err))
      : console.log("select a datset");
  }, [selectedDataset]);

  function loadImage(src, id, numClasses) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        let onh = Array(numClasses).fill(0);
        onh[id] = 1;
        labelTensor.current.push(tf.tensor1d(onh));
        resolve(
          imageTensor.current.push(
            tf.image.resizeBilinear(tf.browser.fromPixels(img), [
              inputSize,
              inputSize
            ])
          )
        );
      };
      img.onerror = err => reject(err);
    });
  }

  function createDataset(cfu) {
    setDataFlag(false);
    let promises = [];
    const numClasses = cfu.length;
    cfu.forEach((urls, id) => {
      const baseUrl = `https://afternoon-plains-91928.herokuapp.com/static/datasets/${selectedDatasetData.name}/${selectedDatasetData.classes[id]}/`;
      urls.forEach(url => {
        promises.push(loadImage(baseUrl + url, id, numClasses));
      });
    });
    Promise.all(promises).finally(() => setDataFlag(true));
  }

  function preProcess() {
    model.add(
      tf.layers.dense({
        units: selectedDatasetData.classes.length,
        activation: "softmax"
      })
    );
    model.compile({
      optimizer: optimizor,
      loss: lossFunction,
      metrics: ["accuracy"]
    });
    setModel(model);
    tfvis.show.modelSummary(
      { name: "Model Summary", tab: "Model Inspection" },
      model
    );
    imageTensor.current = tf.stack(imageTensor.current);
    labelTensor.current = tf.stack(labelTensor.current);
  }

  async function traingLoop() {
    setDataFlag("training");
    preProcess();
    console.log("img", imageTensor.current.shape);
    console.log("label", labelTensor.current.shape);
    console.log(model.summary());

    await model.fit(imageTensor.current, labelTensor.current, {
      batchSize: 4,
      epochs: 10,
      callbacks: tfvis.show.fitCallbacks(
        { name: "Fit Callbacks", tab: "Training" },
        ["loss", "acc"]
      )
    });
    setModel(model);
    tfvis.show.modelSummary(
      { name: "Model Summary", tab: "Model Inspection" },
      model
    );
    setDataFlag("trained");
  }

  return (
    <>
      <h2>Compile Model and queue for training</h2>
      {allDataset ? (
        <>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select Dataset</Form.Label>
            <Form.Control
              as="select"
              onChange={async e => {
                if (e.target.value !== "EMPTY") {
                  setSelectedDataset(e.target.value);
                }
              }}
            >
              <option value="EMPTY"> </option>
              {allDataset.map((d, id) => (
                <option key={id} value={id + 1}>
                  {d.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </>
      ) : (
        <h1>Loading</h1>
      )}
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Select Optimizer</Form.Label>
        <Form.Control as="select" onChange={e => setOptimizor(e.target.value)}>
          <option value="adam">Adam</option>
          <option value="adagrad">Adagrad</option>
          <option value="sgd">stochastic gradient descent</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Select Loss Function</Form.Label>
        <Form.Control
          as="select"
          onChange={e => setLossFunction(e.target.value)}
        >
          <option value="meanSquaredError">Mean Squred Error</option>
          <option value="categoricalCrossentropy">
            Softmax Categorical Cross Entropy
          </option>
        </Form.Control>
      </Form.Group>
      {selectedDatasetData ? (
        <>
          <h2>Name : {selectedDatasetData.name}</h2>
          <h3>Classes :</h3>
          <ul>
            {selectedDatasetData.classes.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ul>

          {dataFlag === null ? (
            <Button
              onClick={() => {
                createDataset(selectedDatasetData.files);
              }}
            >
              Load Data
            </Button>
          ) : null}
          {dataFlag === false ? <h1>loading</h1> : null}
          <br></br>
          {dataFlag === true ? (
            <Button
              onClick={() => {
                traingLoop();
              }}
            >
              Train
            </Button>
          ) : null}
          {dataFlag === "trained" ? (
            <>
              <Button
                onClick={() => {
                  model.save(
                    `downloads://${
                      selectedDatasetData.name
                    }-inference-${Math.floor(new Date().getTime() / 1000)}`
                  );
                }}
              >
                Download for Inference
              </Button>
              <br></br>
              <Button
                onClick={() => {
                  const newModel = tf.model({
                    inputs: model.inputs,
                    outputs: model.layers[model.layers.length - 2].output
                  });
                  console.log();
                  tfvis.show.modelSummary(
                    {
                      name: "Feature Extraction Model Summary",
                      tab: "Model Inspection"
                    },
                    newModel
                  );
                  newModel.save(
                    `downloads://${
                      selectedDatasetData.name
                    }-feature-extraction-${Math.floor(
                      new Date().getTime() / 1000
                    )}`
                  );
                  newModel.dispose();
                }}
              >
                Download for Feature Extraction
              </Button>
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}
