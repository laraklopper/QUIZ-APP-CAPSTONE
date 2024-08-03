// Import necessary modules and packages
import React, { useRef, useEffect, useState } from "react";

export default function Countdown() {
  
  const [num, setNum] = useState(100);// State variable to store the countdown number
  const [pause, setPause] = useState(false);
  
  let intervalRef = useRef();// useRef to hold the interval reference
  // Function to decrease the countdown number by 1
  const decreaseNum = () => setNum((prev) => prev - 1);

  // useEffect to set up the interval when the component mounts
  useEffect(() => {
    // Start the interval and store the reference in intervalRef.current
    intervalRef.current = setInterval(decreaseNum, 1000);

    // Cleanup function to clear the interval when the component unmounts or updates
    return () => clearInterval(intervalRef.current);
  }, []);

  // Function to handle the click event for the button
  const handleClick = () => {
    // If the countdown is not paused, clear the interval
    if (!pause) {
      clearInterval(intervalRef.current);// Stop the countdown
    } 
    else {// If the countdown is paused, start a new interval
      intervalRef.current = setInterval(decreaseNum, 1000);//Resume the countDown
    }
    
    setPause((prev) => !prev);// Toggle the pause state
  };

  //===========JSX RENDERING==================

 return (
    <div>
      {/* Display the current countdown number */}
      <div>{num}</div>
      
      {/* Button to pause or resume the countdown */}
      <button onClick={handleClick}>
        {pause ? "Run" : "Pause"}
      </button>
    </div>
  );
}
