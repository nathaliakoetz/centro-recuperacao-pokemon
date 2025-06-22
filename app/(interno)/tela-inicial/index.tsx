import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  estilosGlobais,
  tipografia,
  espacamento,
  cores,
  bordas,
  sombras,
} from '../../../styles/estilosGlobais';
import CardOpcao from '../../../components/CardOpcao';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function AreaInterna() {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const [dataHora, setDataHora] = useState('');

  useEffect(() => {
    const formatarDataHora = () => {
      const agora = new Date();
      const opcoesData = { day: 'numeric', month: 'long', year: 'numeric' } as const;
      const dataFormatada = agora.toLocaleDateString('pt-BR', opcoesData);
      const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setDataHora(`${dataFormatada} - ${horaFormatada}`);
    };
    formatarDataHora();
    const intervalId = setInterval(formatarDataHora, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const opcoes = [
    {
      titulo: 'Registrar para Consulta',
      rota: '/(interno)/cadastro/cadastro-check',
      tipo: 'primario' as const,
    },
    {
      titulo: 'URGENTE',
      rota: '/(interno)/cadastro/urgente',
      tipo: 'urgente' as const,
    },
  ];

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.cardPrincipal}>

        <View style={styles.header}>
          <Text style={styles.bemVindoTexto}>Bem vindo {usuario}!</Text>
          <TouchableOpacity onPress={logout}>
            <Image
              source={require('../../../assets/sair.png')}
              style={styles.logoutIcon}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../../../assets/cadastro.png')}
          style={styles.imagemPrincipal}
        />

        <Text style={styles.titulo}>Área de Cadastro</Text>
        <Text style={styles.dataHoraTexto}>{dataHora}</Text>

        <Text style={styles.subtitulo}>
          Selecione uma das opções abaixo para prosseguir.
        </Text>

        {opcoes.map((item) => (
          <CardOpcao
            key={item.rota}
            onPress={() => router.push(item.rota as any)}
            tipo={item.tipo}
            style={styles.botaoOpcao}
          >
            {item.titulo}
          </CardOpcao>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardPrincipal: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioGrande,
    padding: espacamento.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    ...sombras.sombraMedia,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espacamento.m,
  },
  bemVindoTexto: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoSecundario,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: cores.textoSecundario,
  },
  imagemPrincipal: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: espacamento.m,
  },
  titulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: espacamento.s,
  },
  subtitulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginBottom: espacamento.xl,
  },
  botaoOpcao: {
    flex: 0,
    width: '100%',
    minHeight: 0,
    paddingVertical: espacamento.l,
    marginBottom: espacamento.l,
  },
  dataHoraTexto: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoSecundario,
    marginBottom: espacamento.l,
    textAlign: 'center',
  },
});