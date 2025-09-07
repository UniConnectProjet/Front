import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Image } from '../../atoms';
import Icon from '../../../assets/svg/uni-without.svg';
import accueilIcon from '../../../assets/svg/home.svg';
import timetableIcon from '../../../assets/svg/time.svg';
import chatIcon from '../../../assets/svg/chat.svg';
import missingIcon from '../../../assets/svg/missing.svg';
import logoutIcon from '../../../assets/svg/logout.svg';
import chatService from '../../../_services/chat.service';

const Menu = ({ className = '' }) => {
    const [activeButton, setActiveButton] = useState('accueil');
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    // Récupérer le nombre de messages non lus
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const conversations = await chatService.getConversations();
                const totalUnread = conversations.reduce((total, conversation) => {
                    return total + (conversation.unreadCount || 0);
                }, 0);
                setUnreadCount(totalUnread);
            } catch (error) {
                // Erreur silencieuse - pas de log console
            }
        };

        fetchUnreadCount();
        
        // Polling moins fréquent pour réduire la charge serveur
        const interval = setInterval(fetchUnreadCount, 15000); // 15 secondes au lieu de 3
        
        // Polling plus fréquent seulement quand on est sur la page chat
        const chatInterval = setInterval(() => {
          if (window.location.pathname === '/chat') {
            fetchUnreadCount();
          }
        }, 5000); // 5 secondes au lieu de 2
        
        // Polling global pour toutes les pages (beaucoup moins fréquent)
        const globalInterval = setInterval(fetchUnreadCount, 30000); // 30 secondes au lieu de 10
        
        // Écouter les événements de mise à jour des messages
        const handleMessageUpdate = () => {
            fetchUnreadCount();
        };
        
        window.addEventListener('messageRead', handleMessageUpdate);
        window.addEventListener('newMessage', handleMessageUpdate);
        
        return () => {
            clearInterval(interval);
            clearInterval(chatInterval);
            clearInterval(globalInterval);
            window.removeEventListener('messageRead', handleMessageUpdate);
            window.removeEventListener('newMessage', handleMessageUpdate);
        };
    }, []);

    const handleButtonClick = (button) => {
        setActiveButton(button);
        switch (button) {
            case 'accueil':
                navigate('/home');
                break;
            case 'timetable':
                navigate('/planning');
                break;
            case 'chat':
                navigate('/chat');
                break;
            case 'missing':
                navigate('/absences');
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
                <Button className={`menu-button ${activeButton === 'chat' ? 'active' : ''} p-4 relative`} onClick={() => handleButtonClick('chat')}>
                    <img src={chatIcon} alt="Chat" className="w-8 h-8" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold z-10">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
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