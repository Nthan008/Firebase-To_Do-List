import React, { useState, useEffect } from "react";
import { onAuthStateChange, signIn, signUp, signOutUser, resetPassword } from "./AuthService.js"; // Adjust path as needed
import { signInWithGoogle } from "./AuthService.js";
import { db } from './firebaseConfig'; // Update this path according to your project structure
import { collection, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { createUserProfile } from './FirestoreService'; // This is a function you will create
import { doc} from 'firebase/firestore';

function ProfileUpdateForm({ user }) {
  const [newUsername, setNewUsername] = useState('');

  const handleUsernameUpdate = async () => {
    try {
      // Update the username in the database
      await updateDoc(doc(db, 'users', user.uid), {
        username: newUsername
      });
      console.log('Username updated successfully!');
      // Optionally, you can also update the local state to reflect the new username
      // setNewUsername(''); // Clear the input field
    } catch (error) {
      console.error('Error updating username:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="mt-4 bg-gray-50 p-4 border border-gray-300 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Profile Information</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Update Username</h4>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="New Username"
          className="w-full p-2 mb-2 bg-white border border-gray-300 rounded-md"
        />
        <button onClick={handleUsernameUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Update</button>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [todo, setTodo] = useState(""); 
  const [todoList, setTodoList] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'ongoing', 'completed'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false); // State to toggle profile visibility
  const [showTodoList, setShowTodoList] = useState(false);


  // Log username changes
  useEffect(() => {
    console.log("Username updated:", username);
  }, [username]);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      console.log("Auth state changed, user:", user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  console.log("Current user state:", user);

  const handleForm = async (e) => {
    e.preventDefault();
    const newTask = { userId: user.uid, todoName: todo, completed: false };
    await addDoc(collection(db, 'tasks'), newTask); // Add the task to Firestore
    setTodo(""); // Clear the input field
  };

  const deleteTodo = (deleteValue) => {
    const restTodoList = todoList.filter((val) => val.todoName !== deleteValue);
    setTodoList(restTodoList);
  };

  const toggleTodoCompletion = (todoName) => {
    const updatedTodoList = todoList.map((todo) => {
      if (todo.todoName === todoName) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodoList(updatedTodoList);
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case "ongoing":
        return todoList.filter((todo) => !todo.completed);
      case "completed":
        return todoList.filter((todo) => todo.completed);
      case "all":
      default:
        return todoList;
    }
  };

  const handleAuth = async (action) => {
    try {
      if (action === 'signUp') {
        await signUp(email, password);
      } else if (action === 'signIn') {
        await signIn(email, password);
      } else if (action === 'resetPassword') {
        await resetPassword(email);
        alert('Check your email for the password reset link.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAuthAction = async (action) => {
    try {
      if (action === 'signIn') {
        await signIn(email, password);
        // ... handle sign-in success
      } else if (action === 'signUp') {
        if (password !== confirmPassword) {
          alert("Passwords don't match.");
          return;
        }
        console.log('Username before sign up:', username); // Add this console log
        const userCredential = await signUp(email, password, username);
        // Create user profile in Firestore
        await createUserProfile(userCredential.user.uid, {
          username: username,
          email: email,
        });
        setSuccessMessage('Sign up successful, please login.');
        setTimeout(() => {
          setIsSignUp(false); // Redirect back to the login page
          setSuccessMessage(''); // Clear the success message
        }, 3000); // Redirect after 3 seconds
      }
      
      // ... handle other actions
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile); // Toggle the visibility of the profile section
  };

  // Function to navigate to the profile section
  const navigateToProfile = () => {
    setShowProfile(true); // Show the profile section
  };
  return (
    <>
      {!user ? (
         <div className="min-h-screen flex items-center justify-center bg-custom-bg">
         <div className="max-w-md w-full mx-auto p-8 border-yellow-500 border-4 bg-red-900 rounded-xl shadow-md">
           {isSignUp ? (
             <>
               <h2 className="text-4xl font-bold text-center text-yellow-500 mb-8">Sign Up</h2>
               <input
   type="text"
   value={username}
   onChange={(e) => setUsername(e.target.value)}
   placeholder="Username"
   className="w-full p-4 mb-4 bg-gray-50 border border-gray-300 rounded-lg"
 />
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Email Address"
                 className="w-full p-4 mb-4 bg-gray-50 border border-gray-300 rounded-lg"
               />
              
 
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Password"
                 className="w-full p-4 mb-4 bg-gray-50 border border-gray-300 rounded-lg"
               />
               <input
                 type="password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 placeholder="Confirm Password"
                 className="w-full p-4 mb-4 bg-gray-50 border border-gray-300 rounded-lg"
               />
               <button onClick={() => handleAuthAction('signUp')} className="w-full p-3 bg-light-brown border-yellow-500 border-2 text-white rounded-lg hover:bg-yellow-600">Sign Up</button>
             </>
           ) : (
             <>
               <h2 className="text-4xl font-bold text-center text-yellow-500 mb-8 ">Login</h2>
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Email Address"
                 className="w-full p-4 mb-4 bg-gray-50 border border-gray-300 rounded-lg"
               />
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Password"
                 className="w-full p-4 mb-4 bg-gray-50 border border-gray-300 rounded-lg"
               />
               <button onClick={() => handleAuthAction('signIn')} className="w-full p-3 bg-light-brown border-yellow-500 border-2 text-white rounded-lg hover:bg-yellow-600">Login</button>
               <div className="my-4 flex items-center justify-center">
                 <div className="h-px bg-gray-300 flex-grow"></div>
                 <span className="px-4 text-gray-400">or</span>
                 <div className="h-px bg-gray-300 flex-grow"></div>
               </div>
               <button onClick={signInWithGoogle} className="w-full p-3 bg-light-brown border-yellow-500 border-2 text-white rounded-lg hover:bg-yellow-600">Login with Google</button>
             </>
           )}
           <div className="flex justify-center mt-4">
             <button onClick={() => setIsSignUp(!isSignUp)} className="text-yellow-500 hover:text-yellow-600 font-bold">
               {isSignUp ? "Already have an account? Sign in here." : "Don't have an account? Sign up here."}
           </button>
         </div>
       </div>
     </div>
        ) : (
          <>
            {!showProfile && (
              <div className="App bg-custom-bg ">
                <button onClick={signOutUser} className="sign-out-arrow">
        ← Sign Out
      </button>
                <div className="bg-custom-bg w-full h-screen flex flex-col items-center">
                  <h1 className="text-5xl text-yellow-500 font-bold mb-4 mt-4 text-shadow">Todo List</h1>
                  <h2 className="text-2xl text-yellow-500 font-bold mb-8 mt-4 relative">Carlo Nathanael Bessie 2602236685</h2>
                  <div className="w-full flex items-center flex-col">
                    <div className="w-[500px] mx-auto bg-red-900 p-5 border-yellow-500 border-solid border-4 relative mb-8 rounded-lg">
                    <div className="w-full flex justify-center">
                          <button
                            onClick={navigateToProfile}
                            className="bg-light-brown text-white py-3 px-8 rounded-lg w-full border-yellow-500 border-2 mb-5"
                          >
                            View Profile
                          </button>
                        </div>
                      <form onSubmit={handleForm} className="flex flex-col items-center">
                        <div className="w-full">
                          <input
                            className="border-2 placeholder:text-gray-500 rounded-lg border-yellow-500 w-full p-5 mb-5 text-black"
                            type="text"
                            placeholder="Add Todo"
                            value={todo}
                            onChange={(e) => setTodo(e.target.value)}
                          />
                        </div>
                        <div className="w-full flex justify-center">
                          <button
                            type="submit"
                            className="bg-light-brown text-white py-3 px-8 rounded-lg w-full border-yellow-500 border-2"
                          >
                            Add
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="w-[500px] mx-auto bg-red-900 p-5 border-yellow-500 border-solid border-4 relative rounded-lg">
                      <div className="mb-4 flex justify-start">
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="bg-yellow-500 text-white py-2 px-3 rounded-lg border-yellow-500 border-2"
                        >
                          <option value="all">All</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="todo-show-area">
                        <ul>
                          {getFilteredTodos().map((singleTodo, index) => (
                            <li
                              key={index}
                              className={`mb-5 flex justify-between items-center rounded-lg text-xl px-3 ${
                                singleTodo.completed ? "bg-light-brown border-2 border- yellow-500" : "bg-light-brown border-yellow-500 border-2"
                              }`}
                              style={{ minHeight: '2.5rem' }}
                            >
                              <div
                                className="w-80 h-6 bg-white flex justify-left items-center rounded px-3"
                                style={{ lineHeight: '1rem' }}
                              >
                                {singleTodo.todoName}
                              </div>
                              <span
                                onClick={() => toggleTodoCompletion(singleTodo.todoName)}
                                className="cursor-pointer text-gray-500"
                              >
                                {singleTodo.completed ? "Undo" : "Complete"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showProfile && (
              <div className="min-h-screen flex items-center justify-center bg-custom-bg">
                <div className="max-w-md w-full mx-auto p-8 border-yellow-500 border-4 bg-red-900 rounded-xl shadow-md">
                  {/* Profile section */}
                  <h2 className="text-4xl font-bold text-center text-yellow-500 mb-8">Welcome, {user.email}</h2>
                  <div className="mt-4 bg-gray-50 p-4 border border-gray-300 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Profile Information</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <ProfileUpdateForm user={user} />
                    {/* Button to navigate to the todo list */}
                    <button onClick={toggleProfile} className="mt-4 bg-light-brown text-white py-3 px-8 rounded-lg hover:bg-yellow-600">Go to Todo List</button>
</div>
</div>
</div>
)}
</>
)}
</>
);
}



    




export default App;
