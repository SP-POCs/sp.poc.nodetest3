// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
     // Add User button click
    $('#btnAddUser').on('click', addUser);
    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    // Update User link click
    $('#userList table tbody').on('click', 'td a.linkupdateuser', updateUser);
    $('#addUser fieldset input').val('');


});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// Add/Update User
function updateUser(event) {
    event.preventDefault();

    $("#btnAddUser").html('Update User');
    $("#wrapper h2")[2].innerHTML = 'Update User';

    // Retrieve username from link rel attribute
    var thisUserId = $(this).attr('rel');

    console.log("thisUserId-------------"+thisUserId);

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisUserId);
    // Get our User Object
    updateUserObject = userListData[arrayPosition];
    updateUserObject._id = thisUserId;
    console.log("updateUserObject._id---"+updateUserObject._id);

    //Populate Info Box
    $('#inputUserName').prop('placeholder',updateUserObject.username);
    $('#inputUserName').prop('value',updateUserObject.username);
    $('#inputUserEmail').prop('placeholder',updateUserObject.email);
    $('#inputUserEmail').prop('value',updateUserObject.email);
    $('#inputUserFullname').prop('placeholder',updateUserObject.fullname);
    $('#inputUserFullname').prop('value',updateUserObject.fullname);
    $('#inputUserAge').prop('placeholder',updateUserObject.age);
    $('#inputUserAge').prop('value',updateUserObject.age);
    $('#inputUserLocation').prop('placeholder',updateUserObject.location);
    $('#inputUserLocation').prop('value',updateUserObject.location);
    $('#inputUserGender').prop('placeholder',updateUserObject.gender);
    $('#inputUserGender').prop('value',updateUserObject.gender);

    // Clear the form inputs
                //$('#addUser fieldset input').val('');

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service

        console.log("-------------->" + $(this).attr('rel'));

        //console.log("thisUserObject._id---"+updateUserObject._id);

        var type,url;
        if ( $("#btnAddUser").text() === "Add User") {
            type = 'POST';
            url = '/users/adduser';
        } else {
            type = 'PUT';
            url = '/users/updateuser/' + updateUserObject._id;

        }

        $.ajax({
            type: type,
            data: newUser,
            url: url,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Update the table
                populateTable();
                // Clear the form inputs
                $('#addUser fieldset input').val('');
                resetPlaceHolders();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

function resetPlaceHolders(){
    $('#inputUserName').prop('placeholder','Username');
    $('#inputUserEmail').prop('placeholder','Email');
    $('#inputUserFullname').prop('placeholder','Full Name');
    $('#inputUserAge').prop('placeholder','Age');
    $('#inputUserLocation').prop('placeholder','Location');
    $('#inputUserGender').prop('placeholder','Gender');
}

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};


