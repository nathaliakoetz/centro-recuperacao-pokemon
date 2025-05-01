// components/ComponenteEspeciePokemon.tsx
import React from 'react';
import { Picker } from '@react-native-picker/picker';

type ComponenteEspeciePokemonProps = {
  selectedEspecie: string;
  onEspecieChange: (novaEspecie: string) => void;
};

export default function ComponenteEspeciePokemon({
  selectedEspecie,
  onEspecieChange,
}: ComponenteEspeciePokemonProps) {
  return (
    <Picker
      selectedValue={selectedEspecie}
      onValueChange={onEspecieChange}
      style={{ height: 50, width: '100%' }}
    >
      <Picker.Item label="Selecione a espécie" value="" />
      <Picker.Item label="Pikachu" value="Pikachu" />
      <Picker.Item label="Charmander" value="Charmander" />
      <Picker.Item label="Bulbasaur" value="Bulbasaur" />
    </Picker>
  );
}