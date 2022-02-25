import React, {Component, Fragment} from 'react';
import {Col, Container, Row,Button} from "react-bootstrap";
import '../assets/css/bootstrap.min.css';
import '../assets/css/camera.css';
import defaultImg from "../assets/img/defaultImg.png";
import {HiOutlineSave, MdOutlineCameraAlt} from "react-icons/all";
import Webcam from "react-webcam";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactJson from "react-json-view";

import * as faceAPI from "face-api.js";
import Loader from "./loader";

class Camera extends Component {

    constructor(props) {
        super(props);
        this.cameraRef = React.createRef();

        this.state={
            onCaptureImage:defaultImg,
            userCameraError:false,
            AgeAndGender:[],
            mainDiv:"",
            loaderDiv:"d-none",
            age:"",
            gender:"",
            expression:"",
            faceExpression:[],
            faceLandmarkPoint:[],
            left_to_Right_Eye:0.0,
            nose_to_Left_Mouth:0.0,
            nose_to_Right_Mouth:0.0,
            nose_to_Right_Eye:0.0,
            nose_to_Left_Eye:0.0,
        }
    }

    whenCameraError=()=>{
        this.setState({userCameraError:true})
    }
    onClickCapture = ()=>{
        let captureUserImgBase64 = this.cameraRef.current.getScreenshot();
        this.setState({onCaptureImage:captureUserImgBase64});
        this.ageAndGenderDetection()
        this.FaceExpression()
        this.FaceLandMark()

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

    ageAndGenderDetection=()=>{
        (async ()=>{
            this.setState({loaderDiv:" "});
            let image = document.getElementById('img');
            await faceAPI.nets.ssdMobilenetv1.loadFromUri('models/');
            await faceAPI.nets.ageGenderNet.loadFromUri('models/');
            const result = await faceAPI.detectAllFaces(image).withAgeAndGender();
            this.setState({
                age:parseInt(result[0]['age']),
                gender:result[0]['gender']
            })
            this.setState({AgeAndGender:result});
            this.setState({loaderDiv:"d-none"})
        })()
    }
    FaceExpression =()=>{
        (async ()=>{
            this.setState({loaderDiv:" "});
            let Img = document.getElementById('img');
            await faceAPI.nets.ssdMobilenetv1.loadFromUri('models/');
            await faceAPI.nets.faceExpressionNet.loadFromUri('models/');
            const result = await faceAPI.detectAllFaces(Img).withFaceExpressions();

            let neutral = (result[0]['expressions']['neutral']);
            let happy = (result[0]['expressions']['happy']);
            let sad = (result[0]['expressions']['sad']);
            let angry = (result[0]['expressions']['angry']);
            let fearful = (result[0]['expressions']['fearful']);
            let disgusted = (result[0]['expressions']['disgusted']);
            let surprised = (result[0]['expressions']['surprised']);

            if (neutral > 0.9 && neutral < 1.0){
                this.setState({expression:"Neutral"});
            }else if (happy > 0.9 && happy < 1.0){
                this.setState({expression:"Happy"});
            }else if (sad > 0.9 && sad < 1.0){
                this.setState({expression:"Sad"});
            }else if (angry > 0.9 && angry < 1.0){
                this.setState({expression:"Angry"});
            }else if (fearful > 0.9 && fearful < 1.0){
                this.setState({expression:"Fearful"});
            }else if (disgusted > 0.9 && disgusted < 1.0){
                this.setState({expression:"Disgusted"});
            }else if (surprised > 0.9 && surprised < 1.0){
                this.setState({expression:"Surprised"});
            }

            this.setState({faceExpression:result});
            this.setState({loaderDiv:"d-none"})

        })()
    }
    FaceLandMark=()=>{
        (async ()=>{
            this.setState({loaderDiv:" "});
            let Img = document.getElementById('img');
            await faceAPI.nets.ssdMobilenetv1.loadFromUri('models/');
            await faceAPI.nets.faceLandmark68Net.loadFromUri('models/');
            const result = await faceAPI.detectAllFaces(Img).withFaceLandmarks();
            this.setState({faceLandmarkPoint:result});

            this.setState({loaderDiv:"d-none"})
        })()
    }


    Left_to_Right_Eye=()=>{
        let faceLandmarkPoint =  this.state.faceLandmarkPoint;
        let x1=  faceLandmarkPoint[0]['landmarks']['_positions'][37]['_x']
        let y1=  faceLandmarkPoint[0]['landmarks']['_positions'][37]['_y']
        let x2=  faceLandmarkPoint[0]['landmarks']['_positions'][46]['_x']
        let y2=  faceLandmarkPoint[0]['landmarks']['_positions'][46]['_y']
        let dist=Math.sqrt( (Math.pow((x1-x2),2))+(Math.pow((y1-y2),2)));
        this.setState({left_to_Right_Eye:dist})
    }
    Nose_to_Left_Mouth=()=>{
        let faceLandmarkPoint =  this.state.faceLandmarkPoint;
        let x1=  faceLandmarkPoint[0]['landmarks']['_positions'][31]['_x']
        let y1=  faceLandmarkPoint[0]['landmarks']['_positions'][31]['_y']
        let x2=  faceLandmarkPoint[0]['landmarks']['_positions'][49]['_x']
        let y2=  faceLandmarkPoint[0]['landmarks']['_positions'][49]['_y']
        let dist=Math.sqrt( (Math.pow((x1-x2),2))+(Math.pow((y1-y2),2)));
        this.setState({nose_to_Left_Mouth:dist})
    }
    Nose_to_Right_Mouth=()=>{
        let faceLandmarkPoint =  this.state.faceLandmarkPoint;
        let x1=  faceLandmarkPoint[0]['landmarks']['_positions'][31]['_x']
        let y1=  faceLandmarkPoint[0]['landmarks']['_positions'][31]['_y']
        let x2=  faceLandmarkPoint[0]['landmarks']['_positions'][55]['_x']
        let y2=  faceLandmarkPoint[0]['landmarks']['_positions'][55]['_y']
        let dist=Math.sqrt( (Math.pow((x1-x2),2))+(Math.pow((y1-y2),2)));
        this.setState({nose_to_Right_Mouth:dist})
    }
    Nose_to_Right_Eye=()=> {
        let faceLandmarkPoint =  this.state.faceLandmarkPoint;
        let x1 = faceLandmarkPoint[0]['landmarks']['_positions'][31]['_x']
        let y1 = faceLandmarkPoint[0]['landmarks']['_positions'][31]['_y']
        let x2 = faceLandmarkPoint[0]['landmarks']['_positions'][46]['_x']
        let y2 = faceLandmarkPoint[0]['landmarks']['_positions'][46]['_y']
        let dist = Math.sqrt((Math.pow((x1 - x2), 2)) + (Math.pow((y1 - y2), 2)));
        this.setState({nose_to_Right_Eye: dist})
    }
    Nose_to_Left_Eye=()=>{
        let faceLandmarkPoint =  this.state.faceLandmarkPoint;
        let x1=  faceLandmarkPoint[0]['landmarks']['_positions'][31]['_x']
        let y1=  faceLandmarkPoint[0]['landmarks']['_positions'][31]['_y']
        let x2=  faceLandmarkPoint[0]['landmarks']['_positions'][37]['_x']
        let y2=  faceLandmarkPoint[0]['landmarks']['_positions'][37]['_y']
        let dist=Math.sqrt( (Math.pow((x1-x2),2))+(Math.pow((y1-y2),2)));
        this.setState({nose_to_Left_Eye:dist})
    }

    render() {
        return (
            <Fragment>
                <div className={this.state.mainDiv}>
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
                                <img id="img" className="saveUserImg  w-100" src={this.state.onCaptureImage} alt=""/>
                                {/*<button onClick={this.onSaveImage} className="btn btn-success saveButton " > <HiOutlineSave/> Save </button>*/}
                            </Col>

                            <Col className=" p-3 mb-2" sm={12} md={4} lg={4} >
                                <h4>Age: <span className="text-danger">{this.state.age}</span> </h4>
                                <h4>Gender: <span className="text-danger">{this.state.gender}</span> </h4>
                                <h4>Expression: <span className="text-danger">{this.state.expression}</span> </h4>
                            </Col>
                        </Row>
                    </Container>


                    <Container fluid={true}>
                        <Row  className=" m-2  p-5 ">
                            <Col>
                                <table className="table ">
                                    <thead>
                                    <tr>
                                        <th className="text-danger">Age</th>
                                        <th className="text-success">{this.state.age}</th>
                                        <th className="text-danger">Gender</th>
                                        <th className="text-success">{this.state.gender}</th>
                                        <th className="text-danger">Expression</th>
                                        <th className="text-success">{this.state.expression}</th>
                                        <th> <Button onClick={this.Nose_to_Left_Eye}  className="btn btn-info">Nose_to_Left_Eye</Button> </th>
                                        <th className="text-success">{(this.state.nose_to_Left_Eye).toFixed(2)}</th>
                                    </tr>

                                    <tr>
                                        <th> <Button onClick={this.Left_to_Right_Eye}  className="btn btn-info">Left_to_Right_Eye</Button> </th>
                                        <th className="text-success">{(this.state.left_to_Right_Eye).toFixed(2)}</th>
                                        <th> <Button onClick={this.Nose_to_Left_Mouth}  className="btn btn-info">Nose_to_Left_Mouth</Button> </th>
                                        <th className="text-success">{(this.state.nose_to_Left_Mouth).toFixed(2)}</th>
                                        <th> <Button onClick={this.Nose_to_Right_Mouth}  className="btn btn-info">Nose_to_Right_Mo
                                            uth</Button> </th>
                                        <th className="text-success">{(this.state.nose_to_Right_Mouth).toFixed(2)}</th>
                                        <th> <Button onClick={this.Nose_to_Right_Eye}  className="btn btn-info">Nose_to_Right_Eye</Button> </th>
                                        <th className="text-success">{(this.state.nose_to_Right_Eye).toFixed(2)}</th>
                                    </tr>

                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </Container>


                    <Container className="mb-5">
                        <Row>
                            <Col className="my-2" sm={12} md={4} lg={4} >
                                <h5>Face LandMark </h5>
                                {/*<button onClick={this.FaceLandMark} className="btn btn-success " >Click For Result</button>*/}
                                <ReactJson src={this.state.faceLandmarkPoint} theme="monokai" />
                            </Col>
                            <Col className="my-2" sm={12} md={4} lg={4} >
                                <h5>Face Expression Recognition</h5>
                                {/*<button onClick={this.FaceExpression} className="btn btn-success " >Click For Result</button>*/}
                                <ReactJson src={this.state.faceExpression} theme="monokai" />
                            </Col>
                            <Col className="my-2" sm={12} md={4} lg={4} >
                                <h5>Age & Gender Recognition</h5>
                                {/*<button onClick={this.ageAndGenderDetection} className="btn btn-success " >Click For Result</button>*/}
                                <ReactJson src={this.state.AgeAndGender} theme="monokai" />
                            </Col>

                        </Row>
                    </Container>
                </div>
                <div className={this.state.loaderDiv}>
                    <Loader/>
                </div>
                {this.CameraErrorAlert()}
            </Fragment>
        );
    }
}

export default Camera;