import React from 'react';
import { View, Text, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Especie = {
  nome: string;
  tipo: string;
  imagem: any;
};

type ComponenteEspeciePokemonProps = {
  selectedEspecie: string;
  onEspecieChange: (novaEspecie: string) => void;
};

const especies: Record<string, Especie> = {
  Pikachu: {
    nome: 'Pikachu',
    tipo: 'Elétrico',
    imagem: require('../assets/pokemons/pikachu.png'),
  },
  Charmander: {
    nome: 'Charmander',
    tipo: 'Fogo',
    imagem: require('../assets/pokemons/charmander.png'),
  },
  Bulbasaur: {
    nome: 'Bulbasaur',
    tipo: 'Planta',
    imagem: require('../assets/pokemons/bulbasaur.png'),
  },
};

export default function ComponenteEspeciePokemon({
  selectedEspecie,
  onEspecieChange,
}: ComponenteEspeciePokemonProps) {
  const especieSelecionada = especies[selectedEspecie];

  return (
    <View>
      <Picker
        selectedValue={selectedEspecie}
        onValueChange={onEspecieChange}
        style={{ height: 50, width: '100%' }}
      >
        <Picker.Item label="Selecione a espécie" value="" />
        {Object.values(especies).map((especie) => (
          <Picker.Item
            key={especie.nome}
            label={especie.nome}
            value={especie.nome}
          />
        ))}
      </Picker>

      {especieSelecionada && (
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Image
            source={especieSelecionada.imagem}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
          <Text style={{ marginTop: 8 }}>Tipo: {especieSelecionada.tipo}</Text>
        </View>
      )}
    </View>
  );
}