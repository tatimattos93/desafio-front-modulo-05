import './style.css';
import IconeClienteInadimplente from '../../assets/iconeClienteInadimplente.svg';
import { ContextGlobal } from '../../context/ContextGlobal';
import api from '../../service/api';
import { getItem } from '../../utils/storage';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function ClientesInadimplentes() {
    const { setAplicarFiltroClientes } = useContext(ContextGlobal);

    const [resumoInadimplentes, setResumoInadimplentes] = useState([]);
    const [qtdInadimplentes, setQtdInadimplentes] = useState('');

    const token = getItem('token');

    const navigate = useNavigate();

    useEffect(() => {
        carregarClientesInadimplentes();
    }, []);

    async function carregarClientesInadimplentes() {
        try {
            const resposta = await api.get('/clientes/inadimplentes', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setResumoInadimplentes([...resposta.data.clientesInadimplentes]);
            setQtdInadimplentes(resposta.data.total);

        } catch (error) {
            console.log(error)
        }
    }

    function verTodosClientesEmDia() {
        setAplicarFiltroClientes({ status: 'inadimplente' });

        navigate('/clientes');
    }

    return (
        <div className='card-clientes-conteudo'>
            <div className='card-clientes-header'>
                <div className='header-titulo'>
                    <img src={IconeClienteInadimplente} alt='Ícone' />
                    <h3 className='h3-semi-negrito'>Clientes Inadimplentes</h3>
                </div>
                <h4 className='numero-cobrancas clientes-inadimplentes'>{qtdInadimplentes}</h4>
            </div>

            <div className='card-conteudo'>
                <div className='titulo-tabela'>
                    <p className='subtitulo'>Cliente</p>
                    <p className='subtitulo'>ID do Clie.</p>
                    <p className='subtitulo'>CPF</p>
                </div>

                {resumoInadimplentes.map((cliente) => (
                    <div key={cliente.id} className='conteudo-tabela'>
                    <span className='corpo-pequeno'>{cliente.cliente}</span>
                    <span className='corpo-pequeno'>{cliente.id}</span>
                    <span className='corpo-pequeno'>{cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</span>
                </div>
                ))}

            </div>

            <div className='card-footer'>
                <a
                    href='#'
                    className='h3-semi-negrito'
                    onClick={() => verTodosClientesEmDia()}
                >
                    Ver todos
                </a>
            </div>
        </div>
    );
}

export default ClientesInadimplentes;