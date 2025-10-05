import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { campuses, diningLocations } from '../data/locations';
import { getDistance } from '../utils/distanceCalculator';
import OrderRequestSystem from './OrderRequestSystem';
import DeliveryRequestMarker from './DeliveryRequestMarker';

const mapContainerStyle = {
  height: "600px",
  width: "100%"
};

function RutgersMap() {
  const [selectedCampus, setSelectedCampus] = useState('collegeAve');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDining, setSelectedDining] = useState(null);
  const [activeRequests, setActiveRequests] = useState([]);
  const [userMode, setUserMode] = useState('requester'); // 'requester' or 'deliverer'
  const [mealSwipes, setMealSwipes] = useState(120); // Mock meal swipes
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied");
          // Set default location (Rutgers College Ave for demo)
          setUserLocation({
            lat: 40.5008,
            lng: -74.4474
          });
        }
      );
    }
  }, []);
  
  const handleRequestCreated = (request) => {
    // Add unique ID
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      acceptedBy: null,
      status: 'pending'
    };
    
    setActiveRequests([...activeRequests, newRequest]);
    
    // TODO: Your backend team will replace this with actual API call
    console.log('New request created:', newRequest);
    // fetch('/api/requests/create', { 
    //   method: 'POST', 
    //   body: JSON.stringify(newRequest) 
    // })
  };
  
  const handleAcceptRequest = (request) => {
    // Calculate estimated time based on distance
    const distance = getDistance(
      userLocation.lat,
      userLocation.lng,
      request.pickupLat,
      request.pickupLng
    );
    
    // Assume 3 mph walking speed + 5 min pickup time
    const estimatedTime = Math.round((distance / 3) * 60 + 5);
    
    // Update request
    const updatedRequests = activeRequests.map(req => {
      if (req.id === request.id) {
        return {
          ...req,
          acceptedBy: 'user123', // This should be actual user ID from login
          delivererName: 'John Doe', // This should be actual user name from login
          estimatedTime: estimatedTime,
          status: 'accepted'
        };
      }
      return req;
    });
    
    setActiveRequests(updatedRequests);
    
    // Deduct meal swipe
    setMealSwipes(mealSwipes - 1);
    
    alert(`Delivery accepted! ETA: ${estimatedTime} minutes. You'll use 1 meal swipe.`);
    
    // TODO: Your backend team will replace this with actual API call
    console.log('Request accepted:', request.id);
    // fetch('/api/requests/accept', { 
    //   method: 'POST', 
    //   body: JSON.stringify({ requestId: request.id, delivererId: 'user123' }) 
    // })
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#CC0033' }}>Rutgers Food Delivery - Campus Map</h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'center', 
          marginBottom: '15px',
          flexWrap: 'wrap'
        }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Select Campus: </label>
            <select 
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              style={{ 
                padding: '10px', 
                fontSize: '16px',
                marginLeft: '10px',
                borderRadius: '5px',
                border: '2px solid #CC0033'
              }}
            >
              <option value="collegeAve">College Avenue</option>
              <option value="busch">Busch</option>
              <option value="livingston">Livingston</option>
              <option value="cookDoug">Cook/Douglass</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold' }}>I want to: </label>
            <select
              value={userMode}
              onChange={(e) => setUserMode(e.target.value)}
              style={{ 
                padding: '10px', 
                fontSize: '16px',
                marginLeft: '10px',
                borderRadius: '5px',
                border: '2px solid #CC0033'
              }}
            >
              <option value="requester">Request Delivery</option>
              <option value="deliverer">Deliver Food</option>
            </select>
          </div>
          
          <div style={{ 
            padding: '10px 20px', 
            backgroundColor: '#CC0033',
            color: 'white',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            🎫 Meal Swipes: {mealSwipes}
          </div>
        </div>
      </div>
      
      {userMode === 'requester' && userLocation && (
        <OrderRequestSystem
          campus={selectedCampus}
          userLocation={userLocation}
          onRequestCreated={handleRequestCreated}
        />
      )}
      
      {userMode === 'deliverer' && (
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #28a745'
        }}>
          <strong>🚶 Deliverer Mode Active:</strong> Click on blue markers on the map to accept delivery requests! Each delivery uses 1 meal swipe.
        </div>
      )}
      
      {activeRequests.length > 0 && (
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong>Active Requests:</strong> {activeRequests.length} order(s) pending
        </div>
      )}
      
      <LoadScript googleMapsApiKey="AIzaSyCbLssAL7hWK6VTeP-s0nqA0Nz9KsU9wqU">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={campuses[selectedCampus]}
        >
          {/* Dining location markers (red) */}
          {diningLocations[selectedCampus].map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setSelectedDining(location)}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
              }}
            />
          ))}
          
          {/* Dining hall info window */}
          {selectedDining && (
            <InfoWindow
              position={{ lat: selectedDining.lat, lng: selectedDining.lng }}
              onCloseClick={() => setSelectedDining(null)}
            >
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{selectedDining.name}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  ✅ Meal swipes accepted
                </p>
              </div>
            </InfoWindow>
          )}
          
          {/* Active delivery requests (blue markers) */}
          {activeRequests
            .filter(req => req.campus === selectedCampus)
            .map(request => (
              <DeliveryRequestMarker
                key={request.id}
                request={request}
                onAccept={handleAcceptRequest}
                isDeliverer={userMode === 'deliverer'}
              />
            ))}
          
          {/* User's current location */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                scale: 10,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2
              }}
              title="Your Location"
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default RutgersMap;