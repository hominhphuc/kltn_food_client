package dev.webservice_client.service;

import dev.webservice_client.model.LoaiMatHang;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class LoaiMatHangServiceImpl implements LoaiMatHangService{

    @Autowired
    private RestTemplate restTemplate;

    @Value("${app.url.categories}")
    private String url;

    //Hàm CRUD mặc định
    @Override
    public List<LoaiMatHang> findAll() {
        ResponseEntity<List<LoaiMatHang>> responseEntity
                = restTemplate.exchange(url, HttpMethod.GET, null,
                new ParameterizedTypeReference<List<LoaiMatHang>>() {
                });
        List<LoaiMatHang> list = responseEntity.getBody();
        return list;
    }
}
