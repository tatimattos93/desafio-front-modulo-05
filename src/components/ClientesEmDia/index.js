import './style.css';
import IconeClienteEmDia from '../../assets/iconeClienteEmDia.svg';
import { ContextGlobal } from '../../context/ContextGlobal';
import api from '../../service/api';
import { getItem } from '../../utils/storage';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ClientesEmDia() {
    const { setAplicarFiltroClientes } = useContext(ContextGlobal);

    const [resumoEmDia, setResumoEmDia] = useState([]);
    const [qtdEmDia, setQtdEmDia] = useState('');

    const token = getItem('token');

    const navigate = useNavigate();

    useEffect(() => {
        carregarClientesEmDia();
    }, []);

    async function carregarClientesEmDia() {
        try {
            const resposta = await api.get('/clientes/em_dia', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setResumoEmDia([...resposta.data.clientesEmDia]);
            setQtdEmDia(resposta.data.total);
            

        } catch (error) {
            console.log(error);
        }
    }

    function verTodosClientesEmDia() {
        setAplicarFiltroClientes({ status: 'em dia' });

        navigate('/clientes');
    }

    return (
        <div className='card-clientes-conteudo'>
            <div className='card-clientes-header'>
                <div className='header-titulo'>
                    <img src={IconeClienteEmDia} alt='Ícone' />
                    <h3 className='h3-semi-negrito'>Clientes em dia</h3>
                </div>
                <h4 className='numero-cobrancas clientes-em-dia'>{qtdEmDia}</h4>
            </div>

            <div className='card-conteudo'>
                <div className='titulo-tabela'>
                    <p className='subtitulo'>Cliente</p>
                    <p className='subtitulo'>ID da Clie.</p>
                    <p className='subtitulo'>CPF</p>
                </div>

                {resumoEmDia.map((cliente) => (
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

export default ClientesEmDia;