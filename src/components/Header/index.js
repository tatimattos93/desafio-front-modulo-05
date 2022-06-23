import EditarUsuarioModal from '../../components/EditarUsuarioModal';

import './style.css';
import SetaEditarELogout from '../../assets/setaEditarELogout.svg';
import EditarUsuario from '../../assets/editarUsuario.svg';
import LogoutUsuario from '../../assets/logoutUsuario.svg';
import SetaBackgroundModalSair from '../../assets/setaBackgroundModalSair.svg';

import { clear, getItem } from '../../utils/storage';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../service/api';
import { ContextGlobal } from '../../context/ContextGlobal';
import { useContext } from 'react';

export function Header() {
    const navigate = useNavigate();

    const { paginaHome, paginaClientes, setPaginaDetalhesCliente, paginaDetalhesCliente, paginaCobrancas } = useContext(ContextGlobal);

    const token = getItem('token');

    const [modalEditarSair, setModalEditarSair] = useState(false);
    const [modalEditarUsuario, setModalEditarUsuario] = useState(false);

    const [dadosUsuario, setDadosUsuario] = useState({ id: '', nome: '', email: '', cpf: '', telefone: '' });

    const [iniciaisUsuario, setIniciaisUsuario] = useState('');


    useEffect(() => {
        carregarDadosUsuario();

    }, []);

    async function carregarDadosUsuario() {
        try {
            const resposta = await api.get('/usuario', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            setDadosUsuario({ id: resposta.data.id, nome: resposta.data.nome, email: resposta.data.email, cpf: resposta.data.cpf, telefone: resposta.data.telefone });

            carregarIniciaisUsuario(resposta.data.nome);

        } catch (error) {

            if (error.response.status === 500) {
                clear();
                navigate('/login');
            }
        }
    }

    function carregarIniciaisUsuario(nome) {
        setIniciaisUsuario('');

        if (nome.split(' ').length > 1) {
            const iniciais = nome.split(' ');

            const primeira = iniciais[0][0];
            const segunda = iniciais[1][0];

            setIniciaisUsuario((primeira + segunda).toUpperCase());
        } else {
            const primeira = nome[0];
            const segunda = nome[1];

            setIniciaisUsuario((primeira + segunda).toUpperCase());
        }
    }

    function gerenciarLogout() {
        clear();

        navigate('/login');
    }

    function fecharModalEdicaoUsuario() {
        setModalEditarSair(false);
        setModalEditarUsuario(false);
    }

    function voltarPaginaClientes() {
        setPaginaDetalhesCliente(false);

        navigate('/clientes');
    }

    return (
        <header>
            <div className='nome-pagina'>
                {paginaHome && <h1>Resumo das cobranças</h1>}

                {paginaClientes &&
                    <span
                        className='corpo-normal'
                        onClick={() => voltarPaginaClientes()}
                        style={paginaDetalhesCliente ? { cursor: 'pointer' } : { cursor: 'default' }}
                    >
                        Clientes
                    </span>}

                {paginaDetalhesCliente &&
                    <>
                        <span
                            className='corpo-normal marginLados10 corCinza3'
                        >
                            {'>'}
                        </span>

                        <span
                            className='corpo-normal corCinza3'
                        >
                            Detalhes do cliente
                        </span>
                    </>}

                {paginaCobrancas && <span className='corpo-normal'>Cobranças</span>}
            </div>
            <div className='cliente-header'>
                <div className='iniciais-usuario'>
                    <h3 className='h3-semi-negrito font22'>
                        {iniciaisUsuario}
                    </h3>
                </div>
                <div className='info-usuario'>
                    <h3 className='h3-semi-negrito'>
                        {dadosUsuario.nome.toUpperCase()}
                    </h3>
                    <button
                        type='button'
                        className='btn-header'
                        onClick={() => modalEditarSair ? setModalEditarSair(false) : setModalEditarSair(true)}
                    >
                        <img src={SetaEditarELogout} alt='Seta' />

                        {modalEditarSair &&
                            <div className='modal-editar-sair'>
                                <img
                                    className='seta-background-modal'
                                    src={SetaBackgroundModalSair}
                                    alt='Seta'
                                />
                                <button
                                    type='button'
                                    className='btn-header'
                                    onClick={() => setModalEditarUsuario(true)}
                                >
                                    <img className='btn-editar-usuario'
                                        src={EditarUsuario}
                                        alt='Editar Usuário' />
                                    <span className='corpo-normal'>Editar</span>
                                </button>

                                <button
                                    type='button'
                                    className='btn-header'
                                    onClick={() => gerenciarLogout()}>
                                    <img src={LogoutUsuario} alt='Sair' />
                                    <span className='corpo-normal'>Sair</span>
                                </button>
                            </div>}

                        {modalEditarUsuario &&
                            <EditarUsuarioModal
                                dadosUsuario={dadosUsuario}
                                fecharModalEdicaoUsuario={fecharModalEdicaoUsuario}
                                carregarDadosUsuario={carregarDadosUsuario}
                            />}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
