import MenuLateral from '../../components/MenuLateral';
import Header from '../../components/Header';
import CobrancasVencidas from '../../components/CobrancasVencidas';
import CobrancasPendentes from '../../components/CobrancasPendentes';
import CobrancasPagas from '../../components/CobrancasPagas';
import ClientesInadimplentes from '../../components/ClientesInadimplentes';
import ClientesEmDia from '../../components/ClientesEmDia';

import './style.css';
import IconeCobrancaPaga from '../../assets/iconeCobrancaPaga.svg';
import IconeCobrancaVencida from '../../assets/iconeCobrancaVencida.svg';
import IconeCobrancaPrevista from '../../assets/iconeCobrancaPrevista.svg';
import { useEffect, useState } from 'react';
import { ContextGlobal } from '../../context/ContextGlobal';
import { useContext } from 'react';
import { getItem } from '../../utils/storage';
import {formatarValor} from '../../utils/formatarValores';
import api from '../../service/api';

export function Home() {
    const { setPaginaHome, setPaginaClientes, setPaginaDetalhesCliente, setPaginaCobrancas, setAplicarFiltroClientes, setAplicarFiltroCobrancas } = useContext(ContextGlobal);

    const token = getItem('token');

    const [totalCobrancas, setTotalCobrancas] = useState({});

    useEffect(() => {
        carregarTotalCobrancasPorStatus();

        setPaginaHome(true);
        setPaginaClientes(false);
        setPaginaCobrancas(false);
        setPaginaDetalhesCliente(false);

        setAplicarFiltroClientes({ status: '' });
        setAplicarFiltroCobrancas({ status: '', vencimento: '' });
    }, []);

    async function carregarTotalCobrancasPorStatus() {
        try {
            const resposta = await api.get('/cobrancas/total', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }

            setTotalCobrancas(resposta.data);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container-home'>

            <MenuLateral />

            <div className='conteudo-home'>

                <Header />

                <div className='home-cobrancas'>
                    <div className='resumo-cobrancas'>
                        <div className='card-resumo-cobranca vencida'>
                            <img src={IconeCobrancaVencida} alt='Cobrança Vencida' />
                            <div className='card-resumo-conteudo'>
                                <h3 className='h3-negrito'>Cobranças Vencidas</h3>
                                <h2>{`R$ ${formatarValor(totalCobrancas.total_Vencida ? totalCobrancas.total_Vencida : '0')}`}</h2>
                            </div>
                        </div>

                        <div className='card-resumo-cobranca prevista'>
                            <img src={IconeCobrancaPrevista} alt='Cobrança Prevista' />
                            <div className='card-resumo-conteudo'>
                                <h3 className='h3-negrito'>Cobranças Pendentes</h3>
                                <h2>{`R$ ${formatarValor(totalCobrancas.total_Pendente ? totalCobrancas.total_Pendente : '0')}`}</h2>
                            </div>
                        </div>

                        <div className='card-resumo-cobranca paga'>
                            <img src={IconeCobrancaPaga} alt='Cobrança Paga' />
                            <div className='card-resumo-conteudo'>
                                <h3 className='h3-negrito'>Cobranças Pagas</h3>
                                <h2>{`R$ ${formatarValor(totalCobrancas.total_Pago ? totalCobrancas.total_Pago : '0')}`}</h2>
                            </div>
                        </div>
                    </div>

                    <div className='detalhes-cobrancas'>
                        <CobrancasVencidas />
                        <CobrancasPendentes />
                        <CobrancasPagas />
                    </div>

                    <div className='detalhes-clientes'>
                        <ClientesInadimplentes />
                        <ClientesEmDia />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;