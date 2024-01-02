async function getTutorList() {
  const userPrompt = document.getElementById('promptInput').value;

  // Display loading spinner
  document.getElementById('loadingSpinner').classList.remove('hidden');

  try {
    const url = `http://localhost:3000/api/student/gpt?userPrompt=${encodeURIComponent(userPrompt)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json(); 
      if (result.generatedTutorList.length>2){
        const tutorListElement = document.getElementById('tutorList');
        tutorListElement.innerHTML = result.generatedTutorList;
        document.getElementById('bookButton').classList.remove('hidden');
        document.getElementById('cancelButton').classList.remove('hidden');
      }
      else{
        const tutorListElement = document.getElementById('tutorList');
        tutorListElement.innerHTML = "No availabe tutors at the time!";
      }

    } else {
      console.error('Failed to get tutor list:', response.status, response.statusText);
    }
  } finally {
    // Hide loading spinner
    document.getElementById('loadingSpinner').classList.add('hidden');
  }
}

async function bookTutors() {
  const userPrompt = document.getElementById('tutorList').innerText;

  // Display loading spinner
  document.getElementById('loadingSpinner').classList.remove('hidden');

  try {
    const response = await fetch('http://localhost:3000/api/student/gpt/658a1f85e5d05e547a1f02ca', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userPrompt }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.length>2){
        const tutorListElement = document.getElementById('tutorList');
        tutorListElement.innerHTML = "Tutors added!";
      }
      else{
        const tutorListElement = document.getElementById('tutorList');
        tutorListElement.innerHTML = "No availabe tutors at the time!";
      }
    } else {
      console.error('Failed to book tutors:', response.status, response.statusText);
    }
  } finally {
    // Hide loading spinner
    document.getElementById('loadingSpinner').classList.add('hidden');
  }
}

async function cancelBooking() {
  // Add your logic for canceling the booking here
  console.log('Booking cancelled!');
  // You can also hide the "Cancel Booking" button if needed
  const tutorListElement = document.getElementById('tutorList');
  tutorListElement.innerHTML = "Cancelled!";
  document.getElementById('bookButton').classList.add('hidden');
  document.getElementById('cancelButton').classList.add('hidden');

}
