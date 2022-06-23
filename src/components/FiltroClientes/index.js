import api from '../../service/api';
import { getItem } from '../../utils/storage';
import { ContextGlobal } from '../../context/ContextGlobal';
import { useContext, useEffect } from 'react';

import './style.css';
import '../../styles/modalSucesso.css';
import SetaBackgroundModalSair from '../../assets/setaBackgroundModalSair.svg';

export function FiltroClientes({ modalFiltro, carregarClientes, setClientes, setListaClientes, setSemResultado }) {

    const { aplicarFiltroClientes, setAplicarFiltroClientes } = useContext(ContextGlobal);

    const token = getItem('token');

    function filtrar(e) {
        aplicarFiltroClientes.status === e.target.value
            ? setAplicarFiltroClientes({ ...aplicarFiltroClientes, status: '' })
            : setAplicarFiltroClientes({ ...aplicarFiltroClientes, status: e.target.value });
    }

    async function gerenciarFiltro() {
        setSemResultado(false);

        if (!aplicarFiltroClientes.status) {
            carregarClientes();
        }

        try {
            const resposta = await api.get('/clientes', {
                params: {
                    filtro: aplicarFiltroClientes.status
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

            setClientes([...resposta.data]);
            setListaClientes([...resposta.data]);
            modalFiltro();

        } catch (error) {
            console.log(error);
        }
    }

    function limparFiltro() {
        setAplicarFiltroClientes({ status: '' });
        setSemResultado(false);
        carregarClientes();
        modalFiltro();
    }


    return (
        <>
            <div className='modal-filtro pg-clientes'>
                <img
                    className='seta-background-modal'
                    src={SetaBackgroundModalSair}
                    alt='Seta'
                />
                <span className='corpo-pequeno'>Status</span>

                <label
                    htmlFor='opcao-pendente'
                    className='corpo-normal label-checkbox-input'>
                    <input
                        type='radio'
                        id='opcao-pendente'
                        name='opcoes-filtro'
                        className='checkbox-input'
                        value='inadimplente'
                        checked={aplicarFiltroClientes.status === 'inadimplente' ? true : false}
                        onClick={(e) => filtrar(e)}
                        onChange={(e) => setAplicarFiltroClientes({ ...aplicarFiltroClientes, status: e.target.value })}
                    />
                    Inadimplentes
                </label>

                <label
                    htmlFor='opcao-pago'
                    className='corpo-normal label-checkbox-input'>
                    <input
                        type='radio'
                        id='opcao-pago'
                        name='opcoes-filtro'
                        className='checkbox-input'
                        value='em dia'
                        checked={aplicarFiltroClientes.status === 'em dia' ? true : false}
                        onClick={(e) => filtrar(e)}
                        onChange={(e) => setAplicarFiltroClientes({ ...aplicarFiltroClientes, status: e.target.value })}
                    />
                    Em dia
                </label>

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

export default FiltroClientes;