import './style.css';
import { ContextGlobal } from '../../context/ContextGlobal';
import api from '../../service/api';
import {getItem} from '../../utils/storage';
import {formatarValor} from '../../utils/formatarValores';

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function CobrancasPagas() {
    const { setAplicarFiltroCobrancas } = useContext(ContextGlobal);

    const [resumoPagas, setResumoPagas] = useState([]);
    const [qtdPagas, setQtdPagas] = useState('');

    const token = getItem('token');

    const navigate = useNavigate();

    useEffect(() => {
        carregarCobrancasPagas();
    }, []);

    async function carregarCobrancasPagas() {
        try {
            const resposta = await api.get('/cobrancas/pagas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(resposta.status > 204){
                return;
            }

            setResumoPagas([...resposta.data.cobrancasPagas]);
            setQtdPagas(resposta.data.total);

        } catch (error) {
            console.log(error)
        }
    }

    function verTodasCobrancasPagas() {
        setAplicarFiltroCobrancas({ status: 'pago', vencimento: '' });

        navigate('/cobrancas');
    }

    return (
        <div className='card-cobrancas-conteudo'>
            <div className='card-header'>
                <h3 className='h3-semi-negrito'>Cobranças Pagas</h3>
                <h4 className='numero-cobrancas cobranca-paga'>{qtdPagas}</h4>
            </div>

            <div className='card-conteudo'>
                <div className='titulo-tabela'>
                    <p className='subtitulo'>Cliente</p>
                    <p className='subtitulo'>ID da cob.</p>
                    <p className='subtitulo'>Valor</p>
                </div>

                {resumoPagas.map((cobranca) => (
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

export default CobrancasPagas;