$(document).ready(function() {
    $("#btnLogin").click(function(e) {
        var username = $("#username").val();
        var password = $("#password").val();
        login(username, password);
    });
});

async function login(username, password) {
    await $.ajax({
        type: "POST",
        url: "https://we-sports-sv.herokuapp.com/v1/admin/login",
        data: JSON.stringify({ username: username, password: password }),
        contentType: "application/json",
        success: function(result) {
            if (result == 0) {
                window.location.replace('./main.html');
            }
        }
    })
}