package  hello;

import javax.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import io.spring.guides.gs_producing_web_service.User;

@Component
public class UserRepository {

    @PostConstruct
    public void initData() {

        DatabaseHandler.createDefaultTables();
    }

    public User findUser(String name) {
        Assert.notNull(name, "The Student's name must not be null");
        return DatabaseHandler.findByUsername(name);
    }
}
