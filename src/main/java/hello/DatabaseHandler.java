package hello;

import java.sql.*;
import java.util.*;

import io.spring.guides.gs_producing_web_service.User;
import io.spring.guides.gs_producing_web_service.Message;
import io.spring.guides.gs_producing_web_service.Status;

public class DatabaseHandler{

    private static DatabaseHandler instance;
    private static String url        = "jdbc:postgresql://localhost:5432/test";
    private static String driverName = "org.postgresql.Driver";
    private static String username   = "postgres";
    private static String password   = "1357";
    private Connection connection;


    //Creates database if not created and sets connection
    private DatabaseHandler() throws SQLException{

        try {

            Class.forName(driverName);

            //Connect to the base database to create a database
            System.out.println("Connecting to database...");
            connection = DriverManager
                    .getConnection("jdbc:postgresql://localhost:5432/",
                            "postgres", "1357");

            Statement statement = connection.createStatement();

            //Create database if not created
            try{

                String sql = "CREATE DATABASE test";
                statement.executeUpdate(sql);
                System.out.println("Database created successfully.");

            } catch (SQLException se) {

                System.out.println("Database is already created.");
            }

            this.connection = DriverManager.getConnection(url, username, password);
        }
        catch (ClassNotFoundException ex) {

            System.out.println("Database Connection Creation Failed : " + ex.getMessage());
        }
    }

    //Return the database connection
    Connection getConnection() {

        return connection;
    }

    //Create instance
    public static DatabaseHandler getInstance() throws SQLException {

        if (instance == null) {

            instance = new DatabaseHandler();

        } else if (instance.getConnection().isClosed()) {

            instance = new DatabaseHandler();
        }

        return instance;
    }

    //Create the initial tables if not created
    static void createDefaultTables(){

        Connection connection = null;
        Statement statement   = null;

        try{

            connection = getInstance().getConnection();
            statement = connection.createStatement();

            //Create the tables if not created
            try{

                //Users default table
                String sql = "CREATE TABLE users (" +
                        "username  TEXT PRIMARY KEY," +
                        "password  TEXT," +
                        "name      TEXT," +
                        "surname   TEXT," +
                        "gender  TEXT," +
                        "birthday    TEXT," +
                        "e_mail    TEXT," +
                        "status    TEXT );";

                statement.executeUpdate(sql);

                System.out.println("Table created successfully.");

            } catch (SQLException es) {
                //Table created already
            }

            try{

                //Messages default table
                String sql = "CREATE TABLE messages (" +
                        "fromUser    TEXT," +
                        "toUser      TEXT," +
                        "date    TEXT," +
                        "message TEXT," +
                        "FOREIGN KEY (fromUser) REFERENCES users(username) ON DELETE CASCADE," +
                        "FOREIGN KEY (toUser) REFERENCES users(username) ON DELETE CASCADE) ;";

                statement.executeUpdate(sql);

            } catch (SQLException es){
                //Table created already
            }

            try{

                //Sessions default table
                String sql = "CREATE TABLE sessions (" +
                        "username    TEXT," +
                        "session_id     INT," +
                        "FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE) ;";

                statement.executeUpdate(sql);

            } catch (SQLException es){
                //Table created already
            }


            //Create the default admin if not created
            if (findByUsername("admin") == null) {

                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("1357");
                admin.setName("Aytac Anil");
                admin.setSurname("Durmaz");
                admin.setGender("male");
                admin.setBirthday("28.04.1998");
                admin.setMail("aytacanildurmaz@gmail.com");
                admin.setStatus(Status.ADMIN);

                insertUser(admin);
                System.out.println("Admin created.");
            }

        }catch(SQLException se){
            //Handle errors for JDBC
            se.printStackTrace();

        }catch(Exception e){
            //Handle errors for Class.forName
            e.printStackTrace();

        }finally{

            //finally block used to close resources
            try{
                if(statement!=null)
                    statement.close();
            }catch(SQLException se2){
            }// nothing we can do

            try{
                if(connection != null)
                    connection.close();
            }catch(SQLException se){
                se.printStackTrace();

            }//end finally try

        }//end try

        System.out.println("Creation ended!");

    }//end createDefaultDatabase

    static boolean doUsernameExists(String username){

        return (findByUsername(username) != null);
    }

    //To check if username/password combination is correct
    static boolean checkPassword(String username, String password){

        User user = findByUsername(username);

        if ( user != null){

            return user.getPassword().equals(password);
        }

        else {

            return false;
        }
    }

    //Find a user in database with username and return User object
    static User findByUsername(String username){

        User user = null;

        try{

            Connection connection = getInstance().getConnection();
            Statement statement   = connection.createStatement();

            ResultSet rs = statement.executeQuery("SELECT * FROM users WHERE username='" + username + "';");

            if(rs.next()){

                user = new User();
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setName(rs.getString("name"));
                user.setSurname(rs.getString("surname"));
                user.setGender(rs.getString("gender"));
                user.setBirthday(rs.getString("birthday"));
                user.setMail(rs.getString("e_mail"));
                user.setStatus(rs.getString("status").equals("regular") ?
                        Status.REGULAR : Status.ADMIN);
            }

        } catch( SQLException se){
            System.out.println("Could not find.");
            se.printStackTrace();
        }
        return user;
    }


