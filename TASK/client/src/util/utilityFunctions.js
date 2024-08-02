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
    let shuffledArray = array.slice(); // Create a copy of the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };

export defualt = {
  dateDisplay
}
