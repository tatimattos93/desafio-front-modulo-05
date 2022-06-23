import { useEffect, useState } from 'react';
import api from '../../service/api';
import { getItem } from '../../utils/storage';
import {formatarValor} from '../../utils/formatarValores';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import './style.css';
import '../../styles/modalSucesso.css';
import fecharIcone from '../../assets/fecharicone.png';
import IconeModalAddCobranca from '../../assets/iconeModalAddCobranca.svg';

export function DetalhesCobrancaModal({ detalhesCobrancaId, setModalDetalhesCobranca }) {
    const token = getItem('token');

    const [cobranca, setCobranca] = useState({});

    const dataAtual = new Date();

    useEffect(() => {
        carregarDadosCobranca();
    }, []);

    async function carregarDadosCobranca() {
        try {
            const resposta = await api.get(`/cobranca/${detalhesCobrancaId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setCobranca(resposta.data);

        } catch (error) {
            toast.error(error.response.data);
        }
    }

    function fecharModal() {
        setModalDetalhesCobranca(false);
    }

    return (
        <>
            <div className='backdrop'>
                <div className='modal modal-cobranca'>
                    <img
                        src={fecharIcone}
                        alt='Fechar'
                        className='fechar-icone'
                        onClick={() => fecharModal()}
                    />

                    <div className='titulo-cliente mr20'>
                        <img
                            src={IconeModalAddCobranca}
                            alt='Cadastro Cobrança'
                        />
                        <h1>Detalhe da Cobrança</h1>
                    </div>

                    <div className='detalhes-cobranca'>
                        <span className='subtitulo'>Nome</span>
                        <span className='subtitulo fw400'>{cobranca.cliente}</span>

                        <span className='subtitulo'>Descrição</span>
                        <span className='subtitulo fw400'>{cobranca.descricao}</span>

                        <div className='display-row detalhes-cobranca-grid'>
                            <div className='display-column'>
                                <span className='subtitulo'>Vencimento</span>
                                <span className='subtitulo fw400'>{cobranca.vencimento ? format(new Date(cobranca.vencimento.slice(0, -5)), 'dd/MM/yyyy', { locale: ptBR }) : ''}</span>
                            </div>

                            <div className='display-column'>
                                <span className='subtitulo'>Valor</span>
                                <span className='subtitulo fw400'>{`R$ ${formatarValor(cobranca.valor)}`}</span>
                            </div>
                        </div>

                        <div className='display-row detalhes-cobranca-grid'>
                            <div className='display-column'>
                                <span className='subtitulo'>ID Cobrança</span>
                                <span className='subtitulo fw400 mb0'>{cobranca.id}</span>
                            </div>

                            <div className='display-column'>
                                <span className='subtitulo'>Status</span>
                                <span className='subtitulo fw400 mb0'>
                                    {cobranca.status === 'pago' &&
                                        <span className='status-atual cobranca-paga'>Paga</span>}

                                    {cobranca.status === 'pendente' &&
                                        <span className='status-atual cobranca-previsto'>Pendente</span>}

                                    {cobranca.status === 'vencida' &&
                                        <span className='status-atual cobranca-vencida'>Vencida</span>}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default DetalhesCobrancaModal;