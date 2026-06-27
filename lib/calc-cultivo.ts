import type { CalcCultivoInputs } from '@/types';

export function calcularCultivo(i: CalcCultivoInputs) {
  const bolsasPorChorizo = 6;
  const pesoSustratoPorBolsa = 2.5;
  const pesoMicelioPorBolsa = 0.05;

  const numeroFilas = i.distanciaFilas > 0 ? Math.floor(i.ancho / i.distanciaFilas) : 0;
  const numeroColumnas = i.distanciaColumnas > 0 ? Math.floor(i.largo / i.distanciaColumnas) : 0;
  const numeroChorizos = numeroFilas * numeroColumnas;
  const numeroBolsas = numeroChorizos * bolsasPorChorizo;
  const pesoTotalSustrato = numeroBolsas * pesoSustratoPorBolsa;
  const pesoTotalMicelio = numeroBolsas * pesoMicelioPorBolsa;

  const pesoMateriaSeca = pesoTotalSustrato * 0.625;
  const pesoAserrin = pesoMateriaSeca * 0.88;
  const pesoSalvado = pesoMateriaSeca * 0.10;
  const pesoYeso = pesoMateriaSeca * 0.02;

  const costoTotalAserrin = pesoAserrin * i.costoAserrin;
  const costoTotalSalvado = pesoSalvado * i.costoSalvado;
  const costoTotalYeso = pesoYeso * i.costoYeso;
  const costoTotalSustrato = costoTotalAserrin + costoTotalSalvado + costoTotalYeso;
  const costoTotalBolsas = numeroBolsas * i.costoBolsa;
  const costoTotalMicelio = pesoTotalMicelio * i.costoMicelio;
  const costoTotalManoDeObra = i.numeroTrabajadores * i.sueldoTrabajador;
  const costoTotal = costoTotalSustrato + costoTotalBolsas + costoTotalMicelio + costoTotalManoDeObra;

  const pesoTotalOrellana = pesoTotalSustrato * 0.5;
  const ingresosTotales = pesoTotalOrellana * i.precioVentaOrellana;
  const gananciaNeta = ingresosTotales - costoTotal;
  const porcentajeNeto = ingresosTotales > 0 ? (gananciaNeta / ingresosTotales) * 100 : 0;

  return {
    numeroChorizos, numeroBolsas, pesoTotalSustrato, pesoAserrin, pesoSalvado,
    pesoYeso, pesoTotalMicelio, pesoTotalOrellana,
    costoTotalAserrin, costoTotalSalvado, costoTotalYeso, costoTotalSustrato,
    costoTotalBolsas, costoTotalMicelio, costoTotalManoDeObra, costoTotal,
    ingresosTotales, gananciaNeta, porcentajeNeto,
  };
}
