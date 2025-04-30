import React, { useState } from 'react';
import { View, TextInput, Text, Button, Switch, StyleSheet, Image } from 'react-native';
import ComponenteTipoPokemon from '../../components/ComponenteTipoPokemon';
import ComponenteEspeciePokemon from '../../components/ComponenteEspeciePokemon';
import { Picker } from '@react-native-picker/picker';

const Cadastro = () => {
  const [nomePokemon, setNomePokemon] = useState('');
  const [tipoPokemon, setTipoPokemon] = useState('');
  const [especiePokemon, setEspeciePokemon] = useState('');
  const [dataCaptura, setDataCaptura] = useState('');
  const [adquiridoTroca, setAdquiridoTroca] = useState(false);
  const [nomeTreinador, setNomeTreinador] = useState('');
  const [idTreinador, setIdTreinador] = useState('');
  const [descricaoSentimento, setDescricaoSentimento] = useState('');

  const handleSubmit = () => {
    console.log('Cadastro realizado com sucesso!');
    // Aqui você pode fazer o processamento do cadastro.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de PokePaciente</Text>

      <Text>Nome do Pokémon</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do Pokémon"
        value={nomePokemon}
        onChangeText={setNomePokemon}
      />

      <Text>Tipo do Pokémon</Text>
      <ComponenteTipoPokemon selectedTipo={tipoPokemon} onTipoChange={setTipoPokemon} />

      <Text>Espécie do Pokémon</Text>
      <ComponenteEspeciePokemon selectedEspecie={especiePokemon} onEspecieChange={setEspeciePokemon} />

      <Text>Data de captura</Text>
      <TextInput
        style={styles.input}
        placeholder="Selecione a data"
        value={dataCaptura}
        onChangeText={setDataCaptura}
      />

      <Text>Adquirido por troca?</Text>
      <Switch
        value={adquiridoTroca}
        onValueChange={setAdquiridoTroca}
      />

      <Text>Nome do Treinador</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Treinador"
        value={nomeTreinador}
        onChangeText={setNomeTreinador}
      />

      <Text>ID do Treinador</Text>
      <TextInput
        style={styles.input}
        placeholder="ID do Treinador"
        value={idTreinador}
        onChangeText={setIdTreinador}
      />

      <Text>Descrição do que o Pokémon está sentindo</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Descreva o que o Pokémon está sentindo"
        value={descricaoSentimento}
        onChangeText={setDescricaoSentimento}
        multiline
      />

      <Button title="Cadastrar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  multilineInput: {
    height: 80,
  },
});

export default Cadastro;