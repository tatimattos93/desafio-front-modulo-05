import api from '../../service/api';
import { getItem } from '../../utils/storage';
import { toast } from 'react-toastify';


import './style.css';
import '../../styles/modalSucesso.css';
import exclamacaoExclusao from '../../assets/exclamacaoExclusao.png'
import fecharIcone from '../../assets/fecharicone.png';
import CheckModalSucesso from '../../assets/checkModalSucesso.svg';
import FecharModalSucesso from '../../assets/fecharModalSucesso.svg';
import FecharModalErro from '../../assets/fecharModalErro.png';
import CheckModalErro from '../../assets/checkModalErro.png';

export function ExcluirCobrancaModal({fecharModalExcluirCobranca, cobrancaIdStatus, carregarCobrancas}) {
    const token = getItem('token');
    const ExcluirCobrancaModalErro = ({ closeToast }) => (
        <div className='modal-erro-conteudo'>
            <div className='check-texto'>
                <img src={CheckModalErro} alt='Sucesso' />
                <span>Esta cobrança não pode ser excluída!</span>
            </div>
            <img src={FecharModalErro} alt='Fechar' onClick={closeToast} />
        </div>
    );

    const ExcluirCobrancaModalSucesso = ({ closeToast }) => (
        <div className='modal-sucesso-conteudo'>
            <div className='check-texto'>
                <img src={CheckModalSucesso} alt='Sucesso' />
                <span>Cobrança excluída com sucesso!</span>
            </div>
            <img src={FecharModalSucesso} alt='Fechar' onClick={closeToast} />
        </div>
    );
    
    async function excluirCobranca() {
        
        if (!cobrancaIdStatus) {
            return
        }
        if (cobrancaIdStatus.status === 'vencida' || cobrancaIdStatus.status ==='pago') {
            toast(<ExcluirCobrancaModalErro />, {
                className: 'modal-erro',
                closeButton: false,
                pauseOnFocusLoss: false,
                position: toast.POSITION.BOTTOM_RIGHT
            });
            fecharModalExcluirCobranca()

            return 
        }

        try {
            const resposta = await api.delete(`/cobranca/excluir/${cobrancaIdStatus.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (resposta.status > 204) {
                return;
            }            
            carregarCobrancas();
            fecharModalExcluirCobranca()
            toast(<ExcluirCobrancaModalSucesso />, {
                className: 'modal-sucesso',
                closeButton: false,
                pauseOnFocusLoss: false,
                position: toast.POSITION.BOTTOM_RIGHT
            });

        } catch (error) {
            toast.error(error.response.data);
        }

    }
      
   

    return (
        <>
            
            <div className='backdrop'>
                <div className='modal modal-excluir'>
                    <img
                        className='fechar-icone'
                        src={fecharIcone}
                        onClick={() => fecharModalExcluirCobranca()}
                    />
                    <img
                        className='img-exclusao'
                        src={exclamacaoExclusao}
                    />
                    <span className='h3-semi-negrito'>Tem certeza que deseja excluir esta cobrança?</span>

                    <div className='btn-exclusao'>
                        <button 
                            className='btn-excluir nao corpo-pequeno'
                            onClick={() => fecharModalExcluirCobranca()}
                        > Não</button>
                        <button 
                            className='btn-excluir sim corpo-pequeno'
                            onClick={() => excluirCobranca()}
                        >Sim</button>
                    </div>                    
                </div>
            </div>
        
        </>
    );
}

export default ExcluirCobrancaModal;