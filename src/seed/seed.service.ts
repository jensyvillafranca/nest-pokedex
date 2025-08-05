import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/pokemon-response-interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;


  async ejecutarSeed() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    data.results.forEach(({ name, url }) => {
      const segmentos = url.split('/');
      const numeroPokemon = +segmentos[ segmentos.length - 2];
      console.log({ name, numeroPokemon });
    })
    return data.results;
  }
}
