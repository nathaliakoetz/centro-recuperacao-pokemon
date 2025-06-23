import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { estilosGlobais, cores, espacamento, bordas, sombras, tipografia } from '../styles/estilosGlobais';
import BotaoAcao from '../components/BotaoAcao';
import { Usuario } from '../utils/gerenciarUsuarios';

export default function VerificarCodigo() {
  const router = useRouter();
  const { login } = useAuth();
  const params = useLocalSearchParams<{ codigoCorreto: string, usuario: string }>();
  
  const [codigoDigitado, setCodigoDigitado] = useState('');

  // Desserializa o objeto do usuário que foi passado como string
  const usuario: Usuario | null = params.usuario ? JSON.parse(params.usuario) : null;
  const codigoCorreto = params.codigoCorreto;

  const handleVerificar = () => {
    if (!usuario) {
        Alert.alert("Erro", "Ocorreu um erro. Tente fazer o login novamente.");
        router.replace('/');
        return;
    }

    if (codigoDigitado === codigoCorreto) {
      // Se o código estiver correto, finaliza o login
      login(usuario);
    } else {
      Alert.alert("Erro", "Código de verificação incorreto.");
    }
  };

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.voltarContainer} onPress={() => router.back()}>
            <Image source={require('../assets/voltar.png')} style={styles.voltarIcon} />
        </TouchableOpacity>

        <Image
          source={require('../assets/auth.png')} // Crie ou use uma imagem para esta tela
          style={styles.imagemPrincipal}
        />
        <Text style={styles.titulo}>Verificação de Segurança</Text>
        <Text style={styles.subtitulo}>
          Um código foi enviado para o seu dispositivo. Por favor, insira-o abaixo.
        </Text>

        <TextInput
          style={[estilosGlobais.campoTexto, styles.campoCodigo]}
          placeholder="------"
          placeholderTextColor={cores.textoSecundario}
          value={codigoDigitado}
          onChangeText={setCodigoDigitado}
          keyboardType="number-pad"
          maxLength={6}
        />

        <BotaoAcao onPress={handleVerificar}>Verificar Código</BotaoAcao>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: cores.fundoSuperficie,
        borderRadius: bordas.raioGrande,
        padding: espacamento.xl,
        alignItems: 'center',
        width: '100%',
        maxWidth: 450,
        ...sombras.sombraMedia,
    },
    voltarContainer: {
        alignSelf: 'flex-start',
        position: 'absolute',
        top: espacamento.l,
        left: espacamento.l,
    },
    voltarIcon: {
        width: 30,
        height: 30,
        tintColor: cores.textoSecundario,
    },
    imagemPrincipal: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        marginBottom: espacamento.l,
    },
    titulo: {
        ...estilosGlobais.titulo,
        fontSize: tipografia.tamanhos.subtitulo,
        marginBottom: espacamento.s,
    },
    subtitulo: {
        ...estilosGlobais.textoSecundario,
        textAlign: 'center',
        marginBottom: espacamento.xl,
        fontSize: tipografia.tamanhos.corpo,
    },
    campoCodigo: {
        fontSize: 24,
        textAlign: 'center',
        letterSpacing: 8,
    }
});