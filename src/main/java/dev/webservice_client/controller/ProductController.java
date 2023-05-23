package dev.webservice_client.controller;

import dev.webservice_client.model.LoaiMatHang;
import dev.webservice_client.service.LoaiMatHangService;
import dev.webservice_client.service.MatHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private LoaiMatHangService loaiMatHangService;

    @Autowired
    private MatHangService matHangService;

    @GetMapping("/categories/{categories}")
    String productPage(Model model, @PathVariable Long categories) {

        List<LoaiMatHang> loaiMatHangList = loaiMatHangService.findAll();

        for (int i = 0; i < loaiMatHangList.size(); i++) {
            if (categories == 0) {
                categories = loaiMatHangList.get(0).getMaLMH();
            }
        }

        model.addAttribute("listByLMH", matHangService.findAllByLMH(categories));
        model.addAttribute("idLMH", categories);
        model.addAttribute("listLMH", loaiMatHangList);
        return "product";
    }

    @GetMapping
    String searchProductPage(Model model, String keyword) {

        List<LoaiMatHang> loaiMatHangList = loaiMatHangService.findAll();

        if (keyword != null && keyword != "") {
            model.addAttribute("listByLMH", matHangService.search(keyword));
            model.addAttribute("keyword", keyword);
            model.addAttribute("listLMH", loaiMatHangList);
            return "product";
        } else {
            return productPage(model, 1L);
        }

    }

}
