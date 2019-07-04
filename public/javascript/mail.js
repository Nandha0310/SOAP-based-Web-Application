var sessionId = sessionStorage.getItem("sessionId");

//Check whether user authorized
if (!sessionId)
{
    location.replace("index.html");
}

//Initial with conditions
function initialPage()
{
    if (sessionStorage.getItem("status") == "false")
    {
        document.getElementById("usersButton").style.display = 'none';
    }

    document.getElementById("userGreeter").innerHTML +=
        sessionStorage.getItem("username");
}

//Hides every element on the page
function clearPage()
{
    document.getElementById("usersTable").style.display = 'none';
    document.getElementById("usersTab").style.display = 'none';
    document.getElementById("mailsTab").style.display = 'none';
    document.getElementById("createrForm").style.display = 'none';
    document.getElementById("updaterForm").style.display = 'none';
    document.getElementById("deleterForm").style.display = 'none';
    document.getElementById("messagerForm").style.display = 'none';
    document.getElementById("inboxTable").style.display = 'none';
    document.getElementById("outboxTable").style.display = 'none';
}

//Show the create user page elements only
function createForm()
{
    document.getElementById("usersTable").style.display = 'none';
    document.getElementById("createrForm").style.display = 'block';
    document.getElementById("updaterForm").style.display = 'none';
    document.getElementById("deleterForm").style.display = 'none';

    document.getElementById("createrForm").reset();
    document.getElementById("answerToCreate").innerHTML = "";
}


//Show the update user elements only
function updateForm()
{
    document.getElementById("usersTable").style.display = 'none';
    document.getElementById("createrForm").style.display = 'none';
    document.getElementById("updaterForm").style.display = 'block';
    document.getElementById("deleterForm").style.display = 'none';

    document.getElementById("updaterForm").reset();
    document.getElementById("answerToUpdate").innerHTML = "";
}


//Show the delete user elements only
function deleteForm()
{
    document.getElementById("usersTable").style.display = 'none';
    document.getElementById("createrForm").style.display = 'none';
    document.getElementById("updaterForm").style.display = 'none';
    document.getElementById("deleterForm").style.display = 'block';

    document.getElementById("deleterForm").reset();
    document.getElementById("answerToDelete").innerHTML = "";
}


//Show the send message elements only
function sendMessageForm()
{
    document.getElementById("messagerForm").style.display = 'block';
    document.getElementById("inboxTable").style.display = 'none';
    document.getElementById("outboxTable").style.display = 'none';

    document.getElementById("messagerForm").reset();
    document.getElementById("answerToSendMessage").innerHTML = "";
}


//Show the mails' sub tab only
function showMailTab()
{
    document.getElementById("usersTable").style.display = 'none';
    document.getElementById("usersTab").style.display = 'none';
    document.getElementById("mailsTab").style.display = 'block';
    document.getElementById("createrForm").style.display = 'none';
    document.getElementById("updaterForm").style.display = 'none';
    document.getElementById("deleterForm").style.display = 'none';
    document.getElementById("messagerForm").style.display = 'none';
}


//Show user table element only
function showUserTable()
{
    document.getElementById("usersTable").style.display = 'block';
    document.getElementById("inboxTable").style.display = 'none';
    document.getElementById("outboxTable").style.display = 'none';
    document.getElementById("usersTab").style.display = 'block';
    document.getElementById("mailsTab").style.display = 'none';
    document.getElementById("createrForm").style.display = 'none';
    document.getElementById("updaterForm").style.display = 'none';
    document.getElementById("deleterForm").style.display = 'none';
    document.getElementById("messagerForm").style.display = 'none';
}


//Show inbox table only
function showInboxTable()
{
    document.getElementById("inboxTable").style.display = 'block';
    document.getElementById("outboxTable").style.display = 'none';
    document.getElementById("messagerForm").style.display = 'none';
}


//Show outbox table only
function showOutboxTable()
{
    document.getElementById("inboxTable").style.display = 'none';
    document.getElementById("outboxTable").style.display = 'block';
    document.getElementById("messagerForm").style.display = 'none';
}

//////////////////////////////User logout
function closeThisSession()
{
    var xhttp = new XMLHttpRequest();
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
        ' xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:logoutRequest>\n' +
        '         <gs:sessionId>' + sessionId + '</gs:sessionId>\n' +
        '      </gs:logoutRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("status");
    sessionStorage.removeItem("username");

    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);

    location.replace("index.html");
}


