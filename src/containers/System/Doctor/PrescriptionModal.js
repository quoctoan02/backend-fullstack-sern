import React, { Component } from 'react';
import { connect } from 'react-redux';
import './PrescriptionModal.scss';
import { LANGUAGES, CommonUtils } from '../../../utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import moment from 'moment';
class PrescriptionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imageBase64: '',
        };
    }

    async componentDidMount() {
        if (this.props.email) {
            this.setState({ email: this.props.dataModal.email });
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.dataModal.email !== prevProps.dataModal.email) {
            this.setState({ email: this.props.dataModal.email });
        }
        if (this.props.language !== prevProps.language) {
        }
    }
    handleChangeEmail = (event) => {
        this.setState({ email: event.target.value });
    };

    handleChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };

    handleSendPrescription = async () => {
        this.props.closeModal();

        let data = {
            email: this.state.email,
            imageBase64: this.state.imageBase64,
            bookingId: this.props.dataModal.bookingId,
            patientName: this.props.dataModal.patientName,
            language: this.props.language,
            timeBooking: this.props.dataModal.timeBooking,
        };
        this.props.sendPrescription(data);
    };
    render() {
        let { closeModal, isOpenModal, dataModal, sendPrescription } = this.props;
        console.log(this.props);
        return (
            <Modal
                size="lg"
                isOpen={isOpenModal}
                className={'prescription-modal-container'}
                centered={true}
            >
                <ModalHeader toggle={closeModal}>Gửi hoá đơn khám bệnh</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={this.state.email}
                                className="form-control"
                                onChange={(event) => this.handleChangeEmail(event)}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Chon don thuoc</label>
                            <input
                                type="file"
                                className="form-control-file"
                                onChange={(event) => this.handleChangeImage(event)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => this.handleSendPrescription()}
                    >
                        Send
                    </Button>{' '}
                    <Button
                        color="secondary"
                        onClick={closeModal}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionModal);
