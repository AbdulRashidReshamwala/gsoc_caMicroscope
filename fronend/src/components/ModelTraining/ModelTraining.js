import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import ModelTrainingStep1 from "./ModelTrainingStep1";
import ModelTrainingStep2 from "./ModelTrainingStep2";
import ModelTrainingStep3 from "./ModelTrainingStep3";
import * as tfvis from "@tensorflow/tfjs-vis";

export default function ModelTraining() {
  const [model, setModel] = useState(null);
  const [stage, setStage] = useState(1);
  const [iLayer, setILayer] = useState(1);

  useEffect(() => tfvis.visor().close(), []);

  let s;
  switch (stage) {
    case 1:
      s = (
        <ModelTrainingStep1
          model={model}
          setModel={setModel}
          setStage={setStage}
        />
      );
      break;
    case 2:
      s = (
        <ModelTrainingStep2
          model={model}
          setModel={setModel}
          setStage={setStage}
        />
      );
      break;
    case 3:
      s = <ModelTrainingStep3 model={model} setModel={setModel} />;
      break;
    default:
      s = <h1>Error</h1>;
  }

  return (
    <>
      <br />
      <h1>Model Builder</h1>
      <h6>Press '~' on your keyboard to toggle model info</h6>
      {stage > 1 ? (
        <>
          <Button
            onClick={() => {
              setStage(stage - 1);
            }}
            variant="danger"
          >
            prev
          </Button>
          <br />
        </>
      ) : null}
      {model ? (
        <>
          <br />
          <h4>Layer Viewer</h4>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Select Layer to Inspect</Form.Label>
            <Form.Control
              value={iLayer}
              type="number"
              placeholder="eg : 256"
              onChange={e => setILayer(parseInt(e.target.value))}
            />
          </Form.Group>
          <Button
            onClick={e => {
              e.preventDefault();
              tfvis.visor().open();
              if (iLayer - 1 > model.layers.length - 1) {
                alert(`Model only has ${model.layers.length} layers`);
              } else {
                tfvis.show.layer(
                  {
                    name: "Layer Details",
                    tab: "Layer Inspector"
                  },
                  model.getLayer(undefined, iLayer - 1)
                );
              }
            }}
          >
            Inspect
          </Button>
          <br />
        </>
      ) : null}

      <br />
      {s}
    </>
  );
}
