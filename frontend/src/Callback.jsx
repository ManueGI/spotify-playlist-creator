// frontend/src/Callback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Callback({ setToken }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleAuth() {
      const code = searchParams.get('code');
      if (!code) {
        navigate('/');
        return;
      }

      try {
        const res = await fetch('http://localhost:3001/api/exchange_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem('spotify_access_token', data.access_token);
          setToken(data.access_token);
          navigate('/dashboard');
        } else {
          console.error('No access token received');
          navigate('/');
        }
      } catch (e) {
        console.error(e);
        navigate('/');
      }
    }
    handleAuth();
  }, [searchParams, navigate, setToken]);

  return <div>Loading...</div>;
}
