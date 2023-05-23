package dev.webservice_client.initializer;

import com.twilio.Twilio;
import dev.webservice_client.model.Twilioproperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioInitializer {

	
	private final Twilioproperties twilioproperties;
	
	@Autowired
	public TwilioInitializer(Twilioproperties twilioproperties)
	{
		this.twilioproperties=twilioproperties;
		Twilio.init(twilioproperties.getAccountSid(), twilioproperties.getAuthToken());
	}
}
