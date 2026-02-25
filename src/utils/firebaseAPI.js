

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, remove } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * sendBroadcastData
 * Sends username, hashkey, and time to Firebase Realtime Database
 * 
 * @param {string} username - The broadcaster's username
 * @param {string} hashkey - The generated hash/key
 * @param {string} time - The broadcast time
 * @returns {Promise} - Resolves on successful write, rejects on error
 */
export async function sendBroadcastData(username, hashkey, time) {
  try {
    const broadcastRef = ref(database, 'broadcasts');
    
    const data = {
      username,
      hashkey,
      time,
      timestamp: new Date().toISOString(),
      status: 'active'
    };

    const newBroadcastRef = await push(broadcastRef, data);
    
    console.log('Broadcast data sent successfully:', {
      id: newBroadcastRef.key,
      ...data
    });

    return {
      success: true,
      broadcastId: newBroadcastRef.key,
      data
    };
  } catch (error) {
    console.error('Error sending broadcast data:', error);
    throw new Error(`Failed to start broadcast: ${error.message}`);
  }
}

/**
 * stopBroadcast
 * Deletes a broadcast record from the database
 * 
 * @param {string} broadcastId - The broadcast ID to delete
 * @returns {Promise} - Resolves on successful deletion
 */
export async function stopBroadcast(broadcastId) {
  try {
    const broadcastRef = ref(database, `broadcasts/${broadcastId}`);
    await remove(broadcastRef);
    
    console.log('Broadcast stopped and deleted:', broadcastId);
    
    return {
      success: true,
      message: `Broadcast ${broadcastId} deleted successfully`
    };
  } catch (error) {
    console.error('Error stopping broadcast:', error);
    throw new Error(`Failed to stop broadcast: ${error.message}`);
  }
}

/**
 * sendLocation
 * Pushes a location entry under broadcasts/{broadcastId}/locations
 * @param {string} broadcastId
 * @param {number} lat
 * @param {number} lng
 */
export async function sendLocation(broadcastId, lat, lng, accuracy = null) {
  try {
    const locRef = ref(database, `broadcasts/${broadcastId}/locations`);
    const data = {
      lat,
      lng,
      accuracy: accuracy,
      timestamp: new Date().toISOString()
    };
    const newRef = await push(locRef, data);
    return {
      success: true,
      locId: newRef.key,
      data
    };
  } catch (error) {
    console.error('Error sending location:', error);
    throw new Error(`Failed to send location: ${error.message}`);
  }
}

export default { sendBroadcastData, stopBroadcast };
