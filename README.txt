In this repository, public is the Client side of this web project and rest is the Server side.

Server side developed using Java, Apache Tomcat, Spring, Maven and IntelliJ IDEA.
Client side developed using Vanilla Javascript, Html5 and Css.

Users must authenticate to use the application on the client side. There are two user types: Admin and Regular.

Admin can add, update, delete users and can see all the users in the database.
Admin and regular users can send message, read inbox and outbox.

How to run:
	mvn install
	java -jar target\gs-producting-web-service-0.1.0.jar

Before running, database configuration must be changed at DatabaseHandler.java

default admin for login:
	username= admin
	password= 1357
