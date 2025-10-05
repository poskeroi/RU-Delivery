import React, { useState } from 'react';
import { diningLocations, dormBuildings } from '../data/locations';
import { menuItems } from '../data/MenuItems';

function OrderRequestForm({ campus, userLocation, onRequestCreated }) {
  const [selectedDining, setSelectedDining] = useState('');
  const [selectedDorm, setSelectedDorm] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedItem) {
      alert('Please select an item!');
      return;
    }

    if (!selectedDorm) {
      alert('Please select your dorm!');
      return;
    }

    const diningHall = diningLocations[campus].find(
      loc => loc.name === selectedDining
    );
    
    const request = {
      pickupLocation: selectedDining,
      pickupLat: diningHall.lat,
      pickupLng: diningHall.lng,
      deliveryLocation: selectedDorm,
      deliveryLat: userLocation.lat,
      deliveryLng: userLocation.lng,
      items: [selectedItem], // Only one item
      campus: campus,
      userId: 'user123',
      timestamp: Date.now()
    };
    
    // TODO: Call RU Dining API to deduct meal swipe
    // try {
    //   const response = await fetch('RU_DINING_API_URL/deduct-swipe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ userId: 'user123' })
    //   });
    // } catch (error) {
    //   alert('Failed to process meal swipe');
    //   return;
    // }
    
    console.log('Request created:', request);
    onRequestCreated(request);
    
    // Reset form
    setSelectedDining('');
    setSelectedDorm('');
    setSelectedItem('');
    setShowForm(false);
  };

  const availableItems = selectedDining && menuItems[campus] && menuItems[campus][selectedDining] 
    ? menuItems[campus][selectedDining] 
    : [];

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: '#CC0033',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}
      >
        🍔 Request Delivery
      </button>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, color: '#CC0033' }}>Request a Delivery (1 Meal Swipe)</h3>
      <form onSubmit={handleSubmit}>
        {/* Dining Location Selector */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Pickup From:
          </label>
          <select
            value={selectedDining}
            onChange={(e) => {
              setSelectedDining(e.target.value);
              setSelectedItem('');
            }}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px',
              borderRadius: '5px',
              border: '2px solid #ccc'
            }}
          >
            <option value="">Select dining location...</option>
            {diningLocations[campus].map(loc => (
              <option key={loc.id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>

        {/* Item Selector - Radio Buttons for Single Selection */}
        {selectedDining && availableItems.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Select ONE Item (1 meal swipe):
            </label>
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '2px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              {availableItems.map((item, index) => (
                <div key={index} style={{ 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  backgroundColor: selectedItem === item ? '#e8f5e9' : 'transparent',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedItem(item)}
                >
                  <input
                    type="radio"
                    id={`item-${index}`}
                    name="menuItem"
                    checked={selectedItem === item}
                    onChange={() => setSelectedItem(item)}
                    style={{ 
                      marginRight: '10px',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <label 
                    htmlFor={`item-${index}`}
                    style={{ 
                      cursor: 'pointer',
                      fontSize: '16px',
                      userSelect: 'none',
                      flex: 1
                    }}
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
            {selectedItem && (
              <div style={{ 
                marginTop: '10px', 
                padding: '10px',
                backgroundColor: '#e3f2fd',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Selected: {selectedItem}
              </div>
            )}
          </div>
        )}

        {/* Dorm Selector */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Deliver To (Your Dorm):
          </label>
          <select
            value={selectedDorm}
            onChange={(e) => setSelectedDorm(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px',
              borderRadius: '5px',
              border: '2px solid #ccc'
            }}
          >
            <option value="">Select your dorm...</option>
            {dormBuildings[campus].map((dorm, index) => (
              <option key={index} value={dorm}>{dorm}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#CC0033',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Submit Request (1 Swipe)
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setSelectedDining('');
              setSelectedDorm('');
              setSelectedItem('');
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrderRequestForm;