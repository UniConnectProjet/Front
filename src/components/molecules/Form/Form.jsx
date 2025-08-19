import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Input, Title } from '../../atoms';
import userIcon from '../../../assets/svg/user.svg';
import passwordIcon from '../../../assets/svg/password.svg';
import { useAuth } from '../../../auth/AuthProvider';

const Form = ({ className = '' }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const runningRef = useRef(false);

  const { login, error } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const doLogin = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    setLocalError(null);
    try {
      await login(email.trim(), password);
      const to = location.state?.from?.pathname || '/home';
      navigate(to, { replace: true });
    } catch {
      setLocalError('Identifiants invalides ou serveur indisponible');
    } finally {
      setLoading(false);
      runningRef.current = false;
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    void doLogin();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full md:w-1/2 h-full flex flex-col justify-center items-center p-6 bg-background ${className}`}
    >
      <Title className="text-primary-500 text-2xl md:text-4xl mb-6">Se Connecter</Title>
      <div className="w-full max-w-sm space-y-4">
        <Input
          type="email"
          icon={userIcon}
          placeholder="Email"
          autoComplete="email"
          className="w-full px-7 py-2 border-b-2 border-primary-500 text-primary-500 font-poppins text-base md:text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          icon={passwordIcon}
          placeholder="Mot de passe"
          autoComplete="current-password"
          className="w-full px-7 py-2 border-b-2 border-primary-500 text-primary-500 font-poppins text-base md:text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          // on garde ton style tel quel
          className="w-full px-5 py-2 bg-primary-500 text-white font-poppins text-base md:text-subtitle rounded-full hover:bg-primary-600 transition duration-300"
          // si ton atom Button n’est pas un vrai <button>, on clique pour lancer le login
          onClick={doLogin}
          // et si c’est un vrai <button>, on force le type pour éviter le double submit
          type="button"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
        {(error || localError) && <p className="text-red-500">{error || localError}</p>}
      </div>
    </form>
  );
};

Form.propTypes = { className: PropTypes.string };
export default Form;
