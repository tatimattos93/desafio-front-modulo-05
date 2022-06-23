import { useEffect, useState } from 'react';
import { getItem } from '../../utils/storage';
import { formatarValor } from '../../utils/formatarValores';
import api from '../../service/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import './style.css';
import Header from '../../components/Header';
import MenuLateral from '../../components/MenuLateral';
import AddCobrancaModal from '../../components/AddCobrancaModal';
import EditarClienteModal from '../../components/EditarClienteModal';
import EditarCobrancaModal from '../../components/EditarCobrancaModal';
import DetalhesCobrancaModal from '../../components/DetalhesCobrancaModal';
import ExcluirCobrancaModal from '../../components/ExcluirCobrancaModal';
import IconeCadastro from '../../assets/cadastroicone.png';
import IconeEditarVerde from '../../assets/iconeEditarVerde.svg';
import IconeDeletar from '../../assets/iconeDeletar.svg';
import EditarUsuario from '../../assets/editarUsuario.svg';
import IconeOrdenar from '../../assets/iconeOrdenar.svg';
import { ContextGlobal } from '../../context/ContextGlobal';
import { useContext } from 'react';

export function Clientes() {
    const { setPaginaHome, setPaginaClientes, setPaginaDetalhesCliente, setPaginaCobrancas } = useContext(ContextGlobal);

    const [clienteAtual, setClienteAtual] = useState([]);
    const [cobrancasClienteAtual, setCobrancasClienteAtual] = useState([]);

    const [modalEditarCliente, setModalEditarCliente] = useState(false);

    const [addCobrancaCliente, setAddCobrancaCliente] = useState({ id: '', nome: '' });
    const [modalAddCobranca, setModalAddCobranca] = useState(false);

    const [modalExcluirCobranca, setModalExcluirCobranca] = useState(false);
    const [cobrancaIdStatus, setCobrancaIdStatus] = useState({ id: '', status: '' });

    const [editarCobranca, setEditarCobranca] = useState({ nome: '', descricao: '', status: '', valor: '', vencimento: '' });
    const [modalEditarCobranca, setModalEditarCobranca] = useState(false);

    const [modalDetalhesCobranca, setModalDetalhesCobranca] = useState(false);
    const [detalhesCobrancaId, setDetalhesCobrancaId] = useState('');

    const [ordemIdCresc, setOrdemIdCresc] = useState(false);
    const [ordemDataAsc, setOrdemDataAsc] = useState(true);

    const token = getItem('token');
    const clienteId = getItem('clienteId');

    useEffect(() => {
        carregarDadosClienteSelecionado();
        carregarCobrancasClienteSelecionado();

        setPaginaHome(false);
        setPaginaClientes(true);
        setPaginaCobrancas(false);
        setPaginaDetalhesCliente(true);

    }, []);

    async function carregarDadosClienteSelecionado() {
        try {
            const resposta = await api.get(`/cliente/${clienteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setClienteAtual({ ...resposta.data });
            setAddCobrancaCliente({ id: resposta.data.id, nome: resposta.data.nome });
            setEditarCobranca({ ...editarCobranca, nome: resposta.data.nome });

        } catch (error) {
            console.log(error);
        }
    }

    async function carregarCobrancasClienteSelecionado() {
        try {
            const resposta = await api.get(`/cobranca/cliente/${clienteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setCobrancasClienteAtual([...resposta.data]);

        } catch (error) {
            console.log(error);
        }
    }

    function fecharModalEditarCliente() {
        setModalEditarCliente(false);

        carregarDadosClienteSelecionado();
    }

    function fecharModalAddCobranca() {
        setModalAddCobranca(false);

        carregarCobrancasClienteSelecionado();
    }

    function abrirModalEditarCobranca(cobranca) {
        setModalEditarCobranca(true);

        setEditarCobranca({ ...editarCobranca, id: cobranca.id, descricao: cobranca.descricao, status: cobranca.status, valor: cobranca.valor, vencimento: cobranca.vencimento });
    }

    function fecharModalEditarCobranca() {
        setModalEditarCobranca(false);

        carregarCobrancasClienteSelecionado();
    }

    function abrirModalExcluirCobranca(cobranca) {
        setModalExcluirCobranca(true);
        setCobrancaIdStatus({ id: cobranca.id, status: cobranca.status });
    }

    function fecharModalExcluirCobranca() {
        setModalExcluirCobranca(false);
    }

    function abrirDetalherCobranca(cobrancaId) {
        setModalDetalhesCobranca(true);

        setDetalhesCobrancaId(cobrancaId);
    }

    function ordenarId() {
        setOrdemIdCresc(!ordemIdCresc);

        const ordemId = [...cobrancasClienteAtual].sort((a, b) => {
            if (ordemIdCresc) {
                return b.id - a.id;
            }
            return a.id - b.id;

        });

        setCobrancasClienteAtual(ordemId);
    }

    function ordenarData() {
        setOrdemDataAsc(!ordemDataAsc);

        const ordemAZ = [...cobrancasClienteAtual].sort((a, b) => {
            if (ordemDataAsc) {
                return a.vencimento.localeCompare(b.vencimento);
            }

            return b.vencimento.localeCompare(a.vencimento);
        });

        setCobrancasClienteAtual(ordemAZ);
    }


    return (
        <div className='container-home'>

            <MenuLateral />

            <div className='conteudo-home'>

                <Header />

                <div className='container-clientes'>
                    <img className='iconeCadastro' src={IconeCadastro} alt='Icone Cadastro' />
                    <h1>{clienteAtual.nome}</h1>
                </div>

                <div className='container-detalhes-cliente subtitulo'>
                    <div className='detalhes-cliente-titulo'>
                        <h3>Dados do cliente</h3>
                        <button
                            className='btn-cinza-8'
                            onClick={() => setModalEditarCliente(true)}
                        >
                            <img src={IconeEditarVerde} alt='Editar Cliente' />
                            Editar Cliente
                        </button>
                    </div>

                    <div className='dados-cliente primeira-linha'>
                        <div>
                            <p>E-mail</p>
                            <span className='corpo-normal'>{clienteAtual.email}</span>
                        </div>
                        <div>
                            <p>Telefone</p>
                            <span className='corpo-normal'>{clienteAtual.telefone ? clienteAtual.telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3") : null}</span>
                        </div>
                        <div>
                            <p>CPF</p>
                            <span className='corpo-normal'>{clienteAtual.cpf ? clienteAtual.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : null}</span>
                        </div>
                    </div>

                    <div className='dados-cliente segunda-linha'>
                        <div>
                            <p>Endereço</p>
                            <span className='corpo-normal'>{clienteAtual.endereco}</span>
                        </div>
                        <div>
                            <p>Bairro</p>
                            <span className='corpo-normal'>{clienteAtual.bairro}</span>
                        </div>
                        <div>
                            <p>Complemento</p>
                            <span className='corpo-normal'>{clienteAtual.complemento}</span>
                        </div>
                        <div>
                            <p>CEP</p>
                            <span className='corpo-normal'>{clienteAtual.cep ? clienteAtual.cep.replace(/(\d{5})(\d{3})/, "$1-$2") : null}</span>
                        </div>
                        <div>
                            <p>Cidade</p>
                            <span className='corpo-normal'>{clienteAtual.cidade}</span>
                        </div>
                        <div>
                            <p>UF</p>
                            <span className='corpo-normal'>{clienteAtual.uf}</span>
                        </div>
                    </div>
                </div>

                <div className='container-detalhes-cliente subtitulo'>
                    <div className='detalhes-cliente-titulo'>
                        <h3>Cobranças do Cliente</h3>
                        <button
                            className='btn-rosa-medio'
                            onClick={() => setModalAddCobranca(true)}
                        >
                            + Adicionar Cobrança
                        </button>
                    </div>

                    <div className='tabela-cobrancas-cliente'>
                        <div className='tabela-cob-cliente-titulo'>
                            <div className='ordenar-clientes'>
                                <img
                                    src={IconeOrdenar}
                                    alt='Ordenar'
                                    onClick={() => ordenarId()}
                                />
                                <h3>ID Cob.</h3>
                            </div>
                            <div className='ordenar-clientes'>
                                <img
                                    src={IconeOrdenar}
                                    alt='Ordenar'
                                    onClick={() => ordenarData()}
                                />
                                <h3>Data venc.</h3>
                            </div>
                            <h3>Valor</h3>
                            <h3>Status</h3>
                            <h3>Descrição</h3>
                        </div>

                        {cobrancasClienteAtual.map((cobranca) => (
                            <div
                                className='tabela-cob-cliente corpoPequeno'
                                key={cobranca.id}
                            >
                                <span
                                    className='cursor-pointer'
                                    onClick={() => abrirDetalherCobranca(cobranca.id)}
                                >
                                    {cobranca.id}
                                </span>

                                <span
                                    className='cursor-pointer'
                                    onClick={() => abrirDetalherCobranca(cobranca.id)}
                                >
                                    {format(new Date(cobranca.vencimento.slice(0, -5)), 'dd/MM/yyyy', { locale: ptBR })}
                                </span>

                                <span
                                    className='cursor-pointer'
                                    onClick={() => abrirDetalherCobranca(cobranca.id)}
                                >
                                    {`R$ ${formatarValor(cobranca.valor)}`}
                                </span>

                                <div
                                    className='cliente-status cursor-pointer'
                                    onClick={() => abrirDetalherCobranca(cobranca.id)}
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
                                    onClick={() => abrirDetalherCobranca(cobranca.id)}
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

                    </div>


                </div>
            </div>

            {modalEditarCliente &&
                <EditarClienteModal
                    clienteAtual={clienteAtual}
                    fecharModalEditarCliente={fecharModalEditarCliente}
                />}

            {modalAddCobranca &&
                <AddCobrancaModal
                    addCobrancaCliente={addCobrancaCliente}
                    fecharModalAddCobranca={fecharModalAddCobranca}
                />}

            {modalEditarCobranca &&
                <EditarCobrancaModal
                    editarCobranca={editarCobranca}
                    fecharModalEditarCobranca={fecharModalEditarCobranca}
                />}

            {modalExcluirCobranca &&
                <ExcluirCobrancaModal
                    fecharModalExcluirCobranca={fecharModalExcluirCobranca}
                    cobrancaIdStatus={cobrancaIdStatus}
                    carregarCobrancas={carregarCobrancasClienteSelecionado}
                />}

            {modalDetalhesCobranca &&
                <DetalhesCobrancaModal
                    detalhesCobrancaId={detalhesCobrancaId}
                    setModalDetalhesCobranca={setModalDetalhesCobranca}
                />}
        </div>
    );
}

export default Clientes;