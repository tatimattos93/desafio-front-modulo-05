import { useEffect, useState } from 'react';
import api from '../../service/api';
import { getItem } from '../../utils/storage';
import { toast } from 'react-toastify';
import { InputCPF, InputTelefone, InputCep } from '../../utils/inputFormatoNumero';

import './style.css';
import fecharIcone from '../../assets/fecharicone.png';
import cadastroIcone from '../../assets/cadastroicone.png';
import CheckModalSucesso from '../../assets/checkModalSucesso.svg';
import FecharModalSucesso from '../../assets/fecharModalSucesso.svg';

export function EditarClienteModal({ clienteAtual, fecharModalEditarCliente }) {
    const token = getItem('token');

    const [formEditarCliente, setFormEditarCliente] =
        useState({
            id: '', nome: '', email: '', cpf: '', telefone: '', endereco: '', complemento: '', cep: '', bairro: '', cidade: '', uf: ''
        });

    const [erroNome, setErroNome] = useState(false);
    const [erroEmail, setErroEmail] = useState(false);
    const [erroEmailExiste, setErroEmailExiste] = useState(false);
    const [erroCpf, setErroCpf] = useState(false);
    const [erroCpfIncompleto, setErroCpfIncompleto] = useState(false);
    const [erroCpfExiste, setErroCpfExiste] = useState(false);
    const [erroTelefone, setErroTelefone] = useState(false);
    const [erroTelefoneIncompleto, setErroTelefoneIncompleto] = useState(false);
    const [erroCepExiste, setErroCepExiste] = useState(false);
    const [erroCepIncompleto, setErroCepIncompleto] = useState(false);

    const EditarClienteModalSucesso = ({ closeToast }) => (
        <div className='modal-sucesso-conteudo'>
            <div className='check-texto'>
                <img src={CheckModalSucesso} alt='Sucesso' />
                <span>Edições do cadastro concluídas com sucesso</span>
            </div>
            <img src={FecharModalSucesso} alt='Fechar' onClick={closeToast} />
        </div>
    );

    useEffect(() => {
        setFormEditarCliente({
            id: clienteAtual.id, nome: clienteAtual.nome, email: clienteAtual.email, cpf: clienteAtual.cpf, telefone: clienteAtual.telefone, endereco: clienteAtual.endereco, complemento: clienteAtual.complemento, cep: clienteAtual.cep, bairro: clienteAtual.bairro, cidade: clienteAtual.cidade, uf: clienteAtual.uf
        });

    }, []);

    function errorNome(e) {
        if (!e.target.value) {
            setErroNome(true);
            return;
        }
        setErroNome(false);
    }

    function errorEmail(e) {
        setErroEmailExiste(false);

        if (!e.target.value) {
            setErroEmail(true);
            return;
        }
        setErroEmail(false);
    }

    function errorCpf(e) {
        setErroCpfExiste(false);
        setErroCpfIncompleto(false);

        if (!e.target.value) {
            setErroCpf(true);
            return;
        }
        setErroCpf(false);
    }

    function errorTelefone(e) {
        setErroTelefoneIncompleto(false);

        if (!e.target.value) {
            setErroTelefone(true);
            return;
        }
        setErroTelefone(false);
    }

    function errorCepExiste() {
        setErroCepIncompleto(false);
        setErroCepExiste(false);
    }

    async function gerenciarAplicar(e) {
        e.preventDefault();

        if (!formEditarCliente.nome && !formEditarCliente.email &&
            !formEditarCliente.cpf && !formEditarCliente.telefone) {
            setErroNome(true);
            setErroEmail(true);
            setErroCpf(true);
            setErroTelefone(true);
            return;
        }

        if (!formEditarCliente.nome) {
            setErroNome(true);
            return;
        }

        if (!formEditarCliente.email) {
            setErroEmail(true);
            return;
        }

        if (!formEditarCliente.cpf) {
            setErroCpf(true);
            return;
        }

        if (!formEditarCliente.telefone) {
            setErroTelefone(true);
            return;
        }

        if (formEditarCliente.cpf.length < 11 && formEditarCliente.telefone.length < 10) {
            setErroCpfIncompleto(true);
            setErroTelefoneIncompleto(true);
            return;
        }

        if (formEditarCliente.cpf.length < 11) {
            setErroCpfIncompleto(true);
            return;
        }

        if (formEditarCliente.telefone.length < 10) {
            setErroTelefoneIncompleto(true);
            return;
        }

        if (formEditarCliente.cep !== '') {
            if (formEditarCliente.cep.length >= 8 && (!formEditarCliente.endereco || !formEditarCliente.bairro || !formEditarCliente.cidade || !formEditarCliente.uf)) {
                setErroCepExiste(true);
                return;
            } else if (formEditarCliente.cep.length < 8) {
                setErroCepIncompleto(true);
                return;
            }
        }

        setErroNome(false);
        setErroEmail(false);
        setErroEmailExiste(false);
        setErroCpf(false);
        setErroCpfIncompleto(false);
        setErroCpfExiste(false);
        setErroTelefone(false);
        setErroTelefoneIncompleto(false);
        setErroCepExiste(false);
        setErroCepIncompleto(false);

        try {
            const resposta = await api.put(`/cliente/editar/${formEditarCliente.id}`, {
                nome: formEditarCliente.nome,
                email: formEditarCliente.email,
                cpf: formEditarCliente.cpf,
                telefone: formEditarCliente.telefone,
                endereco: formEditarCliente.endereco,
                complemento: formEditarCliente.complemento,
                cep: formEditarCliente.cep,
                bairro: formEditarCliente.bairro,
                cidade: formEditarCliente.cidade,
                uf: formEditarCliente.uf
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (resposta.status > 204) {
                return;
            }

            fecharModalEditarCliente();

            toast(<EditarClienteModalSucesso />, {
                className: 'modal-sucesso',
                closeButton: false,
                pauseOnFocusLoss: false,
                position: toast.POSITION.BOTTOM_RIGHT
            });

        } catch (error) {
            if (error.response.data.message === 'E-mail já existe.') {
                setErroEmailExiste(true);
                return;
            }

            if (error.response.data.message === 'CPF já existe.') {
                setErroCpfExiste(true);
                return;
            }
            console.log(error);
        }
    }

    function fecharECancelarModal() {
        fecharModalEditarCliente();

        setErroNome(false);
        setErroEmail(false);
        setErroCpf(false);
        setErroCpfIncompleto(false);
        setErroCpfExiste(false);
        setErroTelefone(false);
        setErroTelefoneIncompleto(false);
        setErroCepExiste(false);
        setErroCepIncompleto(false);
    }

    async function viaCep(e) {

        const cepDigitado = e.target.value.replace(/\D/g, '');

        if (cepDigitado.length === 8) {
            fetch(`https://viacep.com.br/ws/${cepDigitado}/json/`)
                .then(res => res.json()).then(body => {
                    if (body.erro) {
                        alert('O CEP informado é inválido, verifique e tente novamente.');
                        return;
                    }

                    setFormEditarCliente({ ...formEditarCliente, cep: cepDigitado, endereco: body.logradouro, bairro: body.bairro, cidade: body.localidade, uf: body.uf });

                    return;
                });
        }

        setFormEditarCliente({ ...formEditarCliente, cep: cepDigitado });
    }

    return (
        <div className='backdrop'>
            <div className='modal modal-cliente'>
                <img
                    src={fecharIcone}
                    alt='Fechar'
                    className='fechar-icone'
                    onClick={fecharECancelarModal}
                />

                <div className='titulo-cliente'>
                    <img
                        src={cadastroIcone}
                        alt='Cadastro Cliente'
                    />
                    <h1>Editar Cliente</h1>
                </div>

                <form className='form-modal form-cliente'
                    onSubmit={gerenciarAplicar}
                >
                    <div className='input-flex-column mb0'>
                        <label htmlFor='nome'>Nome*</label>
                        <input
                            type='text'
                            name='nome'
                            className={erroNome ? 'input-erro mb12' : 'mb12'}
                            placeholder='Digite o nome'
                            value={formEditarCliente.nome}
                            onChange={(e) => setFormEditarCliente
                                ({ ...formEditarCliente, nome: e.target.value })}
                            onBlur={(e) => errorNome(e)}
                        />
                        {erroNome &&
                            <span className='mensagem-erro botton-4 corpo-minusculo'>Este campo deve ser preenchido</span>}
                    </div>

                    <div className='input-flex-column mb0'>
                        <label htmlFor='email'>E-mail*</label>
                        <input
                            type='email'
                            name='email'
                            className={erroEmail || erroEmailExiste ? 'input-erro mb12' : 'mb12'}
                            placeholder='Digite o e-mail'
                            value={formEditarCliente.email}
                            onChange={(e) => setFormEditarCliente
                                ({ ...formEditarCliente, email: e.target.value })}
                            onBlur={(e) => errorEmail(e)}
                        />
                        {erroEmail &&
                            <span className='mensagem-erro botton-4 corpo-minusculo'>Este campo deve ser preenchido</span>}
                        {erroEmailExiste &&
                            <span className='mensagem-erro botton-4 corpo-minusculo'>E-mail já cadastrado</span>}
                    </div>
                    <div className='display-row'>
                        <div className='display-column'>
                            <label htmlFor='cpf'>CPF*</label>
                            <InputCPF
                                type='number'
                                name='cpf'

                                className={erroCpf || erroCpfExiste || erroCpfIncompleto ? 'input-erro mb12 input-number' : 'input-number mb12'}
                                placeholder={'Digite o CPF'}
                                value={formEditarCliente.cpf}
                                onChange={(e) => {
                                    setFormEditarCliente
                                        ({ ...formEditarCliente, cpf: e.target.value })
                                }}
                                onBlur={(e) => errorCpf(e)}
                            />
                            {erroCpf &&
                                <span className='mensagem-erro botton-4 corpo-minusculo'>Este campo deve ser preenchido</span>}

                            {erroCpfExiste &&
                                <span className='mensagem-erro botton-4 corpo-minusculo'>CPF já cadastrado</span>}

                            {erroCpfIncompleto &&
                                <span className='mensagem-erro botton-4 corpo-minusculo'>Campo incompleto</span>}
                        </div>
                        <div className='display-column'>
                            <label htmlFor='telefone'>Telefone*</label>
                            <InputTelefone
                                type='number'
                                name='telefone'

                                className={erroTelefone || erroTelefoneIncompleto ? 'input-erro mb12 input-number' : 'input-number mb12'}
                                placeholder={'Digite o telefone'}

                                value={formEditarCliente.telefone}
                                onChange={(e) => setFormEditarCliente
                                    ({ ...formEditarCliente, telefone: e.target.value })}
                                onBlur={(e) => errorTelefone(e)}
                            />
                            {erroTelefone &&
                                <span className='mensagem-erro botton-4 corpo-minusculo'>Este campo deve ser preenchido</span>}

                            {erroTelefoneIncompleto &&
                                <span className='mensagem-erro botton-4 corpo-minusculo'>Campo incompleto</span>}
                        </div>
                    </div>
                    <div className='display-row'>
                        <div className='display-column'>
                            <label htmlFor='cep'>CEP</label>
                            <InputCep
                                type='number'
                                name='cep'
                                className={erroCepExiste || erroCepIncompleto ? 'input-erro mb12 input-number' : 'input-number mb12'}
                                placeholder='Digite o CEP'
                                value={formEditarCliente.cep}
                                onChange={(e) => viaCep(e)}
                                onBlur={() => errorCepExiste()}
                            />
                            {erroCepExiste &&
                                <span className='mensagem-erro botton-4 corpo-minusculo'>Preencha endereço, bairro, cidade e UF</span>}

                            {erroCepIncompleto &&
                                <span className='mensagem-erro botton-4 corpo-minusculo'>Campo incompleto</span>}
                        </div>
                        <div className='display-column'>
                            <label htmlFor='bairro'>Bairro</label>
                            <input
                                type='text'
                                name='bairro'
                                placeholder='Digite o bairro'
                                value={formEditarCliente.bairro}
                                onChange={(e) => setFormEditarCliente
                                    ({ ...formEditarCliente, bairro: e.target.value })}
                            />
                        </div>
                    </div>
                    <label htmlFor='endereco'>Endereço</label>
                    <input
                        type='text'
                        name='endereco'
                        placeholder='Digite o endereço'
                        value={formEditarCliente.endereco}
                        onChange={(e) => setFormEditarCliente
                            ({ ...formEditarCliente, endereco: e.target.value })}
                    />
                    <label htmlFor='complemento'>Complemento</label>
                    <input
                        type='text'
                        name='complemento'
                        placeholder='Digite o complemento'
                        value={formEditarCliente.complemento}
                        onChange={(e) => setFormEditarCliente
                            ({ ...formEditarCliente, complemento: e.target.value })}
                    />
                    <div className='display-row'>
                        <div className='display-column'>
                            <label htmlFor='cidade'>Cidade</label>
                            <input
                                type='text'
                                name='cidade'
                                placeholder='Digite a Cidade'
                                value={formEditarCliente.cidade}
                                onChange={(e) => setFormEditarCliente
                                    ({ ...formEditarCliente, cidade: e.target.value })}
                            />
                        </div>
                        <div className='display-column'>
                            <label htmlFor='uf'>UF</label>
                            <input
                                type='text'
                                name='uf'
                                placeholder='Digite a UF'
                                value={formEditarCliente.uf}
                                onChange={(e) => setFormEditarCliente
                                    ({ ...formEditarCliente, uf: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='display-row row-btn'>
                        <button className='btn-rosa-medio'
                            style={{ marginRight: '2.2rem' }}
                            type='submit'
                        >Aplicar
                        </button>

                        <button
                            className='btn-cinza-8'
                            type='button'
                            onClick={fecharECancelarModal}
                        >Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarClienteModal;