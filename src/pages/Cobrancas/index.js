import Header from '../../components/Header';
import MenuLateral from '../../components/MenuLateral';
import EditarCobrancaModal from '../../components/EditarCobrancaModal';
import DetalhesCobrancaModal from '../../components/DetalhesCobrancaModal';
import ExcluirCobrancaModal from '../../components/ExcluirCobrancaModal';
import FiltroCobrancas from '../../components/FiltroCobrancas';

import './style.css';
import IconeCobrancas from '../../assets/iconeCobrancas.svg';
import IconeFiltro from '../../assets/iconeFiltro.png';
import LupaPesquisa from '../../assets/lupaPesquisa.png';
import IconeOrdenar from '../../assets/iconeOrdenar.svg';
import IconeDeletar from '../../assets/iconeDeletar.svg';
import EditarUsuario from '../../assets/editarUsuario.svg';
import IconeFiltroSemResultado from '../../assets/iconeFiltroSemResultado.svg';
import { useEffect, useState } from 'react';
import { ContextGlobal } from '../../context/ContextGlobal';
import { useContext } from 'react';
import { getItem } from '../../utils/storage';
import {formatarValor} from '../../utils/formatarValores';
import api from '../../service/api';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';

export function Cobrancas() {
    const { setPaginaHome, setPaginaClientes, setPaginaDetalhesCliente, setPaginaCobrancas, aplicarFiltroCobrancas } = useContext(ContextGlobal);

    const token = getItem('token');

    const [cobrancas, setCobrancas] = useState([]);

    const [abrirFiltro, setAbrirFiltro] = useState(false);

    const [editarCobranca, setEditarCobranca] = useState({ nome: '', descricao: '', status: '', valor: '', vencimento: '' });
    const [modalEditarCobranca, setModalEditarCobranca] = useState(false);

    const [modalExcluirCobranca, setModalExcluirCobranca] = useState(false);
    const [cobrancaIdStatus, setCobrancaIdStatus] = useState({ id: '', status: '' });

    const [modalDetalhesCobranca, setModalDetalhesCobranca] = useState(false);
    const [detalhesCobrancaId, setDetalhesCobrancaId] = useState('');

    const [pesquisa, setPesquisa] = useState('');
    const [listaCobrancas, setListaCobrancas] = useState([]);
    const [semResultado, setSemResultado] = useState(false);

    const [ordemAsc, setOrdemAsc] = useState(true);
    const [ordemIdCresc, setOrdemIdCresc] = useState(false);


    useEffect(() => {

        if (aplicarFiltroCobrancas.status) {
            gerenciarFiltro();
        } else {
            carregarCobrancas();
        }

        setPaginaHome(false);
        setPaginaClientes(false);
        setPaginaCobrancas(true);
        setPaginaDetalhesCliente(false);

    }, []);

    async function carregarCobrancas() {
        try {
            const resposta = await api.get('/cobrancas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setCobrancas([...resposta.data]);
            setListaCobrancas([...resposta.data]);

        } catch (error) {
            console.log(error);
        }
    }

    function abrirModalEditarCobranca(cobranca) {
        setModalEditarCobranca(true);

        setEditarCobranca({ ...editarCobranca, id: cobranca.id, nome: cobranca.cliente, descricao: cobranca.descricao, status: cobranca.status, valor: cobranca.valor, vencimento: cobranca.vencimento });
    }

    function fecharModalEditarCobranca() {
        setModalEditarCobranca(false);

        carregarCobrancas();
    }

    function abrirModalExcluirCobranca(cobranca) {
        setModalExcluirCobranca(true);
        setCobrancaIdStatus({ id: cobranca.id, status: cobranca.status });
    }

    function fecharModalExcluirCobranca() {
        setModalExcluirCobranca(false);
    }

    function abrirDetalhesCobranca(cobrancaId) {
        setModalDetalhesCobranca(true);

        setDetalhesCobrancaId(cobrancaId);
    }

    function gerenciarPesquisa(e) {

        if (cobrancas) {
            setSemResultado(false);
        }

        const inputPesquisa = e.target.value;

        setPesquisa(e.target.value);

        if (inputPesquisa) {
            let resultado = listaCobrancas.filter((cobranca) => {
                return cobranca.cliente.toLocaleLowerCase().includes(inputPesquisa.toLocaleLowerCase()) || String(cobranca.id).includes(inputPesquisa);
            });

            setCobrancas(resultado);

            if (resultado.length === 0) {
                setSemResultado(true);
            }

        } else {
            setCobrancas(listaCobrancas);
        }
    }

    function ordenarCliente() {
        setOrdemAsc(!ordemAsc);

        const ordemAZ = [...cobrancas].sort((a, b) => {
            if (ordemAsc) {
                return a.cliente.localeCompare(b.cliente);
            }

            return b.cliente.localeCompare(a.cliente);
        });

        setCobrancas(ordemAZ);
        setListaCobrancas(ordemAZ);
    }

    function ordenarId() {
        setOrdemIdCresc(!ordemIdCresc);

        const ordemId = [...cobrancas].sort((a, b) => {
            if (ordemIdCresc) {
                return a.id - b.id;
            }
            return b.id - a.id;

        });

        setCobrancas(ordemId);
        setListaCobrancas(ordemId);
    }

    function modalFiltro() {
        setAbrirFiltro(abrirFiltro ? false : true);
        setPesquisa('');
    }

    async function gerenciarFiltro() {
        try {
            const resposta = await api.get('/cobrancas', {
                params: {
                    status: aplicarFiltroCobrancas.status,
                    data: aplicarFiltroCobrancas.vencimento
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

            setCobrancas([...resposta.data]);
            setListaCobrancas([...resposta.data]);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container-cobrancas'>

            <MenuLateral />

            <div className='conteudo-cobrancas'>

                <Header />

                <div className='container-clientes'>
                    <div className='titulo-cobrancas'>
                        <img className='iconeCadastro' src={IconeCobrancas} alt='Icone Cobranças' />
                        <h1>Cobranças</h1>
                    </div>
                    <div className='titulo-cobrancas'>
                        <div className='btn-filtro'>
                            <img
                                className='iconeFiltro'
                                src={IconeFiltro}
                                alt='Icone Filtro'
                                onClick={() => modalFiltro()}
                            />

                            {abrirFiltro &&
                                <FiltroCobrancas
                                    modalFiltro={modalFiltro}
                                    carregarCobrancas={carregarCobrancas}
                                    setCobrancas={setCobrancas}
                                    setListaCobrancas={setListaCobrancas}
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
                </div>

                <div className='tabela-cobrancas'>
                    <div className='tabela-cob-titulo subtitulo'>
                        <div className='ordenar'>
                            <img src={IconeOrdenar}
                                alt='Ordenar'
                                onClick={() => ordenarCliente()} />
                            <h3>Cliente</h3>
                        </div>
                        <div className='ordenar'>
                            <img src={IconeOrdenar}
                                alt='Ordenar'
                                onClick={() => ordenarId()} />
                            <h3>ID Cob.</h3>
                        </div>
                        <h3>Valor</h3>
                        <h3>Data venc.</h3>
                        <h3>Status</h3>
                        <h3>Descrição</h3>
                    </div>

                    {cobrancas.map((cobranca) => (
                        <div
                            className='tabela-cob corpoPequeno'
                            key={cobranca.id}
                        >
                            <span
                                className='cursor-pointer'
                                onClick={() => abrirDetalhesCobranca(cobranca.id)}
                            >
                                {cobranca.cliente}
                            </span>

                            <span
                                className='cursor-pointer'
                                onClick={() => abrirDetalhesCobranca(cobranca.id)}
                            >
                                {cobranca.id}
                            </span>

                            <span
                                className='cursor-pointer'
                                onClick={() => abrirDetalhesCobranca(cobranca.id)}
                            >
                                {`R$ ${formatarValor(cobranca.valor)}`}
                            </span>

                            <span
                                className='cursor-pointer'
                                onClick={() => abrirDetalhesCobranca(cobranca.id)}
                            >
                                {format(new Date(cobranca.vencimento.slice(0, -5)), 'dd/MM/yyyy', { locale: ptBR })}</span>

                            <div
                                className='cliente-status cursor-pointer'
                                onClick={() => abrirDetalhesCobranca(cobranca.id)}
                            >
                                {cobranca.status === 'pago' &&
                                    <span className='status-atual cobranca-paga'>Paga</span>}

                                {cobranca.status === 'pendente' &&
                                    <span className='status-atual cobranca-previsto'>Pendente</span>}

                                {cobranca.status === 'vencida' &&
                                    <span className='status-atual cobranca-vencida'>Vencida</span>}
                            </div>

                            <span
                                className='cursor-pointer'
                                onClick={() => abrirDetalhesCobranca(cobranca.id)}
                            >
                                {cobranca.descricao}
                            </span>

                            <button
                                type='button'
                                onClick={() => abrirModalEditarCobranca(cobranca)}
                            >
                                <img className='btn-editar-cobranca'
                                    src={EditarUsuario}
                                    alt='Editar Usuário' />
                                <span className='corpo-normal editar-cobranca'>Editar</span>
                            </button>

                            <button
                                type='button'
                                onClick={() => abrirModalExcluirCobranca(cobranca)}
                            >
                                <img
                                    className='btn-deletar-cobranca'
                                    src={IconeDeletar}
                                    alt='Editar Usuário' />
                                <span className='corpo-normal deletar-cobranca'>Deletar</span>
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

                    {modalEditarCobranca &&
                        <EditarCobrancaModal
                            editarCobranca={editarCobranca}
                            fecharModalEditarCobranca={fecharModalEditarCobranca}
                        />}

                    {modalExcluirCobranca &&
                        <ExcluirCobrancaModal
                            fecharModalExcluirCobranca={fecharModalExcluirCobranca}
                            cobrancaIdStatus={cobrancaIdStatus}
                            carregarCobrancas={carregarCobrancas}
                        />}

                    {modalDetalhesCobranca &&
                        <DetalhesCobrancaModal
                            detalhesCobrancaId={detalhesCobrancaId}
                            setModalDetalhesCobranca={setModalDetalhesCobranca}
                        />}

                </div>
            </div>
        </div>
    );
}

export default Cobrancas;