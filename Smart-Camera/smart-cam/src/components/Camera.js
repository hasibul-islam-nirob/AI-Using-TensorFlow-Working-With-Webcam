import React, {Component, Fragment} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import '../assets/css/bootstrap.min.css';
import '../assets/css/camera.css';
import defaultImg from "../assets/img/defaultImg.png";
import {HiOutlineSave, MdOutlineCameraAlt} from "react-icons/all";
import Webcam from "react-webcam";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactJson from "react-json-view";


class Camera extends Component {

    constructor() {
        super();
        this.cameraRef = React.createRef();

        this.state={
            onCaptureImage:defaultImg,
            userCameraError:false
        }
    }

    whenCameraError=()=>{
        this.setState({userCameraError:true})
    }

    onClickCapture = ()=>{
        let captureUserImgBase64 = this.cameraRef.current.getScreenshot();
        this.setState({onCaptureImage:captureUserImgBase64});

    }

    onSaveImage = ()=>{
        let imgBase64String = this.state.onCaptureImage;
        let a = document.createElement('a');
        a.href=imgBase64String;
        a.download = 'webcam-image.jpeg';
        a.click();
    }

    CameraErrorAlert=()=>{
        if (this.state.userCameraError===true){
            return(
                <SweetAlert danger title="Device Camera Disable..!" onConfirm={this.tryAgain} >
                    Check Device Camera
                </SweetAlert>
            )
        }
    }
    tryAgain=()=>{
        window.location.href='/';
    }

    render() {
        let demoJson=[{
            "name":"Nirob",
            "Age":"23"
        }]
        return (
            <Fragment>
                <Container className="">
                    <Row className="pt-5 shadow-sm bg-white" >
                        <Col className=" p-3 mb-2" sm={12} md={4} lg={4} >
                            <Webcam
                                onUserMediaError={this.whenCameraError}
                                audio={false}
                                className="w-100"
                                screenshotFormat="image/jpeg"
                                ref={this.cameraRef}
                            />
                            <button onClick={this.onClickCapture} className="btn btn-success captureButton" > <MdOutlineCameraAlt/> Capture</button>
                        </Col>
                        <Col className=" p-3 mb-2" sm={12} md={4} lg={4} >
                            <img className="saveUserImg  w-100" src={this.state.onCaptureImage} alt=""/>
                            <button onClick={this.onSaveImage} className="btn btn-success saveButton " > <HiOutlineSave/> Save </button>
                        </Col>

                        <Col className=" p-3 mb-2" sm={12} md={4} lg={4} >
                            <h4>Age: </h4>
                            <h4>Gender: </h4>
                            <h4>Expression: </h4>
                        </Col>
                    </Row>
                </Container>

                <Container className="mb-5">
                    <Row>
                        <Col className="my-2" sm={12} md={6} lg={6} >
                            <h5>Face LandMark </h5>
                            <ReactJson src={demoJson} theme="monokai" />
                        </Col>
                        <Col className="my-2" sm={12} md={6} lg={6} >
                            <h5>Face Expression Recognition</h5>
                            <ReactJson src={demoJson} theme="monokai" />
                        </Col>
                        <Col className="my-2" sm={12} md={6} lg={6} >
                            <h5>Age Estimation</h5>
                            <ReactJson src={demoJson} theme="monokai" />
                        </Col>
                        <Col className="my-2" sm={12} md={6} lg={6} >
                            <h5>Gender Recognition</h5>
                            <ReactJson src={demoJson} theme="monokai" />
                        </Col>

                    </Row>
                </Container>


                {this.CameraErrorAlert()}
            </Fragment>
        );
    }
}

export default Camera;