import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class About extends Component {
    render() {
        return (
            <div className="section-share section-about">
                <div className="section-about-header">Truyền thông</div>
                <div className="section-about-content">
                    <div className="content-left">
                        <iframe
                            width="100%"
                            height="500"
                            src="https://www.youtube.com/embed/1unEzG8NMs8"
                            title="Quanglinhvlogs || Thu Hoạch Hành Vụ Đầu Tiên Của Quang Linh Farm Với Số Lượng Siêu Khủng"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="content-right">
                        <p>
                            ► Mua Áo Của Team Châu Phi : https://shopee.vn/quanglinhstore ► Mua Nước
                            Hoa Tại: https://www.facebook.com/quanglinhstore Liên Hệ Đóng Góp Ý Kiến
                            Cho Nhóm ► Zalo Angola : +244 949028888 ( Phạm Quang Linh ) ► Zalo Việt
                            Nam : +84 986881994 ( Trần Chí Tâm ) ► Mail: pqlmmo@gmail.com ► FanPage
                            Chính Chủ: https://www.facebook.com/QuangLinhVlogss ► FaceBook Cá Nhân :
                            https://www.facebook.com/PhamQuangLin... ► Cảm ơn các bạn đã xem clip
                            của tôi. Hãy nhấn đăng ký để ủng hộ mình nhé ! ► Kênh hứa hẹn sẽ tạo ra
                            những Video hay nhất cho các bạn xem ! Cảm ơn các bạn đã xem. Tôi yêu
                            các bạn rất nhiều ! #TeamChâuphi #quanglinhvlogs #lindo ✪ Copyright ©
                            #Quanglinhvlogs
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
