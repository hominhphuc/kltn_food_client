const url_api_product = 'https://ffapi.azurewebsites.net/api/v1/mat-hang'
const url_api_client = 'https://ffapi.azurewebsites.net/api/v1/khach-hang'
const url_api_order = 'https://ffapi.azurewebsites.net/api/v1/don-dat-hang'
const url_api_orderDetail = 'https://ffapi.azurewebsites.net/api/v1/chi-tiet-don-dat-hang'
const url_api_voucher = 'https://ffapi.azurewebsites.net/api/v1/voucher'

let userId = $('#userId').text()

//Hiển thị thông báo
// function thongBaoSpan(element, message, clr) {
//     element.empty()
//     element.append('' +
//         '<span style="font-size: small; color: ' + clr + ';">\
//             <i>(*) ' + message + '</i>\
//                 </span>\
//             ')
// }

function alerUsing(element, text, condition) {
    if (condition) {
        element.fadeIn(400)
        element.text(text)
    } else {
        element.fadeIn(400)
        element.text(text)
        setTimeout(function () {
            element.fadeOut()
        }, 2000)
    }
}

//Hiện ẩn mật khẩu
function showHidePassword(a, b, c) {
    var x = a
    var y = b
    var z = c

    if (x.attr('type') === "password" && y.attr('type') === "password" && z.attr('type') === "password") {
        x.attr('type', 'text')
        y.attr('type', 'text')
        z.attr('type', 'text')
    } else {
        x.attr('type', 'password')
        y.attr('type', 'password')
        z.attr('type', 'password')
    }
}

$(document).ready(function () {

    var current = location.pathname;
    $('#nav-header li a').each(function () {
        var $this = $(this);
        // if the current path is like this link, make it active
        if (current === "/") {
            $("#homePage").css("color", "red");
            return false;
        }
        if ($this.attr('href').indexOf(current) !== -1) {
            $this.css("color", "red");
        }
    })

    $('[data-toggle="popover"]').popover()
    $('[data-toggle="tooltip"]').tooltip({boundary: 'window'})

})

$(".js-select2").each(function () {
    $(this).select2({
        minimumResultsForSearch: 20,
        dropdownParent: $(this).next('.dropDownSelect2')
    })
})