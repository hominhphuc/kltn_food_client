$(document).ready(function () {

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

    // Method thay đổi mật khẩu
    $("#change-password").validate({

        //Các ràng buộc cho field
        rules: {
            'old-password': {
                required: true,
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
            'old-password': {
                required: 'Vui lòng nhập mật khẩu cũ'
            },
            'new-password': {
                required: 'Vui lòng nhập mật khẩu mới'
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

        submitHandler: function (form) {

            var repass = $('#re-password').val()
            var oldpass = $('#old-password').val()

            $.ajax({
                type: "GET",
                url: url_api_client + '/' + userId,
                success: function (data) {
                    var bcrypt = dcodeIO.bcrypt

                    /** One way, can't decrypt but can compare */
                    var salt = bcrypt.genSaltSync(10)

                    /** Compare stored password with new encrypted password */
                    bcrypt.compare(oldpass, data.password, (err, res) => {
                        // res == true or res == false
                        if (res == false) {
                            alerUsing($("#regex-old-password"), 'Mật khẩu cũ không chính xác', false)
                        } else {
                            /** Encrypt password */
                            bcrypt.hash(repass, salt, (err, res) => {
                                $.ajax({
                                    type: "PUT",
                                    data: JSON.stringify({
                                        name: data.name,
                                        avatar: data.avatar,
                                        email: data.email,
                                        phone: data.phone,
                                        address: data.address,
                                        username: data.username,
                                        password: res,
                                        roleName: data.roleName,
                                        gender: data.gender,
                                        birthDate: data.birthDate
                                    }),
                                    contentType: "application/json",
                                    url: url_api_client + '/' + userId,
                                    success: function (data) {
                                        $('.js-modal-change-password').removeClass('show-modal1');
                                        swal('Thành công', "Mật khẩu đã thay đổi", "success")
                                        setTimeout(function () {
                                            window.location.href = '/logout'
                                        }, 2000);
                                    },
                                    error: function (err) {
                                        swal('Lỗi', "Thông tin không hợp lệ", "error")
                                    }
                                });
                            });
                        }
                    })
                },
                error: function (err) {
                    alert('Xin lỗi. Không tìm thấy thônn tin cá nhân của khách hàng!!!')
                }
            })
        }
    })

    //Hàm thay đổi mật khẩu
    function changePassword() {
        $('#change-password').submit(function (evt) {
            evt.preventDefault();

            var oldpass = $('#old-password').val()
            var newpass = $('#new-password').val()
            var repass = $('#re-password').val()

            // Bắt valid trả về false khi không khớp
            if (repass != newpass) {
                alerUsing($("#regex-repassword"), 'Mật khẩu nhập lại chưa khớp với mật khẩu trên', false)
                return false
            }

            if (!newpass.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
                alerUsing($("#regex-new-password"), 'Mật khẩu phải tối thiểu 8 ký tự bao gồm 1 ký tự in hoa, 1 ký tự thương và 1 ký tự số', false)
                return false
            }


        })
    }

    //Hiện ẩn mật khẩu
    $('#chk-show-hide-pass').click(function () {
        showHidePassword($('#old-password'), $('#new-password'), $('#re-password'))
    })
})