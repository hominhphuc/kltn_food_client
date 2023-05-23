package dev.webservice_client.service;

import dev.webservice_client.model.CustomOAuth2User;
import dev.webservice_client.model.KhachHang;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private KhachHangService khachHangService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);
        String email = user.getAttribute("email");
        String name = user.getAttribute("name");
        String picture = user.getAttribute("picture");
        KhachHang customer = khachHangService.getCustomerByEmail(email);
        KhachHang customer2 = null;
        if (customer == null) {
            //Đăng ký khách hàng mới
            customer2 = khachHangService.createCustomer(email, name, picture);
        } else {
            //Cập nhật khách hàng đã tồn tại
            customer2 = khachHangService.updateCustomer(customer, name, picture);
        }
        return new CustomOAuth2User(user, customer2);
    }

}
