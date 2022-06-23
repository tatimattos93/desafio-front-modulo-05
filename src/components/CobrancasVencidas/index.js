import './style.css';
import { ContextGlobal } from '../../context/ContextGlobal';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItem } from '../../utils/storage';
import {formatarValor} from '../../utils/formatarValores';
import api from '../../service/api';

export function CobrancasVencidas() {
    const { setAplicarFiltroCobrancas } = useContext(ContextGlobal);

    const token = getItem('token');
    const navigate = useNavigate();

    const [resumoVencidas, setResumoVencidas] = useState([]);
    const [qtdVencidas, setQtdVencidas] = useState('');

    useEffect(() => {
        carregarCobrancasVencidas();

    }, []);

    async function carregarCobrancasVencidas() {
        try {
            const resposta = await api.get('/cobrancas/vencidas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setResumoVencidas([...resposta.data.cobrancasVencidas]);
            setQtdVencidas(resposta.data.total);
            console.log(qtdVencidas);
        } catch (error) {
            console.log(error);
        }
    }

    function verTodasCobrancasPagas() {
        setAplicarFiltroCobrancas({ status: 'vencida', vencimento: '' });

        navigate('/cobrancas');
    }

    return (
        <div className='card-cobrancas-conteudo'>
            <div className='card-header'>
                <h3 className='h3-semi-negrito'>Cobranças Vencidas</h3>
                <h4 className='numero-cobrancas cobranca-vencida'>{qtdVencidas}</h4>
            </div>

            <div className='card-conteudo'>
                <div className='titulo-tabela'>
                    <p className='subtitulo'>Cliente</p>
                    <p className='subtitulo'>ID da cob.</p>
                    <p className='subtitulo'>Valor</p>
                </div>

                {resumoVencidas.map((cobranca) => (
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

export default CobrancasVencidas;