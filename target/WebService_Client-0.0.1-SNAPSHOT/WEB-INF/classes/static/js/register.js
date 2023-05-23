$(document).ready(function () {
    //Khai báo các biến
    let password = $("#new-password")
    let repassword = $("#re-password")
    let hovaten = $("#ho-va-ten")
    let diachi = $("#dia-chi")
    let ngaysinh = $('#birthday')
    let phoneVerify = $('#phone')
    let otpVerify = $('#otp')

    $('.form-verify-otp').hide()

    validation()

    // Custom validation cho password
    $.validator.addMethod('valid_password',
        function (value, element) {
            var check = false
            var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
            if (re.test(value)) {
                check = true
            } else {
                check = false
            }
            return this.optional(element) || check
        }, 'Mật khẩu phải tối thiểu 8 ký tự bao gồm 1 ký tự in hoa, 1 ký tự thường và 1 ký tự số')

    // Custom validation cho phoneNumber
    $.validator.addMethod('valid_phoneNumber',
        function (value, element) {
            var check = false
            var re = /(84|0[2|3|5|7|8|9])+([0-9]{8})\b/g
            if (re.test(value)) {
                check = true
            } else {
                check = false
            }
            return this.optional(element) || check
        }, 'Số điện thoại gồm 0(3|5|7|8|9) đầu và 8 số sau nó')

    // Method validation for datepicker
    $.validator.addMethod('dateFormat',
        function (value, element) {
            var check = false
            var re = /^\d{4}\-\d{1,2}\-\d{1,2}$/
            if (re.test(value)) {
                var adata = value.split('-')
                var dd = parseInt(adata[2], 10)
                var mm = parseInt(adata[1], 10)
                var yyyy = parseInt(adata[0], 10)
                var xdata = new Date(yyyy, mm - 1, dd)
                if ((xdata.getFullYear() === yyyy) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === dd)) {
                    check = true
                } else {
                    check = false
                }
            } else {
                check = false
            }
            return this.optional(element) || check
        }, 'Vui lòng chọn chính xác ngày sinh theo định dạng (ngày / tháng / năm)')

    // Cập nhật thông tin khách hàng
    $('#form-register').validate({

        //Các ràng buộc cho field
        rules: {
            'ho-va-ten': {
                required: true
            },
            'dia-chi': {
                required: true
            },
            gender: {
                required: true,
            },
            birthday: {
                required: true,
                dateFormat: true
            },
            'new-password': {
                required: true,
                valid_password: true
            },
            're-password': {
                equalTo: '#new-password',
            }
        },

        //Các thông báo khi bắt lỗi
        messages: {
            'ho-va-ten': {
                required: 'Vui lòng nhập đầy đủ họ và tên'
            },
            'dia-chi': {
                required: 'Vui lòng điền đúng địa chỉ'
            },
            gender: {
                required: 'Vui lòng chọn giới tính và ngày sinh',
            },
            birthday: {
                required: ''
            },
            'new-password': {
                required: 'Vui lòng nhập mật khẩu'
            },
            're-password': {
                equalTo: "Mật khẩu không khớp",
            }
        },

        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback')
            element.closest('.form-group').append(error)
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid')
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid')
        },

        submitHandler: function () {
            postClient()
        }
    })

    // Gửi OTP xác nhận để Cập nhật số điện thoại và địa chỉ khách hàng
    $('#form-reqUpdateProfile').validate({

        //Các ràng buộc cho field
        rules: {
            addressProfile: {
                required: true
            },
            phoneNumberProfile: {
                required: true,
                valid_phoneNumber: true,
                remote: {
                    url: url_api_client + '/checkExistsByPhone',
                    type: 'POST',
                    data: {
                        p: function () {
                            return $("#phoneNumberProfile").val()
                        }
                    }
                }
            },
        },

        //Các thông báo khi bắt lỗi
        messages: {
            addressProfile: {
                required: 'Vui lòng nhập địa chỉ của quý khách'
            },
            phoneNumberProfile: {
                required: 'Vui lòng nhập số điện thoại của quý khách',
                remote: 'Số điện thoại này đã được đăng ký'
            },
        },

        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback')
            element.closest('.form-group').append(error)
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid')
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid')
        },

        submitHandler: function () {
            $.ajax({
                type: 'GET',
                url: url_api_client + '/phone=' + $('#phoneNumberProfile').val(),
                success: function (client) {
                    if (client.phone != $('#phoneNumberProfile').val()) {
                        sendOTP($('#phoneNumberProfile'))
                        setTimeout(function () {
                            $.ajax({
                                url: '/login/sendOTP',
                                method: 'POST',
                                data: {
                                    phone: '+84' + $('#phoneNumberProfile').val().substring(1),
                                },
                                success: function () {},
                                error: function () {

                                }
                            })
                        }, 2000)
                    } else {
                        swal('Thất bại', 'Số điện thoại này đã được đăng ký. Vui lòng dùng số điện thoại khác', 'error')
                    }
                },
                error: function (err) {
                    alert('Quá nhiều yêu cầu. Vui lòng thử lại vài giây lát')
                }
            })
        }
    })

    //Gửi mã OTP vào số điện thoại
    $('#send-otp, #resend-otp').click(function () {
        if (!phoneVerify.val().match(/(84|0[2|3|5|7|8|9])+([0-9]{8})\b/g)) {
            return false
        }

        $.ajax({
            type: "GET",
            url: url_api_client + "/phone=" + phoneVerify.val(),
            success: function (data) {
                if (data.phone != phoneVerify.val()) {
                    $('.form-verify-otp').show()
                    $('.form-sent-otp').hide()
                    sendOTP(phoneVerify)
                    setTimeout(function () {
                        $.ajax({
                            url: '/login/sendOTP',
                            method: 'POST',
                            data: {
                                phone: '+84' + phoneVerify.val().substring(1),
                            },
                            success: function () {},
                            error: function () {

                            }
                        })
                    }, 2000)
                } else {
                    alerUsing($("#regex-phone"), 'Số điện thoại này đã được đăng ký', false)
                }
            },
            error: function (err) {
                alerUsing($("#regex-phone"), 'Quá nhiều yêu cầu. Vui lòng thử lại vài giây lát', false)
            }
        })
    })

    $('.btnUpdatePhoneAddress').click(function () {
        if ($('#otpUpdateProfile').val().length != 6) {
            alerUsing($('#regexUpdateProfile'), 'Mã OTP phải gồm 6 ký tự số', false)
            return false
        }

        $.ajax({
            url: '/login/verifyOTP',
            method: 'POST',
            data: {
                phone: '+84' + $('#phoneNumberProfile').val().substring(1),
                otp: $('#otpUpdateProfile').val()
            },
            success: function () {
                putClient()
            },
            error: function () { //error function
                alerUsing($('#regexUpdateProfile'), 'Mã OTP không chính xác. Vui lòng kiểm tra lại điện thoại',
                    false)
            }
        })
    })

    //Xác thực OTP
    $('#verify-otp').click(function () {
        if (otpVerify.val().length != 6) {
            alerUsing($('#regex-phone-verify'), 'Mã OTP phải gồm 6 ký tự số', false)
            return false
        }

        $.ajax({
            url: '/login/verifyOTP',
            method: 'POST',
            data: {
                phone: '+84' + phoneVerify.val().substring(1),
                otp: otpVerify.val()
            },
            success: function (data) {
                $('#verifyOTPModal').modal('hide')
                $('.js-modal1').addClass('show-modal1')
                $('.form-verify-otp').hide()
                $('.form-sent-otp').show()
            },
            error: function (err) { //error function
                alerUsing($('#regex-phone-verify'), 'Mã OTP không chính xác. Vui lòng kiểm tra lại điện thoại',
                    false)
            }
        })
    })

    //Hàm đăng ký tài khoản mới
    function postClient() {
        var bcrypt = dcodeIO.bcrypt

        /** One way, can't decrypt but can compare */
        var salt = bcrypt.genSaltSync(10)

        bcrypt.hash(repassword.val(), salt, (err, res) => {
            $.ajax({
                type: 'POST',
                url: url_api_client,
                data: JSON.stringify({
                    name: hovaten.val(),
                    avatar: 'https://raw.githubusercontent.com/N52-47-KLTN-Tan-Toan/FastFood_CLIENT/master/avatar_default.png',
                    phone: phoneVerify.val(),
                    address: diachi.val(),
                    gender: $('.gender:checked').val() == 1 ? true : false,
                    birthDate: ngaysinh.val(),
                    password: res,
                    roleName: 'ROLE_CLIENT',
                    diemTichLuy: 0
                }),
                contentType: 'application/json',
                success: function (client) {
                    postVoucher(client.userId)

                    $('.js-modal1').removeClass('show-modal1');
                    $('#phone-login').val(phoneVerify.val())
                    $('#password-login').val(repassword.val())

                    phoneVerify.val('')
                    hovaten.val('')
                    diachi.val('')
                    ngaysinh.val('')
                    password.val('')
                    $('#chk-show-hide-pass').prop('checked', false)
                    $('#male').prop('checked', false)
                    $('#female').prop('checked', false)

                    swal('Tạo tài khoản thành công', "Bạn được tặng 1 voucher dành cho thành viên mới", "success")

                    $.post('/j_spring_security_check', {username: client.phone, password: repassword.val()},
                        function () {
                            setTimeout(function () {
                                location.reload()
                            }, 3000)
                        })
                },
                error: function (err) {
                    swal('Thất bại', "Một số thông tin không hợp lệ. Vui lòng kiểm tra lại", "error")
                }
            })
        })
    }

    // Hàm cập nhật khách hàng mới
    function putClient() {
        $.ajax({
            type: 'GET',
            url: url_api_client + '/' + userId,
            success: function (client) {
                $.ajax({
                    type: 'PUT',
                    data: JSON.stringify({
                        name: client.name,
                        avatar: client.avatar,
                        email: client.email,
                        phone: $('#phoneNumberProfile').val(),
                        address: $('#addressProfile').val(),
                        password: client.password,
                        roleName: client.roleName,
                        gender: client.gender,
                        birthDate: client.birthDate,
                        diemTichLuy: client.diemTichLuy
                    }),
                    contentType: 'application/json',
                    url: url_api_client + '/' + userId,
                    success: function (c) {
                        postVoucher(c.userId)
                        swal('Chúc mừng', 'Bạn đã nhận được 1 Voucher từ chương trình khuyến mãi khách hàng mới. ' +
                            'Vui lòng đăng nhập lại để nhận thưởng', 'success')
                        setTimeout(function () {
                            window.location.href = '/logout'
                        }, 3000)
                    },
                    error: function (err) {
                        alert('Quá nhiều yêu cầu vui lòng thử lại trong giây lát')
                    }
                })
            },
            error: function (err) {
                alert('Xin lỗi. Không tìm thấy thông tin cá nhân của khách hàng!!!')
            }
        })
    }

    //Hàm tạo voucher cho khách hàng mới
    function postVoucher(userId) {
        $.ajax({
            type: 'POST',
            data: JSON.stringify({
                tenPhieu: 'Ưu đãi thành viên mới',
                loaiPhieu: 'Cá nhân',
                trangThai: 'Chưa sử dụng',
                phanTram: 10.0,
                ngayBatDau: null,
                ngayKetThuc: null,
                khachHang: {
                    userId: userId
                }
            }),
            contentType: 'application/json',
            url: url_api_voucher,
            success: function () {
            },
            error: function (err) {
                alert(err)
            }
        })
    }

    //Hiện ẩn mật khẩu
    $('#chk-show-hide-pass').click(function () {
        showHidePassword($('#new-password'), $('#new-password'), $('#re-password'))
    })

    //Tự động bắt lỗi khi nhập liệu
    function validation() {
        phoneVerify.keyup(function () {
            if (!phoneVerify.val().match(/(84|0[2|3|5|7|8|9])+([0-9]{8})\b/g)) {
                alerUsing($("#regex-phone"), 'Số điện thoại gồm 0(3|5|7|8|9) đầu và 8 số sau nó', true)
                return false
            } else {
                alerUsing($("#regex-phone"), '', true)
                return true
            }
        })

    }
})

//Hàm Gửi mã OTP
function sendOTP(phoneVerify) {
    $.ajax({
        url: '/login/sendOTP',
        method: 'POST',
        data: {
            phone: '+84' + phoneVerify.val().substring(1),
        },
        success: function (res) {
            swal('Thành công', res, 'success')
        },
        error: function (err) {
            alert('Quá nhiều yêu cầu .Vui lòng thử lại trong giây lát')
        }
    })
}