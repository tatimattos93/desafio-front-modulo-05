import './style.css';
import { ContextGlobal } from '../../context/ContextGlobal';
import api from '../../service/api';
import { getItem } from '../../utils/storage';
import {formatarValor} from '../../utils/formatarValores';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CobrancasPendentes() {
    const { setAplicarFiltroCobrancas } = useContext(ContextGlobal);

    const [resumoPendentes, setResumoPendentes] = useState([]);
    const [qtdPendentes, setQtdPendentes] = useState('');

    const navigate = useNavigate();

    const token = getItem('token');

    useEffect(() => {
        carregarCobrancasPendentes();
    }, []);

    async function carregarCobrancasPendentes() {
        try {
            const resposta = await api.get('/cobrancas/pendentes', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setResumoPendentes([...resposta.data.cobrancasPendentes]);
            setQtdPendentes(resposta.data.total);

        } catch (error) {
            console.log(error);
        }
    }

    function verTodasCobrancasPagas() {
        setAplicarFiltroCobrancas({ status: 'pendente', vencimento: '' });

        navigate('/cobrancas');
    }

    return (
        <div className='card-cobrancas-conteudo'>
            <div className='card-header'>
                <h3 className='h3-semi-negrito'>Cobranças Pendentes</h3>
                <h4 className='numero-cobrancas cobranca-prevista'>{qtdPendentes}</h4>
            </div>

            <div className='card-conteudo'>
                <div className='titulo-tabela'>
                    <p className='subtitulo'>Cliente</p>
                    <p className='subtitulo'>ID da cob.</p>
                    <p className='subtitulo'>Valor</p>
                </div>

                {resumoPendentes.map((cobranca) => (
                    <div key={cobranca.id} className='conteudo-tabela'>
                    <span className='corpo-pequeno'>{cobranca.cliente}</span>
                    <span className='corpo-pequeno'>{cobranca.id}</span>
                    <span className='corpo-pequeno'>{`R$ ${formatarValor(cobranca.valor)}`}</span>
                </div>
                ))}

            </div>

            <div className='card-footer'>
                <a
                    href='#'
                    className='h3-semi-negrito'
                    onClick={() => verTodasCobrancasPagas()}
                >
                    Ver todos
                </a>
            </div>
        </div>
    );
}

export default CobrancasPendentes;