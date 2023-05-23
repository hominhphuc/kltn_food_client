package dev.webservice_client.service;

import dev.webservice_client.model.MatHang;

import java.util.List;

public interface MatHangService {

    //Hàm CRUD mặc định
    List<MatHang> findAll();

    //Các hàm khác bổ sung vào
    List<MatHang> findAllByLMH(Long id);

    List<MatHang> features();

    List<MatHang> topSeller();

    List<MatHang> search(String keyword);

}
