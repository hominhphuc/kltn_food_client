$(document).ready(function () {
    assignDataToTable()

    //Hủy đơn hàng theo mã
    $('table').on('click', '.delete-btn', function () {
        let btn_id = this.id.split("_")[2]

        //AJAX Tìm hóa đơn để tìm ra mã giảm giá cập nhật lại trạng thái của phiếu giảm giá đó
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: url_api_order + '/' + btn_id,
            success: function (order) {
                if (order.maGiamGia == null) {
                    removeOrder(btn_id)
                } else {
                    $.ajax({
                        type: 'GET',
                        contentType: 'application/json',
                        url: url_api_voucher + '/' + order.maGiamGia,
                        success: function (voucher) {
                            $.ajax({
                                type: 'PUT',
                                data: JSON.stringify({
                                    tenPhieu: voucher.tenPhieu,
                                    loaiPhieu: voucher.loaiPhieu,
                                    trangThai: 'Chưa sử dụng',
                                    phanTram: voucher.phanTram,
                                    ngayBatDau: voucher.ngayBatDau,
                                    ngayKetThuc: voucher.ngayKetThuc,
                                    khachHang: {
                                        userId: voucher.khachHang.userId
                                    }
                                }),
                                contentType: 'application/json',
                                url: url_api_voucher + '/' + order.maGiamGia,
                                success: function () {
                                    removeOrder(btn_id)
                                },
                                error: function (err) {
                                    alert(err)
                                }
                            })
                        },
                        error: function (err) {
                            alert(err)
                        }
                    })
                }
            },
            error: function (err) {
                alert(err)
            }
        })
    })

    //Lấy dữ liệu đối tượng từ nút view
    $('table').on('click', '.view-btn', function (e) {
        $('.js-modal-orderdetail').addClass('show-modal1')
        let view_id = this.id.split("_")[2]
        // Find ALL by id
        renderOrderDetail(view_id)
    })

    //Hiển thị dữ liệu
    function assignDataToTable() {
        var t = $("#tbl-order").DataTable({
            paging: true,
            pagingType: 'full_numbers',
            lengthChange: true,
            lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Tất cả']],
            searching: true,
            ordering: true,
            info: false,
            autoWidth: false,
            responsive: true,
            processing: true,
            dom: 'Plfrtip',
            //Thay đổi ngôn ngữ của bảng
            oLanguage: {
                sLengthMenu: 'Hiển thị _MENU_ đơn hàng',
                sSearch: 'Tìm kiếm',
                sInfo: 'Đang hiển thị từ _START_ đến _END_ trên _TOTAL_ đơn hàng.',
                sInfoFiltered: '(được lọc từ tổng _MAX_ đơn hàng)',
                sEmptyTable: 'Chưa có đơn hàng nào được đặt. ' +
                    'Hãy đặt nhiều đơn để mau thăng hạng nhận được nhiều ưu đãi hơn nhé ^_^',
                sProcessing: "Đang tải dữ liệu...",
                oPaginate: {
                    sFirst: 'Đầu',
                    sLast: 'Cuối',
                    sNext: '>',
                    sPrevious: '<'
                }
            },
            language: {
                searchPanes: {
                    title: {
                        _: 'Bộ lọc đã chọn - %d',
                        0: 'Chưa chọn bộ lọc',
                        1: '1 bộ lọc đã được chọn'
                    },
                }
            },
            pagingType: 'full_numbers',
            order: [[1, 'desc']],
            ajax: {
                url: url_api_order + '/userId=' + userId,
                type: "GET",
                contentType: "application/json",
                dataSrc: function (d) {
                    return d
                },
            },
            //Tạo id cho mỗi thẻ tr
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                $(nRow).attr('id', 'tr_' + aData.maDDH); // or whatever you choose to set as the id
            },
            //Mặc định filter theo trạng thái chờ xác nhận
            searchPanes: {
                preSelect: [
                    {
                        rows: ['Chờ xác nhận'],
                        column: 2
                    },
                ],
                initCollapsed: false,
                clear: false,
                collapse: false,
                i18n: {
                    count: 'Có {total} đơn',
                    countFiltered: '{shown} ({total})'
                }
            },
            // Ẩn filter nào không cần thiết theo số cột
            columnDefs: [
                {
                    searchPanes: {
                        show: false
                    },
                    targets: [0, 1, 3, 4, 5, 6, 7, 8]
                },
                {
                    searchPanes: {
                        show: true
                    },
                    targets: [2]
                }
            ],
            //Render dữ liệu
            columns: [
                {
                    data: 'maDDH'
                },
                {
                    data: 'maDDH'
                },
                {
                    data: 'trangThai',
                    render: function (data, type, row, meta) {
                        if (row.trangThai == 'Chờ xác nhận') {
                            return '<button class="badge badge-pill badge-danger cl0 pointer-none">' + row.trangThai + '</button>'
                        } else if (row.trangThai == 'Đang giao') {
                            return '<button class="badge badge-pill badge-warning cl2 pointer-none">' + row.trangThai + '</button>'
                        } else {
                            return '<button class="badge badge-pill badge-success cl0 pointer-none">' + row.trangThai + '</button>'
                        }
                    },
                },
                {
                    data: 'hinhThuc'
                },
                {
                    data: 'diaChiGiaoHang'
                },
                {
                    data: 'tongTien',
                    render: function (data, type, row, meta) {
                        return (row.tongTien + 15000).toLocaleString('it-IT',
                            {style: 'currency', currency: 'VND'}) + ' (Có tính phí ship 15.000)'
                    }
                },
                {
                    data: 'ngayDatHang',
                    render: $.fn.dataTable.render.moment('YYYY-MM-DD', 'DD/MM/YYYY')
                },
                {
                    data: 'maDDH',
                    render: function (data, type, row, meta) {
                        return '<button id="btn_view_' + row.maDDH + '" class="btn bg-transparent text-info view-btn"' +
                            '><i class="lnr lnr-eye"></i></button>'
                    }
                },
                {
                    class: 'cl2',
                    data: 'maDDH',
                    render: function (data, type, row, meta) {
                        if (row.trangThai == 'Chờ xác nhận') {
                            return '  <button id="btn_delete_' + row.maDDH + '" class="btn bg-transparent text-danger delete-btn" >' +
                                '<i class="zmdi zmdi-close-circle"></i></button>'
                        } else {
                            return ''
                        }
                    }
                }
            ]
        })

        new $.fn.dataTable.FixedHeader(t)

        //Tạo số thứ tự bắt đầu từ 1 vào cột mã
        t.on('order.dt search.dt', function () {
            t.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1
            })
        }).draw()

        //Gắn nút refresh vào bảng
        new $.fn.dataTable.Buttons(t, {
            buttons: [
                {
                    text: '<i class="lnr lnr-sync"></i>',
                    action: function (e, dt, node, conf) {
                        t.ajax.reload(null, false)
                    }
                },
            ]
        })

        t.buttons(0, null).container().prependTo(
            t.table().container()
        )
    }

    //Hiển thị chi tiết hóa đơn
    function renderOrderDetail(view_id) {
        $("#tbl-od tbody").empty()
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: url_api_orderDetail + '/donDatHang=' + view_id,
            success: function (data) {
                $.each(data, (i, object) => {
                    $('#tbl-od tbody').append('<tr> \
                            <td>' + (i + 1) + '</td> \
                            <td>' + object.matHang.tenMH + '</td> \
                            <td>' + object.soLuongDat + '</td> \
                            <td>' + object.donGia.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}) + '</td> \
                        </tr>')
                    if (object.donDatHang.trangThai == 'Đã thanh toán') {
                        $('#tbl-od tbody').append('' +
                            '<td colspan="4">' +
                            '<button onclick="addToCart(' + object.matHang.maMH + ')" class="btn btn-primary buy-btn float-right">' +
                            'Mua lại' +
                            '</button>' +
                            '</td>' + '')
                    }
                })
            },
            error: function (err) {
                alert(err)
            }
        })
    }

    //Delete Object by id
    function removeOrder(orderId) {
        $.ajax({
            type: 'DELETE',
            url: url_api_order + '/' + orderId,
            success: function (data) {
                swal('Thành công', 'Đã hủy đơn hàng "' + orderId + '"', 'success')
                $('#tbl-order').DataTable().ajax.reload(null, false)
                $('#tbl-voucher').DataTable().ajax.reload(null, false)
            },
            error: function (err) {
                swal('Thất bại', 'Không thể hủy đơn hàng "' + btn_id + '"', 'error')
            }
        })
    }
})