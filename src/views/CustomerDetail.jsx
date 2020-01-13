import React, { Component } from "react";
import NotificationSystem from "react-notification-system";
import moment from "moment";

import {
  Grid,
  Row,
  Col,
  Table,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { style } from "variables/Variables.jsx";

class CustomerDetail extends Component {
  constructor(props) {
    const { match } = props;
    super(props);
    this.state = {
      _notificationSystem: null,
      doc_list: [],
      doc_name: "",
      fileInput: "",
      file_upload: {},
      cust_id: match.params.id
    };
    this.upload = this.upload.bind(this);
    this.getFile = this.getFile.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  getFile(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = theFile => {
      var data = {
        blob: theFile.target.result.split(",")[1],
        name: file.name,
        type: file.type
      };
      // console.log(data);
      this.setState({ file_upload: data });
    };
    reader.readAsDataURL(file);
  }

  upload() {
    let params = {
      doc_name: this.state.doc_name,
      blob: this.state.file_upload.blob,
      file_name: this.state.file_upload.name,
      file_type: this.state.file_upload.file_type,
      cust_id: this.state.cust_id,
      created_date: new Date().toString()
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(
      proxyurl +
        "https://pytpnxf5zi.execute-api.ap-southeast-2.amazonaws.com/DEV/",
      {
        method: "post",
        body: JSON.stringify(params),
        headers: { "Content-Type": "application/json" }
      }
    )
      .then(response => response.json())
      .then(data => {
        this.getDocumentList();
        this.setState({ doc_name: "", fileInput: "" });
        this.state._notificationSystem.addNotification({
          title: <span data-notify="icon" className="pe-7s-check" />,
          message: <div>Document Uploaded Successfully</div>,
          level: "success",
          position: "tr",
          autoDismiss: 15
        });
      });
  }

  getDocumentList() {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(
      proxyurl +
        "https://pytpnxf5zi.execute-api.ap-southeast-2.amazonaws.com/DEV?from=details&cust_id=" +
        this.state.cust_id,
      {
        headers: { "Content-Type": "application/json" }
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ doc_list: data.hits });
      });
  }

  downloadDocumnet(file_name) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(
      proxyurl +
        "https://pytpnxf5zi.execute-api.ap-southeast-2.amazonaws.com/DEV?from=download&file_name=" +
        file_name,
      {
        headers: { "Content-Type": "application/json" }
      }
    )
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        window.open(data.body, "_blank");
      });
  }

  deleteDocument(doc_id) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(
      proxyurl +
        "https://pytpnxf5zi.execute-api.ap-southeast-2.amazonaws.com/DEV?doc_id=" +
        doc_id,
      {
        method: "delete",
        headers: { "Content-Type": "application/json" }
      }
    )
      .then(response => response.json())
      .then(data => {
        this.getDocumentList();
        this.state._notificationSystem.addNotification({
          title: <span data-notify="icon" className="pe-7s-close-circle" />,
          message: <div>Document Deleted Successfully</div>,
          level: "info",
          position: "tr",
          autoDismiss: 15
        });
      });
  }

  componentDidMount() {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    this.getDocumentList();
  }

  render() {
    return (
      <div className="content">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Customer Detail"
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <div style={{ padding: 20 }}>
                    <form>
                      <div className="row">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Document Name</ControlLabel>
                            <FormControl
                              type="text"
                              name="doc_name"
                              bsClass="form-control"
                              value={this.state.doc_name}
                              onChange={e => this.handleChange(e)}
                            />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel>Document</ControlLabel>
                            <FormControl
                              name="file_path"
                              type="file"
                              bsClass="form-control"
                              onChange={this.getFile}
                              ref={ref => (this.state.fileInput = ref)}
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <Button bsStyle="info" fill onClick={this.upload}>
                        Upload Document
                      </Button>
                      <div className="clearfix" />
                    </form>
                    <div><br/></div>
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Document ID</th>
                          <th>Document Name</th>
                          <th>Created Date</th>
                          <th>Last Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.doc_list.map((prop, key) => {
                          return (
                            <tr key={key}>
                              <td>{prop.doc_id}</td>
                              <td>{prop.doc_name}</td>
                              <td>
                                {moment(prop.created_date).format(
                                  "DD-MMM-YYYY"
                                )}
                              </td>
                              <td>
                                {moment(prop.created_date).format(
                                  "DD-MMM-YYYY"
                                )}
                              </td>
                              <td>
                                <div
                                  className="col-md-2"
                                  onClick={() =>
                                    this.downloadDocumnet(prop.doc_path)
                                  }
                                >
                                  <i
                                    className="pe-7s-cloud-download"
                                    style={{ fontSize: 20 }}
                                  />
                                </div>
                                <div
                                  className="col-md-2"
                                  onClick={() =>
                                    this.deleteDocument(prop.doc_id)
                                  }
                                >
                                  <i
                                    className="pe-7s-trash"
                                    style={{ fontSize: 20 }}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default CustomerDetail;
