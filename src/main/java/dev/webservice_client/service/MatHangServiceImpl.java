package dev.webservice_client.service;

import dev.webservice_client.model.MatHang;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class MatHangServiceImpl implements MatHangService{

    @Value("${app.url.product}")
    private String url;

    @Autowired
    private RestTemplate restTemplate;

    //Hàm CRUD mặc định
    @Override
    public List<MatHang> findAll() {
        ResponseEntity<List<MatHang>> responseEntity
                = restTemplate.exchange(url, HttpMethod.GET, null,
                new ParameterizedTypeReference<>() {
                });
        List<MatHang> list = responseEntity.getBody();
        return list;
    }

    //Các hàm khác được bổ sung vào
    @Override
    public List<MatHang> findAllByLMH(Long id) {
        ResponseEntity<List<MatHang>> responseEntity
                = restTemplate.exchange(url + "/pLoai=" + id, HttpMethod.GET, null,
                new ParameterizedTypeReference<>() {
                });
        List<MatHang> list = responseEntity.getBody();
        return list;
    }

    @Override
    public List<MatHang> features() {
        ResponseEntity<List<MatHang>> responseEntity
                = restTemplate.exchange(url + "/features", HttpMethod.GET, null,
                new ParameterizedTypeReference<>() {
                });
        List<MatHang> list = responseEntity.getBody();
        return list;
    }

    @Override
    public List<MatHang> topSeller() {
        ResponseEntity<List<MatHang>> responseEntity
                = restTemplate.exchange(url + "/top-seller", HttpMethod.GET, null,
                new ParameterizedTypeReference<>() {
                });
        List<MatHang> list = responseEntity.getBody();
        return list;
    }

    @Override
    public List<MatHang> search(String keyword) {
        ResponseEntity<List<MatHang>> responseEntity
                = restTemplate.exchange(url + "/keyword=" + keyword, HttpMethod.GET, null,
                new ParameterizedTypeReference<>() {
                });
        List<MatHang> list = responseEntity.getBody();
        return list;
    }
}
