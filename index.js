// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBNpq_CywhebNsEEMg8cxjNfIHRBQw-ygk",
  authDomain: "mytwitterclone-43c08.firebaseapp.com",
  databaseURL:
    "https://mytwitterclone-43c08-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mytwitterclone-43c08",
  storageBucket: "mytwitterclone-43c08.appspot.com",
  messagingSenderId: "178203321423",
  appId: "1:178203321423:web:9e35de5b8e51458098f63a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);
const user = auth.currentUser;

import {
  getDatabase,
  set,
  get,
  update,
  remove,
  ref,
  child,
  push,
  onChildAdded,
  orderByValue,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

const db = getDatabase();

let postTweetInput = document.getElementById("postTweetInput");
let addTweet = document.getElementById("addTweet");
let tweetsContainer = document.getElementById("tweetsContainer");
let loginBtn = document.getElementById("loginBtn");
let lodingTweets = document.querySelector(".lodingTweets");
let profileImg = document.getElementById("profileImg");
let addTweetsContainer = document.querySelector(".addTweetsContainer");
let header = document.querySelector("header");
let myprofileDetails = document.getElementById("myprofileDetails");
let myProfileContainer = document.getElementById("myProfileContainer");
let logInBtnContainer = document.getElementById("logInBtnContainer");
let container = document.getElementById("container");
let logoutButton = document.getElementById("logoutButton");

function getTweetDate() {
  let currentDate = new Date();
  let date = currentDate.getDate();
  let month = currentDate.getMonth();
  let allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  const nth = function (d) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  let monthName = allMonths[month];
  let hours = currentDate.getHours() % 12 || 12;
  let minutes = currentDate.getMinutes();
  let amPm = currentDate.getHours() < 12 ? "AM" : "PM";
  let tweetDate =
    date +
    nth(date) +
    " " +
    monthName +
    ", " +
    pad(hours) +
    ":" +
    pad(minutes) +
    amPm;
  return tweetDate;
}

function onAddTweetBtnClick() {
  if (!postTweetInput.value) {
    postTweetInput.classList.add("error_msgInput");
    document.querySelector(".error_msg").style.display = "block";
    return false;
  } else {
    const user = auth.currentUser;
    let postTweets = ref(db, "tweets");
    let newTweets = push(postTweets);
    set(newTweets, {
      content: postTweetInput.value,
      date: getTweetDate(),
      userId: user.uid,
      userName: user.displayName,
      userPhotoURL: user.photoURL,
      userEmail: user.email,
    })
      .then(() => {
        alert("Data added sucessfully!");
      })
      .catch((error) => {
        alert(error);
      });
  }
}

function getHTMLforTweet(data) {
  let tweetHTML = `
        <div class="tweet">
        <img src="${data.val().userPhotoURL}" class="profileImgTweet"></img>
        <div class="tweetContent">
        <h3>${data.val().userName}</h3>
        <p>${data.val().content}</p>
        </div>
        <p class="currentDateTime">${data.val().date}</p>
        </div> `;
  return tweetHTML;
}
function getHTMLforMyprofileDetails(user) {
  let myprofileDetailsHTML = `
  <div class="profile_bg"></div>
  <div class="profileImgContain">
  <img src="${user.photoURL}" class="profileImg"></img>
  </div>
  <h3>${user.displayName}</h3>
  <p>${user.email}</p> `;
  return myprofileDetailsHTML;
}

function getHTMLforprofileImg(user) {
  let profileImgHTML = `<img src="${user.photoURL}" alt="" class="profileImgTweet"> `;
  return profileImgHTML;
}

function fetchTweets() {
  const db = getDatabase();
  const tweetsRef = ref(db, "tweets");
  onChildAdded(tweetsRef, (data) => {
    postTweetInput.addEventListener("focus", () => {
      document.querySelector(".error_msg").style.display = "none";
      postTweetInput.classList.remove("error_msgInput");
    });
    postTweetInput.classList.remove("error_msgInput");
    lodingTweets.style.display = "none";
    postTweetInput.value = "";
    tweetsContainer.insertAdjacentHTML("afterbegin", getHTMLforTweet(data));
  });
}

function updateUserDetails() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      addTweetsContainer.style.display = "block";
      header.style.display = "flex";
      container.classList.add("containerBg");
      container.classList.remove("containerWithBgImage");
      myProfileContainer.style.display = "block";
      logInBtnContainer.style.display = "none";
      fetchTweets();
      myprofileDetails.innerHTML = getHTMLforMyprofileDetails(user);
      profileImg.innerHTML = getHTMLforprofileImg(user);
    } else {
      myProfileContainer.style.display = "none";
      logInBtnContainer.style.display = "flex";
      tweetsContainer.style.display = "none";
      container.classList.add("containerWithBgImage");
      container.classList.remove("containerBg");
    }
  });
}

updateUserDetails();

function onLoginBtnClick() {
  signInWithRedirect(auth, provider);
  getRedirectResult(auth)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

function onLogoutBtnClick() {
  signOut(auth)
    .then(() => {
      addTweetsContainer.style.display = "none";
      header.style.display = "none";
    })
    .catch((error) => {
      alert("An error happened.");
    });
}
addTweet.addEventListener("click", onAddTweetBtnClick);
loginBtn.addEventListener("click", onLoginBtnClick);
logoutButton.addEventListener("click", onLogoutBtnClick);
