package dev.webservice_client.service;

import dev.webservice_client.model.KhachHang;
import org.springframework.http.ResponseEntity;

public interface KhachHangService {

    //Hàm CRUD Mặc định
    KhachHang createCustomer(String email, String name, String picture);

    KhachHang updateCustomer(KhachHang customer, String name, String picture);

    //Một số hàm khác
    KhachHang findByPhone(String s);

    KhachHang getCustomerByEmail(String email);
}
