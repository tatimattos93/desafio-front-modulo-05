import './style.css';
import BotaoHome from '../../assets/botaoHome.svg';
import BotaoHomeSelecionado from '../../assets/botaoHomeSelecionado.svg';
import BotaoClientes from '../../assets/botaoClientes.svg';
import BotaoClientesSelecionado from '../../assets/botaoClientesSelecionado.svg';
import BotaoCobrancas from '../../assets/botaoCobrancas.svg';
import BotaoCobrancasSelecionado from '../../assets/botaoCobrancasSelecionado.svg';
import { useNavigate } from 'react-router-dom';
import { ContextGlobal } from '../../context/ContextGlobal';
import { useContext } from 'react';

export function MenuLateral() {
    const { paginaHome, setPaginaHome, paginaClientes, setPaginaClientes, paginaCobrancas, setPaginaCobrancas, setAplicarFiltroClientes, setAplicarFiltroCobrancas } = useContext(ContextGlobal);

    const navigate = useNavigate();

    function botaoHome() {
        setPaginaHome(true);
        setPaginaClientes(false);
        setPaginaCobrancas(false);

        navigate('/home');
    }

    function botaoClientes() {
        setPaginaHome(false);
        setPaginaClientes(true);
        setPaginaCobrancas(false);

        setAplicarFiltroClientes({ status: '' });

        navigate('/clientes');
    }

    function botaoCobrancas() {
        setPaginaHome(false);
        setPaginaClientes(false);
        setPaginaCobrancas(true);

        setAplicarFiltroCobrancas({ status: '', vencimento: '' });

        navigate('/cobrancas');
    }

    return (
        <div className='container-menu'>
            <div className='cada-btn'>
                <button
                    className={paginaHome ? 'btn-menu-lateral selecionado' : 'btn-menu-lateral'}
                    onClick={() => botaoHome()}
                >
                    <img src={paginaHome ? BotaoHomeSelecionado : BotaoHome} alt='Home' />
                    <span className='corpo-normal' >Home</span>
                </button>
            </div>

            <div className='cada-btn'>
                <button
                    className={paginaClientes ? 'btn-menu-lateral selecionado' : 'btn-menu-lateral'}
                    onClick={() => botaoClientes()}
                >
                    <img src={paginaClientes ? BotaoClientesSelecionado : BotaoClientes} alt='Clientes' />
                    <span className='corpo-normal'>Clientes</span>
                </button>
            </div>

            <div className='cada-btn'>
                <button
                    className={paginaCobrancas ? 'btn-menu-lateral selecionado' : 'btn-menu-lateral'}
                    onClick={() => botaoCobrancas()}
                >
                    <img src={paginaCobrancas ? BotaoCobrancasSelecionado : BotaoCobrancas} alt='Cobranças' />
                    <span className='corpo-normal'>Cobranças</span>
                </button>
            </div>
        </div >
    );
}

export default MenuLateral;