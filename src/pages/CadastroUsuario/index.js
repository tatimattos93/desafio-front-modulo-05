import './style.css';
import FrameAdicionarDados from '../../assets/frameAdicionarDados.svg';
import FrameSenha from '../../assets/frameSenha.svg';
import FrameCadastroConcluido from '../../assets/frameCadastroConcluido.svg';
import FooterAdicionarDados from '../../assets/footerAdicionarDados.svg';
import FooterSenha from '../../assets/footerSenha.svg';
import FooterCadastroConcluido from '../../assets/footerCadastroConcluido.svg';
import OlhoFechado from '../../assets/olhoFechado.png';
import OlhoAberto from '../../assets/olhoAberto.png';
import CadastroFinalizado from "../../assets/cadastroFinalizado.png";
import FecharModalErro from '../../assets/fecharModalErro.png';
import CheckModalErro from '../../assets/checkModalErro.png';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../service/api';
import { toast } from 'react-toastify';


export function CadastroUsuario() {
    const navigate = useNavigate();

    const [adicionarDados, setAdicionarDados] = useState(true);
    const [adicionarSenha, setAdicionarSenha] = useState(false);
    const [cadastroConcluido, setCadastroConcluido] = useState(false);

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarRepitaSenha, setMostrarRepitaSenha] = useState(false);

    const [formCadastro, setFormCadastro] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });

    const [erroNome, setErroNome] = useState(false);
    const [erroEmail, setErroEmail] = useState(false);
    const [erroEmailExiste, setErroEmailExiste] = useState(false);
    const [erroSenha, setErroSenha] = useState(false);
    const [erroConfirmarSenha, setErroConfirmarSenha] = useState(false);
    const [erroSenhaTamanho, setErroSenhaTamanho] = useState(false);
    const [erroConfirmarSenhaTamanho, setErroConfirmarSenhaTamanho] = useState(false);

    useEffect(() => {
        setErroNome(false);
        setErroEmail(false);
        setErroEmailExiste(false);
        setErroSenha(false);
        setErroSenhaTamanho(false);
        setErroSenhaTamanho(false);
        setErroConfirmarSenhaTamanho(false);
    }, []);

    function errorNome(e) {
        if (!e.target.value) {
            setErroNome(true);
            return;
        }
        setErroNome(false);
    }

    function errorEmail(e) {
        setErroEmailExiste(false);

        if (!e.target.value) {
            setErroEmail(true);
            return;
        }
        setErroEmail(false);
    }

    function errorSenha(e) {
        setErroSenhaTamanho(false);

        if (!e.target.value) {
            setErroSenha(true);
            return;
        }
        setErroSenha(false);
    }

    function errorConfirmarSenha(e) {
        setErroConfirmarSenhaTamanho(false);

        if (!e.target.value) {
            setErroConfirmarSenha(true);
            return;
        }
        setErroConfirmarSenha(false);
    }

    async function gerenciarContinuar() {

        if (!formCadastro.nome && !formCadastro.email) {
            setErroNome(true);
            setErroEmail(true);
            return;
        };

        if (!formCadastro.nome) {
            setErroNome(true);
            return;
        };

        if (!formCadastro.email) {
            setErroEmail(true);
            return;
        };

        setErroNome(false);
        setErroEmail(false);

        try {
            await api.get(`/usuarios/emails/${formCadastro.email}`);

            setAdicionarDados(false);
            setAdicionarSenha(true);
        } catch (error) {
            setErroEmailExiste(true);
            return;
        }

    }

    async function gerenciarEntrar(e) {
        e.preventDefault();

        if (formCadastro.senha.length < 6 && formCadastro.confirmarSenha.length < 6) {
            setErroSenha(false);
            setErroConfirmarSenha(false);

            setErroSenhaTamanho(true);
            setErroConfirmarSenhaTamanho(true);
            return;
        };

        if (formCadastro.senha.length < 6) {
            setErroSenha(false);
            setErroSenhaTamanho(true);
            return;
        };

        if (formCadastro.confirmarSenha.length < 6) {
            setErroConfirmarSenha(false);
            setErroConfirmarSenhaTamanho(true);
            return;
        };

        if (!formCadastro.senha && !formCadastro.confirmarSenha) {
            setErroSenha(true);
            setErroConfirmarSenha(true);
            return;
        };

        if (!formCadastro.senha) {
            setErroSenha(true);
            return;
        };

        if (!formCadastro.confirmarSenha) {
            setErroConfirmarSenha(true);
            return;
        };

        if (formCadastro.senha !== formCadastro.confirmarSenha) {
            toast(
                <div className='modal-erro-conteudo'>
                    <div className='check-texto'>
                        <img src={CheckModalErro} alt='Sucesso' />
                        <span>As senhas não conferem!</span>
                    </div>
                    <img src={FecharModalErro} alt='Fechar' />
                </div>, {
                className: 'modal-erro',
                closeButton: false,
                pauseOnFocusLoss: false,
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        };

        setErroSenha(false);
        setErroSenhaTamanho(false);
        setErroSenhaTamanho(false);
        setErroConfirmarSenhaTamanho(false);

        try {
            const resposta = await api.post('/usuarios/cadastro', {
                nome: formCadastro.nome,
                email: formCadastro.email,
                senha: formCadastro.senha
            });

            if (resposta.status > 204) {
                return;
            }

            setAdicionarSenha(false);
            setCadastroConcluido(true);
            limparFormCadastro();

        } catch (error) {
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
        }

    }

    function gerenciarIrParaLogin() {
        setCadastroConcluido(false);

        navigate('/login');
    }

    function limparFormCadastro() {
        setFormCadastro({ nome: '', email: '', senha: '', confirmarSenha: '' });
    }

    return (
        <div className='container-cadastro'>
            <div className='container-status'>
                <div className='checagem-status'>
                    {adicionarDados &&
                        <img src={FrameAdicionarDados} alt='Status Dados' />}

                    {adicionarSenha &&
                        <img src={FrameSenha} alt='Status Dados' />}

                    {cadastroConcluido &&
                        <img src={FrameCadastroConcluido} alt='Status Dados' />}
                </div>
                <div className='texto-status'>
                    <h3 className='h3-negrito'>Cadastre-se</h3>
                    <span className='h3-semi-negrito'>Por favor, escreva seu nome e e-mail</span>
                    <h3 className='h3-negrito'>Escolha uma senha</h3>
                    <span className='h3-semi-negrito'>Escolha uma senha segura</span>
                    <h3 className='h3-negrito'>Cadastro realizado com sucesso</h3>
                    <span className='h3-semi-negrito'>E-mail e senha cadastrados com sucesso</span>
                </div>
            </div>

            <div className='container-dados'>

                {adicionarDados && <>
                    <h2>Adicione seus dados</h2>
                    <form className='form-cadastro-login'>
                        <div className='input-flex-column'>
                            <label className='corpo-pequeno' htmlFor='nome'>Nome*</label>
                            <input
                                type='text'
                                id='nome'
                                name='nome'
                                className={erroNome ? 'mb-20 input-erro' : 'mb-20'}
                                placeholder='Digite o seu nome'
                                value={formCadastro.nome}
                                onChange={(e) => setFormCadastro({ ...formCadastro, nome: e.target.value })}
                                onBlur={(e) => errorNome(e)}
                            />
                            {erroNome &&
                                <span className='mensagem-erro botton0 corpo-minusculo'>Este campo deve ser preenchido</span>}
                        </div>

                        <div className='input-flex-column'>
                            <label className='corpo-pequeno' htmlFor='email'>E-mail*</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                className={erroEmail || erroEmailExiste ? 'mb-20 input-erro' : 'mb-20'}
                                placeholder='Digite o seu e-mail'
                                value={formCadastro.email}
                                onChange={(e) => setFormCadastro({ ...formCadastro, email: e.target.value })}
                                onBlur={(e) => errorEmail(e)}
                            />
                            {erroEmail &&
                                <span className='mensagem-erro botton0 corpo-minusculo'>Este campo deve ser preenchido</span>}
                            {erroEmailExiste &&
                                <span className='mensagem-erro botton0 corpo-minusculo'>E-mail já cadastrado</span>}
                        </div>

                        <button
                            type='button'
                            className='btn-cadastro-login'
                            onClick={() => gerenciarContinuar()}
                        >
                            Continuar
                        </button>

                        <span className='h3-semi-negrito'>Já possui uma conta? Faça seu <Link to={'/login'}><a>Login</a></Link></span>

                    </form></>}

                {adicionarSenha && <>
                    <h2>Escolha uma senha</h2>
                    <form className='form-cadastro-login'>
                        <div className='form-cadastro-login container-inputSenha'>
                            <label className='corpo-pequeno' htmlFor='senha'>Senha*</label>
                            <input
                                type={mostrarSenha ? 'text' : 'password'}
                                id='senha'
                                name='senha'
                                className={erroSenha || erroSenhaTamanho ? 'mb-20 input-erro' : 'mb-20'}
                                placeholder='Digite a sua senha'
                                value={formCadastro.senha}
                                onChange={(e) => setFormCadastro({ ...formCadastro, senha: e.target.value })}
                                onBlur={(e) => errorSenha(e)}
                            />
                            <img
                                src={mostrarSenha ? OlhoAberto : OlhoFechado}
                                alt='Exibir Senha'
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                            />
                            {erroSenha &&
                                <span className='mensagem-erro botton0 corpo-minusculo'>Este campo deve ser preenchido</span>}

                            {erroSenhaTamanho &&
                                <span className='mensagem-erro botton0 corpo-minusculo'>A senha deve conter no mínimo 6 carácteres</span>}
                        </div>

                        <div className='form-cadastro-login container-inputSenha'>
                            <label className='corpo-pequeno' htmlFor='confirmar-senha'>Repita a senha*</label>
                            <input
                                type={mostrarRepitaSenha ? 'text' : 'password'}
                                id='confirmar-senha'
                                name='senha'
                                className={erroConfirmarSenha || erroConfirmarSenhaTamanho ? 'mb-20 input-erro' : 'mb-20'}
                                placeholder='Repita sua senha'
                                value={formCadastro.confirmarSenha}
                                onChange={(e) => setFormCadastro({ ...formCadastro, confirmarSenha: e.target.value })}
                                onBlur={(e) => errorConfirmarSenha(e)}
                            />
                            <img
                                src={mostrarRepitaSenha ? OlhoAberto : OlhoFechado}
                                alt='Exibir Senha'
                                onClick={() => setMostrarRepitaSenha(!mostrarRepitaSenha)}
                            />
                            {erroConfirmarSenha &&
                                <span className='mensagem-erro botton0 corpo-minusculo'>Este campo deve ser preenchido</span>}

                            {erroConfirmarSenhaTamanho &&
                                <span className='mensagem-erro botton0 corpo-minusculo'>A senha deve conter no mínimo 6 carácteres</span>}
                        </div>

                        <button
                            type='button'
                            className='btn-cadastro-login'
                            onClick={(e) => gerenciarEntrar(e)}
                        >
                            Entrar
                        </button>

                        <span className='h3-semi-negrito'>Já possui uma conta? Faça seu <Link to={'/login'}><a>Login</a></Link></span>

                    </form></>}

                {cadastroConcluido &&
                    <div className='cadastro-finalizado'>
                        <img className='img-cadastro-finalizado' src={CadastroFinalizado} alt='Cadastro concluído' />

                        <button
                            type='button'
                            className='btn-cadastro-login'
                            onClick={() => gerenciarIrParaLogin()}
                        >
                            Ir para Login
                        </button>
                    </div>}

                <div className='barraStatus'>
                    {adicionarDados &&
                        <img className='img-footer' src={FooterAdicionarDados} alt='Status Dados' />}

                    {adicionarSenha &&
                        <img className='img-footer' src={FooterSenha} alt='Status Dados' />}

                    {cadastroConcluido &&
                        <img className='img-footer ultimo-footer-cadastro' src={FooterCadastroConcluido} alt='Status Dados' />}

                </div>
            </div>
        </div>
    );
}

export default CadastroUsuario;