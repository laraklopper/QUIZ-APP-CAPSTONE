import React, { useState, useRef, useEffect } from "react";

// Timer component
export default function Timer() {
    const Ref = useRef(null);    // Reference to keep track of the interval ID
    const [timer, setTimer] = useState("00:00:00");// State to keep track of the timer value


  // Function to calculate the remaining time until a given deadline
const getTimeRemaining = (e) => {
    // Calculate the total time difference in milliseconds between the deadline and the current time
    const total = Date.parse(e) - Date.parse(new Date());
    
    // Calculate the remaining seconds, minutes, and hours from the total milliseconds
    const seconds = Math.floor((total / 1000) % 60); // Convert total milliseconds to seconds and get the remainder when divided by 60
    const minutes = Math.floor((total / 1000 / 60) % 60); // Convert total milliseconds to minutes and get the remainder when divided by 60
    const hours = Math.floor((total / 1000 / 60 / 60) % 24); // Convert total milliseconds to hours and get the remainder when divided by 24
    //Math.foor() rounds down to the nearest integer
    // Return an object containing the total remaining time in milliseconds and the remaining hours, minutes, and seconds
    return { total, hours, minutes, seconds };
};


   // Function to start the timer
const startTimer = (e) => {
    // Get the remaining time values from the getTimeRemaining function
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    
    // Conditional rendering if the total remaining time is non-negative (i.e., the deadline has not passed)
    if (total >= 0) {
        setTimer(// Update the timer state with the formatted remaining time
            // Format hours to ensure two digits (e.g., 09 instead of 9)
            (hours > 9 ? hours : "0" + hours) +
            ":" +
            // Format minutes to ensure two digits (e.g., 09 instead of 9)
            (minutes > 9 ? minutes : "0" + minutes) +
            ":" +
            // Format seconds to ensure two digits (e.g., 09 instead of 9)
            (seconds > 9 ? seconds : "0" + seconds)
        );
    }
};


    // Function to clear the current timer and start a new one
    const clearTimer = (e) => {
        setTimer("00:00:10"); // Initialize the timer with 10 seconds
        if (Ref.current) clearInterval(Ref.current); // Clear any existing interval
        const id = setInterval(() => {
            startTimer(e);
        }, 1000); // Set a new interval to update the timer every second
        Ref.current = id;
    };

    // Function to get the deadline time (current time + 10 seconds)
    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 10);
        return deadline;
    };

    // useEffect to start the timer when the component mounts
    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);

    // Function to reset the timer when the button is clicked
    const onClickReset = () => {
        clearTimer(getDeadTime());
    };

    // JSX to render the component
    return (
        <div>
            <h3 className='h3'>TIMER{timer}</h3>
            <h3>Countdown Timer Using React JS</h3>
            <h2>{timer}</h2>
            <button onClick={onClickReset}>Reset</button>
        </div>
    );
};
