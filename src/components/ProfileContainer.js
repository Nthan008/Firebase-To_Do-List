import React, { useState, useEffect } from "react";
import { getUserProfile } from "./FirestoreService"; // Function to fetch user profile data

function ProfileContainer({ user }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user profile data when the user logs in
    if (user) {
      getUserProfile(user.uid)
        .then((profile) => {
          setUserData(profile);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [user]);

  const handleUpdateUsername = (newUsername) => {
    // Implement function to update username in Firestore
  };

  const handleUploadProfilePicture = (file) => {
    // Implement function to upload profile picture to Firestore Storage
  };

  return (
    <div>
      {userData && (
        <div>
          <h2>User Profile</h2>
          <p>Email: {userData.email}</p>
          <p>Username: {userData.username}</p>
          {/* Add form to update username */}
          <form onSubmit={(e) => {
            e.preventDefault();
            const newUsername = e.target.elements.username.value;
            handleUpdateUsername(newUsername);
          }}>
            <input type="text" name="username" placeholder="New Username" />
            <button type="submit">Update Username</button>
          </form>
          {/* Add input for uploading profile picture */}
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            handleUploadProfilePicture(file);
          }} />
        </div>
      )}
    </div>
  );
}

export default ProfileContainer;
