import { useNavigate } from 'react-router-dom';
import BackIcon from '../assets/back.svg';

export default function BackButton(props: {}) {
    const navigate = useNavigate();

    return (
        <button type="button" title="Go Back" onClick={() => navigate(-1)} className="back-button">
            <img src={BackIcon} />
            <strong>Back</strong>
        </button>
    );
}