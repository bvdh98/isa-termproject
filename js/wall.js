$(function(){
    let postDiv = $("#post-div");
    let makePostDiv = $("#make-post-div");
    let postBttn = $("#post-bttn").click(function(){
        let textArea = '<textarea id="w3review" name="w3review" rows="4" cols="50"></textarea>';
        makePostDiv.append(textArea);
    });
})

/*let postDiv = document.getElementById("post-div");
let makePostDiv = document.getElementById("make-post-div");
let postBttn = document.getElementById("post-bttn");

postBttn.addEventListener("click", function() {
  CreatePostUI();
});

function CreatePostUI() {
  RemoveNewPostBttn();
  let textarea = document.createElement("textarea");
  Object.assign(textarea, {
    rows: "4",
    cols: "50",
    className: "mt-4",
    id: "walltextarea",
  });
  makePostDiv.appendChild(textarea);
  let postBttn = document.createElement("button");
  Object.assign(postBttn, {
    className: "mt-4",
    innerHTML: "Post",
  });
  postBttn.addEventListener("click", function() {
    PostToWall();
  });
  let postBttnDiv = document.createElement("div");
  postBttnDiv.appendChild(postBttn);
  makePostDiv.appendChild(postBttnDiv);
}

function RemoveNewPostBttn() {
  postBttn.parentNode.removeChild(postBttn);
}

$(function PostToWall() {
  let textArea = $("#walltextarea");
  let postContent = $("<p></p>");
  let newPostDiv = $("<div></div>");
  let userName = ($("<p></p>").innerHTML = "test");

  let d = new Date();
  let strDate = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
  let dateParagraph = ($("<p></p>").innerHTML = strDate);

  let topDiv = $("<div></div>").appendChild(userName,dateParagraph);
  topDiv.attr('id','top-div');

  postContent.innerHTML = textArea.value;
  newPostDiv.appendChild(topDiv,postContent);
  postDiv.appendChild(newPostDiv);
});

/*function PostToWall() {
  let textArea = document.getElementById("walltextarea");
  let postContent = document.createElement("p");
  let newPostDiv = document.createElement("div");

  let userName = document.createElement("p");
  userName.innerHTML = "test";
  let dateParagraph = document.createElement("p");
  dateParagraph.innerHTML = "" + Date;
  let topDiv = document.createElement("div");
  topDiv.appendChild(userName);
  topDiv.appendChild(dateParagraph);
  postContent.innerHTML = textArea.value;
  newPostDiv.appendChild(topDiv);
  newPostDiv.appendChild(postContent);
  postDiv.appendChild(newPostDiv);
}*/
