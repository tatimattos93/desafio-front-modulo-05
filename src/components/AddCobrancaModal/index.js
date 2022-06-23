import { useEffect, useState } from 'react';
import api from '../../service/api';
import { getItem } from '../../utils/storage';
import { toast } from 'react-toastify';

import './style.css';
import '../../styles/modalSucesso.css';
import fecharIcone from '../../assets/fecharicone.png';
import IconeModalAddCobranca from '../../assets/iconeModalAddCobranca.svg';
import CheckModalSucesso from '../../assets/checkModalSucesso.svg';
import FecharModalSucesso from '../../assets/fecharModalSucesso.svg';

export function AddCobrancaModal({ addCobrancaCliente, fecharModalAddCobranca }) {
    const token = getItem('token');

    const [formCadastro, setFormCadastro] = useState({
        nome: addCobrancaCliente.nome, descricao: '', vencimento: '', valor: '', status: 'pago'
    });

    const [erroDescricao, setErroDescricao] = useState(false);
    const [erroVencimento, setErroVencimento] = useState(false);
    const [erroValor, setErroValor] = useState(false);

    const AddCobrancaModalSucesso = ({ closeToast }) => (
        <div className='modal-sucesso-conteudo'>
            <div className='check-texto'>
                <img src={CheckModalSucesso} alt='Sucesso' />
                <span>Cobrança cadastrada com sucesso</span>
            </div>
            <img src={FecharModalSucesso} alt='Fechar' onClick={closeToast} />
        </div>
    );

    function limparForm() {
        setFormCadastro({
            nome: addCobrancaCliente.nome, descricao: '', vencimento: '', valor: '', status: 'pago'
        });
    }

    function changeDescricao(e) {
        if (!e.target.value) {
            setErroDescricao(true);
            return;
        }
        setErroDescricao(false);
    }

    function changeVencimento(e) {
        if (!e.target.value) {
            setErroVencimento(true);
            return;
        }
        setErroVencimento(false);
    }

    function changeValor(e) {
        if (!e.target.value) {
            setErroValor(true);
            return;
        }
        setErroValor(false);
    }

    async function gerenciarAplicar(e) {
        e.preventDefault();

        if (!formCadastro.descricao && !formCadastro.vencimento && !formCadastro.valor) {
            setErroDescricao(true);
            setErroVencimento(true);
            setErroValor(true);
            return;
        }

        if (!formCadastro.descricao) {
            setErroDescricao(true);
            return;
        }

        if (!formCadastro.vencimento) {
            setErroVencimento(true);
            return;
        }

        if (!formCadastro.valor) {
            setErroValor(true);
            return;
        }

        setErroDescricao(false);
        setErroVencimento(false);
        setErroValor(false);

        try {
            const resposta = await api.post(`/cobrancas/cadastro/${addCobrancaCliente.id}`, {
                cliente_id: addCobrancaCliente.id,
                descricao: formCadastro.descricao,
                vencimento: formCadastro.vencimento,
                valor: formCadastro.valor * 100,
                status: formCadastro.status
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (resposta.status > 204) {
                return;
            }

            limparForm();
            fecharModalAddCobranca();

            toast(<AddCobrancaModalSucesso />, {
                className: 'modal-sucesso',
                closeButton: false,
                pauseOnFocusLoss: false,
                position: toast.POSITION.BOTTOM_RIGHT
            });

        } catch (error) {
            toast.error(error.response.data);
        }
    }

    function fecharECancelarModal() {
        limparForm();
        fecharModalAddCobranca();

        setErroDescricao(false);
        setErroVencimento(false);
        setErroValor(false);
    }

    return (
        <>
            <div className='backdrop'>
                <div className='modal modal-cobranca'>
                    <img
                        src={fecharIcone}
                        alt='Fechar'
                        className='fechar-icone'
                        onClick={() => fecharECancelarModal()}
                    />

                    <div className='titulo-cliente'>
                        <img
                            src={IconeModalAddCobranca}
                            alt='Cadastro Cobrança'
                        />
                        <h1>Cadastro de Cobrança</h1>
                    </div>

                    <form className='form-modal form-cobranca'
                        onSubmit={(e) => gerenciarAplicar(e)}
                    >
                        <label htmlFor='nome'>Nome*</label>
                        <input
                            type='text'
                            name='nome'
                            placeholder='Digite o nome'
                            value={formCadastro.nome}
                            onChange={() => setFormCadastro({ ...formCadastro, nome: formCadastro.nome })}
                        />

                        <div className='input-flex-column mb0'>
                            <label htmlFor='descricao'>Descrição*</label>
                            <textarea
                                type='text'
                                name='descricao'
                                className={erroDescricao ? 'input-descricao input-erro' : 'input-descricao'}
                                placeholder='Digite a descrição'
                                value={formCadastro.descricao}
                                onChange={(e) => setFormCadastro
                                    ({ ...formCadastro, descricao: e.target.value })}
                                onBlur={(e) => changeDescricao(e)}
                            />
                            {erroDescricao &&
                                <span className='mensagem-erro botton-4 corpo-minusculo'>Este campo deve ser preenchido</span>}
                        </div>

                        <div className='display-row'>
                            <div className='display-column'>
                                <label htmlFor='vencimento'>Vencimento*</label>
                                <input
                                    type='date'
                                    name='vencimento'
                                    className={erroVencimento ? 'input-erro mb12' : 'mb12'}
                                    placeholder='Data de vencimento'
                                    value={formCadastro.vencimento}
                                    onChange={(e) => setFormCadastro({ ...formCadastro, vencimento: e.target.value })}
                                    onBlur={(e) => changeVencimento(e)}
                                />
                                {erroVencimento &&
                                    <span className='mensagem-erro botton-4 corpo-minusculo'>Este campo deve ser preenchido</span>}
                            </div>
                            <div className='display-column'>
                                <label htmlFor='valor'>Valor*</label>
                                <input
                                    type='number'
                                    name='valor'
                                    className={erroValor ? 'input-erro input-number mb12' : 'input-number mb12'}
                                    placeholder='Digite o valor'
                                    value={formCadastro.valor}
                                    onChange={(e) => setFormCadastro({ ...formCadastro, valor: e.target.value })}
                                    onBlur={(e) => changeValor(e)}
                                />
                                {erroValor &&
                                    <span className='mensagem-erro corpo-minusculo'>Este campo deve ser preenchido</span>}
                            </div>
                        </div>

                        <label htmlFor='status'>Status*</label>
                        <div className='selecionar-status'>
                            <label
                                htmlFor='opcao-pago'
                                className='selecionar-status'>
                                <input
                                    type='radio'
                                    id='opcao-pago'
                                    name='opcoes-status'
                                    className='checkbox-input'
                                    value='pago'
                                    checked={formCadastro.status === 'pago' ? true : false}
                                    onChange={(e) => setFormCadastro({ ...formCadastro, status: e.target.value })}
                                />
                                Cobrança Paga
                            </label>

                            <label
                                htmlFor='opcao-pendente'
                                className='selecionar-status'>
                                <input
                                    type='radio'
                                    id='opcao-pendente'
                                    name='opcoes-status'
                                    className='checkbox-input'
                                    value='pendente'
                                    checked={formCadastro.status === 'pendente' ? true : false}
                                    onChange={(e) => setFormCadastro({ ...formCadastro, status: e.target.value })}
                                />
                                Cobrança Pendente
                            </label>
                        </div>



                        <div className='display-row'>
                            <button className='btn-rosa-medio'
                                style={{ marginRight: '2.2rem' }}
                                type='submit'
                            >Aplicar
                            </button>

                            <button
                                className='btn-cinza-8'
                                type='button'
                                onClick={() => fecharECancelarModal()}
                            >Cancelar</button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    );
}

export default AddCobrancaModal;