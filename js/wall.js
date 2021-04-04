$(function() {
  let postDiv = $("#post-div");
  let makePostDiv = $("#make-post-div");

  //get old posts from user
  let loadPostBttn = $("#load-post-bttn").click(function() {
    GetPosts();
  });

  let newPostBttn = $("#new-post-bttn").click(function() {
    $.fn.HideNewPostButton();
    let textArea = $(
      '<textarea id="walltextarea" class="mt-4" rows="4" cols="50"></textarea>'
    );
    let postBttn = $('<button type="button">Post</button>');
    postBttn.click(function() {
      $.fn.PostToWall();
    });
    let postBttnDiv = $("<div></div>");
    postBttnDiv.append(postBttn);
    makePostDiv.append(textArea, postBttnDiv);
  });

  $.fn.HideNewPostButton = function() {
    $("#new-post-bttn").hide();
  };

  //send post to server
  $.fn.SendPost = function(text, date) {
    let post = {};
    post.text = text;
    post.date = date;

    const endPoint = "http://localhost:8888/walls/API/V1/post/id";
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", endPoint, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(post));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("response").innerHTML = this.responseText;
      }
    };
  };

  $.fn.PostToWall = function() {
    let textArea = $("#walltextarea");
    let postContent = $(`<p class="postContent"></p>`);
    let newPostDiv = $("<div></div>");
    //username which will be displayed in post, set to: test for now
    let userName = ($("<p></p>").innerHTML = "test");
    let userNameDiv = $(`<div></div>`);
    userNameDiv.append(userName);

    //date that will be displayed in post
    let d = new Date();
    let strDate =
      d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
    let dateParagraph = ($("<p></p>").innerHTML = strDate);
    let dateParagraphDiv = $('<div class="ml-4"></div>');
    dateParagraphDiv.append(dateParagraph);

    let topDiv = $(`<div class="mt-4"></div>`).append(
      userNameDiv,
      dateParagraphDiv
    );
    topDiv.attr("class", "top-div");
    //set the inner html of the postContent paragraph to what user typed in text area
    postContent.html(textArea.val());
    //check first that the text area isnt empty
    if (textArea.val() != "") {
      //clear the text area so the user can make a new post
      textArea.val("");
      newPostDiv.append(topDiv, postContent);
      postDiv.prepend(newPostDiv);
      $.fn.SendPost(postContent.html(), dateParagraphDiv.html());
    }
  };
});

//upload old wall posts from posts away
UploadPosts = function(posts) {
  console.log("upload posts called");
  for (i = 0; i < posts.length; i++) {
    let postContent = document.createElement('p');
    postContent.className = "postContent";
    let newPostDiv = document.createElement('div');
    //username which will be displayed in post, set to: test for now
    let userName = document.createElement('p');
    userName.innerHTML = "test";
    let userNameDiv = document.createElement('div');
    userNameDiv.appendChild(userName);

    let dateParagraph = document.createElement('p');
    dateParagraph.innerHTML = posts[i].date;
    dateParagraph.className = "ml-4";
    let dateParagraphDiv = document.createElement('div');
    dateParagraphDiv.appendChild(dateParagraph);

    let topDiv = document.createElement('div');
    topDiv.className = "mt-4 top-div";
    topDiv.appendChild(userNameDiv);
    topDiv.appendChild(dateParagraphDiv);

    newPostDiv.appendChild(topDiv);
    newPostDiv.appendChild(postContent);

    //set the inner html of the postContent paragraph to what user typed in text area
    postContent.innerHTML = posts[i].text;
    let postDiv = document.getElementById('post-div');
    postDiv.appendChild(newPostDiv);
  }
};

//create post objects and store them in posts array
StoreWallPosts = function(posts, postNodeList) {
  console.log("length : " + postNodeList.results.length);
  for (let i = 0; i < postNodeList.results.length; i++) {
    let wallPost = JSON.parse(postNodeList.results[i]);
    posts.push(wallPost);
    UploadPosts(posts);
  }
};

GetPosts = async function() {
  let posts = [];
  console.log("get post called");
  const endPoint = "http://localhost:8888/walls/API/V1/post";
  const response = await fetch(endPoint);
  const postNodeList = await response.json();
  StoreWallPosts(posts, postNodeList);
};
