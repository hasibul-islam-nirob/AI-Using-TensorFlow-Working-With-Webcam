import React, {Component, Fragment} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import '../assets/css/bootstrap.min.css';
import '../assets/css/camera.css';
import defaultImg from "../assets/img/defaultImg.png";
import {HiOutlineSave, MdOutlineCameraAlt} from "react-icons/all";
import Webcam from "react-webcam";


class Camera extends Component {

    constructor() {
        super();
        this.cameraRef = React.createRef();

        this.state={
            onCaptureImage:defaultImg
        }
    }

    onClickCapture = ()=>{
        let captureUserImgBase64 = this.cameraRef.current.getScreenshot();
        this.setState({onCaptureImage:captureUserImgBase64});

    }

    render() {
        return (
            <Fragment>
                <Container className="">
                    <Row className="pt-5 shadow-sm bg-white" >
                        <Col className=" p-3 mb-2" sm={12} md={6} lg={6} >
                            <Webcam
                                audio={false}
                                className="w-100"
                                screenshotFormat="image/jpeg"
                                ref={this.cameraRef}
                            />
                            <button onClick={this.onClickCapture} className="btn btn-success captureButton" > <MdOutlineCameraAlt/> Capture</button>
                        </Col>
                        <Col className=" p-3 mb-2" sm={12} md={6} lg={6} >
                            <img className="saveUserImg  w-100" src={this.state.onCaptureImage} alt=""/>
                            <button className="btn btn-success saveButton " > <HiOutlineSave/> Save </button>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default Camera;