//////////////////////////////Handle create user command
function createUser()
{
    var username = document.forms["createrForm"]["username"].value;
    var password = document.forms["createrForm"]["password"].value;
    var name = document.forms["createrForm"]["name"].value;
    var surname = document.forms["createrForm"]["surname"].value;
    var gender = document.forms["createrForm"]["gender"].value;
    var birthday = document.forms["createrForm"]["birthday"].value;
    var mail = document.forms["createrForm"]["mail"].value;

    var xhttp = new XMLHttpRequest();
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
        ' xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:createRequest>\n' +
        '         <gs:sessionId>' + sessionId + '</gs:sessionId>\n' +
        '         <gs:user>\n' +
        '            <gs:username>' + username + '</gs:username>\n' +
        '            <gs:password>' + password + '</gs:password>\n' +
        '            <gs:name>' + name + '</gs:name>\n' +
        '            <gs:surname>' + surname + '</gs:surname>\n' +
        '            <gs:gender>' + gender + '</gs:gender>\n' +
        '            <gs:birthday>' + birthday + '</gs:birthday>\n' +
        '            <gs:mail>' + mail + '</gs:mail>\n' +
        '            <gs:status>' + "regular" + '</gs:status>\n' +
        '         </gs:user>\n' +
        '      </gs:createRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    xhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var xmlDoc = xhttp.responseXML;

            if (xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                "createValid")[0].childNodes[0].nodeValue == "true")
            {
                document.getElementById("answerToCreate").innerHTML =
                    "User created!";
            }
            else
            {
                document.getElementById("answerToCreate").innerHTML =
                    "There was an error.";
            }
        }
    };

    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);
}


//////////////////////////////Handle delete user command
function deleteUser()
{
    var username = document.forms["deleterForm"]["username"].value;

    var xhttp = new XMLHttpRequest();
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
        ' xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:deleteRequest>\n' +
        '         <gs:sessionId>' + sessionId + '</gs:sessionId>\n' +
        '         <gs:username>' + username + '</gs:username>\n' +
        '      </gs:deleteRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    xhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var xmlDoc = xhttp.responseXML;

            if (xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                "deleteValid")[0].childNodes[0].nodeValue == "true")
            {
                document.getElementById("answerToDelete").innerHTML =
                    "User deleted!";
            }
            else
            {
                document.getElementById("answerToDelete").innerHTML =
                    "There was an error.";
            }
        }
    };

    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);
}


//////////////////////////////Handle update user command
function updateUser()
{
    var username = document.forms["updaterForm"]["username"].value;
    var category = document.forms["updaterForm"]["infoCategory"].value;
    var info = document.forms["updaterForm"]["newInfo"].value;

    var xhttp = new XMLHttpRequest();
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
        ' xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:updateRequest>\n' +
        '         <gs:sessionId>' + sessionId + '</gs:sessionId>\n' +
        '         <gs:targetUsername>' + username + '</gs:targetUsername>\n' +
        '         <gs:infoCategory>' + category + '</gs:infoCategory>\n' +
        '         <gs:newInfo>' + info + '</gs:newInfo>\n' +
        '      </gs:updateRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    xhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var xmlDoc = xhttp.responseXML;

            if (xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                "updateValid")[0].childNodes[0].nodeValue == "true")
            {
                document.getElementById("answerToUpdate").innerHTML =
                    "User updated!";
            }
            else
            {
                document.getElementById("answerToUpdate").innerHTML =
                    "There was an error.";
            }
        }
    };

    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);
}


//////////////////////////////Show the registered users as table
function userTable()
{

    showUserTable();
    selectableUsernamesMaker();

    var xhttp = new XMLHttpRequest();
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
        ' xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:getUsersRequest>\n' +
        '         <gs:sessionId>' + sessionId + '</gs:sessionId>\n' +
        '      </gs:getUsersRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    xhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var xmlDoc = xhttp.responseXML;
            var table =
                '<tr>' +
                '<th onclick="sortTable(0)">Username</th>' +
                '<th onclick="sortTable(1)">Password</th>' +
                '<th onclick="sortTable(2)">Name</th>' +
                '<th onclick="sortTable(3)">Surname</th>' +
                '<th onclick="sortTable(4)">Gender</th>' +
                '<th onclick="sortTable(5)">Birthday</th>' +
                '<th onclick="sortTable(6)">Mail</th>' +
                '<th onclick="sortTable(7)">Status</th>' +
                '</tr>';

            var x = xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                "user");

            for (i = 0; i < x.length; i++)
            {
                table += "<tr><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "username")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "password")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "name")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "surname")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "gender")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "birthday")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "mail")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "status")[0].childNodes[0].nodeValue +
                    "</td></tr>";
            }

            document.getElementById("usersTable").innerHTML = table;
        }
    };
    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);
}