    //Return all users in the database as list of User objects
    static Vector<User> getUsers(){

        Vector<User> v = new Vector<User>();

        try{

            Connection connection = getInstance().getConnection();
            Statement statement = connection.createStatement();

            String sql;

            sql = "SELECT * FROM users;";

            ResultSet rs = statement.executeQuery(sql);

            while(rs.next()){

                User user = new User();

                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setName(rs.getString("name"));
                user.setSurname(rs.getString("surname"));
                user.setGender(rs.getString("gender"));
                user.setBirthday(rs.getString("birthday"));
                user.setMail(rs.getString("e_mail"));

                if (rs.getString("status").equals("admin")){

                    user.setStatus(Status.ADMIN);
                }
                else{

                    user.setStatus(Status.REGULAR);
                }

                v.add(user);
            }

        } catch (SQLException es){
            System.out.println("Could not get messages");
        }

        return v;
    }


    //Take a User object and insert that user to database if username is unique
    static boolean insertUser(User user){

        try{

            Connection connection = getInstance().getConnection();
            Statement statement = connection.createStatement();

            String status = "regular";
            if (user.getStatus() == Status.ADMIN){

                status = "admin";
            }

            String sql = "INSERT INTO users (username, password, name, surname, gender, birthday, e_mail, status) " +
                    "VALUES ('" + user.getUsername() +"', '" + user.getPassword() + "', '" +
                    user.getName() + "', '" + user.getSurname() + "', '" + user.getGender() + "', '"
                    + user.getBirthday() + "', '" + user.getMail() + "', '" + status + "');";

            return (statement.executeUpdate(sql) == 1) ? true: false;

        } catch (SQLException es){
            System.out.println("This username is not available.");
            return false;
        }
    }


    //Change a user's information field
    static boolean updateUser(String username, String newInfo, String columnName){

        try{

            Connection connection = getInstance().getConnection();
            Statement statement = connection.createStatement();

            String sql = "UPDATE users SET " + columnName + " = '" + newInfo + "' where username='" + username + "';";

            return (statement.executeUpdate(sql) == 1) ? true: false;

        } catch (SQLException es){
            System.out.println("Could not update");
            return false;
        }
    }


    //Delete a user from database
    static boolean deleteUser(String username){

        try{

            Connection connection = getInstance().getConnection();
            Statement statement = connection.createStatement();

            String sql = "DELETE FROM users WHERE  username='" + username + "';";

            return (statement.executeUpdate(sql) == 1) ? true: false;

        } catch (SQLException es){
            System.out.println("Could not delete");
            return false;
        }
    }


    //Take a message object and send message according to that object
    static boolean sendMessage(Message msg){

        try{

            Connection connection = getInstance().getConnection();
            Statement statement = connection.createStatement();

            String sql = "INSERT INTO messages (fromUser, toUser, date, message) " +
                    "VALUES ('" + msg.getFrom()+ "', '" + msg.getTo()
                    + "', '" + msg.getDate() + "', '" + msg.getMessage() + "');";

            return (statement.executeUpdate(sql) == 1) ? true: false;

        } catch (SQLException es){
            System.out.println("Could not send");
            return false;
        }
    }


    //Return all of the messages in the database as a list of message objects
    static Vector<Message> getMessages(String username, String inboxOrOutbox){

        Vector<Message> v = new Vector<Message>();

        try{

            Connection connection = getInstance().getConnection();
            Statement statement = connection.createStatement();

            String sql;

            if (inboxOrOutbox.equals("inbox")){

                sql = "SELECT * FROM messages WHERE touser='" + username + "';";
            }

            else{

                sql = "SELECT * FROM messages WHERE fromuser='" + username + "';";
            }

            ResultSet rs = statement.executeQuery(sql);

            while(rs.next()){

                Message message = new Message();
                message.setFrom(rs.getString("fromuser"));
                message.setTo(rs.getString("touser"));
                message.setMessage(rs.getString("message"));
                message.setDate(rs.getString("date"));

                v.add(message);
            }

        } catch (SQLException es){
            System.out.println("Could not get messages");
        }

        return v;
    }

    //Create a new session ID randomly, insert it to database and return it
    static int insertNewSession(String username){

        try{

            Connection connection = getInstance().getConnection();
            Statement statement = connection.createStatement();

            Random generator = new Random();
            int newId = generator.nextInt(2147483646) + 1;

            String sql = "INSERT INTO sessions (username, session_id) " +
                    "VALUES ('" + username + "', " + newId + ");";

            statement.executeUpdate(sql);
            return newId;
        }
        catch (SQLException es){
            System.out.println("Username not found.");
            return 0;
        }

    }

    static boolean doSessionIdExists(int id){

        try{

            Connection connection = getInstance().getConnection();
            Statement statement   = connection.createStatement();

            ResultSet rs = statement.executeQuery("SELECT * FROM sessions WHERE session_id=" + id + ";");

            if(rs.next()){

                return true;
            }

        } catch( SQLException se){
            System.out.println("Could not find.");
            se.printStackTrace();
        }
        return false;
    }

    static String findUsernameById(int id){

        String username = "";

        try {

            Connection connection = getInstance().getConnection();
            Statement statement = connection.createStatement();

            ResultSet rs = statement.executeQuery("SELECT * FROM sessions WHERE session_id=" + id + ";");

            if (rs.next()) {

                username = rs.getString("username");
            }

        } catch( SQLException se){
            System.out.println("Could not find.");
            se.printStackTrace();
        }
        return username;
    }

    static boolean deleteSession(int id){

        try{

            Connection connection = getInstance().getConnection();
            Statement statement = connection.createStatement();

            String sql = "DELETE FROM sessions WHERE  session_id=" + id + ";";

            return (statement.executeUpdate(sql) == 1) ? true: false;

        } catch (SQLException es){
            System.out.println("Could not delete session");
            return false;
        }
    }


}//end class