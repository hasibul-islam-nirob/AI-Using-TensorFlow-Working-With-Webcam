import React, {Component, Fragment} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import '../assets/css/bootstrap.min.css';
import '../assets/css/camera.css';
import defaultImg from "../assets/img/defaultImg.png";
import {HiOutlineSave, MdOutlineCameraAlt} from "react-icons/all";
import Webcam from "react-webcam";
import SweetAlert from "react-bootstrap-sweetalert";


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
        return (
            <Fragment>
                <Container className="">
                    <Row className="pt-5 shadow-sm bg-white" >
                        <Col className=" p-3 mb-2" sm={12} md={6} lg={6} >
                            <Webcam
                                onUserMediaError={this.whenCameraError}
                                audio={false}
                                className="w-100"
                                screenshotFormat="image/jpeg"
                                ref={this.cameraRef}
                            />
                            <button onClick={this.onClickCapture} className="btn btn-success captureButton" > <MdOutlineCameraAlt/> Capture</button>
                        </Col>
                        <Col className=" p-3 mb-2" sm={12} md={6} lg={6} >
                            <img className="saveUserImg  w-100" src={this.state.onCaptureImage} alt=""/>
                            <button onClick={this.onSaveImage} className="btn btn-success saveButton " > <HiOutlineSave/> Save </button>
                        </Col>
                    </Row>
                </Container>
                {this.CameraErrorAlert()}
            </Fragment>
        );
    }
}

export default Camera;