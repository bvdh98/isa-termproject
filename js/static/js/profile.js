$(function() {
  $("#wall-bttn").click(function() {
    GoToWall();
  });
  (async () => {
    user = await GetProfile();
    $.fn.LoadProfile(user);
  })();

  $.fn.LoadProfile = function(user) {
    let profileDiv = $("#profile-div");
    if (user.displayName == null && user.about == null) {
      let form = `<form id="profile-form">
                        <label for="name">name:</label><br>
                        <input type="text" id="name" name="name" required><br><br>
                        <label for="profile-textarea">About you: </label><br>
                        <textarea id="profile-textarea" name="textarea" rows="4"
                            cols="50">Tell us about yourself</textarea><br><br>
                    </form>
                    <button id="profile-save-bttn" type="submit">Save</button><br><br>`;
      profileDiv.append(form);
      $("#profile-save-bttn").click(function() {
        SaveProfile($("#name").val(), $("#profile-textarea").val());
      });
    }
    let displayNameDiv = document.createElement("div");
    let nameParagraph = document.createElement("p");
    nameParagraph.style.fontSize = "30px";
    nameParagraph.innerHTML = user.displayName;
    displayNameDiv.appendChild(nameParagraph);
    let aboutHeader = document.createElement("p");
    aboutHeader.innerHTML = "About you:";
    aboutHeader.className = "mt-4";
    let aboutParagraph = document.createElement("p");
    aboutParagraph.innerHTML = user.about;
    aboutParagraph.className = "mt-4";

    profileDiv.append(displayNameDiv, aboutHeader, aboutParagraph);
  };
});

const domainURL = "http://localhost:8888";
let endPoint = "/walls/API/V1";

GoToWall = async function() {
  const response = await fetch(domainURL.concat("/wall"));
  if (response.status == 200) {
    window.location.assign(domainURL.concat("/wall"));
  }
};

LogOut = async function() {
  const getMethod = {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  const response = await fetch(
    domainURL.concat(endPoint, "/user/logout"),
    getMethod
  );
  if (response.status == 200) {
    alert("Logout Successful");
    window.location.assign(domainURL);
  }
};

let logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function() {
  LogOut();
});

DeleteAccount = async function() {
  const getMethod = {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  const response = await fetch(
    domainURL.concat(endPoint, "/user/delete"),
    getMethod
  );
  if (response.status == 200) {
    alert("Successfully deleted your account");
    window.location.assign(domainURL);
  }
};

let deleteAccountBttn = document
  .getElementById("delAccntBttn")
  .addEventListener("click", function() {DeleteAccount()});

SaveProfile = async function(name, about) {
  let profile = {};
  console.log(document.getElementById("name").innerHTML);
  profile.displayName = name;
  profile.about = about;

  const putMethod = {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(profile),
  };
  const response = await fetch(
    domainURL.concat(endPoint, "/user/profile"),
    putMethod
  );
  if (response.status == 200) {
    alert("Profile saved successfully");
  } else {
    alert("Failed to save profile");
  }
};

GetProfile = async function() {
  const response = await fetch(domainURL.concat(endPoint, "/user/profile"));
  const userNodeList = await response.json();
  for (let i = 0; i < userNodeList.results.length; i++) {
    let user = JSON.parse(userNodeList.results[i]);
    return user;
  }
};
