import type { CalcSustratoInputs } from '@/types';

export function calcularSustrato(i: CalcSustratoInputs) {
  const pesoTotal = i.numBloques * i.pesoBloques * 1000; // gramos
  const matSeca = i.porcentajeMateriaSeca / 100;
  const liquidos = i.porcentajeLiquidos / 100;

  const pesoMateriaSeca = pesoTotal * matSeca;
  const pesoLiquidos = pesoTotal * liquidos;

  return {
    pesoAserrin: pesoMateriaSeca * (i.porcentajeAserrin / 100),
    pesoViruta: pesoMateriaSeca * (i.porcentajeViruta / 100),
    pesoSalvado: pesoMateriaSeca * (i.porcentajeSalvado / 100),
    pesoCal: pesoMateriaSeca * (i.porcentajeCal / 100),
    pesoAgua: pesoLiquidos * (i.porcentajeAgua / 100),
    pesoMelaza: pesoLiquidos * (i.porcentajeMelaza / 100),
    pesoTotal,
  };
}
