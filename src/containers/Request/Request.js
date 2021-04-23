import React, { Component } from 'react';
import './Request.css';
import TextInput from '../../components/UI/TextInput/TextInput';
import Button from '../../components/UI/Button/Button';
import SelectInput from '../../components/UI/SelectInput/SelectInput';
import validate from '../Util/validate';
import Loader from '../../components/UI/Loader/Loader';
import { getCurrentUser } from '../../containers/Util/auth';
import Tabs from "../../components/Tabs/Tabs"; 
import moment from 'moment'
import { SERVER_API_URL } from '../../constants'


//Makes sure location accuracy is high
const options = {
    enableHighAccuracy: true
}
    
class Request extends Component {

    constructor () {
        super()
        this.state = {
            isLoading: false,
            error: null,
            formIsValid: false, //we will use this to track the overall form validity
            formControls: this.initialFormState(),
            formSuccess: false,
            formFailure: false,
            formMessage: null,
            allRequests: true,
            requests: [],
            currentUser: getCurrentUser(),
            disabled: false
        }
      
    }

    componentDidMount() {
        this.fetchRequests(this.state.currentUser.id);
    }
    // selected
    initialFormState() {
        return {
            description: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 10,
                    maxLength: 300,
                    isRequired: true
                },
                placeholderText: 'Enter Description',
                touched: false
            },
            request_type: {
                value: 'one_time',
                valid: true,
                options: ['One Time', 'Material Need'],
                placeholderText: 'Select Type'
            },
            lat: {
                value: '',
                valid: true,
                validationRules: {
                    isRequiredNumber: true
                },
                placeholderText: 'Latitude',
                touched: false
            },
            lng: {
                value: '',
                valid: true,
                validationRules: {
                    isRequiredNumber: true
                },
                placeholderText: 'Longitude',
                touched: false
            }
        }
    }

    getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.updatePosition, this.showError, options);
        } else { 
            alert("Geolocation is not supported by this browser.");
        }
    }
      
    updatePosition = position => {
        const updatedControls = {
            ...this.state.formControls
        };
       
        updatedControls.lat.value = position.coords.latitude.toFixed(3)
        updatedControls.lng.value = position.coords.longitude.toFixed(3)

        updatedControls.lat.valid = validate(position.coords.latitude, updatedControls.lat.validationRules);
        updatedControls.lng.valid = validate(position.coords.longitude, updatedControls.lng.validationRules);

        // debugger;
        let formIsValid = true;
        for (let inputIdentifier in updatedControls) {
            formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        })

        console.log(`Current Latitude is ${position.coords.latitude} and your longitude is ${position.coords.longitude}`);
    }

    // Displays the different error messages
    showError = error => {
        //mapArea.style.display = "block"
        switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("You denied the request for your location.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Your Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("Your request timed out. Please try again");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred please try again after some time.");
            break;
        }
    }

    fetchRequests = (user_id) => {
        const url = `${SERVER_API_URL}/api/v1/requests/user/${user_id}`;
        fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    const sortedRequests = result.requests.slice().sort((a, b) => a.created_at > b.created_at ? -1 : 1)
                    this.setState({
                        isLoading: false,
                        requests: sortedRequests
                    });
                },
                (error) => {
                    console.log('Error > ', error)
                    this.setState({
                        isLoading: false,
                        error
                    });
                }
            )
    }

    updateRequest = (request) => {
        const url = `${SERVER_API_URL}/api/v1/requests/${request.id}`;
        fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(request),
            })
            .then(res => res.json())
            .then(
                (result) => {                    
                    this.setState({
                        isLoading: false,
                        request: result.data,
                        disabled: !this.state.disabled
                    });
                },
                (error) => {
                    console.log('Error > ', error)
                    this.setState({
                        isLoading: false,
                        error
                    });
                }
            )
    }

    handleUpdate = (request) => {
        // const target = event.target;
        // var value = target.value;
        
        // if(target.checked){
        //     // this.state.hobbies[value] = value;   
        //     console.log("value ", value)
        // }else{
        //     // this.state.hobbies.splice(value, 1);
        //     console.log("value else ", value)
        // }
        let req = { ...request }
        req.fulfilled = !req.fulfilled
        this.updateRequest(req);
    }

    republishRequest = (request_id) => {
        const url = `${SERVER_API_URL}/api/v1/requests/republish/${request_id}`;
        fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: null,
            })
            .then(res => res.json())
            .then(
                (result) => {                    
                    this.setState({
                        isLoading: false,
                        request: result.data,
                        disabled: !this.state.disabled
                    });
                },
                (error) => {
                    console.log('Error > ', error)
                    this.setState({
                        isLoading: false,
                        error
                    });
                }
            )
    }

    handleRepublish = (request_id) => {
        this.republishRequest(request_id);
    }

    changeHandler = event => {
        
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = {
            ...this.state.formControls
        };
        const updatedFormElement = {
            ...updatedControls[name]
        };

        if (Number(value) === value && value % 1 !== 0) value = value.toFixed(2);

        updatedFormElement.value = value;
        // updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        // debugger;

        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedControls) {
            formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

        // console.log(this.state.formControls)
    }

    onSubmitForm = (event) => {
        this.setState({ isLoading: true })
        event.preventDefault();
        const formData = {};
        for (let formElementId in this.state.formControls) {
            formData[formElementId] = this.state.formControls[formElementId].value;
        }
        
        console.dir(formData);
        this.submitFormToApi(formData);
    }

    submitFormToApi = (formData) => {
        const url = `${SERVER_API_URL}/api/v1/requests`
        fetch(url, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(data => {
                this.setState({ isLoading: false })
                if (data.status === "00") {
                    this.setState({ formControls: this.initialFormState(), formIsValid: false, formSuccess: true })
                } else {
                    this.setState({ formFailure: true, formMessage: data.message })
                }
                
            })
            .catch((error) => {
                this.setState({ isLoading: false })
                console.error('Error:', error);
            });
    }
    
     render() {

        const { error, isLoading, requests } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (isLoading) {
            return <Loader show={this.state.isLoading} />;
        } else {

            return(
                
                <div className="Request">
                    <div className="container">

                        <div className="section-title">
                            <h2>Requests</h2>
                        </div>

                        <div className="row d-flex justify-content-center">
                            <div className="col-12">

                            <Tabs> 
                                
                                <div label="Request Form"> 
                                    
                                    { this.state.formSuccess ? (<h3>Your Request Has Been Submitted. Thank You!</h3>) : null }
                                    <form className="Contact">

                                        <div className="form-group">
                                            <label>Description:</label>
                                            <TextInput name="description"  type="text"
                                                placeholder={this.state.formControls.description.placeholderText}
                                                value={this.state.formControls.description.value}
                                                onChange={this.changeHandler}
                                                touched={this.state.formControls.description.touched}
                                                valid={this.state.formControls.description.valid}
                                                />
                                        </div>


                                        <div className="form-group">
                                            <label>Type:</label>
                                            <SelectInput name="request_type" 
                                                placeholder={this.state.formControls.request_type.placeholderText}
                                                value={this.state.formControls.request_type.value}
                                                onChange={this.changeHandler}
                                                options={this.state.formControls.request_type.options}
                                                />
                                        </div>

                                        <div className="form-group">
                                            <label>Location:</label>
                                            <div className="d-flex flex-row">
                                                <TextInput name="lat" type="number"
                                                    placeholder={this.state.formControls.lat.placeholderText}
                                                    value={this.state.formControls.lat.value}
                                                    onChange={this.changeHandler}
                                                    touched={this.state.formControls.lat.touched}
                                                    valid={this.state.formControls.lat.valid}
                                                    // disabled
                                                    />

                                                    <TextInput name="lng" type="number" className="form-control ml-3"
                                                    placeholder={this.state.formControls.lng.placeholderText}
                                                    value={this.state.formControls.lng.value}
                                                    onChange={this.changeHandler}
                                                    touched={this.state.formControls.lng.touched}
                                                    valid={this.state.formControls.lng.valid}
                                                    // disabled
                                                    />

                                                    <div className="form-group">
                                                    <button className="btn btn-primary mx-4" type="button" onClick={this.getLocation}>Get My Location</button>
                                                    </div>
                                                    {/* <Button type="button" btnType="Primary" clicked={this.getLocation}>Get Location</Button> */}
                                            </div>
                                            
                                        </div>

                                        {/* <input type="btn btn-primary" value="submit" onClick={this.onSubmitForm} /> disabled={!this.state.formIsValid} */}
                                        <button className="btn btn-primary" onClick={this.onSubmitForm}  > Submit Request </button>
                                    

                                    </form> 
                                    
                                </div> 

                                <div label="Requests"> 
                                    
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Description</th>
                                                {/* <th scope="col">Fulfilled</th> */}
                                                {/* <th scope="col">Fulfilcount</th> */}
                                                <th scope="col">Request Type</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Mark As Fufilled</th>
                                                <th scope="col">Republish</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map((value, key) => {
                                                return(
                                                    <tr key={value.id}>
                                                        <th scope="row">{key+1}</th>
                                                        <td>{value.description}</td>
                                                        {/* <td>{value.fulfilled ? "True" : "False"}</td> */}
                                                        {/* <td>{value.fulfilcount}</td> */}
                                                        <td>{value.request_type.replace("_"," ")}</td>
                                                        <td>{moment(value.created_at).format('MM/DD/YYYY')}</td>
                                                        <td>
                                                        <div className="form-check">
                                                            <input className="form-check-input position-static" 
                                                            type="checkbox" 
                                                            defaultChecked={value.fulfilled}
                                                            name={value.description} 
                                                            id={value.id} 
                                                            value={value}
                                                            disabled={value.fulfilled}
                                                            onClick={() => this.handleUpdate(value)} />
                                                        </div>
                                                        </td>
                                                        <td onClick={() => this.handleRepublish(value.id)}>
                                                            <button className="btn btn-primary"> Click </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            
                                        </tbody>
                                    </table>

                                </div> 

                            </Tabs> 
                        </div>
                    </div>
                </div>
            </div>
            );
        }
    }

};

export default Request;