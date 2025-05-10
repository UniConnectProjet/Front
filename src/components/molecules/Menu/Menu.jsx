import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Image } from '../../atoms';
import Icon from '../../../assets/svg/uni-without.svg';
import accueilIcon from '../../../assets/svg/home.svg';
import timetableIcon from '../../../assets/svg/time.svg';
import chatIcon from '../../../assets/svg/chat.svg';
import missingIcon from '../../../assets/svg/missing.svg';
import logoutIcon from '../../../assets/svg/logout.svg';

const Menu = ({ className = '' }) => {
    const [activeButton, setActiveButton] = useState('accueil');
    const navigate = useNavigate();

    const handleButtonClick = (button) => {
        setActiveButton(button);
        switch (button) {
            case 'accueil':
                navigate('/home');
                break;
            case 'timetable':
                navigate('/timetable');
                break;
            case 'chat':
                navigate('/chat');
                break;
            case 'missing':
                navigate('/missing');
                break;
            case 'logout':
                navigate('/');
                break;
            default:
                break;
        }
    };

    return (
        <div className={`flex flex-col ${className} space-between items-center justify-between h-full shadow-lg rounded-lg`}>
            <Image src={Icon} alt="Logo" />

            <div className="mb-4">
                <Button className={`menu-button ${activeButton === 'accueil' ? 'active' : ''} p-4`} onClick={() => handleButtonClick('accueil')}>
                    <img src={accueilIcon} alt="Accueil" className="w-8 h-8" />
                </Button>
                <Button className={`menu-button ${activeButton === 'timetable' ? 'active' : ''} p-4`} onClick={() => handleButtonClick('timetable')}>
                    <img src={timetableIcon} alt="Emploi du temps" className="w-8 h-8" />
                </Button>
                <Button className={`menu-button ${activeButton === 'chat' ? 'active' : ''} p-4`} onClick={() => handleButtonClick('chat')}>
                    <img src={chatIcon} alt="Chat" className="w-8 h-8" />
                </Button>
                <Button className={`menu-button ${activeButton === 'missing' ? 'active' : ''} p-4`} onClick={() => handleButtonClick('missing')}>
                    <img src={missingIcon} alt="Absences" className="w-8 h-8" />
                </Button>
            </div>

            <Button className={`menu-button ${activeButton === 'logout' ? 'active' : ''} p-4`} onClick={() => handleButtonClick('logout')}>
                <img src={logoutIcon} alt="Déconnexion" className="w-8 h-8" />
            </Button>
        </div>
    );
}

Menu.propTypes = {
    className: PropTypes.string,
};

export default Menu;