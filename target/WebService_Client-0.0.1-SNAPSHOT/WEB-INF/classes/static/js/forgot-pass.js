$(document).ready(function () {
    var newpass = $('#new-password-fp')
    var repass = $('#re-password-fp')

    let phoneVerify = $('#phone-fp')
    let otpVerify = $('#otp-fp')

    $('.form-verify-otp-fp').hide()

    validation()

    //Gửi mã OTP vào số điện thoại
    $('#send-otp-fp, #resend-otp-fp').click(function () {
        $.ajax({
            type: 'GET',
            url: url_api_client + '/phone=' + phoneVerify.val(),
            success: function (data) {
                if (data.phone == phoneVerify.val()) {
                    $('.form-verify-otp-fp').show()
                    $('.form-send-otp-fp').hide()
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
                    alerUsing($("#regex-phone-fp"), 'Số điện thoại này chưa được đăng ký. Vui lòng đăng ký mới', false)
                }
            },
            error: function (err) {
                alerUsing($("#regex-phone-fp"), 'Quá nhiều yêu cầu. Vui lòng thử lại vài giây lát', false)
            }
        })
    })

    //Xác thực OTP
    $('#verify-otp-fp').click(function () {
        if ($('#otpUpdateProfile').val().length != 6) {
            alerUsing($('#regex-phone-verify-fp'), 'Mã OTP phải gồm 6 ký tự số', false)
            return false
        }
        $.ajax({
            url: '/login/verifyOTP',
            method: 'POST',
            data: {
                phone: '+84' + phoneVerify.val().substring(1),
                otp: otpVerify.val()
            },
            success: function () {
                $('#forgotPasswordModal').modal('hide')
                $('#resetPassword').modal('show')
            },
            error: function () { //error function
                alerUsing($('#regex-phone-verify'), 'Mã OTP không chính xác. Vui lòng kiểm tra lại điện thoại', false)
            }
        })
    })

    $('#fp-btn').click(function () {

        var bcrypt = dcodeIO.bcrypt;

        /** One way, can't decrypt but can compare */
        var salt = bcrypt.genSaltSync(10);

        if (newpass.val() != repass.val()) {
            alerUsing($('#regex-repassword-fp'), 'Mật khẩu không khớp', false)
            return false
        }

        if(!newpass.val().match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)){
            alerUsing($("#regex-new-password"), 'Mật khẩu phải tối thiểu 8 ký tự bao gồm 1 ký tự in hoa, 1 ký tự thường và 1 ký tự số', false)
            return false
        }

        bcrypt.hash(repass.val(), salt, (err, res) => {
            $.ajax({
                type: "GET",
                url: url_api_client + "/phone=" + phoneVerify.val(),
                success: function (data) {
                    $.ajax({
                        type: "PUT",
                        data: JSON.stringify({
                            name: data.name,
                            avatar: data.avatar,
                            email: data.email,
                            phone: data.phone,
                            address: data.address,
                            password: res,
                            roleName: data.roleName,
                            gender: data.gender,
                            birthDate: data.birthDate
                        }),
                        contentType: "application/json",
                        url: url_api_client + '/' + data.userId,
                        success: function (data) {
                            $('.js-modal-new-password').removeClass('show-modal1');
                            swal('Thiết lập mật khẩu mới thành công', "Quay lại đăng nhập thôi nào", "success")
                        },
                        error: function (err) {
                            swal('Lỗi', "Thông tin không hợp lệ", "error")
                        }
                    });
                },
                error: function (err) {
                    alert('Không tìm thấy khách hàng có số điện thoại ', phoneVerify.val())
                }
            })
        })
    })

    //Hiện ẩn mật khẩu
    $('#chk-show-hide-pass-fp').click(function () {
        showHidePassword($('#new-password-fp'), $('#new-password-fp'), $('#re-password-fp'))
    })

    //Tự động bắt lỗi khi nhập liệu
    function validation() {
        newpass.keyup(function () {
            if (!newpass.val().match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
                alerUsing($("#regex-password"), 'Mật khẩu phải tối thiểu 8 ký tự bao gồm 1 ký tự in hoa, 1 ký tự thương và 1 ký tự số', true)
                return false
            } else {
                alerUsing($("#regex-password"), '', true)
                return true
            }
        })

        $('#new-password-fp, #re-password-fp').keyup(function () {
            if (repass.val() != newpass.val()) {
                alerUsing($("#regex-repassword"), 'Mật khẩu nhập lại chưa khớp với mật khẩu trên', true)
                return false
            } else {
                alerUsing($("#regex-repassword"), '', true)
                return true
            }
        })
    }
})