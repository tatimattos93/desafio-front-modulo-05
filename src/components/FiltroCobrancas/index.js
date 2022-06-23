import api from '../../service/api';
import { getItem } from '../../utils/storage';
import { ContextGlobal } from '../../context/ContextGlobal';
import { useContext } from 'react';

import './style.css';
import '../../styles/modalSucesso.css';
import SetaBackgroundModalSair from '../../assets/setaBackgroundModalSair.svg';

export function FiltroCobrancas({ modalFiltro, carregarCobrancas, setCobrancas, setListaCobrancas, setSemResultado }) {

    const { aplicarFiltroCobrancas, setAplicarFiltroCobrancas } = useContext(ContextGlobal);

    const token = getItem('token');

    function filtrar(e) {
        aplicarFiltroCobrancas.status === e.target.value
            ? setAplicarFiltroCobrancas({ ...aplicarFiltroCobrancas, status: '' })
            : setAplicarFiltroCobrancas({ ...aplicarFiltroCobrancas, status: e.target.value });
    }

    async function gerenciarFiltro() {
        setSemResultado(false);

        if (!aplicarFiltroCobrancas.status || !aplicarFiltroCobrancas.vencimento) {
            carregarCobrancas();
        }

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
            modalFiltro();

        } catch (error) {
            console.log(error);
        }
    }

    function limparFiltro() {
        setAplicarFiltroCobrancas({ status: '', vencimento: '' });
        setSemResultado(false);
        carregarCobrancas();
        modalFiltro();
    }


    return (
        <>
            <div className='modal-filtro'>
                <img
                    className='seta-background-modal'
                    src={SetaBackgroundModalSair}
                    alt='Seta'
                />
                <span className='corpo-pequeno'>Status</span>

                <label
                    htmlFor='opcao-vencida'
                    className='corpo-normal label-checkbox-input'>
                    <input
                        type='radio'
                        id='opcao-vencida'
                        name='opcoes-filtro'
                        className='checkbox-input'
                        value='vencida'
                        checked={aplicarFiltroCobrancas.status === 'vencida' ? true : false}
                        onClick={(e) => filtrar(e)}
                        onChange={(e) => setAplicarFiltroCobrancas({ ...aplicarFiltroCobrancas, status: e.target.value })}
                    />
                    Vencidas
                </label>

                <label
                    htmlFor='opcao-pendente'
                    className='corpo-normal label-checkbox-input'>
                    <input
                        type='radio'
                        id='opcao-pendente'
                        name='opcoes-filtro'
                        className='checkbox-input'
                        value='pendente'
                        checked={aplicarFiltroCobrancas.status === 'pendente' ? true : false}
                        onClick={(e) => filtrar(e)}
                        onChange={(e) => setAplicarFiltroCobrancas({ ...aplicarFiltroCobrancas, status: e.target.value })}
                    />
                    Pendentes
                </label>

                <label
                    htmlFor='opcao-pago'
                    className='corpo-normal label-checkbox-input'>
                    <input
                        type='radio'
                        id='opcao-pago'
                        name='opcoes-filtro'
                        className='checkbox-input'
                        value='pago'
                        checked={aplicarFiltroCobrancas.status === 'pago' ? true : false}
                        onClick={(e) => filtrar(e)}
                        onChange={(e) => setAplicarFiltroCobrancas({ ...aplicarFiltroCobrancas, status: e.target.value })}
                    />
                    Pagas
                </label>

                <label htmlFor='filtro-data' className='corpo-pequeno label-data'>Data</label>
                <input
                    type='date'
                    id='filtro-data'
                    name='opcoes-filtro'
                    className='input-data'
                    value={aplicarFiltroCobrancas.vencimento}
                    onChange={(e) => setAplicarFiltroCobrancas({ ...aplicarFiltroCobrancas, vencimento: e.target.value })}
                />

                <button
                    type='button'
                    className='btn-rosa-medio btn-filtro'
                    onClick={() => gerenciarFiltro()}
                >
                    Aplicar
                </button>
                <button
                    type='button'
                    className='btn-cinza-8 btn-filtro'
                    onClick={() => limparFiltro()}
                >
                    Limpar
                </button>
            </div>
        </>
    );
}

export default FiltroCobrancas;