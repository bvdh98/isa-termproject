$(function() {
  let posts = undefined;
  let getStatsBttn = $("#stats-bttn").click(function() {
    (async () => {
      posts = await GetStats();
      $.fn.DisplayStats(posts);
    })();
  });
  $.fn.DisplayStats = function(posts) {
    let table = $(`<table id="stats-table" class="mt-4">
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Request</th>
                  </tr>
                  <tr>
                    <td>Post</td>
                    <td>/walls/API/V1/post/id</td>
                    <td>${posts.wall_post_req}</td>
                  </tr>
                  <tr>
                    <td>Get</td>
                    <td>/walls/API/V1/post</td>
                    <td>${posts.wall_get_req}</td>
                  </tr>
                </table>`);
    $("#stats-div").append(table);
  };
});

GetStats = async function() {
  const endPoint = "http://localhost:8888/walls/API/V1/admin/stats";
  const response = await fetch(endPoint);
  posts = await response.json();
  return posts;
};
