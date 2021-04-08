let signupBttn = document.getElementById("signup-bttn");
signupBttn.addEventListener('click',function(){
    Signup();
});
function Signup() {
  let user = {};
  let userName = document.getElementById("signup-username").innerHTML;
  let password = document.getElementById("signup-password").innerHTML;
  user.userName = userName;
  user.password = password;
  const endPoint = "http://localhost:8888/walls/API/V1/post/signup";
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", '/walls/API/V1/post/signup', true);
  xhttp.setRequestHeader("Content-type", "application/json");
  console.log(JSON.stringify(user));
  xhttp.send(JSON.stringify(user));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("response").innerHTML = this.responseText;
    }
  };
}
