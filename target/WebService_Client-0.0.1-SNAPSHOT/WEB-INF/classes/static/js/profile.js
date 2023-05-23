var firebaseConfig = {
    apiKey: "AIzaSyBSLLi7jGwomqntt2Ky0RnmIdk_wM0YGL0",
    authDomain: "n52-47-kltn-tan-toan.firebaseapp.com",
    projectId: "n52-47-kltn-tan-toan",
    storageBucket: "n52-47-kltn-tan-toan.appspot.com",
    messagingSenderId: "601210556956",
    appId: "1:601210556956:web:dc4df16ecb002d447085d9",
    measurementId: "G-J68P4KMT72"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

;(function () {

    $('.cartFrame').hide()

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
    $("#profile-update").validate({

        //Các ràng buộc cho field
        rules: {
            email: {
                required: true,
                email: true
            },
            birthday: {
                required: true,
                dateFormat: true
            }
        },

        //Các thông báo khi bắt lỗi
        messages: {
            email: {
                required: 'Vui lòng điền email',
                email: 'Vui lòng điền đúng định dạng email. Ví dụ: user@gmail.com'
            },
            birthday: {
                required: 'Vui lòng chọn ngày sinh nhật'
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
            const ref = firebase.storage().ref()
            const file = document.querySelector("#file-upload-firebase").files[0]
            let name

            var ext = $('#file-upload-firebase').val().split('.').pop().toLowerCase()

            $('#loading-img').show()
            $('#luu-span').hide()

            $.ajax({
                type: "GET",
                url: url_api_client + '/' + userId,
                success: function (data) {
                    if ($('#file-upload-firebase').val() == "") {

                        //Không có cập nhật ảnh
                        $.ajax({
                            type: "PUT",
                            data: JSON.stringify({
                                name: $('#hovaten-u').val(),
                                avatar: data.avatar,
                                email: $('#email').val(),
                                phone: data.phone,
                                address: $('#address').val(),
                                password: data.password,
                                roleName: data.roleName,
                                gender: $('.gender:checked').val() == 1 ? true : false,
                                birthDate: $('#birthday').val(),
                                diemTichLuy: data.diemTichLuy
                            }),
                            contentType: "application/json",
                            url: url_api_client + '/' + userId,
                            success: function (data) {
                                sauKhiCapNhat()
                                swal('Thành công', "Thông tin đã được cập nhật", "success")
                            },
                            error: function (err) {
                                sauKhiCapNhat()
                                swal('Lỗi', "Thông tin không hợp lệ", "error")
                            }
                        })

                    } else {

                        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                            $('#loading-img').hide()
                            $('#luu-span').show()
                            swal('Cập nhật thất bại', "Vui lòng chọn hình ảnh có đuôi .gif .png .jpg hoặc .jpeg !!!!", "error")
                            return false
                        }

                        //convert hình ảnh upload
                        try {
                            name = +new Date() + "-" + file.name
                        } catch (e) {
                            swal('Không đúng định dạng của ảnh', "Vui lòng chọn ảnh khác", "success")
                            return false
                        }
                        const metadata = {
                            contentType: file.type
                        }
                        const task = ref.child(name).put(file, metadata)

                        //Có cập nhật ảnh
                        deleteImageToStorageById(userId);
                        task
                            .then(snapshot => snapshot.ref.getDownloadURL())
                            .then(urlImg => {
                                $.ajax({
                                    type: "PUT",
                                    data: JSON.stringify({
                                        name: $('#hovaten-u').val(),
                                        avatar: urlImg,
                                        email: $('#email').val(),
                                        phone: data.phone,
                                        address: $('#address').val(),
                                        password: data.password,
                                        roleName: data.roleName,
                                        gender: $('.gender:checked').val() == 1 ? true : false,
                                        birthDate: $('#birthday').val(),
                                        diemTichLuy: data.diemTichLuy
                                    }),
                                    contentType: "application/json",
                                    url: url_api_client + '/' + userId,
                                    success: function (data) {
                                        sauKhiCapNhat()
                                        swal('Thành công', "Thông tin đã được cập nhật. Đăng nhập lại để có trải nghiệm tốt hơn", "success")
                                    },
                                    error: function (err) {
                                        sauKhiCapNhat()
                                        swal('Lỗi', "Thông tin không hợp lệ", "error")
                                    }
                                })
                            })
                            .catch(console.error)
                    }
                },
                error: function (err) {
                    alert('Xin lỗi. Không tìm thấy thônn tin cá nhân của khách hàng!!!')
                }
            })

            function sauKhiCapNhat() {
                $('#loading-img').hide()
                $('#luu-span').show()
                cancelChinhSua(userId)
            }

        }
    })

    cancelChinhSua()

}())

//Xóa hình ảnh trên firebase storage dựa trên tìm kiếm id của đối tượng
function deleteImageToStorageById(id) {
    //Find Object by id
    $.ajax({
        type: 'GET',
        contentType: "application/json",
        url: url_api_client + '/' + id,
        success: function (data) {
            // Create a reference to the file to delete
            var desertRef = firebase.storage().refFromURL(data.avatar);

            // Delete the file
            desertRef.delete().then(function () {
            }).catch(function (error) {
            });
        },
        error: function (err) {
            alert("Error -> " + err)
        }
    })
}

function hienChinhSua() {
    $('#cancel').show()
    $('#hovaten-u').prop('readonly', false)
    $('#birthday').prop('readonly', false)
    $('#email').prop('readonly', false)
    $('#address').prop('readonly', false)
    $("#image-upload-btn").show()
    $('#male').prop('disabled', false)
    $('#female').prop('disabled', false)
    $('#form-btn-save').empty()
    $('#form-btn-save').append('\
        <button id="update-btn" class="flex-c-m stext-101 cl0 size-125 bg3 bor2 hov-btn3 p-lr-15 trans-04">\
            <img id="loading-img" src="https://www.sacombank.com.vn/_layouts/15/STB.STool.DKTV/images/loading.gif" width="25" height="25" alt="Loading">\
            <span id="luu-span">Lưu</span>\
        </button>\
        ')
    $('#loading-img').hide()
}

const ic_lv0 = 'https://github.com/N52-47-KLTN-Tan-Toan/FastFood_CLIENT/blob/master/newbie.png?raw=true'
const ic_lv1 = 'https://github.com/N52-47-KLTN-Tan-Toan/FastFood_CLIENT/blob/master/lv1.png?raw=true'
const ic_lv2 = 'https://github.com/N52-47-KLTN-Tan-Toan/FastFood_CLIENT/blob/master/lv2.png?raw=true'
const ic_lv3 = 'https://github.com/N52-47-KLTN-Tan-Toan/FastFood_CLIENT/blob/master/lv3.png?raw=true'

function cancelChinhSua() {
    $('.level-system').empty()
    $('#cancel').hide()
    $('#hovaten-u').prop('readonly', true)
    $('#address').prop('readonly', true)
    $('#birthday').prop('readonly', true)
    $('#email').prop('readonly', true)
    $("#image-upload-firebase").prop('readonly', true)
    $('#male').prop('disabled', true)
    $('#female').prop('disabled', true)
    $("#image-upload-btn").hide()
    $('#form-btn-save').empty()
    $('#loading-img').hide()

    $.ajax({
        type: 'GET',
        url: url_api_client + '/' + userId,
        success: function (data) {
            $('#hovaten-u').val(data.name)
            if (data.gender == true) {
                $('#male').prop('checked', true)
            } else {
                $('#female').prop('checked', true)
            }
            $('#birthday').val(data.birthDate)
            $('#email').val(data.email)
            $('#sdt').val(data.phone)
            $('#address').val(data.address)
            $("#image-upload-firebase").attr("src", data.avatar);

            var point = data.diemTichLuy

            switch (true) {
                case point < 500:
                    setLevel('dark', 'Người mới', ic_lv0, point + ' / 500')
                    break
                case point >= 500 && point < 1000:
                    setLevel('silver', 'Bạc', ic_lv1, point + ' / 1000')
                    break
                case point >= 1000 && point < 5000:
                    setLevel('darkgoldenrod', 'Vàng', ic_lv2, point + ' / 5000')
                    break
                case point >= 5000:
                    setLevel('darkcyan', 'Kim cương', ic_lv3, point)
                    break
            }
        },
        error: function (err) {
            alert('Xin lỗi. Không tìm thấy thông tin cá nhân của khách hàng!!!')
        }
    })
}

function setLevel(clr, level, ic, text) {
    $('.level-system').append('\
        <h6>Cấp bậc\
            <span style="color: ' + clr + '; font-weight: bold" data-toggle="tooltip" data-placement="top" ' +
        'title="Mỗi 1 cấp sẽ có phần thưởng riêng. Vui lòng liên hệ tại cửa hàng để biết thêm chi tiết" >' + level + '</span>\
                <img width="25" height="25" class="m-l-5"\
                     src="' + ic + '"\
                     alt="level"><br>\
            <span class="m-r-10" data-toggle="tooltip" data-placement="left" title="10.000 VND = 1 điểm" style="font-weight: bold">' + text + '</span>\
        </h6>\
    ')
}