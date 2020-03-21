import React, { useState } from "react";
import { Form } from "react-bootstrap";

export default function ModelTrainingStep3() {
  const [noClasses, setNoClasses] = useState(0);

  return (
    <>
      {/* <h3>Enter Number of classes</h3> */}
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Number of classes</Form.Label>
        <Form.Control
          value={noClasses}
          type="number"
          placeholder="eg : 256"
          onChange={e => setNoClasses(parseInt(e.target.value))}
        />
      </Form.Group>
    </>
  );
}
