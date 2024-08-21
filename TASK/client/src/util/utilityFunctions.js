//Function to specify the date format
  const dateDisplay = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  }

  // Fisher-Yates shuffle algorithm to randomize array elements
  const shuffleArray = (array) => {
    let shuffledArray = array.slice(); 
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); 
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; 
    }
    return shuffledArray;
  };

 // Function to format the timer into mm:ss format
  const formatTimer = (time) => {
    if (time === null) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = time % 60; 
    return `${minutes.toString().padStart(2, '0')}:
    ${seconds.toString().padStart(2, '0')}`;
  };

export defualt = {
  dateDisplay,
 shuffleArray,
 formatTimer
 
}
