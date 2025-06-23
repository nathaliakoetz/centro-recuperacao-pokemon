import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, Alert, TouchableOpacity, ActivityIndicator, Modal, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { estilosGlobais, cores, espacamento, tipografia, sombras, bordas } from '../../../styles/estilosGlobais';
import BotaoAcao from '../../../components/BotaoAcao';
import { Usuario, buscarUsuarios, atualizarUsuario, deletarUsuario } from '../../../utils/gerenciarUsuarios';
import { Feather } from '@expo/vector-icons';

export default function EditarUsuario() {
  const router = useRouter();
  const params = useLocalSearchParams<{ username?: string }>();
  const usernameOriginal = params.username;

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [feedbackModalVisivel, setFeedbackModalVisivel] = useState(false);
  const [modalMensagem, setModalMensagem] = useState('');
  const [modalSucesso, setModalSucesso] = useState(false);
  const [confirmarDelecaoModal, setConfirmarDelecaoModal] = useState(false);
  
  useEffect(() => {
    if (usernameOriginal) {
      const carregarUsuario = async () => {
        setIsLoading(true);
        const todos = await buscarUsuarios();
        const encontrado = todos.find(u => u.username.toLowerCase() === usernameOriginal.toLowerCase());
        setUsuario(encontrado || null);
        if (encontrado) {
          setPassword(encontrado.password);
        }
        setIsLoading(false);
      };
      carregarUsuario();
    } else {
        setIsLoading(false);
    }
  }, [usernameOriginal]);

  const handleUpdate = async () => {
    if (!usuario || !usernameOriginal) return;
    const dadosAtualizados: Usuario = { ...usuario, password };
    const resultado = await atualizarUsuario(usernameOriginal, dadosAtualizados);
    setModalMensagem(resultado.mensagem);
    setModalSucesso(resultado.sucesso);
    setFeedbackModalVisivel(true);
  };
  
  const handleAbrirConfirmacaoDelete = () => {
    if (!usuario) return;
    if (usuario.username.toLowerCase() === 'admin') {
      Alert.alert("Ação Proibida", "Não é possível deletar o administrador principal.");
      return;
    }
    setConfirmarDelecaoModal(true);
  };

  const handleConfirmarDelete = async () => {
    if (!usuario) return;

    setConfirmarDelecaoModal(false);
    
    const resultado = await deletarUsuario(usuario.username);

    setModalMensagem(resultado.mensagem);
    setModalSucesso(resultado.sucesso);
    setFeedbackModalVisivel(true);
  };
  
  const handleFecharFeedbackModal = () => {
      setFeedbackModalVisivel(false);
      if (modalSucesso) {
          router.replace('/cadastrar-usuario');
      }
  }

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.cardCadastro}>
        <Text style={styles.titulo}>Editando Usuário</Text>
        <Text style={styles.subtitulo}>{usernameOriginal}</Text>
        <Text style={estilosGlobais.label}>Nome de Usuário</Text>
        <TextInput
          style={estilosGlobais.campoTexto}
          value={usuario?.username}
          onChangeText={text => setUsuario(u => u ? {...u, username: text} : null)}
          autoCapitalize="none"
        />
        <Text style={estilosGlobais.label}>Senha</Text>
        <TextInput
          style={estilosGlobais.campoTexto}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.switchContainer}>
          <Text style={estilosGlobais.label}>Tipo: {usuario?.role === 'medico' ? 'Médico' : 'Funcionário'}</Text>
          <Switch
            value={usuario?.role === 'medico'}
            onValueChange={isMedico => setUsuario(u => u ? {...u, role: isMedico ? 'medico' : 'funcionario'} : null)}
            trackColor={{ false: cores.textoSecundario, true: cores.primaria }}
            thumbColor={cores.branco}
          />
        </View>
        <View style={styles.botoesContainer}>
            <BotaoAcao onPress={() => router.back()} tipo="secundario" style={{flex: 1}}>Voltar</BotaoAcao>
            <BotaoAcao onPress={handleUpdate} style={{flex: 1}}>Salvar Alterações</BotaoAcao>
        </View>
        <BotaoAcao onPress={handleAbrirConfirmacaoDelete} tipo="urgente" style={{marginTop: espacamento.xl}}>
          Deletar Usuário
        </BotaoAcao>
      </View>

      <Modal visible={confirmarDelecaoModal} transparent animationType="fade" onRequestClose={() => setConfirmarDelecaoModal(false)}>
        <View style={estilosGlobais.modalFundo}>
          <View style={[estilosGlobais.modalConteudo, {padding: espacamento.xl}]}>
            <Text style={estilosGlobais.modalTitulo}>Confirmar Exclusão</Text>
            <Text style={estilosGlobais.modalTexto}>Tem certeza que deseja deletar o usuário "{usuario?.username}"? Esta ação não pode ser desfeita.</Text>
            <View style={styles.botoesContainer}>
                <BotaoAcao onPress={() => setConfirmarDelecaoModal(false)} tipo="secundario" style={{flex: 1}}>Cancelar</BotaoAcao>
                <BotaoAcao onPress={handleConfirmarDelete} tipo="urgente" style={{flex: 1}}>Deletar</BotaoAcao>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={feedbackModalVisivel} transparent animationType="fade" onRequestClose={handleFecharFeedbackModal}>
        <View style={estilosGlobais.modalFundo}>
          <View style={[estilosGlobais.modalConteudo, {padding: espacamento.xl}]}>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={handleFecharFeedbackModal}>
              <Feather name="x" size={24} color={cores.textoSecundario} />
            </TouchableOpacity>
            <Text style={estilosGlobais.modalTitulo}>{modalSucesso ? '' : 'Erro'}</Text>
            {modalSucesso && <Image source={require('../../../assets/sucesso.png')} style={styles.modalImagem}/>}
            <Text style={estilosGlobais.modalTexto}>{modalMensagem}</Text>
            <BotaoAcao onPress={handleFecharFeedbackModal} style={{alignSelf: 'stretch'}}>OK</BotaoAcao>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    cardCadastro: { width: '100%', maxWidth: 500, backgroundColor: cores.fundoSuperficie, padding: espacamento.xl, borderRadius: bordas.raioGrande, ...sombras.sombraMedia },
    titulo: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.titulo, color: cores.textoClaro, textAlign: 'center' },
    subtitulo: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.corpo, color: cores.primaria, textAlign: 'center', marginBottom: espacamento.xl },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: espacamento.l, padding: espacamento.s, backgroundColor: cores.fundoEscuro, borderRadius: bordas.raioPequeno },
    botoesContainer: { flexDirection: 'row', gap: espacamento.m, marginTop: espacamento.m },
    botaoFecharModal: { position: 'absolute', top: espacamento.m, right: espacamento.m, padding: 4 },
    modalImagem: { width: 80, height: 80, marginBottom: espacamento.m, alignSelf: 'center' }
});