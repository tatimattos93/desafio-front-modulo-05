import { useState } from 'react';
import api from '../../service/api';
import { getItem } from '../../utils/storage';
import { toast } from 'react-toastify';
import { InputCPF, InputTelefone, InputCep } from '../../utils/inputFormatoNumero';

import './style.css';
import fecharIcone from '../../assets/fecharicone.png';
import cadastroIcone from '../../assets/cadastroicone.png';
import CheckModalSucesso from '../../assets/checkModalSucesso.svg';
import FecharModalSucesso from '../../assets/fecharModalSucesso.svg';

export function ClienteModal({ modalCadastroCliente, fecharModalCadastroCliente, carregarClientes }) {
    const token = getItem('token');

    const [formCadastro, setFormCadastro] =
        useState({
            nome: '', email: '', cpf: '', telefone: '',
            endereco: '', complemento: '', cep: '', bairro: '', cidade: '', uf: ''
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

    const AddClienteModalSucesso = ({ closeToast }) => (
        <div className='modal-sucesso-conteudo'>
            <div className='check-texto'>
                <img src={CheckModalSucesso} alt='Sucesso' />
                <span>Cadastro concluído com sucesso</span>
            </div>
            <img src={FecharModalSucesso} alt='Fechar' onClick={closeToast} />
        </div>
    );

    function limparForm() {
        setFormCadastro({
            nome: '', email: '', cpf: '', telefone: '',
            endereco: '', complemento: '', cep: '', bairro: '', cidade: '', uf: ''
        });
    }

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

        if (!formCadastro.nome && !formCadastro.email &&
            !formCadastro.cpf && !formCadastro.telefone) {
            setErroNome(true);
            setErroEmail(true);
            setErroCpf(true);
            setErroTelefone(true);
            return;
        }

        if (!formCadastro.nome) {
            setErroNome(true);
            return;
        }

        if (!formCadastro.email) {
            setErroEmail(true);
            return;
        }

        if (!formCadastro.cpf) {
            setErroCpf(true);
            return;
        }

        if (!formCadastro.telefone) {
            setErroTelefone(true);
            return;
        }

        if (formCadastro.cpf.length < 11 && formCadastro.telefone.length < 10) {
            setErroCpfIncompleto(true);
            setErroTelefoneIncompleto(true);
            return;
        }

        if (formCadastro.cpf.length < 11) {
            setErroCpfIncompleto(true);
            return;
        }

        if (formCadastro.telefone.length < 10) {
            setErroTelefoneIncompleto(true);
            return;
        }

        if (formCadastro.cep !== '') {
            if (formCadastro.cep.length >= 8 && (!formCadastro.endereco || !formCadastro.bairro || !formCadastro.cidade || !formCadastro.uf)) {
                setErroCepExiste(true);
                return;
            } else if (formCadastro.cep.length < 8) {
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
            const resposta = await api.post('/clientes/cadastro', {
                nome: formCadastro.nome,
                email: formCadastro.email,
                cpf: formCadastro.cpf,
                telefone: formCadastro.telefone,
                endereco: formCadastro.endereco,
                complemento: formCadastro.complemento,
                cep: formCadastro.cep,
                bairro: formCadastro.bairro,
                cidade: formCadastro.cidade,
                uf: formCadastro.uf
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
            fecharModalCadastroCliente();
            carregarClientes();

            toast(<AddClienteModalSucesso />, {
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
            console.log(error.response.data);
        }
    }

    function fecharECancelarModal() {
        limparForm();
        fecharModalCadastroCliente();

        setErroNome(false);
        setErroEmail(false);
        setErroEmailExiste(false);
        setErroCpf(false);
        setErroCpfIncompleto(false);
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

                    setFormCadastro({ ...formCadastro, cep: cepDigitado, endereco: body.logradouro, bairro: body.bairro, cidade: body.localidade, uf: body.uf });

                    return;
                });
        }

        setFormCadastro({ ...formCadastro, cep: cepDigitado });

    }

    return (
        <>
            {modalCadastroCliente &&
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
                            <h1>Cadastro do Cliente</h1>
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
                                    value={formCadastro.nome}
                                    onChange={(e) => setFormCadastro({ ...formCadastro, nome: e.target.value })}
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
                                    value={formCadastro.email}
                                    onChange={(e) => setFormCadastro({ ...formCadastro, email: e.target.value })}
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
                                        value={formCadastro.cpf}
                                        onChange={(e) => setFormCadastro({ ...formCadastro, cpf: e.target.value })}
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
                                        value={formCadastro.telefone}
                                        onChange={(e) => setFormCadastro({ ...formCadastro, telefone: e.target.value })}
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
                                        placeholder={'Digite o CEP'}
                                        value={formCadastro.cep}
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
                                        value={formCadastro.bairro}
                                        onChange={(e) => setFormCadastro({ ...formCadastro, bairro: e.target.value })}
                                    />
                                </div>
                            </div>
                            <label htmlFor='endereco'>Endereço</label>
                            <input
                                type='text'
                                name='endereco'
                                placeholder='Digite o endereço'
                                value={formCadastro.endereco}
                                onChange={(e) => setFormCadastro({ ...formCadastro, endereco: e.target.value })}
                            />
                            <label htmlFor='complemento'>Complemento</label>
                            <input
                                type='text'
                                name='complemento'
                                placeholder='Digite o complemento'
                                value={formCadastro.complemento}
                                onChange={(e) => setFormCadastro({ ...formCadastro, complemento: e.target.value })}
                            />
                            <div className='display-row'>
                                <div className='display-column'>
                                    <label htmlFor='cidade'>Cidade</label>
                                    <input
                                        type='text'
                                        name='cidade'
                                        placeholder='Digite a Cidade'
                                        value={formCadastro.cidade}
                                        onChange={(e) => setFormCadastro({ ...formCadastro, cidade: e.target.value })}
                                    />
                                </div>
                                <div className='display-column'>
                                    <label htmlFor='uf'>UF</label>
                                    <input
                                        type='text'
                                        name='uf'
                                        placeholder='Digite a UF'
                                        value={formCadastro.uf}
                                        onChange={(e) => setFormCadastro({ ...formCadastro, uf: e.target.value })}
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
            }
        </>

    );
}

export default ClienteModal;