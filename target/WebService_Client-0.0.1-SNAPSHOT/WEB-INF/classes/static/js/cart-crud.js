;(function () {
    let renderCart = []
    let storage = localStorage.getItem('cart')
    if (storage) {
        renderCart = JSON.parse(storage)
    }
    showCart(renderCart)

    if (userId != '') {
        renderVoucher()

        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: url_api_client + '/' + userId,
            success: function (client) {
                $('.myPoint').text('Điểm của tôi: ' + client.diemTichLuy)
                getVoucher($('.btnTapAn'), client, 10.0, client.diemTichLuy, 200, 'Voucher Tập Ăn')
                getVoucher($('.btnSanhAn'), client, 30.0, client.diemTichLuy, 500, 'Voucher Sành Ăn')
                getVoucher($('.btnPhamAn'), client, 50.0, client.diemTichLuy, 1000, 'Voucher Phàm Ăn')
            },
            error: function (err) {
                alert(err)
            }
        })

        function getVoucher(button, client, percent, point, pointConsume, tenPhieu) {
            button.click(function () {
                if (point < pointConsume) {
                    swal('Không đủ điểm để đổi', '', 'error')
                } else {
                    $.ajax({
                        type: 'PUT',
                        data: JSON.stringify({
                            name: client.name,
                            avatar: client.avatar,
                            email: client.email,
                            phone: client.phone,
                            address: client.address,
                            password: client.password,
                            roleName: client.roleName,
                            gender: client.gender,
                            birthDate: client.birthDate,
                            diemTichLuy: client.diemTichLuy - pointConsume
                        }),
                        contentType: 'application/json',
                        url: url_api_client + '/' + userId,
                        success: function (data) {
                            createVoucher(tenPhieu, percent)
                            $('.myPoint').text('Điểm của tôi: ' + data.diemTichLuy)
                        },
                        error: function (err) {
                            alert(err)
                        }
                    })
                }
            })
        }

        function createVoucher(tenPhieu, phanTram) {
            $.ajax({
                type: 'POST',
                data: JSON.stringify({
                    tenPhieu: tenPhieu,
                    loaiPhieu: 'Cá nhân',
                    trangThai: 'Chưa sử dụng',
                    phanTram: phanTram,
                    ngayBatDau: null,
                    ngayKetThuc: null,
                    khachHang: {
                        userId: userId
                    }
                }),
                contentType: 'application/json',
                url: url_api_voucher,
                success: function (voucher) {
                    $('#tbl-voucher').DataTable().ajax.reload()
                    swal('Chúc mừng', 'Quý khách đã nhận được "' + voucher.tenPhieu + '" từ đổi điểm', 'success')
                },
                error: function (err) {
                    alert(err)
                }
            })
        }
    }

    //Đặt hàng event function
    $('#dat-hang-btn').click(function () {
        $('body').css('cursor', 'wait')
        let cartCheckout = []
        let storage = localStorage.getItem('cart')
        if (storage) {
            cartCheckout = JSON.parse(storage)
        }
        if (cartCheckout.length == 0) {
            swal('Ôi, chưa có món ăn nào trong giỏ cả T_T', 'Hãy chọn thật nhiều món để tích lũy nhiều điểm đổi quà nhé', 'warning')
            $('#verifyAddress').modal('hide')
            $('body').css('cursor', 'default')
        } else {
            if ($('.voucherForm span').text().split('-')[0] == '') {
                postOrder(null, cartCheckout)
            } else {
                postOrder($('.voucherForm span').text().split('-')[0], cartCheckout)
            }

            // setTimeout(function () {
            //     window.location.href = '/order'
            // }, 2000)
        }
    })
}())

