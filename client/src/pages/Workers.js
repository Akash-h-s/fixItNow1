const handleBooking = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/workers/${id}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, doorNumber }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Booking failed:', data);
      alert(`Booking failed: ${data.message || 'Unknown error'}`);
      return;
    }

    setStatus(data.message);
    alert(data.message); // optional
  } catch (error) {
    console.error('Request error:', error);
    alert('Network error or server not running');
  }
};
