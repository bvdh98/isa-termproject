$(function() {
  let posts = undefined;
  let getStatsBttn = $("#load-stats-bttn").click(function() {
    (async () => {
      stats = await GetStats();
      $.fn.CreateTable();
      stats.forEach(stat => {
        $.fn.CreateStatsRow(stat);
      });
    })();
  });
  $.fn.CreateTable = function() {
    let table = $(`<table id="stats-table" class="mt-4">
                    <tr>
                      <th>Method</th>
                      <th>Endpoint</th>
                      <th>Count</th>
                    </tr>
                  </table>`);
    $("#stats-div").append(table);
  };
  $.fn.CreateStatsRow = function(stat) {
    $('#stats-table tr:last').after(`<tr>
                                      <td>
                                      ${stat.method}
                                      </td>
                                      <td>
                                      ${stat.resource}
                                      </td>
                                      <td>
                                      ${stat.count}
                                      </td>
                                    </tr>`);
  };
});

const domainURL = "http://localhost:8888";
let endPoint = "/walls/API/V1";

GetStats = async function() {
  const response = await fetch(domainURL.concat(endPoint,"/post/user/admin"));
  const statsNodeList = await response.json();
  let stats = [];
  for (let i = 0; i < statsNodeList.results.length; i++) {
    stats.push(JSON.parse(statsNodeList.results[i]));
  }
  return stats;
};