//Thêm vào giỏ hàng
let cart = []
const addToCart = async (id) => {
    let storage = localStorage.getItem('cart')
    if (storage) {
        cart = JSON.parse(storage)
    }

    let product = await getProductById(id)

    if (cart.length == 0) {
        cart.push({product})
    } else {
        let item = cart.find(c => c.product.productId == id)
        if (item == undefined) {
            cart.push({product})
        } else {
            item.product.quantity += 1
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    swal('THÀNH CÔNG', 'Món "' + product.name + '" đã được thêm vào giỏ hàng', 'success')

    showCart(cart)
}

const getProductById = (id) => {
    var obj = {}

    $('body').css('cursor', 'wait')

    $.ajax({
        type: 'GET',
        async: false,
        url: url_api_product + '/' + id,
        success: function (product) {
            // Define desired object
            obj = {
                productId: product.maMH,
                name: product.tenMH,
                img: product.hinhAnh,
                price: product.donGia,
                quantity: 1
            }
            $('body').css('cursor', 'default')
        },
        error: function (err) {
            swal('Lỗi', 'Quá nhiều yêu cầu', 'error')
            $('body').css('cursor', 'default')
        }
    })

    // Return it
    return obj
}

function showCart(shoppingCart) {
    var totalCost = 0.0

    $('#list-cart').empty()
    $('#amount-in-cart').empty()
    $('#amount-in-cart-mobile').empty()

    shoppingCart.map(item => {
        totalCost += item.product.price * item.product.quantity
        $('#list-cart').append('' +
            '<li class="header-cart-item flex-w flex-t m-b-12">\
                <div class="header-cart-item-img image-product-cart" onclick="removeItem(' + item.product.productId + ')">\
                    <img src="' + item.product.img + '" alt="IMG">\
                </div>\
                <div class="header-cart-item-txt p-t-8">\
                    <span class="m-b-18 hov-cl1 trans-04">' + item.product.name + '</span>\
                    <div class="wrap-num-product flex-w">\
                        <div class="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m" \
                            onclick="downQty(' + item.product.productId + ')">\
                            <i class="fs-16 zmdi zmdi-minus"></i>\
                        </div>\
                        <input id="quantity" class="mtext-104 cl3 txt-center num-product" \
                               type="number" name="num-product1"\
                               value="' + item.product.quantity + '" onkeydown="return false">\
                        <div class="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"\
                             onclick="upQty(' + item.product.productId + ')">\
                             <i class="fs-16 zmdi zmdi-plus"></i>\
                        </div>\
                    </div>\
                    <span class="header-cart-item-info"> x ' + item.product.price.toLocaleString('it-IT', {
                style: 'currency', currency: 'VND'
            }) + '</span> \
                <div>\
            </li>\
        ')
    })

    $('#total-cost').text(totalCost.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}))

    $('#amount-in-cart').append('<i class="zmdi zmdi-shopping-cart"></i>' +
        '<span class="m-l-6">' + shoppingCart.length + '</span>')

    $('#amount-in-cart-mobile').append('<i class="zmdi zmdi-shopping-cart"></i>' +
        '<span class="m-l-6">' + shoppingCart.length + '</span>')

    if (userId != '') {
        //Thay đổi form chọn voucher
        $('.voucherForm').empty()
        $('.voucherForm').append('<button class="flex-c-m cl2 size-111 bg8 bor4 hov-btn3 p-lr-15 ' +
            'trans-04 js-show-modal-voucher">\n' +
            'CHỌN VOUCHER\n' +
            '</button>')

        //Set sự kiện mở modal voucher
        $('.js-show-modal-voucher').on('click', function () {
            $('.js-modal-voucher').addClass('show-modal1')
        })

        getAddress()

        //Áp dụng voucher
        $('table').on('click', '.chooseVoucherBtn', function () {
            let btn_id = this.id
            voucherId = btn_id.split("_")[2]

            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url_api_voucher + '/' + voucherId,
                success: function (voucher) {
                    var tongTienKhiCoVoucher = totalCost - totalCost * (voucher.phanTram / 100)
                    $('#total-cost').text(tongTienKhiCoVoucher.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND'
                    }))

                    //Thay đổi form áp dụng voucher và đóng modal
                    $('.voucherForm').empty()
                    $('.voucherForm').append('Đã áp dụng Voucher:\n' +
                        '<button id="discard-voucher" class="float-right bg-danger p-lr-15 cl0 bor1">Hủy bỏ</button>\n' +
                        '<br>\n' +
                        '<span>' + voucher.maGiamGia + '-' + voucher.tenPhieu + '</span>')
                    $('.js-modal-voucher').removeClass('show-modal1')
                    $('.js-panel-cart').addClass('show-header-cart')

                    //Thao tác áp dụng voucher sau khi hủy voucher cũ
                    //1. Tăng lại giá tổng tiền
                    //2. Thay đổi form
                    $('#discard-voucher').click(function () {
                        let renderCart = []
                        let storage = localStorage.getItem('cart')
                        if (storage) {
                            renderCart = JSON.parse(storage)
                        }
                        showCart(renderCart)
                    })
                },
                error: function (err) {
                    alert(err)
                }
            })
        })
    }
}

const removeItem = id => {
    let storage = localStorage.getItem('cart')
    if (storage) {
        cart = JSON.parse(storage)
    }
    cart = cart.filter(item => item.product.productId != id)
    localStorage.setItem('cart', JSON.stringify(cart))
    showCart(cart)
}

