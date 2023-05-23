package dev.webservice_client.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatHang {

    private long maMH;

    private String tenMH;

    private String moTa;

    private Double donGia;

    private String hinhAnh;

    private String donViTinh;

    private LoaiMatHang loaiMatHang;

}
