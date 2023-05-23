;(function () {
    //Khai báo biến set ngày mặc định
    let d = new Date()
    let month = d.getMonth() + 1
    let day = d.getDate()
    let currentDate = d.getFullYear() + '-' +
        (month < 10 ? '0' : '') + month + '-' +
        (day < 10 ? '0' : '') + day

    //Khai báo biến khởi tạo
    let totalCostCheckout = 0.0
    let fee = 0.0

    //Khai báo biến nhận được từ giao diện
    transferOrderPageIfEmptyCart()
    renderDataCartCheckout()
    changeQuantity($("#tbl-checkout-cart tbody"))
    deleteInCart($("#tbl-checkout-cart tbody"), userId)

    $.ajax({
        type: "GET",
        url: url_api_client + '/' + userId,
        success: function (data) {
            // $('#sdt-checkout').val(data.phone)
            $('#dia-chi-checkout').val(data.address)
        },
        error: function (err) {
            alert('Xin lỗi. Không tìm thấy thônn tin cá nhân của khách hàng!!!')
        }
    })

    //Đặt hàng function
    $('#dat-hang-btn').click(function () {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: url_api_cart + '/userId=' + userId,
            success: function (carts) {
                if (carts.length.toString() != 0) {
                    $.each(carts, (i, object) => {
                        totalCostCheckout += (object.matHang.donGia * object.soLuong)
                    })
                    postOrder(carts)
                } else {
                    $('.js-modal-checkout').removeClass('show-modal1')
                    swal('Xin lỗi', 'Giỏ hàng trống không thể tiếp tục', 'error')
                }
            },
            error: function (err) {
                alert(err)
            }
        })
    })

    // Hàm tạo hóa đơn
    function postOrder(carts) {
        $.ajax({
            type: "POST",
            url: url_api_order,
            data: JSON.stringify({
                hinhThuc: 'Giao tận nơi',
                trangThai: 'Chờ xác nhận',
                diaChiGiaoHang: $('#dia-chi-checkout').val(),
                ngayDatHang: currentDate,
                tongTien: totalCostCheckout,
                khachHang: {
                    userId: userId
                }
            }),
            contentType: "application/json",
            success: function (order) {
                $.each(carts, (i, object) => {
                    $.ajax({
                        type: "POST",
                        url: url_api_orderDetail,
                        data: JSON.stringify({
                            donGia: object.matHang.donGia * object.soLuong,
                            soLuongDat: object.soLuong,
                            matHang: {
                                maMH: object.matHang.maMH
                            },
                            donDatHang: {
                                maDDH: order.maDDH
                            }
                        }),
                        contentType: "application/json",
                        success: function (order) {
                            deleteAllInCartById(object.maGH)
                        },
                        error: function (err) {
                            alert(err)
                        }
                    })
                })
                $('.js-modal-checkout').removeClass('show-modal1')
                swal('Đặt hàng thành công', '', 'success')
            },
            error: function (err) {
                alert(err)
            }
        })
    }

    //Hàm xóa tất cả trong giỏ hàng bằng id
    function deleteAllInCartById(maGH) {
        $.ajax({
            type: "DELETE",
            url: url_api_cart + '/' + maGH,
            success: function (data) {
                renderDataCart(userId)
            },
            error: function (err) {
                alert('Lỗi. Không thể xóa trong giỏ hàng')
            }
        })
    }

    function transferOrderPageIfEmptyCart() {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: url_api_cart + '/userId=' + userId,
            success: function (carts) {
                if (carts.length.toString() == 0) {
                    window.location.href = '/product'
                }
            },
            error: function (err) {
                alert(err)
            }
        })
    }

    //Hiển thị dữ liệu
    function renderDataCartCheckout() {
        var t = $("#tbl-checkout-cart").DataTable({
            info: false,
            deferRender: true,
            scrollY: 400,
            scrollX: true,
            scrollCollapse: true,
            scroller: true,
            paging: false,
            lengthChange: false,
            searching: false,
            ordering: true,
            autoWidth: true,
            responsive: false,
            processing: false,
            //Thay đổi ngôn ngữ của bảng
            oLanguage: {
                sEmptyTable: 'Giỏ hàng trống',
            },
            pagingType: 'full_numbers',
            ajax: {
                url: url_api_cart + '/userId=' + userId,
                type: "GET",
                contentType: "application/json",
                dataSrc: function (d) {
                    return d
                },
            },
            //Tạo id cho mỗi thẻ tr
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                $(nRow).attr('id', 'tr_' + aData.maGH) // or whatever you choose to set as the id
                $(nRow).addClass('table_row')
                $(nRow).find('td:nth-child(2)').css('paddingTop', 14)
                $(nRow).find('td:nth-child(3)').css('paddingTop', 14)
                $(nRow).find('td:nth-child(4)').css('paddingTop', 14)
                $(nRow).find('td:nth-child(5)').css('paddingTop', 14)
            },
            //Render dữ liệu
            columns: [
                {
                    data: 'matHang.hinhAnh',
                    render: function (data, type, row, meta) {
                        return '<i id="img_cart_' + row.maGH + '" ' +
                            'class="lnr lnr-trash pointer image-product-cart m-r-10" style="font-size: 20px"></i>' +
                                '<img src="' + data + '" alt="IMG" width="70" height="70">'
                    },
                },
                {
                    data: 'matHang.tenMH'
                },
                {
                    data: 'matHang.donGia',
                    render: $.fn.dataTable.render.number(',', '.', 0, '', ' VND')
                },
                {
                    data: 'soLuong',
                    render: function (data, type, row, meta) {
                        return '' +
                            '<div class="wrap-num-product flex-w">' +
                                '<div class="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m decrease-quantity" \
                                    id="decrease_quantity_' + row.maGH + '">' +
                                '<i class="fs-16 zmdi zmdi-minus"></i>' +
                            '</div>' +
                            '<input id="quantity" class="mtext-104 cl3 txt-center num-product" \
                                        type="number" name="num-product1"\
                                        value="' + data + '" onkeydown="return false">' +
                            '<div class="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m increase-quantity"\
                                        id="increase_quantity_' + row.maGH + '">\
                                        <i class="fs-16 zmdi zmdi-plus"></i>\
                            </div>'
                    },
                },
                {
                    data: 'matHang.donGia',
                    render: function (data, type, row, meta) {
                        return (row.matHang.donGia * row.soLuong).toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'VND'
                        })
                    },
                },
            ]
        })
        new $.fn.dataTable.FixedColumns(t)
        new $.fn.dataTable.FixedHeader(t)
    }
}())