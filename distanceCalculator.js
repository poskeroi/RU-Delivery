export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

export function findNearbyUsers(requestLat, requestLng, allUsers, maxDistance = 1) {
  return allUsers.filter(user => {
    const distance = getDistance(requestLat, requestLng, user.lat, user.lng);
    return distance <= maxDistance;
  }).map(user => ({
    ...user,
    distance: getDistance(requestLat, requestLng, user.lat, user.lng)
  }));
}