//////////////////////////////Handle send message command
function sendMessage()
{
    var username = document.forms["messagerForm"]["username"].value;
    var message = document.forms["messagerForm"]["message"].value;

    var xhttp = new XMLHttpRequest();
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
        ' xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:sendMessageRequest>\n' +
        '         <gs:sessionId>' + sessionId + '</gs:sessionId>\n' +
        '         <gs:packedMessage>\n' +
        '            <gs:from>(willBeHandledByServer)</gs:from>\n' +
        '            <gs:to>' + username + '</gs:to>\n' +
        '            <gs:message>' + message + '</gs:message>\n' +
        '            <gs:date>(willBeHandledByServer)</gs:date>\n' +
        '         </gs:packedMessage>\n' +
        '      </gs:sendMessageRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    xhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var xmlDoc = xhttp.responseXML;

            if (xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                "sendMessageValid")[0].childNodes[0].nodeValue == "true")
            {
                document.getElementById("answerToSendMessage").innerHTML =
                    "Message sent!";
            }
            else
            {
                document.getElementById("answerToSendMessage").innerHTML =
                    "There was an error.";
            }
        }
    };

    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);
}


//////////////////////////////Get and display current user's inbox as table
function showInbox()
{
    showInboxTable();

    var xhttp = new XMLHttpRequest();
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
        ' xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:getInboxRequest>\n' +
        '         <gs:sessionId>' + sessionId + '</gs:sessionId>\n' +
        '      </gs:getInboxRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    xhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var xmlDoc = xhttp.responseXML;
            var table = "<tr><th>Date</th><th>From</th><th>" +
                "Message</th></tr>";
            var x = xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                "inbox");

            for (i = x.length - 1; i >= 0; i--)
            {
                table += "<tr><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "date")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "from")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "message")[0].childNodes[0].nodeValue +
                    "</td><tr>";
            }
            document.getElementById("inboxTable").innerHTML = table;
        }
    };
    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);
}


//////////////////////////////Get and display current user's outbox as table
function showOutbox()
{
    showOutboxTable();

    var xhttp = new XMLHttpRequest();
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
        ' xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:getOutboxRequest>\n' +
        '         <gs:sessionId>' + sessionId + '</gs:sessionId>\n' +
        '      </gs:getOutboxRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    xhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var xmlDoc = xhttp.responseXML;
            var table = "<tr><th>Date</th><th>To</th><th>" +
                "Message</th></tr>";
            var x = xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                "outbox");

            for (i = x.length - 1; i >= 0; i--)
            {
                table += "<tr><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "date")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "to")[0].childNodes[0].nodeValue +
                    "</td><td>" +
                    x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                        "message")[0].childNodes[0].nodeValue +
                    "</td><tr>";
            }
            document.getElementById("outboxTable").innerHTML = table;
        }
    };
    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);
}

//////////////////////////////Selectable users
function selectableUsernamesMaker()
{

    var xhttp = new XMLHttpRequest();
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
        ' xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:getUsersRequest>\n' +
        '         <gs:sessionId>' + sessionId + '</gs:sessionId>\n' +
        '      </gs:getUsersRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    xhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var xmlDoc = xhttp.responseXML;

            var selectableUsernameString = '<option value="0">Select a username</option>';

            var x = xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                "user");

            for (i = 0; i < x.length; i++)
            {

                var name = x[i].getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service",
                    "username")[0].childNodes[0].nodeValue;

                //Admin is untouchable
                if (name == "admin")
                    continue;

                selectableUsernameString +=
                    '<option value="' + name + '">' + name + '</option>';
            }

            document.getElementById("deleteSelect").innerHTML = selectableUsernameString;
            document.getElementById("updateSelect").innerHTML = selectableUsernameString;
        }
    };
    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);
}


//////////////////////////////Table sorting algorithm
function sortTable(columnIndex)
{

    var table = document.getElementById("usersTable");

    //Color the selected header
    var headerRow = table.rows[0].getElementsByTagName("th");
    for (i = 0; i < (headerRow.length); i++)
    {

        if (i == columnIndex)
        {

            headerRow[i].
                style.backgroundColor = "#505050";
        }
        else
        {

            headerRow[i].
                style.backgroundColor = "#949494";
        }
    }

    //Sorting
    var rows, switching, i, x, y, shouldSwitch, direction, switchCount = 0;


    switched = true;
    direction = "ascending";

    while (switched)
    {

        switched = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++)
        {

            shouldSwitch = false;

            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("td")[columnIndex];
            y = rows[i + 1].getElementsByTagName("td")[columnIndex];

            if (direction == "ascending")
            {

                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())
                {
                    shouldSwitch = true;
                    break;
                }
            }
            else
            {

                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())
                {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch)
        {

            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switched = true;
            switchCount++;
        }
        else
        {

            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchCount == 0 && direction == "ascending")
            {
                direction = "descending";
                switched = true;
            }
        }
    }
}