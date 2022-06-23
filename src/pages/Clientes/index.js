import { useEffect, useState } from 'react';
import { getItem, setItem } from '../../utils/storage';
import api from '../../service/api';

import './style.css';
import Header from '../../components/Header';
import ClienteCadastroModal from '../../components/ClienteModal';
import MenuLateral from '../../components/MenuLateral';
import AddCobrancaModal from '../../components/AddCobrancaModal';
import FiltroClientes from '../../components/FiltroClientes';
import IconeCadastro from '../../assets/cadastroicone.png';
import IconeFiltro from '../../assets/iconeFiltro.png';
import LupaPesquisa from '../../assets/lupaPesquisa.png';
import IconeOrdenar from '../../assets/iconeOrdenar.svg';
import IconeAddCobranca from '../../assets/iconeAddCobranca.svg';
import IconeFiltroSemResultado from '../../assets/iconeFiltroSemResultado.svg';
import { ContextGlobal } from '../../context/ContextGlobal';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export function Clientes() {
    const { setPaginaHome, setPaginaClientes, setPaginaDetalhesCliente, setPaginaCobrancas, aplicarFiltroClientes } = useContext(ContextGlobal);

    const [modalCadastroCliente, setModalCadastroCliente] = useState('');
    const [clientes, setClientes] = useState([]);

    const [addCobrancaCliente, setAddCobrancaCliente] = useState({ id: '' });
    const [modalAddCobranca, setModalAddCobranca] = useState(false);

    const [abrirFiltro, setAbrirFiltro] = useState(false);

    const [pesquisa, setPesquisa] = useState('');
    const [listaCliente, setListaClientes] = useState([]);
    const [semResultado, setSemResultado] = useState(false);

    const [ordemAsc, setOrdemAsc] = useState(true);

    const token = getItem('token');
    const navigate = useNavigate();

    useEffect(() => {

        if (aplicarFiltroClientes.status) {
            gerenciarFiltro();
        } else {
            carregarClientes();
        }

        setPaginaHome(false);
        setPaginaClientes(true);
        setPaginaCobrancas(false);
        setPaginaDetalhesCliente(false);

    }, []);

    async function carregarClientes() {
        try {
            const resposta = await api.get('/clientes', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setClientes([...resposta.data]);
            setListaClientes([...resposta.data]);

        } catch (error) {
            console.log(error);
        }
    }

    function abrirModalAddCobranca(cliente) {
        setAddCobrancaCliente({ id: cliente.id, nome: cliente.nome });

        setModalAddCobranca(true);
    }

    function fecharModalAddCobranca() {
        setModalAddCobranca(false);

        carregarClientes();
    }

    function detalhesCliente(clienteId) {
        setItem('clienteId', clienteId);

        setPaginaDetalhesCliente(true);

        navigate('/clientes/detalhes');
    }

    function gerenciarPesquisa(e) {

        if (clientes) {
            setSemResultado(false);
        }

        const inputPesquisa = e.target.value;

        setPesquisa(e.target.value);

        if (inputPesquisa) {
            let resultado = listaCliente.filter((cliente) => {
                return cliente.nome.toLocaleLowerCase().includes(inputPesquisa.toLocaleLowerCase()) || String(cliente.cpf).includes(inputPesquisa) || cliente.email.includes(inputPesquisa);
            });

            setClientes(resultado);

            if (resultado.length === 0) {
                setSemResultado(true);
            }

        } else {
            setClientes(listaCliente);
        }
    }

    function ordenarCliente() {
        setOrdemAsc(!ordemAsc);

        const ordemAZ = [...clientes].sort((a, b) => {
            if (ordemAsc) {
                return a.nome.localeCompare(b.nome);
            }

            return b.nome.localeCompare(a.nome);
        });

        setClientes(ordemAZ);
        setListaClientes(ordemAZ);
    }

    function modalFiltro() {
        setAbrirFiltro(abrirFiltro ? false : true);
        setPesquisa('');
    }

    async function gerenciarFiltro() {
        try {
            const resposta = await api.get('/clientes', {
                params: {
                    filtro: aplicarFiltroClientes.status
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            if (!resposta.data[0]) {
                setSemResultado(true);
            }

            setClientes([...resposta.data]);
            setListaClientes([...resposta.data]);

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='container-home'>

            <MenuLateral />

            <div className='conteudo-home'>

                <Header />

                <div className='container-clientes'>
                    <img className='iconeCadastro' src={IconeCadastro} alt='Icone Cadastro' />
                    <h1>Clientes</h1>
                    <button className='btn-addCliente'
                        onClick={() => setModalCadastroCliente(true)}
                    >+ Adicionar cliente</button>
                    <div className='btn-filtro'>
                        <img
                            className='iconeFiltro'
                            src={IconeFiltro}
                            alt='Icone Filtro'
                            onClick={() => modalFiltro()}
                        />

                        {abrirFiltro &&
                            <FiltroClientes
                                modalFiltro={modalFiltro}
                                carregarClientes={carregarClientes}
                                setClientes={setClientes}
                                setListaClientes={setListaClientes}
                                setSemResultado={setSemResultado}
                            />}

                    </div>
                    <input
                        type='text'
                        placeholder='Pesquisa'
                        className='input-pesquisa'
                        value={pesquisa}
                        onChange={(e) => gerenciarPesquisa(e)}
                    />
                    <img className='lupaPesquisa'
                        src={LupaPesquisa}
                        alt='Lupa Pesquisa'
                        value={pesquisa}
                        onClick={() => gerenciarPesquisa({ target: { value: pesquisa } })}
                    />
                </div>

                <div className='container-tabelaClientes'>
                    <div className='tabela-sub subtitulo'>
                        <div className='ordenar-clientes'>
                            <img src={IconeOrdenar}
                                alt='Ordenar'
                                onClick={() => ordenarCliente()}
                            />
                            <h3>Cliente</h3>
                        </div>
                        <h3>CPF</h3>
                        <h3>E-mail</h3>
                        <h3>Telefone</h3>
                        <h3>Status</h3>
                        <h3>Criar Cobrança</h3>
                    </div>

                    {clientes.map((cliente) => (
                        <div
                            className='tabela-clientes corpoPequeno'
                            key={cliente.id}
                        >

                            <span className='cursor-pointer' onClick={() => detalhesCliente(cliente.id)}>{cliente.nome}</span>
                            <span>{cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</span>
                            <span>{cliente.email}</span>
                            <span>{cliente.telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")}</span>
                            <div className='cliente-status'>
                                {cliente.status === 'inadimplente' &&
                                    <span className='status-atual cliente-inadimplente'>Inadimplente</span>}

                                {cliente.status === 'em dia' &&
                                    <span className='status-atual cliente-em-dia'>Em dia</span>}
                            </div>
                            <button
                                className='add-cobranca'
                                onClick={() => abrirModalAddCobranca(cliente)}
                            >
                                <img className='iconeCobranca' src={IconeAddCobranca} alt='Icone Cobrança' />
                                <span>Cobranças</span>
                            </button>

                        </div>
                    ))}

                    {semResultado &&
                        <div className='pesquisa-sr-center'>
                            <img
                                src={IconeFiltroSemResultado}
                                alt='Sem resultado' />
                            <h1 className='pesquisa-sr'>Nenhum resultado foi encontrado!</h1>
                        </div>}
                </div>
            </div>

            <ClienteCadastroModal
                modalCadastroCliente={modalCadastroCliente}
                fecharModalCadastroCliente={() => setModalCadastroCliente(false)}
                carregarClientes={carregarClientes}
            />

            {modalAddCobranca &&
                <AddCobrancaModal
                    addCobrancaCliente={addCobrancaCliente}
                    fecharModalAddCobranca={fecharModalAddCobranca}
                />}

        </div>
    );
}

export default Clientes;