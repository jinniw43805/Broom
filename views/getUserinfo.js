$.post("/getUserinfo", function(data) {
  $(".result").html(data);
});