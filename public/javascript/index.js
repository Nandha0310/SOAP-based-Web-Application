var sessionId = 0;

function soap()
{
    var xhttp = new XMLHttpRequest();

    var username = document.forms["myForm"]["username"].value;
    var password = document.forms["myForm"]["password"].value;

    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <gs:loginRequest>\n' +
        '         <gs:username>' + username + '</gs:username>\n' +
        '         <gs:password>' + password + '</gs:password>\n' +
        '      </gs:loginRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    xhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var xmlDoc = xhttp.responseXML;

            sessionId = xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service"
                ,"newSessionId")[0].childNodes[0].nodeValue;

            if (sessionId != 0)
            {

                //login successful
                sessionStorage.setItem("sessionId", sessionId);
                sessionStorage.setItem("status",
                    xmlDoc.getElementsByTagNameNS("http://spring.io/guides/gs-producing-web-service"
                        ,"admin")[0].childNodes[0].nodeValue);
                sessionStorage.setItem("username", username);

                //navigate to application
                location.replace("mail.html");
            }
            else
            {
                document.getElementById("unsuccessfulLogin").innerHTML =
                    "Wrong username or password";
            }
        }
    };

    xhttp.open("POST", 'http://localhost:8080/ws', true);
    xhttp.setRequestHeader('Content-Type', 'text/xml');
    xhttp.send(xml);
}