function upQty(id) {
    let storage = localStorage.getItem('cart')
    if (storage) {
        cart = JSON.parse(storage)
    }
    let item = cart.find(c => c.product.productId == id)
    if (item) {
        item.product.quantity += 1
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    showCart(cart)
}

function downQty(id) {
    let storage = localStorage.getItem('cart')
    if (storage) {
        cart = JSON.parse(storage)
    }
    let item = cart.find(c => c.product.productId == id)
    if (item) {
        if (item.product.quantity > 1) {
            item.product.quantity -= 1
        } else {
            removeItem(item.product.productId)
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    showCart(cart)
}

//Hiển thị dữ liệu voucher
function renderVoucher() {
    var t = $("#tbl-voucher").DataTable({
        paging: false,
        lengthChange: true,
        searching: false,
        ordering: false,
        info: false,
        autoWidth: false,
        responsive: true,
        processing: true,
        //Thay đổi ngôn ngữ của bảng
        oLanguage: {
            sEmptyTable: 'Chưa có mã giảm giá nào, mua nhiều mặt hàng để nhận mã giảm giá nhé',
            sProcessing: "Đang tải dữ liệu...",
        },
        ajax: {
            url: url_api_voucher + '/maKhachHang=' + userId,
            type: "GET",
            contentType: "application/json",
            dataSrc: function (d) {
                var is_already_show = sessionStorage.getItem('alreadyShow')
                if (is_already_show != 'alredy shown') {
                    sessionStorage.setItem('alreadyShow', 'alredy shown')
                    if (d.length != 0) {
                        swal('THÔNG BÁO', 'Bạn đang có " ' + d.length + ' " phiếu giảm giá trong kho. ' +
                            'Vui lòng chọn Menu > Tên quý khách ' +
                            'hoặc Tên quý khách > Kho voucher để sử dụng mã giảm giá đang có', 'warning')
                    } else {
                        // console.log(is_already_show)
                    }
                }

                return d
            },
        },
        //Render dữ liệu
        columns: [
            {
                class: 'text-center',
                data: 'maGiamGia'
            },
            {
                class: 'text-center',
                data: 'tenPhieu'
            },
            {
                class: 'text-center',
                data: 'phanTram',
                render: function (data, type, row, meta) {
                    return Math.floor(row.phanTram) + ' %'
                },
            },
            {
                class: 'text-center',
                data: 'maGiamGia',
                render: function (data, type, row, meta) {
                    return '<button id="btn_v_' + row.maGiamGia + '" class="btn bg-warning text-info hov-btn3 ' +
                        'chooseVoucherBtn"' +
                        '>Sử dụng</button>'
                }
            }
        ]
    })
}

//Hàm tạo hóa đơn
function postOrder(maGiamGia, shoppingCart) {
    //Convert today()
    let d = new Date()
    let month = d.getMonth() + 1
    let day = d.getDate()
    let currentDate = d.getFullYear() + '-' +
        (month < 10 ? '0' : '') + month + '-' +
        (day < 10 ? '0' : '') + day

    //AJAX Tạo hóa đơn
    $.ajax({
        type: 'POST',
        url: url_api_order,
        data: JSON.stringify({
            hinhThuc: 'Giao tận nơi',
            trangThai: 'Chờ xác nhận',
            diaChiGiaoHang: $('#dia-chi-checkout').val(),
            ngayDatHang: currentDate,
            tongTien: parseFloat($('#total-cost').text().replace(/[.VND]/g, '')),
            maGiamGia: maGiamGia,
            khachHang: {
                userId: userId
            }
        }),
        contentType: 'application/json',
        success: function (order) {
            shoppingCart.map(item => {
                postOrderDetail(item, order)
            })

            if (maGiamGia != null) {
                putVoucher(maGiamGia)
            }

            $('#verifyAddress').modal('hide')
            $('#reqSuccessful').modal('show')
            $('body').css('cursor', 'default')
        },
        error: function (err) {
            alert(err)
            $('body').css('cursor', 'default')
        }
    })
}

//Hàm tạo chi tiết hóa đơn
function postOrderDetail(cart, order) {
    $.ajax({
        type: 'POST',
        url: url_api_orderDetail,
        data: JSON.stringify({
            donGia: cart.product.price * cart.product.quantity,
            soLuongDat: cart.product.quantity,
            matHang: {
                maMH: cart.product.productId
            },
            donDatHang: {
                maDDH: order.maDDH
            }
        }),
        contentType: 'application/json',
        success: function (od) {
            removeItem(od.matHang.maMH)
        },
        error: function (err) {
            alert(err)
        }
    })
}

//Lấy địa chỉ của khách hàng
function getAddress() {
    $.ajax({
        type: 'GET',
        url: url_api_client + '/' + userId,
        success: function (client) {
            $('#dia-chi-checkout').val(client.address)
        },
        error: function (err) {
            alert('Xin lỗi. Không tìm thấy thông tin cá nhân của khách hàng!!!')
        }
    })
}

//Hàm cập nhật phiếu giảm giá
function putVoucher(maGiamGia) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: url_api_voucher + '/' + maGiamGia,
        success: function (voucher) {
            $.ajax({
                type: 'PUT',
                data: JSON.stringify({
                    tenPhieu: voucher.tenPhieu,
                    loaiPhieu: voucher.loaiPhieu,
                    trangThai: 'Đã sử dụng',
                    phanTram: voucher.phanTram,
                    ngayBatDau: voucher.ngayBatDau,
                    ngayKetThuc: voucher.ngayKetThuc,
                    khachHang: {
                        userId: voucher.khachHang.userId
                    }
                }),
                contentType: 'application/json',
                url: url_api_voucher + '/' + maGiamGia,
                success: function () {

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

