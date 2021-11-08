import React, {Component, Fragment} from 'react';
import loader from '../assets/img/loader.webp';
import '../assets/css/loader.css';
import {Col, Container, Row} from "react-bootstrap";
class Loader extends Component {
    render() {
        return (
            <Fragment>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Col>
                            <div className="loadingOverlay center-screen">
                                <img className="loader-size" src={loader} alt=""/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default Loader;