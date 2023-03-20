import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss'
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';


class HandBook extends Component {


    render() {

        return (
            <div className='section-share section-hand-book'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cam nang</span>
                        <button className='btn-section'> Xem them</button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            <div className="section-customize">
                                <div className='bg-image section-hand-book'></div>
                                <div>Tim mach</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-hand-book'></div>
                                <div>Tim mach</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-hand-book'></div>
                                <div>Tim mach</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-hand-book'></div>
                                <div>Tim mach</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-hand-book'></div>
                                <div>Tim mach</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-hand-book'></div>
                                <div>Tim mach</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-hand-book'></div>
                                <div>Tim mach</div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
