 //Function to specify the date format
  const dateDisplay = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  }

export defualt = {
  dateDisplay
}
