import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "components/Card/Card.jsx";

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: []
    };
  }
  componentDidMount() {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(
      proxyurl +
        "https://pytpnxf5zi.execute-api.ap-southeast-2.amazonaws.com/DEV?from=customer",
      {
        headers: { "Content-Type": "application/json" }
      }
    )
      .then(response => response.json())
      .then(data => this.setState({ customer: data.hits }));
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Customer List"
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Customer Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.customer.map((prop, key) => {
                        return (
                          <tr key={key}>
                            <td>{prop.cust_id}</td>
                            <td>{prop.cust_name}</td>
                            <td>
                              <div
                                className="font-icon-detail"
                                onClick={() => {
                                  window.location.href =
                                    "/admin/customer_detail/" + prop.cust_id;
                                }}
                              >
                                <i
                                  className="pe-7s-note"
                                  style={{ fontSize: 20 }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Customer;
