import { SyntheticEvent, useState } from 'react';
import { Portal } from 'react-portal';

export default function Donate(props: {}) {
    const items = ["Coffee 🍵","Beer 🍺","Cake 🍰","Peach 🍑","Eggplant 🍆","Pizza 🍕"];
    const [item,setItem] = useState(items[Math.floor(Math.random() * (items.length))]);
    const [modalOpen,setModalOpen] = useState(false);

    const _handleClick = (e:SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setModalOpen(true);
    }
    
    const _handleCloseModal = (e:SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setModalOpen(false);
    }

    return (
        <>
        <a href="#" title="" target="_self" className="donate-btn" onClick={_handleClick}>Donate Me A {item}!</a>
        {modalOpen ? 
            <Portal>
                <div className="modal">
                    <div className="modal-backdrop" onClick={_handleCloseModal}></div>
                    <div className="modal-content">
                        <h1>🪙 Donation</h1>
                        <p>Developing Kite takes quite some time from my daily life so I'd really appreciate any help if you'd like to support a passionate developer :) </p>
                        <div className="donation-uri">
                            <strong>Etherium: </strong>
                            <span>0x50Eb77506a540B9e7242F8601075bDCa41f55B09</span>
                        </div>
                        <div className="donation-uri">
                            <strong>Tether (TRC20): </strong>
                            <span>TB386wd3Q4na6Maazhxs6LQw8fB99GBiY1</span>
                        </div>
                        <div className="donation-uri">
                            <strong>Dogecoin: </strong>
                            <span>DQko9jWCUQLQRm7adwrZ38g8JaCFwsvycJ</span>
                        </div>
                    </div>
                </div>
            </Portal>
        : ''}
        </>
    );
}