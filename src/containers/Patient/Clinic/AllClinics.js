import React, { Component } from 'react';
import { connect } from 'react-redux';
import './AllClinics.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { getAllClinic } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import { withRouter } from 'react-router';
class AllClinics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allClinics: [],
        };
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                allClinics: res.data,
            });
        }
    }

    handleViewDetailClinic = (clinic) => {
        this.props.history.push(`/detail-clinic/${clinic.id}`);
    };

    render() {
        let { allClinics } = this.state;

        return (
            <div className="all-section-container">
                <HomeHeader isShowBanner={false} />
                <div className="all-section-header container-md">Cơ sở y tế nổi bật</div>
                <div className="all-section-body container-md">
                    {allClinics &&
                        allClinics.length > 0 &&
                        allClinics.map((item, index) => {
                            return (
                                <div
                                    onClick={() => this.handleViewDetailClinic(item)}
                                    className="each-section "
                                    key={index}
                                >
                                    <div
                                        className="avatar-section avatar-clinic"
                                        style={{ backgroundImage: `url(${item.avatar})` }}
                                    ></div>
                                    <div
                                        className="basic-title"
                                        style={{
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllClinics));
