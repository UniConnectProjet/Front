// src/components/molecules/Form/Form.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Input, Title } from '../../atoms';
import userIcon from '../../../assets/svg/user.svg';
import passwordIcon from '../../../assets/svg/password.svg';
import axios from 'axios';
import { accountService } from '../../../_services/account.service';

const Form = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    handleLogin();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const auth = await axios.post(
        'http://localhost:8000/api/login_check',
        { username: email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = auth.data.token;
      accountService.saveToken(token);
      accountService.saveRefreshToken?.(auth.data.refresh_token);
      try {
        const userRes = await axios.get(`http://localhost:8000/api/user/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = userRes?.data?.id;
        if (userId) accountService.saveUserId(userId);
      } catch (e) {
        console.warn('Récup userId échouée', e?.response?.status, e?.response?.data);
      }
      try {
        const sres = await axios.get('http://localhost:8000/api/me/student', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const studentId = sres?.data?.id;
        if (studentId) accountService.saveStudentId(studentId);
      } catch (e) {
        // 404 = pas d’étudiant lié → pas bloquant pour accéder à /home
        console.warn('Récup studentId échouée', e?.response?.status, e?.response?.data);
      }

      navigate('/home');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.response ? 'Identifiants incorrects' : 'Impossible de contacter le serveur');
    } finally {
      setIsLoading(false);
    }
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
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </form>
  );
};

Form.propTypes = { className: PropTypes.string };
export default Form;