import { Picker } from '@react-native-picker/picker';
import React from 'react';

type ComponenteTipoPokemonProps = {
  selectedTipo: string;
  onTipoChange: (novoTipo: string) => void;
};

export default function ComponenteTipoPokemon({
  selectedTipo,
  onTipoChange,
}: ComponenteTipoPokemonProps) {
  return (
    <Picker
      selectedValue={selectedTipo}
      onValueChange={onTipoChange}
      style={{ height: 50, width: '100%' }}
    >
      <Picker.Item label="Selecione o tipo" value="" />
      <Picker.Item label="Fogo" value="Fogo" />
      <Picker.Item label="Elétrico" value="Elétrico" />
      <Picker.Item label="Planta" value="Planta" />
    </Picker>
  );
}