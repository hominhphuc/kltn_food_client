package dev.webservice_client.controller;

import dev.webservice_client.model.KhachHang;
import dev.webservice_client.model.VerificationResult;
import dev.webservice_client.service.KhachHangService;
import dev.webservice_client.service.PhoneVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private PhoneVerificationService phonesmsservice;

    @Autowired
    private KhachHangService khachHangService;

    @GetMapping
    public String loginPage() {
        try {
            KhachHang obj = khachHangService.findByPhone("");
            return "login";
        } catch (Exception e) {
            return "error500";
        }
    }

    //Gửi mã xác thực OTP
    @PostMapping("/sendOTP")
    public ResponseEntity<String> sendOTP(@RequestParam("phone") String phone) {
        VerificationResult result = phonesmsservice.startVerification(phone);
        if (result.isValid()) {
            return new ResponseEntity<>("Mã xác thực OTP đã được gửi tới số điện thoại " + phone
                    + ". Nếu chưa nhận được xin hãy bấm gửi lại mã", HttpStatus.OK);
        }
        return new ResponseEntity<>("Số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST);
    }

    //Xác thực mã OTP
    @PostMapping("/verifyOTP")
    public ResponseEntity<String> verifyOTP(@RequestParam("phone") String phone, @RequestParam("otp") String otp) {
        VerificationResult result = phonesmsservice.checkverification(phone, otp);
        if (result.isValid()) {
            return new ResponseEntity<>("Xác thực thành công", HttpStatus.OK);
        }
        return new ResponseEntity<>("Mã xác thực OTP không chính xác. Vui lòng kiểm tra tin nhắn trong điện thoại"
                , HttpStatus.BAD_REQUEST);
    }
}
