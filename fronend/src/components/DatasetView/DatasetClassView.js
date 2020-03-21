import React from "react";
import ReactNextPaging from "react-next-paging";
import { Col, Row } from "react-bootstrap";
import DatasetItemView from "./DatasetItemView";

const buttonStyles = {
  border: "1px solid #ccc",
  background: "#fff",
  fontSize: "1em",
  padding: 10,
  margin: 5,
  width: 70
};

export default function DatasetClassView(props) {
  const items = props.items;
  const category = props.category;
  const dataset = props.dataset;
  return (
    <ReactNextPaging
      itemsperpage={20}
      nocolumns={3}
      items={items}
      pagesspan={7}
    >
      {({
        getBackButtonProps,
        getFastBackButtonProps,
        getFwdButtonProps,
        getFastFwdButtonProps,
        getSelPageButtonProps,
        nopages,
        inipagearray,
        pagesforarray,
        currentpage,
        noitems,
        initialitem,
        lastitem,
        goBackBdisabled,
        goFastBackBdisabled,
        goFwdBdisabled,
        goFastFwdBdisabled
      }) => (
        <tbody>
          <Row>
            {items.slice(initialitem, lastitem).map((item, index) => {
              return (
                <Col xs={3}>
                  <DatasetItemView
                    category={category}
                    imgName={item}
                    dataset={dataset}
                  />
                </Col>
              );
            })}
          </Row>
          {noitems > 0
            ? [
                <tr key={"pagingrow" + 100}>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    <button
                      style={buttonStyles}
                      {...getFastBackButtonProps()}
                      disabled={goFastBackBdisabled}
                    >
                      {"<<"}
                    </button>
                    <button
                      style={buttonStyles}
                      {...getBackButtonProps()}
                      disabled={goBackBdisabled}
                    >
                      {"<"}
                    </button>
                    {Array.from(
                      { length: pagesforarray },
                      (v, i) => i + inipagearray
                    ).map(page => {
                      return (
                        <button
                          key={page}
                          {...getSelPageButtonProps({ page: page })}
                          disabled={currentpage === page}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      style={buttonStyles}
                      {...getFwdButtonProps()}
                      disabled={goFwdBdisabled}
                    >
                      {">"}
                    </button>
                    <button
                      style={buttonStyles}
                      {...getFastFwdButtonProps()}
                      disabled={goFastFwdBdisabled}
                    >
                      {">>"}
                    </button>
                  </td>
                </tr>
              ]
            : null}
        </tbody>
      )}
    </ReactNextPaging>
  );
}
