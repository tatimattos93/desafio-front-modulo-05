import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../service/api';
import { getItem } from '../../utils/storage';
import { InputCPF, InputTelefone } from '../../utils/inputFormatoNumero';

import './style.css';
import fecharIcone from '../../assets/fecharicone.png';
import CheckModalSucesso from '../../assets/checkModalSucesso.svg';
import FecharModalSucesso from '../../assets/fecharModalSucesso.svg';
import OlhoFechado from '../../assets/olhoFechado.png';
import OlhoAberto from '../../assets/olhoAberto.png';
import FecharModalErro from '../../assets/fecharModalErro.png';
import CheckModalErro from '../../assets/checkModalErro.png';

export function EditarUsuarioModal({ dadosUsuario, fecharModalEdicaoUsuario, carregarDadosUsuario }) {

    const [formCadastro, setFormCadastro] = useState({ id: '', nome: '', email: '', senha: '', confirmarSenha: '', cpf: '', telefone: '' });

    const EditUsuarioModalSucesso = ({ closeToast }) => (
        <div className='modal-sucesso-conteudo'>
            <div className='check-texto'>
                <img src={CheckModalSucesso} alt='Sucesso' />
                <span>Cadastro Atualizado com sucesso</span>
            </div>
            <img src={FecharModalSucesso} alt='Fechar' onClick={closeToast} />
        </div>
    );

    const token = getItem('token');

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);

    const [erroNome, setErroNome] = useState(false);
    const [erroEmail, setErroEmail] = useState(false);
    const [erroEmailExiste, setErroEmailExiste] = useState(false);


    useEffect(() => {
        setValores();

        setErroNome(false);
        setErroEmail(false);
        setErroEmailExiste(false);
    }, []);

    function setValores() {
        setFormCadastro({ ...dadosUsuario });
    }

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

    async function gerenciarAplicar(e) {
        e.preventDefault();

        if (!formCadastro.nome || !formCadastro.email) {
            setErroNome(true);
            setErroEmail(true);
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
        }

        if (formCadastro.email !== dadosUsuario.email) {
            try {
                await api.get(`/usuarios/emails/${formCadastro.email}`);

            } catch (error) {
                setErroEmailExiste(true);
                return;
            }
        }

        setErroNome(false);
        setErroEmail(false);
        setErroEmailExiste(false);

        try {
            const resposta = await api.put('/usuario/editar', {
                nome: formCadastro.nome,
                email: formCadastro.email,
                senha: formCadastro.senha,
                confirmaSenha: formCadastro.confirmarSenha,
                cpf: formCadastro.cpf,
                telefone: formCadastro.telefone

            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            fecharModalEdicaoUsuario();
            carregarDadosUsuario();
            toast(<EditUsuarioModalSucesso />, {
                className: 'modal-sucesso',
                closeButton: false,
                pauseOnFocusLoss: false,
                position: toast.POSITION.BOTTOM_RIGHT
            });

            setErroNome(false);
            setErroEmail(false);
            setErroEmailExiste(false);

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

    return (
        <div className='backdrop '>
            <div className='modal modal-editar'>
                <img
                    src={fecharIcone}
                    alt='Fechar'
                    className='fechar-icone'
                    onClick={() => fecharModalEdicaoUsuario()}
                />

                <h2>Edite seu cadastro</h2>

                <form className='form-modal'>
                    <div className='input-editar'>
                        <div className='input-flex-column mb0'>
                            <label htmlFor='nome'>Nome*</label>
                            <input
                                type='text'
                                id='nome'
                                name='nome'
                                className={erroNome ? 'input-erro' : ''}
                                placeholder='Digite o seu nome'
                                value={formCadastro.nome}
                                onChange={(e) => setFormCadastro({ ...formCadastro, nome: e.target.value })}
                                onBlur={(e) => errorNome(e)}
                            />
                            {erroNome &&
                                <span className='mensagem-erro botton0 corpo-minusculo'>Este campo deve ser preenchido</span>}
                        </div>

                        <div className='input-flex-column mb0'>
                            <label htmlFor='email'>E-mail*</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                className={erroEmail || erroEmailExiste ? 'input-erro' : ''}
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
                        <div className='display-row'>
                            <div className='display-column-input'>
                                <label htmlFor='cpf'>CPF</label>
                                <InputCPF
                                    type='text'
                                    name='cpf'
                                    className='input-number'
                                    placeholder={'Digite o CPF'}
                                    value={formCadastro.cpf}
                                    onChange={(e) => setFormCadastro({ ...formCadastro, cpf: e.target.value })}
                                />
                            </div>
                            <div className='display-column-input'>
                                <label htmlFor='telefone'>Telefone</label>
                                <InputTelefone
                                    type='number'
                                    id='telefone'
                                    name='telefone'
                                    className='input-number'
                                    placeholder={'Digite o telefone'}
                                    value={formCadastro.telefone}
                                    onChange={(e) => setFormCadastro({ ...formCadastro, telefone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className='nova-senha'>
                            <label htmlFor='senha'>Nova senha</label>
                            <input
                                className='input-senha'
                                type={mostrarSenha ? 'text' : 'password'}
                                id='senha'
                                name='senha'
                                value={formCadastro.senha}
                                onChange={(e) => setFormCadastro({ ...formCadastro, senha: e.target.value })}
                            />
                            <img
                                src={mostrarSenha ? OlhoAberto : OlhoFechado}
                                alt='Exibir Senha'
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                            />

                        </div>
                        <div className='confirma-senha'>
                            <label htmlFor='confirmarSenha'>Repita a senha</label>
                            <input
                                className='input-senha'
                                type={mostrarConfirmaSenha ? 'text' : 'password'}
                                id='confirmar-senha'
                                name='confirmarSenha'
                                value={formCadastro.confirmarSenha}
                                onChange={(e) => setFormCadastro({ ...formCadastro, confirmarSenha: e.target.value })}
                            />
                            <img
                                src={mostrarConfirmaSenha ? OlhoAberto : OlhoFechado}
                                alt='Exibir Senha'
                                onClick={() =>
                                    setMostrarConfirmaSenha(!mostrarConfirmaSenha)}
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='btn-rosa-medio btn-editar'
                        onClick={(e) => gerenciarAplicar(e)}
                    >
                        Aplicar
                    </button>
                </form>
            </div>

        </div>

    );
}

export default EditarUsuarioModal;