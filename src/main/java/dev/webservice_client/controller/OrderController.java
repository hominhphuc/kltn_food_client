package dev.webservice_client.controller;

import dev.webservice_client.model.LoaiMatHang;
import dev.webservice_client.service.LoaiMatHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private LoaiMatHangService loaiMatHangService;

    @GetMapping
    public String ordertPage(Model model){
        List<LoaiMatHang> loaiMatHangList = loaiMatHangService.findAll();

        model.addAttribute("loaiMatHang", loaiMatHangList.subList(loaiMatHangList.size() - 4,
                loaiMatHangList.size()));
        return "order";
    }

}
