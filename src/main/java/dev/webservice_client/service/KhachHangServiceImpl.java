package dev.webservice_client.service;

import dev.webservice_client.model.KhachHang;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
public class KhachHangServiceImpl implements KhachHangService{

    @Value("${app.url.client}")
    private String url;

    @Autowired
    private RestTemplate restTemplate;

    //Hàm CRUD mặc định ========================================================================
    @Override
    public KhachHang createCustomer(String email, String name, String picture) {
        KhachHang customer = new KhachHang();
        customer.setUserId(UUID.randomUUID());
        customer.setName(name);
        customer.setEmail(email);
        customer.setAvatar(picture);
        customer.setRoleName("ROLE_CLIENT");
        return restTemplate.postForEntity(url, customer, KhachHang.class).getBody();
    }

    @Override
    public KhachHang updateCustomer(KhachHang customer, String name, String picture) {
        customer.setAvatar(picture);
        customer.setName(name);

        return restTemplate.postForEntity(url, customer, KhachHang.class).getBody();
    }

    //Một số hàm khác ============================================================================
    @Override
    public KhachHang findByPhone(String s) {
        KhachHang obj = restTemplate.getForObject(url + "/phone=" + s, KhachHang.class);
        return obj;
    }

    @Override
    public KhachHang getCustomerByEmail(String email) {
        KhachHang obj = restTemplate.getForObject(url + "/email=" + email, KhachHang.class);
        return obj;
    }
}
