import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './style.css'
import api from '../../service/api';
import { setItem, getItem } from '../../utils/storage'
import { Link } from 'react-router-dom';
import OlhoFechado from '../../assets/olhoFechado.png';
import OlhoAberto from '../../assets/olhoAberto.png';
import FecharModalErro from '../../assets/fecharModalErro.png';
import CheckModalErro from '../../assets/checkModalErro.png';

export function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [mostrarSenha, setMostrarSenha] = useState(false);

    useEffect(() => {
        const token = getItem('token');

        if (token) {
            navigate('/home');
        }

    }, []);

    async function efetuarLogin(e) {
        e.preventDefault();

        if (!email || !senha) {
            toast(
                <div className='modal-erro-conteudo'>
                    <div className='check-texto'>
                        <img src={CheckModalErro} alt='Sucesso' />
                        <span>Todos os campos são obrigatórios</span>
                    </div>
                    <img src={FecharModalErro} alt='Fechar' />
                </div>, {
                className: 'modal-erro',
                closeButton: false,
                pauseOnFocusLoss: false,
                position: toast.POSITION.TOP_RIGHT
            });
            return
        }

        try {
            const resposta = await api.post('/login', {
                email,
                senha
            });

            if (resposta.status > 204) {
                return;
            }

            const { usuario, token } = resposta.data;

            setItem('token', token);
            setItem('userId', usuario.id);

            setEmail('');
            setSenha('');

            navigate('/home');

        } catch (error) {
            if (error.response.data.message) {
                toast(
                    <div className='modal-erro-conteudo'>
                        <div className='check-texto'>
                            <img src={CheckModalErro} alt='Sucesso' />
                            <span>{error.response.data.message}</span>
                        </div>
                        <img src={FecharModalErro} alt='Fechar' />
                    </div>, {
                    className: 'modal-erro',
                    closeButton: false,
                    pauseOnFocusLoss: false,
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast(
                    <div className='modal-erro-conteudo'>
                        <div className='check-texto'>
                            <img src={CheckModalErro} alt='Sucesso' />
                            <span>{error.response.data}</span>
                        </div>
                        <img src={FecharModalErro} alt='Fechar' />
                    </div>, {
                    className: 'modal-erro',
                    closeButton: false,
                    pauseOnFocusLoss: false,
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    return (
        <div className='container-cadastro'>
            <div className='imagem-login'>
                <h1>Gerencie todos os pagamentos da sua empresa em um só lugar.</h1>
                <span></span>
            </div>

            <div className='container-dados'>
                <h2>Faça seu login!</h2>
                <form className='form-cadastro-login'>
                    <label className='corpo-pequeno' htmlFor='email'>E-mail</label>
                    <input
                        type='text'
                        id='email'
                        name='email'
                        placeholder='Digite o seu e-mail'
                        className='mb-20'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className='form-cadastro-login container-inputSenha'>
                        <div className='container-senha'>
                            <label className='corpo-pequeno' htmlFor='senha'>Senha</label>
                            <a className='ancora'>Esqueceu sua senha?</a>
                        </div>
                        <input
                            type={mostrarSenha ? 'text' : 'password'}
                            name='senha'
                            placeholder='Digite a sua senha'
                            className='mb-20'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <img
                            src={mostrarSenha ? OlhoAberto : OlhoFechado}
                            alt='Exibir Senha'
                            className='icone-senha-login'
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                        />
                    </div>

                    <button
                        type='submit'
                        className='btn-cadastro-login'
                        onClick={(e) => efetuarLogin(e)}
                    >
                        Entrar
                    </button>

                </form>
                <span>Ainda não possui uma conta? <a><Link to={'/cadastro-usuario'}>Cadastre-se</Link></a></span>

            </div>
        </div>
    );
}

export default Login;