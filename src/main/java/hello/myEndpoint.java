package hello;

import io.spring.guides.gs_producing_web_service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Endpoint
public class myEndpoint {
        private static final String NAMESPACE_URI = "http://spring.io/guides/gs-producing-web-service";

    private UserRepository userRepository;

    @Autowired
    public myEndpoint(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    //Login operation,
    //  request has username and password
    //  response has new sessionId and user status (Invalid login handled by sessionId = 0)
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "loginRequest")
    @ResponsePayload
    public LoginResponse login(@RequestPayload LoginRequest request) {

        LoginResponse response = new LoginResponse();

        if (DatabaseHandler.checkPassword(request.getUsername(), request.getPassword())){

            //Login successful, give a session id
            response.setNewSessionId(DatabaseHandler.insertNewSession(request.getUsername()));

            //Set status
            response.setAdmin(false);
            if (DatabaseHandler.findByUsername(request.getUsername()).getStatus() == Status.ADMIN){

                response.setAdmin(true);
            }
        }

        else {
            //Means login is unsuccessful
            response.setNewSessionId(0);
        }

        return response;
    }


    //Find user operation,
    //  request has sessionId
    //  response has list of users with all information
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "findRequest")
    @ResponsePayload
    public FindResponse find(@RequestPayload FindRequest request) {

        FindResponse response = new FindResponse();

        if (DatabaseHandler.doSessionIdExists(request.getSessionId())){

            User user = DatabaseHandler.findByUsername(DatabaseHandler.findUsernameById(request.getSessionId()));

            if (user.getStatus() == Status.ADMIN) {

                response.setUser(DatabaseHandler.findByUsername(request.getUsername()));
            }
        }

        return response;
    }


    //Find all users operation,
    //  request has sessionId
    //  response has list of users with all information
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getUsersRequest")
    @ResponsePayload
    public GetUsersResponse getUsers(@RequestPayload GetUsersRequest request) {

        GetUsersResponse response = new GetUsersResponse();

        if (DatabaseHandler.doSessionIdExists(request.getSessionId())){

            User user = DatabaseHandler.findByUsername(DatabaseHandler.findUsernameById(request.getSessionId()));

            if (user.getStatus() == Status.ADMIN) {

                response.getUser().addAll(DatabaseHandler.getUsers());
            }
        }

        return response;
    }


    //Create user operation;
    //  request has sessionId and all information needed for a user
    //  response has true or false(Is operation successful)
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "createRequest")
    @ResponsePayload
    public CreateResponse create(@RequestPayload CreateRequest request) {

        CreateResponse response = new CreateResponse();

        //This will report the error if operation not successful
        response.setCreateValid(false);

        if (DatabaseHandler.doSessionIdExists(request.getSessionId())){

            User user = DatabaseHandler.findByUsername(DatabaseHandler.findUsernameById(request.getSessionId()));

            if (user.getStatus() == Status.ADMIN){

                //Admin creation is not allowed
                request.getUser().setStatus(Status.REGULAR);

                if (DatabaseHandler.insertUser(request.getUser())){

                    response.setCreateValid(true);
                }
            }
        }

        return response;
    }


    //Delete user operation;
    //  request has sessionId and target username
    //  response has true or false(Is operation successful)
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deleteRequest")
    @ResponsePayload
    public DeleteResponse delete(@RequestPayload DeleteRequest request) {

        DeleteResponse response = new DeleteResponse();

        //This will report the error if operation not successful
        response.setDeleteValid(false);

        if (DatabaseHandler.doSessionIdExists(request.getSessionId())){

            User user = DatabaseHandler.findByUsername(DatabaseHandler.findUsernameById(request.getSessionId()));

            if (user.getStatus() == Status.ADMIN) {

                if(DatabaseHandler.deleteUser(request.getUsername())){

                    response.setDeleteValid(true);
                }
            }
        }

        return response;
    }


    //Update user operation,
    //  request has sessionId, target username, information category and new information
    //  response has true or false(Is operation successful)
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updateRequest")
    @ResponsePayload
    public UpdateResponse update(@RequestPayload UpdateRequest request) {

        UpdateResponse response = new UpdateResponse();

        //This will report the error if operation not successful
        response.setUpdateValid(false);

        if (DatabaseHandler.doSessionIdExists(request.getSessionId())){

            User user = DatabaseHandler.findByUsername(DatabaseHandler.findUsernameById(request.getSessionId()));

            if (user.getStatus() == Status.ADMIN) {

                if (DatabaseHandler.updateUser(request.getTargetUsername(),
                        request.getNewInfo(), request.getInfoCategory())){

                    response.setUpdateValid(true);
                }
            }
        }

        return response;
    }


    //Send message operation,
    //  request has sessionId and target username(sender username and date is handled by server)
    //  response has true or false(Is operation successful)
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "sendMessageRequest")
    @ResponsePayload
    public SendMessageResponse sendMessage(@RequestPayload SendMessageRequest request) {

        SendMessageResponse response = new SendMessageResponse();

        //This will report the error if operation not successful
        response.setSendMessageValid(false);

        if (DatabaseHandler.doSessionIdExists(request.getSessionId())){

            String from = DatabaseHandler.findUsernameById(request.getSessionId());

            LocalDateTime rawDate = LocalDateTime.now();
            DateTimeFormatter myFormat = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
            String date = rawDate.format(myFormat);

            request.getPackedMessage().setFrom(from);
            request.getPackedMessage().setDate(date);

            if (DatabaseHandler.sendMessage(request.getPackedMessage())){

                response.setSendMessageValid(true);
            }
        }

        return response;

    }


    //Get inbox operation,
    //  request has sessionId
    //  response has list of Message classes
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getInboxRequest")
    @ResponsePayload
    public GetInboxResponse getInbox(@RequestPayload GetInboxRequest request) {

        GetInboxResponse response = new GetInboxResponse();

        if (DatabaseHandler.doSessionIdExists(request.getSessionId())){

            response.getInbox().addAll(DatabaseHandler.getMessages(
                    DatabaseHandler.findUsernameById(request.getSessionId()),
                    "inbox"));
        }

        return response;
    }


    //Get outbox operation,
    //  request has sessionId
    //  response has list of Message classes
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getOutboxRequest")
    @ResponsePayload
    public GetOutboxResponse getOutbox(@RequestPayload GetOutboxRequest request) {

        GetOutboxResponse response = new GetOutboxResponse();

        if (DatabaseHandler.doSessionIdExists(request.getSessionId())){

            response.getOutbox().addAll(DatabaseHandler.getMessages(
                    DatabaseHandler.findUsernameById(request.getSessionId()),
                    "outbox"));
        }

        return response;
    }


    //Logout operation,
    //  request has sessionId
    //  response has true or false(Is operation successful)
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "logoutRequest")
    @ResponsePayload
    public LogoutResponse logout(@RequestPayload LogoutRequest request) {

        LogoutResponse response = new LogoutResponse();

        //This will report the error if operation not successful
        response.setLogoutValid(false);

        if (DatabaseHandler.doSessionIdExists(request.getSessionId())){

            if (DatabaseHandler.deleteSession(request.getSessionId())){

                response.setLogoutValid(true);
            }
        }

        return response;
    }
}
