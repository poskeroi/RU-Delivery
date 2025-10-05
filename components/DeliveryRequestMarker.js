import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';

function DeliveryRequestMarker({ request, onAccept, isDeliverer }) {
  const [showInfo, setShowInfo] = React.useState(false);

  return (
    <>
      <Marker
        position={{ lat: request.pickupLat, lng: request.pickupLng }}
        onClick={() => setShowInfo(true)}
        icon={{
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }}
      />
      
      {showInfo && (
        <InfoWindow
          position={{ lat: request.pickupLat, lng: request.pickupLng }}
          onCloseClick={() => setShowInfo(false)}
        >
          <div style={{ minWidth: '200px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#CC0033' }}>
              🍔 Delivery Request
            </h3>
            <p style={{ margin: '5px 0' }}>
              <strong>Pickup:</strong> {request.pickupLocation}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Deliver to:</strong> {request.deliveryLocation}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Items:</strong> {request.items.join(', ')}
            </p>
            
            {request.acceptedBy ? (
              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: '#e8f5e9',
                borderRadius: '5px'
              }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>✅ Status:</strong> Accepted
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Deliverer:</strong> {request.delivererName}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>⏱️ ETA:</strong> {request.estimatedTime} mins
                </p>
              </div>
            ) : isDeliverer ? (
              <button
                onClick={() => onAccept(request)}
                style={{
                  marginTop: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                Accept Delivery
              </button>
            ) : (
              <p style={{ 
                color: '#666', 
                fontStyle: 'italic',
                marginTop: '10px'
              }}>
                ⏳ Waiting for deliverer...
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default DeliveryRequestMarker;