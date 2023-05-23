package dev.webservice_client.service;

import dev.webservice_client.model.CustomUserDetails;
import dev.webservice_client.model.KhachHang;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${app.url.client}")
    private String url;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {

        KhachHang khachHang = restTemplate.getForObject(url + "/phone=" + s, KhachHang.class);

        if (khachHang == null) {
            throw new UsernameNotFoundException("Khách hàng " + khachHang + " không tìm thấy trong cơ sở dữ liệu");
        }

        return new CustomUserDetails(khachHang);
    }
}
