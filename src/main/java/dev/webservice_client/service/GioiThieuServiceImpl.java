package dev.webservice_client.service;

import dev.webservice_client.model.GioiThieu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class GioiThieuServiceImpl implements GioiThieuService{

    @Autowired
    private RestTemplate restTemplate;

    @Value("${app.url.intro}")
    private String url;

    @Override
    public List<GioiThieu> findAll() {
        ResponseEntity<List<GioiThieu>> responseEntity
                = restTemplate.exchange(url, HttpMethod.GET, null,
                new ParameterizedTypeReference<List<GioiThieu>>() {
                });
        List<GioiThieu> list = responseEntity.getBody();
        return list;
    }

}
