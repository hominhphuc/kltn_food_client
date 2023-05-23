package dev.webservice_client.controller;

import dev.webservice_client.model.LoaiMatHang;
import dev.webservice_client.model.MatHang;
import dev.webservice_client.service.GioiThieuService;
import dev.webservice_client.service.LoaiMatHangService;
import dev.webservice_client.service.MatHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/")
public class HomeController {

    @Autowired
    private MatHangService matHangService;

    @Autowired
    private LoaiMatHangService loaiMatHangService;

    @Autowired
    private GioiThieuService gioiThieuService;

    @GetMapping
    public String homePage(Model model) {
//        try {
//
//        } catch (Exception e) {
//            return "error500";
//        }
        List<MatHang> matHangList = matHangService.findAll();
        List<LoaiMatHang> loaiMatHangList = loaiMatHangService.findAll();
        List<MatHang> features = matHangService.features();
        List<MatHang> topSeller = matHangService.topSeller();

        model.addAttribute("topSeller", topSeller);
        model.addAttribute("features", features);
        model.addAttribute("matHangNew", matHangList.subList(matHangList.size() - 5, matHangList.size()));
        model.addAttribute("loaiMatHang", loaiMatHangList.subList(loaiMatHangList.size() - 4,
                loaiMatHangList.size()));

        model.addAttribute("intro", gioiThieuService.findAll());
        return "index";
    }

}
