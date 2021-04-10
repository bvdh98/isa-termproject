$(function() {
  let postDiv = $("#post-div");
  let makePostDiv = $("#make-post-div");
  let posts = [];
  //get old posts from user
  GetPosts(posts);

  let newPostBttn = $("#new-post-bttn").click(function() {
    $.fn.HideNewPostButton();
    let textArea = $(
      '<textarea id="walltextarea" class="mt-4" rows="4" cols="50"></textarea>'
    );
    let postBttn = $('<button type="button">Post</button>');
    postBttn.click(function() {
      $.fn.MakeWallPost();
    });
    let postBttnDiv = $("<div></div>");
    postBttnDiv.append(postBttn);
    makePostDiv.append(textArea, postBttnDiv);
  });

  $.fn.HideNewPostButton = function() {
    $("#new-post-bttn").hide();
  };

  //send post to server
  $.fn.SendPost = async function(text, date) {
    let post = {};
    post.text = text;
    post.date = date;

    const postMethod = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(post),
    };
    const response = await fetch(
      "http://localhost:8888/walls/API/V1/post",
      postMethod
    );
    if (response.status == 200) {
      alert("Post saved successfully");
    } else {
      alert("Failed to save post");
    }
  };

  //lets the user create their own wall post
  $.fn.MakeWallPost = function() {
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

  //upload old wall posts from posts away
  UploadPost = function(post) {
    let postContent = document.createElement("p");
    postContent.id = "postcontentof" + post.wall_post_id;
    postContent.className = "postContent";
    let newPostDiv = document.createElement("div");
    let editBttn = document.createElement("button");
    let deleteBttn = document.createElement("button");

    editBttn.className = "edit-bttn";
    editBttn.innerHTML = "Edit";
    deleteBttn.innerHTML = "Delete";
    deleteBttn.className = "ml-4 delete-bttn";

    editBttn.addEventListener("click", function() {
      OnEdit(postContent, editBttn, deleteBttn, newPostDiv, post);
    });

    deleteBttn.addEventListener("click", function() {
      OnDelete(newPostDiv, post);
    });

    //username which will be displayed in post, set to: test for now
    let userName = document.createElement("p");
    userName.innerHTML = "test";
    let userNameDiv = document.createElement("div");
    userNameDiv.appendChild(userName);

    let dateParagraph = document.createElement("p");
    dateParagraph.innerHTML = post.date;
    dateParagraph.className = "ml-4";
    let dateParagraphDiv = document.createElement("div");
    dateParagraphDiv.appendChild(dateParagraph);

    let topDiv = document.createElement("div");
    topDiv.className = "mt-4 top-div";
    topDiv.appendChild(userNameDiv);
    topDiv.appendChild(dateParagraphDiv);

    newPostDiv.appendChild(topDiv);
    newPostDiv.appendChild(postContent);
    newPostDiv.appendChild(editBttn);
    newPostDiv.appendChild(deleteBttn);

    //set the inner html of the postContent paragraph to what user typed in text area
    postContent.innerHTML = post.text;
    let postDiv = document.getElementById("post-div");
    postDiv.appendChild(newPostDiv);
  };

  OnDelete = function(newPostDiv, post) {
    newPostDiv.remove();
    DeleteWallPost(post);
  };

  //ajax call to delete wall post from server
  DeleteWallPost = async function(post) {
    const deleteMethod = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(post),
    };
    console.log("deleting wall post with id: " + post.wall_post_id);
    const response = await fetch(
      "http://localhost:8888/walls/API/V1/post/" + postId,
      deleteMethod
    );
    if (response.status == 200) {
      alert("Deleted post successfully");
    } else {
      alert("Failed to delete post");
    }
  };

  //when the edit button is clicked: allow user to edit a post
  OnEdit = function(postContent, editBttn, deleteBttn, newPostDiv, post) {
    //make postcontent editable
    postContent.contentEditable = true;
    //hide other buttons
    editBttn.style.visibility = "hidden";
    deleteBttn.style.visibility = "hidden";

    //add update button to update post
    let updateBttn = document.createElement("button");
    updateBttn.innerHTML = "Update";
    updateBttn.addEventListener("click", function() {
      OnUpdate(updateBttn, editBttn, deleteBttn, postContent, post);
    });
    newPostDiv.appendChild(updateBttn);
  };

  //updates users post with new content
  OnUpdate = function(updateBttn, editBttn, deleteBttn, postContent, post) {
    //remove update button from dom
    updateBttn.remove();
    //make other buttons visible
    editBttn.style.visibility = "visible";
    deleteBttn.style.visibility = "visible";
    //make postcontent non editable
    postContent.contentEditable = false;
    post.text = postContent.innerHTML;
    UpdateWallPost(post);
  };

  //ajax call to server to update wall post
  UpdateWallPost = async function(post) {
    const putMethod = {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(post),
    };
    let id = post.wall_post_id;
    const response = await fetch(
      "http://localhost:8888/walls/API/V1/post/" + id,
      putMethod
    );
    if (response.status == 200) {
      alert("Update successful");
    } else {
      alert("Update failed");
    }
  };

  GetPosts = async function(posts) {
    const endPoint = "http://localhost:8888/walls/API/V1/post";
    const response = await fetch(endPoint);
    const postNodeList = await response.json();
    console.log("chdsadnsa");
    for (let i = 0; i < postNodeList.results.length; i++) {
      let wallPost = JSON.parse(postNodeList.results[i]);
      posts.push(wallPost);
      UploadPost(wallPost);
    }
  };
});
