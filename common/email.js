const nodemailer = require('nodemailer');

module.exports = function(toUser, subject, text) {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "DH51805679@student.stu.edu.vn",
            pass: "Covid*1009@"
        }
    });

    message = {
        from: "admin@delivery.com",
        to: toUser,
        subject: "Thông báo đến từ Admin Website dịch vụ giao hàng",
        html: text
    }

    transporter.sendMail(message, function(err, info) {
        if (err) {
            console.log(err)
        } else {}
    })

}