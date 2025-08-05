import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Input, Title } from '../../atoms';
import userIcon from '../../../assets/svg/user.svg';
import passwordIcon from '../../../assets/svg/password.svg';
import axios from "axios";
import { accountService } from '../../../_services/account.service';

const Form = ({ className = '' }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        handleLogin();
    };

    const handleLogin = () => {
        setIsLoading(true);
        setError(null);

        axios.post('http://localhost:8000/api/login_check', 
            { username: email, password: password },
            { headers: { 'Content-Type': 'application/json' } }
        )
        .then(response => {
            const token = response.data.token;
            accountService.saveToken(token);
            accountService.saveRefreshToken(response.data.refresh_token);
            
            // Utiliser le token de la réponse directement
            axios.get(`http://localhost:8000/api/user/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(userResponse => {
                const userId = userResponse.data.id;
                console.log("ID de l'utilisateur:", userId);
                // Rediriger vers la page d'accueil avec l'ID utilisateur
                navigate(`/home/${userId}`);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'ID de l'utilisateur:", error);
                if (error.response) {
                    setError("Impossible de récupérer les données utilisateur");
                }
            });
        })
        .catch(error => {
            console.error("Erreur de connexion:", error);
            if (error.response) {
                setError("Identifiants incorrects");
                console.error("Données d'erreur:", error.response.data);
                console.error("Statut:", error.response.status);
            } else {
                setError("Impossible de contacter le serveur");
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

     return (
        <form onSubmit={handleSubmit} className={`w-full md:w-1/2 h-full flex flex-col justify-center items-center p-6 bg-background ${className}`}>
            <Title className="text-primary-500 text-2xl md:text-4xl mb-6">Se Connecter</Title>
            <div className="w-full max-w-sm space-y-4">
                <Input 
                    type="text" 
                    icon={userIcon} 
                    placeholder="Email" 
                    className="w-full px-7 py-2 border-b-2 border-primary-500 text-primary-500 font-poppins text-base md:text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <Input 
                    type="password" 
                    icon={passwordIcon} 
                    placeholder="Mot de passe" 
                    className="w-full px-7 py-2 border-b-2 border-primary-500 text-primary-500 font-poppins text-base md:text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}  
                />
                <Button 
                    type="submit"
                    className="w-full px-5 py-2 bg-primary-500 text-white font-poppins text-base md:text-subtitle rounded-full hover:bg-primary-600 transition duration-300" 
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </form>
    );
};

// Validation des props
Form.propTypes = {
    className: PropTypes.string, // Permet d'ajouter des styles supplémentaires
};

export default Form;