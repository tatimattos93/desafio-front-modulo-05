import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import Home from './pages/Home';
import Cobrancas from './pages/Cobrancas';
import Clientes from './pages/Clientes';
import DetalhesCliente from './pages/DetalhesCliente';
import { getItem } from './utils/storage';
import { useState } from 'react';
import { ContextGlobal } from './context/ContextGlobal';

function RotasProtegidas(redirecionar) {
  const autenticada = getItem('token');

  return autenticada ? <Outlet /> : <Navigate to={redirecionar} />
}

function MainRotas() {

  const [paginaHome, setPaginaHome] = useState(false);
  const [paginaClientes, setPaginaClientes] = useState(false);
  const [paginaDetalhesCliente, setPaginaDetalhesCliente] = useState(false);
  const [paginaCobrancas, setPaginaCobrancas] = useState(false);
  const [aplicarFiltroClientes, setAplicarFiltroClientes] = useState({ status: '' });
  const [aplicarFiltroCobrancas, setAplicarFiltroCobrancas] = useState({ status: '', vencimento: '' });

  return (
    <div>
      <ContextGlobal.Provider value={{
        paginaHome, setPaginaHome,
        paginaClientes, setPaginaClientes,
        paginaDetalhesCliente, setPaginaDetalhesCliente,
        paginaCobrancas, setPaginaCobrancas,
        aplicarFiltroClientes, setAplicarFiltroClientes,
        aplicarFiltroCobrancas, setAplicarFiltroCobrancas
      }} >
        <Routes>
          <Route>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
          </Route>

          <Route path='/cadastro-usuario' element={<CadastroUsuario />} />

          <Route element={<RotasProtegidas redirecionar={<Login />} />}>
            <Route path='/home' element={<Home />} />

            <Route path='/clientes' element={<Clientes />} />

            <Route path='/clientes/detalhes' element={<DetalhesCliente />} />

            <Route path='/cobrancas' element={<Cobrancas />} />
          </Route>

        </Routes>
      </ContextGlobal.Provider>
    </div>
  );
}

export default MainRotas;
