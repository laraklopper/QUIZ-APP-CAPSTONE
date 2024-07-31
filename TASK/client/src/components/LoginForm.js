// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
// Bootstrap
import Row from 'react-bootstrap/Row';// Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button';// Import the Button component from react-bootstrap

//LoginForm function component
export default function LoginForm(//Export default LoginForm function component
  {//PROPS PASSED FROM PARENT COMPONENT
    handleLogin, 
    handleUserLogin, 
    userData,
    setShowPassword,
    showPassword
  }
) {

    //============EVENT LISTENER===============
  // Event listener for handling user login data changes
  const handleUserLogin = (event) => {
    const { name, value } = event.target;
    // Update userData state with new values
    setUserData((prevState) => (
      { ...prevState, [name]: value }
    ));
  };

    // Function to handle user Login
    const handleLogin = (e) => {
        e.preventDefault()
        console.log('logging In');
        submitLogin();
    }
  //============JSX RENDERING================

  return (
    // Form for user login
    <form id='loginForm' onSubmit={handleLogin}>
      <div id='loginDetails'>
      <Row className='loginRow'>
        <Col className='loginCol'>
          {/* Username input */}
          <label 
              className='loginLabel' // CSS class for styling
              htmlFor='loginUsername'//Link the label to the input field with the id attribute
          >
              {/* Label for the username input field */}
            <p className='labelText'>USERNAME:</p>
              {/* Input field for username */}
            <input
                className='loginInput'// CSS class for styling
                type='text'// Specify the input type as text                
                name='username'// Input name for identification field
                value={userData.username}// Value attribute bound to userData.username state
                onChange={handleUserLogin}// Event handler for input change, updates userData.username
                autoComplete='off'// Disable the browser's autocomplete feature
                placeholder='USERNAME'// Placeholder text for the input field
                id='loginUsername'// Unique ID for styling or JavaScript access
            />
          </label>
        </Col>
      </Row>
      <Row className='loginRow'>
        <Col className='loginCol'>
          {/* Password Input */}
          <label 
              className='loginLabel' // CSS class for styling
              htmlFor='loginPassword'//Link the label to the input field with the id attribute
          >
              {/* Label for the password input field */}
            <p className='labelText'>PASSWORD:</p>
              {/* Input field for password */}
            <input
                className='loginInput'// CSS class for styling
                type={showPassword ? 'text' : 'password'}// Toggle between text and password type
                name='password'// Input name for identification
                value={userData.password}// Value attribute bound to userData.password state
                onChange={handleUserLogin}// Event handler for input change, updates userData.password
                autoComplete='off'// Disable the browser's autocomplete feature
                placeholder='PASSWORD'// Placeholder text for the input field
            />
            <div id='showPassword'>   
             {/* Button to display password */}
              <Button variant='success'
                  type='button'// Bootstrap variant 
                  id='passwordDisplay'// Unique ID for the button
                    // onMouseDown={(e) => { 
                    //     e.preventDefault();// Prevent default action
                    //     setShowPassword(true); // Show password on mouse down
                    //   }}
                    // onMouseUp={(e) => { 
                    //   e.preventDefault(); // Prevent default action
                    //   setShowPassword(false);// Hide password on mouse up 
                    // }}
                  //OnClick event to display password
                  onClick={() => setShowPassword(!showPassword)}
                >
              {/* Button text based on visibility state*/}
                  {showPassword ? 'HIDE PASSWORD' : 'SHOW PASSWORD'} 
                </Button>
              </div>
          </label>
        </Col>
      </Row>
        {/* Row for login button */}
      <Row className='loginRow'>
        <Col className='loginCol'>
          {/* Login Button */}
          <Button 
              variant="primary" // Bootstrap variant 
              id='loginBtn'  // Unique ID for the button
              type='submit'// Specify that the button will submit the form
          >
            LOGIN
          </Button>
        </Col>  
      </Row>
      </div> 
    </form>
  )
}
