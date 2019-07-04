In this repository, public is the Client side of this web project and rest is the Server side.

Server side developed using Java, Apache Tomcat, Spring, Maven and IntelliJ IDEA.
Client side developed using Vanilla Javascript, Html5 and Css.

Users must authenticate to use the application on the client side. There are two user types: Admin and Regular.

Admin can add, update, delete users and can see all the users in the database.
Admin and regular users can send message, read inbox and outbox.

Jaxb2 plugin in pom.xml will create Java classes needed by the server side.
Then maven will be able to create the executable jar file.

Application.java can be used to run and deploy the website on localhost:8080, otherwise command line is an option.

------------------------------------------------------------------------------------------------------------------------
default admin for login:
	username= admin
	password= 1357
	
default database name:
	test
	
default tables' names:
	users
	messages
	sessions
